const response = {
  RES_SUCCESS: {
    code: 200,
    message: "Response Success!",
  },
  RES_NOT_NULL: {
    code: 400,
    message: "Params Should Not be Null",
  },
  RES_EXISTED: {
    code: 400,
    message: "Data is Already Existed",
  },
  RES_LOGIN_FAILED: {
    code: 400,
    message: "Incorrect Userid Or Password",
  },
  RES_NO_DATA: {
    code: 400,
    message: "No Data In DB",
  },
  RES_WRONG_DATA: {
    code: 400,
    message: "Incorrected Data is Inputed",
  },
};

module.exports = response;
