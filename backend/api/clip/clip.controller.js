const config = require("../../config");
const logger = require("../../services/logger.service.js");
const axios = require("axios");
const duration = require("duration-fns");

const cleaner = /\([^\)]*\)|\[[^\]]*\]|HD|/g;
const emojiCleaner =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
const symbolsCleaner = /[`~!@#$%^*()_|+=?;:",.<>\{\}\[\]\\\/]/gi;
const apostrophe = /&#39|&39|&quot/g;
const ampersand = /&amp;/gi;
const artistNameCleaner = /vevo|music|-topic| - topic|official/gi;

async function getClips(req, res) {
  try {
    const YT_API_Key = config.youTubeKey;
    logger.debug("Getting Clips");
    const term = req.query.term;
    const apiStr = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=10&videoEmbeddable=true&type=video&maxResults=100&key=${YT_API_Key}&q=${term}`;
    const axiosRes = await axios.get(apiStr);
    const str = axiosRes.data.items
      .map((item) => "" + `${item.id.videoId}%2C`)
      .join("")
      .slice(0, -3);
    const durationStr = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${YT_API_Key}`;
    const durations = await axios.get(durationStr);

    const clips = axiosRes.data.items
      .map((item, idx) => {
        const { snippet, id } = item;
        const { title, thumbnails, channelTitle } = snippet;
        const { contentDetails } = durations.data.items[idx];
        return {
          _id: id.videoId,
          title: title
            .replaceAll(cleaner, "")
            .replaceAll(emojiCleaner, "")
            .replaceAll(symbolsCleaner, "")
            .replaceAll(apostrophe, "'")
            .replaceAll(ampersand, "&")
            .trim(),
          img: {
            url:
              thumbnails.high.url ||
              thumbnails.medium.url ||
              thumbnails.default.url,
          },
          artist: channelTitle.replaceAll(artistNameCleaner, "").trim(),
          duration: {
            hours: duration.parse(contentDetails.duration).hours,
            min: duration.parse(contentDetails.duration).minutes,
            sec: duration.parse(contentDetails.duration).seconds,
          },
          likedByUsers: [],
        };
      })
      .filter(
        (clip) =>
          clip.duration.min < 10 && clip.duration.min > 0 && !clip.imgUrl
      )
      .splice(0, 15);
    res.send(clips);
  } catch (err) {
    logger.error("Failed to get clips", err);
    res.status(500).send({ err: "Failed to get clips" });
  }
}
module.exports = { getClips };
