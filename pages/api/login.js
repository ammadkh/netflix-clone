var jwt = require("jsonwebtoken");
import { setTokenCookie } from "../../db/Cookie";
import { createNewUser, isNewUser } from "../../db/Hasura";
import { magicAdmin } from "../../db/Magic";
export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      const metaData = await magicAdmin.users.getMetadataByToken(didToken);
      const token = jwt.sign(
        {
          issuer: `${metaData.issuer}`,
          publicAddress: `${metaData.publicAddress}`,
          email: `${metaData.email}`,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor((Date.now() / 1000) * 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metaData.issuer}`,
          },
        },
        process.env.JWT_SECRET
      );
      const isNewUserQuery = await isNewUser(token, metaData.issuer);
      isNewUserQuery && (await createNewUser(token, metaData));
      const setCookie = setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.log(error, "err0");
      res.send({ done: false });
    }
  }
}
