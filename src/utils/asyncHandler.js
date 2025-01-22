<<<<<<< HEAD
const asyncHandler = (fn) => async (req, res, next) => {
=======
export const asyncHandler = (fn) => async (req, res, next) => {
>>>>>>> Shubham
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
<<<<<<< HEAD

export {asyncHandler};
=======
>>>>>>> Shubham
