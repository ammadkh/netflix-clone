import React from "react";
import classes from "./loading.module.css";

export default function Loading() {
  return (
    <div className={classes.container}>
      <div className={classes.loader}>loading...</div>;
    </div>
  );
}
