import { getUserIdFromToken } from "../lib/utils";

export default function UseExtractToken(context) {
  const { cookies } = context.req;
  const token = cookies.token;
  const userId = getUserIdFromToken(token);

  return {
    userId,
    token,
  };
}
