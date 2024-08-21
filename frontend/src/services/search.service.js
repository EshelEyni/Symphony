import { storageService } from "./storage.service";
import { stationService } from "./station.service";
import { getClipsFromServer } from "./getClips";

export const searchService = {
  getClips,
  updateUserRecentSearches,
};

async function getClips(term) {
  const termClipsMap = storageService.loadFromStorage("searchDB") || {};

  if (termClipsMap[term]) {
    console.log("Getting from Cache");
    return Promise.resolve(termClipsMap[term]);
  }

  console.log("Getting from Network");
  const clips = await getClipsFromServer(term);
  console.log("clips", clips);
  if (clips && clips.length) {
    termClipsMap[term] = clips;
    storageService.saveToStorage("searchDB", termClipsMap);
  }
  return clips;
}

async function updateUserRecentSearches(
  searchResults,
  loggedinUser,
  currSearchTerm
) {
  if (!loggedinUser) return;
  const clip = searchResults[0] || {};
  if (!clip.img?.url) return; // No valid results from YT_API
  let newSearchList = {
    name: currSearchTerm,
    imgUrl: clip.img.url,
    createdBy: {
      _id: loggedinUser._id,
      username: loggedinUser.username,
      imgUrl: loggedinUser.imgUrl,
    },
    isSearch: true,
    clips: searchResults || [],
  };

  const savedStation = await stationService.save(newSearchList);
  const userToUpdate = { ...loggedinUser };
  userToUpdate.recentSearches = [
    { _id: savedStation._id, title: savedStation.name },
    ...userToUpdate.recentSearches,
  ];

  if (userToUpdate.recentSearches.length > 10) {
    const stationToRemove = userToUpdate.recentSearches.splice(10, 1)[0];
    await stationService.remove(stationToRemove._id);
  }
  return userToUpdate;
}

export const searchFilterBtns = [
  { title: "All", value: null },
  { title: "Songs", value: "songs" },
  { title: "Playlists", value: "playlists" },
  { title: "Artists", value: "artists" },
  { title: "Profiles", value: "profiles" },
  { title: "Recent Searches", value: "searches" },
];
