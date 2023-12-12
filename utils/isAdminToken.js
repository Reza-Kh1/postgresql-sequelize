import token from "jsonwebtoken";
const isAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("لطفا وارد حساب کاربری شوید");
  const verify = authorization.split(" ")[1];
  try {
    const data = token.verify(verify, process.env.TOKEN_SECRET);
    if (data.role !== "ADMIN") {
      throw new Error("شما مجاز به دسترسی به این صفحه نیستید");
    }
    req.userInfo = data;
    next();
  } catch (err) {
    throw new Error(err);
  }
};
export default isAdmin;
