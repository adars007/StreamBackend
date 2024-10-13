// It is also an approach of handling using async and promise
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// It is a wrapper function of asyncHandler using try catch code
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//       await fn(req,res,next)
//   } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message:error.message
//     })
//   }
// };
