import { ApiError, ApiResponse, asyncHandler } from "../utils";


const demo  = asyncHandler( async(req, res)=>{
   
    const data = 12;
//  for error
  if (data<2) {
    throw new ApiError(404, "your error message");
  }
  //  for success
  return res.status(200).json(ApiResponse(200,data , "your message"))

})







export{
    demo,
}