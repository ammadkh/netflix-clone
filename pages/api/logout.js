import { magic } from "../../db/Magic";
import { removeTokenCookie } from "../../db/Cookie";
import { getUserIdFromToken } from "../../lib/utils";

export default async function logout(req, res) {
  try {
    if (!req.cookies.token)
      return res.status(401).json({ message: "User is not logged in" });
    const token = req.cookies.token;

    const userId = getUserIdFromToken(token);
    removeTokenCookie(res);
    try {
      await magic.users.logoutByIssuer(userId);
    } catch (error) {
      console.log("User's session with Magic already expired");
      console.error("Error occurred while logging out magic user", error);
    }
    //redirects user to login page
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (error) {
    console.error({ error });
    res.status(401).json({ message: "User is not logged in" });
  }
}
