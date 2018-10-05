const errorTypes = {
  noError: 0,
  apiRateLimited: 1,
  other: 2
};

function buildError(errorType, message) {
  return { errorType, message, __es6InheritanceTranspileFail__: true };
}
export { buildError, errorTypes };
