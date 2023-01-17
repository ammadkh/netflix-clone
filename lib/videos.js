import videoData from "../data/videos.json";

export const getCommonVideos = async (url) => {
  const youtubeApi = process.env.YOUTUBE_API;
  const baseUrl = "https://youtube.googleapis.com/youtube/v3";
  try {
    const response = await fetch(`${baseUrl}/${url}&key=${youtubeApi}`);
    const res = await response.json();
    if (res?.error) {
      return [];
    }
    return res.items?.map((item) => {
      return {
        title: item.snippet.title,
        description: item.snippet.description,
        imgUrl: `https://i.ytimg.com/vi/${
          item.id?.videoId || item.id
        }/maxresdefault.jpg`,
        id: item.id?.videoId || item.id,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: item.statistics.viewCount,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSyncVideos = () => {
  return videoData.items?.map((item) => {
    return {
      title: item.snippet.title,
      description: item.snippet.description,
      imgUrl: `https://i.ytimg.com/vi/${
        item.id?.videoId || item.id
      }/maxresdefault.jpg`,
      id: item.id?.videoId || item.id,
      publishTime: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      viewCount: item.statistics.viewCount,
    };
  });
};

export const getVideos = (search) => {
  const url = `search?type=video&part=snippet&maxResults=10&q=${search}`;
  return getCommonVideos(url);
};

export const getPopularVideos = () => {
  const url =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";
  return getCommonVideos(url);
};

export const getYoutubeVideoById = (videoId) => {
  const url = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(url);
};
