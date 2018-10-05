const errorTypes = {
  noError: 0,
  apiRateLimited: 1,
  other: 2
};

function buildError(errorType, message) {
  return { errorType, message, __es6InheritanceTranspileFail__: true };
}
// class Err extends Error {
//   constructor(errorType, message) {
//     super(message);
//     this.name = 'Err';
//     this.errorType = errorType;
//   }
// }
// export default Err;
export { buildError, errorTypes };
