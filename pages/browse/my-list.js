import Head from "next/head";
import React from "react";
import SectionCard from "../../components/card/Section-card";
import Nav from "../../components/nav/Nav";
import { fetchMylist } from "../../db/Hasura";
import { getSyncVideos } from "../../lib/videos";
import classes from "../../styles/my-list.module.css";
import UseExtractToken from "../../utils/useExtractToken";

export async function getServerSideProps(context) {
  const { userId, token } = UseExtractToken(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let myList = await fetchMylist(userId, token);
  console.log(myList, "my listtt");
  myList = myList.map((item) => ({
    id: item.videoId,
    imgUrl: `https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg`,
  }));

  return {
    props: { myList }, // will be passed to the page component as props
  };
}

export default function MyList({ myList }) {
  const disneyVideos = getSyncVideos("disney trailure");
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={classes.main}>
        <Nav />
        <div className={classes.sectionWrapper}>
          <SectionCard
            title="My List"
            videos={myList}
            size="small"
            shouldWrap
          />
        </div>
      </main>
    </div>
  );
}
