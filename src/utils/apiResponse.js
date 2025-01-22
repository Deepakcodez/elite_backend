class ApiResponse {
    constructor(
        statusCode, 
        data,
        message = "success",

    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
<<<<<<< HEAD
        this.success = statusCode < 400;
=======
>>>>>>> Shubham
    }
}

export {ApiResponse}