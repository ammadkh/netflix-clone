import Image from "next/image";
import React, { useState } from "react";
import classes from "./Card.module.css";
import { motion } from "framer-motion";

const defaultImage =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80";

export default function Card({
  size,
  imageUrl = defaultImage,
  cardId,
  shouldScale,
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const sizeMap = {
    large: classes.lgItem,
    medium: classes.mdItem,
    small: classes.smItem,
  };

  const onErrorHandler = () => {
    setImgSrc(defaultImage);
  };

  const scale = shouldScale
    ? cardId === 0
      ? { scaleY: 1.1 }
      : { scale: 1.1 }
    : { scale: 1 };
  return (
    <div className={classes.container}>
      <motion.div
        className={`${classes.imgMotionWrapper} ${sizeMap[size]}`}
        whileHover={scale}
      >
        <Image
          onError={onErrorHandler}
          src={imgSrc}
          alt="picture"
          layout="fill"
          className={classes.cardImg}
        />
      </motion.div>
    </div>
  );
}
