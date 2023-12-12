import token from "jsonwebtoken";
const isUser = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("لطفا وارد حساب کاربری شوید");
  const verify = authorization.split(" ")[1];
  try {
    const data = token.verify(verify, process.env.TOKEN_SECRET);
    req.userInfo = data;
    next();
  } catch (err) {
    throw new Error("لطفا دوباره وارد حساب کاربری شوید");
  }
};
export default isUser;
