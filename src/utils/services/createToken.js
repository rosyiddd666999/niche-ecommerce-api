const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
};

const createSendTokenCookies = (user, statusCode, res) => {
  const token = createToken(user.id);

  const cookieDays = Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7;
  
  const cookieOptions = {
    maxAge: cookieDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production"
  };

  res.cookie("jwt", token, cookieOptions);
  
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_img: user.profile_img,
        addresses: user.addresses
      }
    }
  });
};

module.exports = { createToken, createSendTokenCookies };