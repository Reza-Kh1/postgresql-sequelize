import bcrypt from "bcryptjs";
export const createHash = async (value) => {
  return bcrypt.hashSync(value, 10);
};
export const compareHash = (pass, hash) => {
  try {
    const ggo = bcrypt.compareSync(pass, hash);
    if (!ggo) {
      throw new Error();
    }
    return;
  } catch (err) {
    throw new Error("رمز ورود اشتباه است لطفا دوباره تلاش کنید !");
  }
};
