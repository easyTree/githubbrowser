import { updateLookup, objectFind, getPageIndex, getPageIndices, objectMap } from './utils';

it('Can build the index', () => {
  const items1 = [{ id: 0, name: 'a' }, { id: 1, name: 'b' }];
  const items2 = [{ id: 2, name: 'c' }, { id: 3, name: 'd' }];
  const items3 = [{ id: 4, name: 'e' }, { id: 5, name: 'f' }];
  const lookup = {};
  updateLookup(items1, lookup, 0);
  expect(lookup).toEqual({
    0: { id: 0, name: 'a' },
    1: { id: 1, name: 'b' }
  });
  updateLookup(items3, lookup, 2);
  expect(lookup).toEqual({
    0: { id: 0, name: 'a' },
    1: { id: 1, name: 'b' },
    2: { id: 4, name: 'e' },
    3: { id: 5, name: 'f' }
  });
  updateLookup(items2, lookup, 4);
  expect(lookup).toEqual({
    0: { id: 0, name: 'a' },
    1: { id: 1, name: 'b' },

    2: { id: 4, name: 'e' },
    3: { id: 5, name: 'f' },

    4: { id: 2, name: 'c' },
    5: { id: 3, name: 'd' }
  });
})

it('Can find within an object', () => {
  const ob = {
    0: { id: 0, name: 'a' },
    1: { id: 1, name: 'b' },
    2: { id: 4, name: 'e' },
    3: { id: 5, name: 'f' }
  };
  function finder(k, v) {
    const wasFound = v.name === 'b';
    return wasFound;
  }
  const found = objectFind(ob, finder);

  expect(found).toEqual({ k: "1", v: { id: 1, name: 'b' } });
})


it('Can get the associated page', () => {
  const pageSize = 4;
  const mapping = {
    0: 1,
    1: 1,
    2: 1,
    3: 1,

    4: 2,
    5: 2,
    6: 2,
    7: 2,

    8: 3,
    9: 3,
    10: 3,
    11: 3
  }
  const expected = JSON.stringify(mapping, null, 2)
  const actual = JSON.stringify(objectMap(mapping, (k, v) => getPageIndex(k, pageSize)), null, 2)

  expect(actual).toEqual(expected)
})

it('Can get the indices for a particular page', () => {
  const pageSize = 4;
  const mapping = {
    1: { from: 0, to: 3},
    2: { from: 4, to: 7},
    3: { from: 8, to: 11},
  }
  const expected = JSON.stringify(mapping, null, 2)
  const actual = JSON.stringify(objectMap(mapping, (k, v) => getPageIndices(k, pageSize)), null, 2)

  expect(actual).toEqual(expected)
})

test('Can regex-parse an URL fragment', () => {
  const expectations = [{
    input: '/repos/repo.owner.login1/repo.name1/readme',
    output: {
      1: 'repo.owner.login1',
      2: 'repo.name1',
      3: '/readme'
    }
  }, {
    input: '/repos/repo.owner.login2/repo.name2/pulls?per_page=1',
    output: {
      1: 'repo.owner.login2',
      2: 'repo.name2',
      3: '/pulls?per_page=1'
    }
  }, {
    input: '/repos/repo.owner.login3/repo.name3',
    output: {
      1: 'repo.owner.login3',
      2: 'repo.name3',
      3: ''
    }
  }]
  const re = /\/repos\/([A-Za-z0-9_ +-.]+)\/([A-Za-z0-9_ +-.]+)(.*)$/
  expectations.forEach(e => {
    const matches = re.exec(e.input)
    Object.keys(e.output).forEach(k => expect(matches[k]).toEqual(e.output[k]))
  })
})
