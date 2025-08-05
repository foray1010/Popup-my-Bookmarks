ifndef NPROC
	NPROC=$(shell nproc)
endif
MAKEFLAGS += --jobs=$(NPROC) --silent

help: # get all command options
	@grep -E '^[a-zA-Z0-9 -]+:.*#' $(MAKEFILE_LIST) \
		| sort \
		| while read -r l; do \
				printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; \
			done
.DEFAULT_GOAL := help
.PHONY: help

bin_dir := node_modules/.bin

ts-node := node --experimental-strip-types

src_dir := src

locales: # download the latest locale files from transifex
	$(ts-node) scripts/generateLocalesFromTransifex.ts
.PHONY: locales

size-limit: build-prod # limit build size
	$(bin_dir)/size-limit
.PHONY: size-limit

tcm := $(bin_dir)/tcm
rspack := $(ts-node) $(bin_dir)/rspack

build-css-types:
	$(tcm) $(src_dir)
build-prod: build-css-types
	NODE_ENV=production $(rspack)
build: build-prod size-limit # build production extension
.PHONY: build-prod build

dev: # build development extension in watch mode
	$(tcm) $(src_dir) --watch &
	NODE_ENV=development $(rspack)
.PHONY: dev

markdown_dir := markdown

define buildmd
	mkdir -p $(dir $(2))
	find $(1) | xargs -I{} sh -c "cat {}; echo" | sed '$$d' > $(2)
endef
build/store.md: $(markdown_dir)/description.md $(markdown_dir)/todo.md $(markdown_dir)/contributing.md
	$(call buildmd,$^,$@)
README.md: $(markdown_dir)/title.md $(markdown_dir)/description.md $(markdown_dir)/legacy_version.md $(markdown_dir)/developer_guide.md $(markdown_dir)/todo.md $(markdown_dir)/contributing.md
	$(call buildmd,$^,$@)
md: build/store.md README.md # generate markdown files
.PHONY: md

lint-css: # lint by stylelint
	yarn stylelint '**/*.css'
lint-format: md # check if files follow prettier formatting
	yarn prettier --check .
lint-md: md # lint by remark
	yarn remark .
lint-js: build-css-types # lint by eslint
	$(bin_dir)/eslint .
lint: lint-css lint-format lint-md lint-js # run all lint tasks
.PHONY: lint-css lint-format lint-md lint-js lint

test: # run tests
	$(bin_dir)/jest
.PHONY: test

type-check: build-css-types # type check by tsc
	$(bin_dir)/tsc
type-coverage: build-css-types # check type coverage
	$(bin_dir)/type-coverage --strict --at-least 99 --detail --ignore-catch -- $(src_dir)/**
type: type-check type-coverage # run all type tasks
.PHONY: type-check type-coverage type

ci: build md lint test type # run all checkings on CI
.PHONY: ci
