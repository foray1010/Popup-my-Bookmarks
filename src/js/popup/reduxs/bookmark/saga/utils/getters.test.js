import Chance from 'chance'
import * as R from 'ramda'
import {all, call} from 'redux-saga/effects'
import {cloneableGenerator} from 'redux-saga/utils'

import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  searchBookmarkNodes
} from '../../../../../common/utils'
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
          iconUrl: '',
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
          iconUrl: '',
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
          isRoot: true,
          isUnmodifiable: false,
          parentId: '2269',
          storageIndex: 8979,
          title: 'lun',
          type: 'separator',
          url: 'http://fopki.at/ugokikto'
        },
        {
          iconUrl: 'http://dawtoz.ug/cicop',
          id: '6984',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '4161',
          storageIndex: 1272,
          title: 'botverek',
          type: 'folder',
          url: 'http://on.ec/tepho'
        },
        {
          iconUrl: 'http://sinzov.mx/retu',
          id: '9824',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '9928',
          storageIndex: 5093,
          title: 'hi',
          type: 'separator',
          url: 'http://jepava.lu/doju'
        },
        {
          iconUrl: 'http://remahfur.do/wek',
          id: '8165',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '5893',
          storageIndex: 5021,
          title: 'ilo',
          type: 'bookmark',
          url: 'http://jabo.vu/mabheku'
        },
        {
          iconUrl: 'http://zahcasmi.sr/hi',
          id: '9894',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '1047',
          storageIndex: 4193,
          title: 'hu',
          type: 'separator',
          url: 'http://otvuk.nl/wezsi'
        },
        {
          iconUrl: 'http://tenula.bh/letnegba',
          id: '6285',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '1085',
          storageIndex: 2456,
          title: 'gojku',
          type: 'separator',
          url: 'http://sudetu.ac/ajier'
        },
        {
          iconUrl: 'http://pedet.se/vibjuwdik',
          id: '1217',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '2530',
          storageIndex: 620,
          title: 'mombukfes',
          type: 'bookmark',
          url: 'http://keil.gi/wokuj'
        },
        {
          iconUrl: 'http://buk.ax/kusa',
          id: '9557',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '2384',
          storageIndex: 8077,
          title: 'ji',
          type: 'bookmark',
          url: 'http://gepfim.md/udojigu'
        },
        {
          iconUrl: 'http://va.mx/aso',
          id: '9551',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '5517',
          storageIndex: 2338,
          title: 'gu',
          type: 'bookmark',
          url: 'http://iza.gr/ge'
        },
        {
          iconUrl: 'http://nula.at/haharud',
          id: '2421',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '1814',
          storageIndex: 7501,
          title: 'zuzeboj',
          type: 'folder',
          url: 'http://huveimi.lu/dudhe'
        },
        {
          iconUrl: 'http://ma.ky/vawujij',
          id: '3284',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '5594',
          storageIndex: 7839,
          title: 'ahobaom',
          type: 'bookmark',
          url: 'http://bigeha.pa/bejozkal'
        },
        {
          iconUrl: 'http://palaw.gov/din',
          id: '4335',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '5176',
          storageIndex: 1909,
          title: 'se',
          type: 'separator',
          url: 'http://dab.qa/ha'
        },
        {
          iconUrl: 'http://sadcup.ad/ipon',
          id: '5098',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '8980',
          storageIndex: 1612,
          title: 'cunnefco',
          type: 'folder',
          url: 'http://vogir.bj/diziwef'
        },
        {
          iconUrl: 'http://dijolagu.bz/tu',
          id: '3886',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '9731',
          storageIndex: 9453,
          title: 'bonawdi',
          type: 'separator',
          url: 'http://tuhu.pn/tiwaru'
        },
        {
          iconUrl: 'http://uworodim.sz/dud',
          id: '2298',
          isRoot: false,
          isUnmodifiable: true,
          parentId: '4531',
          storageIndex: 8972,
          title: 'mipfo',
          type: 'bookmark',
          url: 'http://ra.mx/jozureb'
        },
        {
          iconUrl: 'http://fe.nu/hih',
          id: '5442',
          isRoot: true,
          isUnmodifiable: false,
          parentId: '9273',
          storageIndex: 347,
          title: 'uduh',
          type: 'folder',
          url: 'http://ca.ck/tuna'
        },
        {
          iconUrl: 'http://sumjueja.nz/ewnobti',
          id: '9548',
          isRoot: true,
          isUnmodifiable: true,
          parentId: '3059',
          storageIndex: 8012,
          title: 'juetpoh',
          type: 'bookmark',
          url: 'http://keil.ye/oku'
        },
        {
          iconUrl: 'http://haoshe.ga/tohibpow',
          id: '2595',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '6300',
          storageIndex: 8468,
          title: 'hamrumba',
          type: 'separator',
          url: 'http://zehevduf.fo/cepob'
        },
        {
          iconUrl: 'http://jop.by/etenazis',
          id: '1593',
          isRoot: false,
          isUnmodifiable: false,
          parentId: '7659',
          storageIndex: 8120,
          title: 'cagmakba',
          type: 'folder',
          url: 'http://vu.gq/bahafom'
        }
      ],
      parent: {
        iconUrl: 'http://bingola.ke/vef',
        id: '2724',
        isRoot: true,
        isUnmodifiable: false,
        parentId: '2501',
        storageIndex: 4257,
        title: 'ajuvoj',
        type: 'folder',
        url: 'http://niopuloc.ug/fuvugtoh'
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
