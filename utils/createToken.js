import tokens from "jsonwebtoken";
const createToken = async (value) => {
  const token = tokens.sign(value, process.env.TOKEN_SECRET,{expiresIn:'30d'});
  return token;
};
export default createToken