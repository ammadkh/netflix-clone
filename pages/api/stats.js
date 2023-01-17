import jwt from "jsonwebtoken";
import findVideoIdByUser, {
  insertNewStats,
  updateStats,
} from "../../db/Hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    const { cookies } = req;
    const { favourited, watched, videoId } = req.body;
    if (!cookies.token) {
      res.status(403).send({ msg: "Cookie not found" });
    } else {
      const decode = jwt.decode(cookies.token, process.env.JWT_SECRET);
      const findVideo = await findVideoIdByUser(
        decode?.issuer,
        videoId,
        cookies.token
      );
      const isNewVideo = findVideo.stats.length === 0;
      if (isNewVideo) {
        const addedVideo = await insertNewStats(
          decode?.issuer,
          videoId,
          cookies.token,
          favourited
        );
        res.send({ msg: "it works", stats: addedVideo });
      } else {
        const updateVideo = await updateStats(cookies.token, {
          favourited,
          userId: decode?.issuer,
          videoId,
          watched,
        });

        res.send({ msg: "it works" });
      }
    }
  } else {
    const { cookies } = req;
    if (!cookies.token) {
      res.status(403).send({ msg: "Cookie not found" });
    } else {
      const { videoId } = req.query;
      const decode = jwt.decode(cookies.token, process.env.JWT_SECRET);
      const findVideo = await findVideoIdByUser(
        decode?.issuer,
        videoId,
        cookies.token
      );
      const isNewVideo = findVideo.stats.length === 0;
      if (isNewVideo) {
        res.send({ msg: "video not found!" });
      } else {
        res.send({ video: findVideo });
      }
    }
  }
}
