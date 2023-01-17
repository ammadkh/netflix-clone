import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import classes from "./Banner.module.css";

export default function Banner({ title, subtitle, imgUrl, videoId }) {
  const router = useRouter();
  const handleOnplay = () => {
    router.push(`/video/${videoId}`);
  };
  return (
    <div className={classes.container}>
      <div className={classes.leftWrapper}>
        <div className={classes.left}>
          <div className={classes.nseriesWrapper}>
            <p className={classes.firstLetter}>N</p>
            <p className={classes.series}>S E R I E S</p>
          </div>
          <h1 className={classes.title}>{title}</h1>
          <h1 className={classes.subTitle}>{subtitle}</h1>
          <div className={classes.playBtnWrapper}>
            <button className={classes.btnWithIcon} onClick={handleOnplay}>
              <Image
                src={"/static/play.svg"}
                alt="play"
                width={30}
                height={30}
              />
              <span className={classes.playText}> Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={classes.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
}
