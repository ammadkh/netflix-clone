import Link from "next/link";
import React from "react";
import Card from "./Card";
import classes from "./Section-card.module.css";

export default function SectionCard({
  title,
  videos = [],
  size,
  shouldWrap = false,
  shouldScale = true,
}) {
  return (
    <section className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      <div className={`${classes.cardWrapper} ${shouldWrap && classes.wrap}`}>
        {videos.map((video, index) => {
          return (
            <Link key={video.id} href={`video/${video.id}`}>
              <Card size={size} cardId={index} imageUrl={video.imgUrl} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
