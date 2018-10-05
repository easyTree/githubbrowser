
export function getRepoUrl(repo, suffix) {
  return `https://api.github.com/repos/${repo.owner.login}/${repo.name}${suffix}`;
}
export function getRepoWebUrl(repo, suffix) {
  return `https://github.com/${repo.owner.login}/${repo.name}${suffix}`;
}
export function getRepoWebUrls(repo) {
  return objectMap({
    issues: 'issues',
    pulls: 'pulls',
    watchers: 'watchers',
    stars: 'stargazers',
    forks: 'network/members'
  }, (k, v) => getRepoWebUrl(repo, `/${v}`));
}
export function getRateLimitUrl() {
  return 'https://api.github.com/rate_limit';
}
export function groupsOfThree(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function normalizeLimits(area) {
  return {
    limit: Number(area.limit),
    remaining: Number(area.remaining),
    reset: new Date(1000 * Number(area.reset))
  };
}
// Output an object with the same keys and mapped values 
export function objectMap(object, mapper) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapper(key, object[key])
    return result
  }, {});
}
export function objectFind(object, matcher) {
  const f = Object.keys(object)
    .map(k => ({ k: k, v: object[k] }))
    .find(({ k, v }) => matcher(k, v));

    return f;
}
// Update target object with the result of running the 
// key-value pairs of the source object through a mapper 
// which may modify both keys and values.
export function objectMapInto(object, mapper, target) {
  Object
    .keys(object)
    .reduce((result, key) => {
      const [[ko, vo]] = Object.entries(
        mapper([Number(key), object[key]])
      );
      result[ko] = vo;
      return result;
    }, target);
}
export function updateLookup(entries, lookup, offset) {
  objectMapInto(
    entries,
    ([k, v]) => ({ [Number(k) + offset]: v }),
    lookup
  );
}
export function pascalCase(str) {
  return str.replace(
    /(\w)(\w*)/g,
    (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
  );
}

// index is zero-based; output page is one-based
export function getPageIndex(index, pageSize) {
  return Math.ceil((Number(index) + 1) / pageSize)
}

function getFakeData(addr) {
  const fakeData = false
  const fakeLimits = false

  return fakeData && (fakeLimits || addr !== 'https://api.github.com/rate_limit')
}

export function fetchData(addr, params) {
  if (getFakeData(addr)) {
    const newAddr = addr.replace('https://api.github.com', 'http://localhost:3001/github')
    return fetch(newAddr, params)
  }
  else {
    return fetch(addr, params)
  }
}

