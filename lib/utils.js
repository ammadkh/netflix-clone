import jwt from "jsonwebtoken";

export const  getUserIdFromToken = (token) => {
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  return decodedToken ? decodedToken.issuer : null;
};
