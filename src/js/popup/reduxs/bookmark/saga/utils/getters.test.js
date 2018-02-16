import Chance from 'chance'
import * as R from 'ramda'
import {all, call} from 'redux-saga/effects'
import {cloneableGenerator} from 'redux-saga/utils'

import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  searchBookmarkNodes
} from '../../../../../common/functions'
import * as CST from '../../../../constants'
import bookmarkNodes from '../__fixtures__/bookmarkNodes'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {simulateBookmark} from './converters'
import * as getters from './getters'

const chance = new Chance('getters')

describe('getBookmarkInfo', () => {
  test('should get the first bookmark node by id and convert it to bookmarkInfo', () => {
    const generator = getters.getBookmarkInfo(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getBookmarkNodes, bookmarkNodes[0].id))

    expect(generator.next(bookmarkNodes).value).toEqual({
      iconUrl: 'chrome://favicon/http://hipul.va/bihdaeha',
      id: '8825',
      isRoot: false,
      isUnmodifiable: false,
      parentId: '',
      storageIndex: 7496,
      title: 'woh',
      type: 'bookmark',
      url: 'http://hipul.va/bihdaeha'
    })

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkChildren', () => {
  test('should get all its children by id and convert all children to bookmarkInfo', () => {
    const generator = getters.getBookmarkChildren(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getBookmarkChildNodes, bookmarkNodes[0].id))

    expect(generator.next([bookmarkNodes[1], bookmarkNodes[2]]).value).toEqual([
      {
        iconUrl: 'chrome://favicon/http://dobapudol.bd/umowimup',
        id: '5683',
        isRoot: false,
        isUnmodifiable: false,
        parentId: '5863',
        storageIndex: 4116,
        title: 'ujapernat',
        type: 'bookmark',
        url: 'http://dobapudol.bd/umowimup'
      },
      {
        iconUrl: 'chrome://favicon/http://rucophe.sr/pakucug',
        id: '3980',
        isRoot: false,
        isUnmodifiable: false,
        parentId: '',
        storageIndex: 7243,
        title: 'olevowobe',
        type: 'bookmark',
        url: 'http://rucophe.sr/pakucug'
      }
    ])

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkTree', () => {
  test('get parent and children data at once', () => {
    const generator = getters.getBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(
      all([
        call(getters.getBookmarkInfo, bookmarkNodes[0].id),
        call(getters.getBookmarkChildren, bookmarkNodes[0].id)
      ])
    )

    expect(generator.next([bookmarkTrees[0].parent, bookmarkTrees[0].children]).value).toEqual(
      bookmarkTrees[0]
    )

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkTrees', () => {
  // limit to 4 trees, and set parentId to previous tree id
  const correlatedBookmarkTrees = R.compose(
    R.reduce((acc, bookmarkTree) => {
      if (!acc.length) return [bookmarkTree]

      const prevBookmarkTree = R.last(acc)
      const updatedBookmarkTree = R.set(
        R.lensPath(['parent', 'parentId']),
        prevBookmarkTree.parent.id,
        bookmarkTree
      )
      return [...acc, updatedBookmarkTree]
    }, []),
    R.take(4),
    R.clone
  )(bookmarkTrees)
  const getRestTreeIds = R.compose(R.map(R.path(['parent', 'id'])), R.tail)

  const options = {}
  const restTreeIds = getRestTreeIds(correlatedBookmarkTrees)

  const generator = cloneableGenerator(getters.getBookmarkTrees)(restTreeIds, options)

  expect(generator.next().value).toEqual(
    all([
      call(getters.getFirstBookmarkTree, options),
      ...R.map((id) => call(getters.tryGetBookmarkTree, id), restTreeIds)
    ])
  )

  test('should get all trees', () => {
    const clonedGenerator = generator.clone()

    expect(clonedGenerator.next(correlatedBookmarkTrees).value).toEqual(correlatedBookmarkTrees)

    expect(clonedGenerator.next().done).toBe(true)
  })

  test('should remove tree and its child trees if its parentId is not the same as previous tree', () => {
    for (let i = 1; i < correlatedBookmarkTrees.length; i += 1) {
      const clonedGenerator = generator.clone()

      const partiallyUnrelatedBookmarkTrees = R.set(
        R.lensPath([i, 'parent', 'parentId']),
        '99999',
        correlatedBookmarkTrees
      )
      expect(clonedGenerator.next(partiallyUnrelatedBookmarkTrees).value).toEqual(
        R.take(i, partiallyUnrelatedBookmarkTrees)
      )

      expect(clonedGenerator.next().done).toBe(true)
    }
  })

  test('should remove tree and its child trees if cannot get that tree', () => {
    for (let i = 1; i < correlatedBookmarkTrees.length; i += 1) {
      const clonedGenerator = generator.clone()

      const partiallyUnrelatedBookmarkTrees = R.set(R.lensIndex(i), null, correlatedBookmarkTrees)
      expect(clonedGenerator.next(partiallyUnrelatedBookmarkTrees).value).toEqual(
        R.take(i, partiallyUnrelatedBookmarkTrees)
      )

      expect(clonedGenerator.next().done).toBe(true)
    }
  })
})

describe('getFirstBookmarkTree', () => {
  test('should get default expanded tree and append root folders to its children except itself', () => {
    const hiddenFolderId = '99999'
    const options = {
      defExpand: Number(bookmarkTrees[0].parent.id),
      hideRootFolder: [Number(hiddenFolderId)]
    }

    const generator = getters.getFirstBookmarkTree(options)

    expect(generator.next().value).toEqual(
      all([
        call(getters.getBookmarkTree, String(options.defExpand)),
        call(getters.getBookmarkChildren, CST.ROOT_ID)
      ])
    )

    const rootFolders = [
      simulateBookmark({
        type: CST.TYPE_BOOKMARK,
        id: String(chance.integer({min: 2}))
      }),
      simulateBookmark({
        type: CST.TYPE_FOLDER,
        id: String(chance.integer({min: 2}))
      }),
      simulateBookmark({
        type: CST.TYPE_FOLDER,
        id: bookmarkTrees[0].parent.id
      }),
      simulateBookmark({
        type: CST.TYPE_FOLDER,
        id: hiddenFolderId
      })
    ]
    expect(generator.next([bookmarkTrees[0], rootFolders]).value).toEqual({
      children: [
        {
          id: '5967205401362433',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '',
          storageIndex: -1,
          title: '',
          type: 'bookmark',
          url: ''
        },
        {
          id: '4488745793355777',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '',
          storageIndex: -1,
          title: '',
          type: 'folder',
          url: ''
        },
        {
          iconUrl: 'http://sidzehod.za/nowocu',
          id: '2314',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '4146',
          storageIndex: 3032,
          title: 'nagcumu',
          type: 'folder',
          url: 'http://jefin.tk/se'
        },
        {
          iconUrl: 'http://pewojli.lv/pohof',
          id: '4433',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '2269',
          storageIndex: 8979,
          title: 'lun',
          type: 1,
          url: 'http://fopki.at/ugokikto'
        },
        {
          iconUrl: 'http://dawtoz.ug/cicop',
          id: '5772',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '6984',
          storageIndex: 1272,
          title: 'obomog',
          type: 2,
          url: 'http://kifon.ec/tepho'
        },
        {
          iconUrl: 'http://tu.kw/vofuvti',
          id: '3995',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '9824',
          storageIndex: 2728,
          title: 'herogto',
          type: 3,
          url: 'http://fipdoju.ne/niwavoni'
        },
        {
          iconUrl: 'http://mirebej.de/muwovvo',
          id: '4878',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '1291',
          storageIndex: 8326,
          title: 'vokbama',
          type: 4,
          url: 'http://zam.hk/gefurbo'
        },
        {
          iconUrl: 'http://saefkej.tc/sudetu',
          id: '9788',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '2853',
          storageIndex: 273,
          title: 'zucez',
          type: 5,
          url: 'http://za.im/degmu'
        },
        {
          iconUrl: 'http://ub.gg/zi',
          id: '8062',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '4211',
          storageIndex: 4206,
          title: 'erwoj',
          type: 6,
          url: 'http://ulazo.gt/ukema'
        },
        {
          iconUrl: 'http://at.sd/pawiw',
          id: '7668',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '1116',
          storageIndex: 7109,
          title: 'udweke',
          type: 7,
          url: 'http://pelwo.ma/ledlu'
        },
        {
          iconUrl: 'http://oj.ms/icbukme',
          id: '4702',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '1559',
          storageIndex: 3137,
          title: 'zud',
          type: 8,
          url: 'http://ji.gy/kofimvez'
        },
        {
          iconUrl: 'http://hacfadoz.bw/sakuhoj',
          id: '6208',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '2582',
          storageIndex: 6891,
          title: 'kepalog',
          type: 9,
          url: 'http://odedaje.np/jot'
        },
        {
          iconUrl: 'http://foudvoc.dj/muhoba',
          id: '9012',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '5745',
          storageIndex: 3040,
          title: 'rucdeg',
          type: 10,
          url: 'http://ci.so/cabef'
        },
        {
          iconUrl: 'http://ma.ky/vawujij',
          id: '8410',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '3890',
          storageIndex: 7839,
          title: 'ke',
          type: 11,
          url: 'http://ha.pa/bejozkal'
        },
        {
          iconUrl: 'http://giaw.gov/din',
          id: '2943',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '4335',
          storageIndex: 1909,
          title: 'bidu',
          type: 12,
          url: 'http://bo.ae/co'
        },
        {
          iconUrl: 'http://sadcup.ad/ipon',
          id: '7808',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '5098',
          storageIndex: 1612,
          title: 'ecuoleca',
          type: 13,
          url: 'http://moufidug.bi/ziwef'
        },
        {
          iconUrl: 'http://dijolagu.bz/tu',
          id: '6412',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '3886',
          storageIndex: 9453,
          title: 'gasnawdi',
          type: 14,
          url: 'http://tuhu.pn/tiwaru'
        },
        {
          iconUrl: 'http://bon.vn/dirdimbuc',
          id: '7870',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '2298',
          storageIndex: 8065,
          title: 'ukte',
          type: 15,
          url: 'http://gam.gov/jeszur'
        },
        {
          iconUrl: 'http://pidha.gu/rekacu',
          id: '1184',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '7095',
          storageIndex: 9498,
          title: 'ok',
          type: 16,
          url: 'http://fazgi.aq/pa'
        },
        {
          iconUrl: 'http://sumjueja.nz/ewnobti',
          id: '2268',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '3536',
          storageIndex: 8012,
          title: 'etpohle',
          type: 17,
          url: 'http://il.ye/oku'
        },
        {
          iconUrl: 'http://fep.ro/va',
          id: '3763',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '2595',
          storageIndex: 9280,
          title: 'ogaziv',
          type: 18,
          url: 'http://bakoj.ua/ev'
        },
        {
          iconUrl: 'http://ivouco.tg/gemakba',
          id: '5174',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '3323',
          storageIndex: 1909,
          title: 'os',
          type: 19,
          url: 'http://le.wf/wogbu'
        }
      ],
      parent: {
        iconUrl: 'http://ozasoluz.nr/ubpo',
        id: '9360',
        isRoot: false,
        isUnmodifiable: false,
        parentId: '4362',
        storageIndex: 9556,
        title: 'bahafom',
        type: 'folder',
        url: 'http://jop.by/etenazis'
      }
    })

    expect(generator.next().done).toBe(true)
  })
})

describe('searchBookmarks', () => {
  test('search bookmarks and convert to bookmarkInfo', () => {
    const searchQuery = chance.word()

    const generator = getters.searchBookmarks(searchQuery)

    expect(generator.next().value).toEqual(call(searchBookmarkNodes, searchQuery))

    expect(generator.next([bookmarkNodes[3], bookmarkNodes[4]]).value).toEqual([
      {
        iconUrl: 'test-file-stub',
        id: '9726',
        isRoot: false,
        isUnmodifiable: true,
        parentId: '',
        storageIndex: 6667,
        title: 'nemed',
        type: 'folder',
        url: ''
      },
      {
        iconUrl: 'chrome://favicon/http://selke.jo/co',
        id: '9645',
        isRoot: false,
        isUnmodifiable: true,
        parentId: '',
        storageIndex: -1,
        title: 'mevobo',
        type: 'bookmark',
        url: 'http://selke.jo/co'
      }
    ])

    expect(generator.next().done).toBe(true)
  })
})

describe('tryGetBookmarkTree', () => {
  test('run getBookmarkTree', () => {
    const generator = getters.tryGetBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getters.getBookmarkTree, bookmarkNodes[0].id))

    expect(generator.next([bookmarkTrees[5]]).value).toEqual([bookmarkTrees[5]])

    expect(generator.next().done).toBe(true)
  })

  test('return null if failed to get bookmark tree', () => {
    const generator = getters.tryGetBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getters.getBookmarkTree, bookmarkNodes[0].id))

    expect(generator.throw(new Error()).value).toBe(null)

    expect(generator.next().done).toBe(true)
  })
})
