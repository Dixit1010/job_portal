// export const sendToken = (user, statusCode, res, message) => {
//   const token = user.getJWTToken();
//   const options = {
//     expiresIn: new Date(
//       Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true, 
//     secure:true,
//     sameSite:'none',
//   };

//   res.status(statusCode).cookie("token", token, options).json({
//     success: true,
//     user,
//     message,
//     token,
//   });
// };

export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
