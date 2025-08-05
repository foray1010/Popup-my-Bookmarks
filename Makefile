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
.PHONY: help
.DEFAULT_GOAL := help

bin_dir := node_modules/.bin

src_dir := src

locales: # download the latest locale files from transifex
	node scripts/generateLocalesFromTransifex.ts
.PHONY: locales

size-limit: build-prod # limit build size
	$(bin_dir)/size-limit
.PHONY: size-limit

tcm := $(bin_dir)/tcm
rspack := node $(bin_dir)/rspack

build-css-types:
	$(tcm) $(src_dir)
.PHONY: build-css-types

build-prod: build-css-types
	NODE_ENV=production $(rspack)
.PHONY: build-prod

build: build-prod size-limit # build production extension
.PHONY: build

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
.PHONY: lint-css

lint-format: md # check if files follow prettier formatting
	yarn prettier --check .
.PHONY: lint-format

lint-md: md # lint by remark
	yarn remark .
.PHONY: lint-md

lint-js: build-css-types # lint by eslint
	$(bin_dir)/eslint .
.PHONY: lint-js

lint: lint-css lint-format lint-md lint-js # run all lint tasks
.PHONY: lint

test: # run tests
	$(bin_dir)/jest
.PHONY: test

type-check: build-css-types # type check by tsc
	$(bin_dir)/tsc
.PHONY: type-check

type-coverage: build-css-types # check type coverage
	$(bin_dir)/type-coverage --strict --at-least 99 --detail -- $$(find $(src_dir) -name "*.ts" -o -name "*.tsx")
.PHONY: type-coverage

type: type-check type-coverage # run all type tasks
.PHONY: type

ci: build md lint test type # run all checkings on CI
.PHONY: ci
