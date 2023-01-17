import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import DisLike from "../../components/icons/dislike-icon";
import Like from "../../components/icons/like-icon";
import Nav from "../../components/nav/Nav";
import { getYoutubeVideoById } from "../../lib/videos";
import classes from "../../styles/videoId.module.css";

Modal.setAppElement("#__next");
export default function VideoDetail({ video }) {
  const router = useRouter();
  const { videoId } = router.query;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await fetch(`/api/stats/?videoId=${videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const videoData = await response.json();
    const videoInfo = videoData.video?.stats;
    if (videoInfo?.length && videoInfo[0].favourited === 1) {
      setToggleLike(true);
    } else if (videoInfo?.length && videoInfo[0].favourited === 0) {
      setToggleDislike(true);
    }
  };

  const handleToggleLike = async () => {
    let value = !toggleLike;
    setToggleLike((prev) => !prev);
    setToggleDislike(false);
    const response = await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited: value ? 1 : 0,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleToggleDislike = async () => {
    let value = !toggleDislike;
    setToggleDislike((prev) => !prev);
    setToggleLike(false);
    const response = await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited: value ? 0 : 1,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const { publishTime, title, description, channelTitle, viewCount } = video;
  return (
    <div className={classes.container}>
      <Nav />
      <Modal
        isOpen={true}
        onRequestClose={() => {
          router.back();
        }}
        overlayClassName={classes.customStyles}
        className={classes.modal}
        contentLabel="Open the video"
      >
        <iframe
          id="player"
          className={classes.videoPlayer}
          type="text/html"
          width="100%"
          height="390"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
        ></iframe>
        <div className={classes.likeDislikeBtnWrapper}>
          <button onClick={handleToggleLike}>
            <div className={classes.btnWrapper}>
              <Like selected={toggleLike} />
            </div>
          </button>
          <button onClick={handleToggleDislike}>
            <div className={classes.btnWrapper}>
              <DisLike selected={toggleDislike} />
            </div>
          </button>
        </div>
        <div className={classes.modalBody}>
          <div className={classes.modalBodyContent}>
            <div className={classes.col1}>
              <p className={classes.publishTime}>{publishTime}</p>
              <p className={classes.title}>{title}</p>
              <p className={classes.description}>{description}</p>
            </div>
            <div className={classes.col2}>
              <p className={`${classes.subText} ${classes.subTextWrapper}`}>
                <span className={classes.textColor}>CAST: </span>
                <span className={classes.channelTitle}>{channelTitle}</span>
              </p>
              <p className={`${classes.subText} ${classes.subTextWrapper}`}>
                <span className={classes.textColor}>View Count: </span>
                <span className={classes.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export async function getStaticPaths() {
  const videoIds = ["togmdDHG3Pw", "gmRKv7n2If8", "mYfJxlgR2jw"];
  return {
    paths: videoIds.map((videoId) => ({
      params: {
        videoId,
      },
    })),
    fallback: "blocking", // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);
  const video = videoArray.length ? videoArray[0] : {};
  return {
    // Passed to the page component as props
    props: { video },
  };
}
