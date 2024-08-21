import { httpService } from "./http.service.js";

const BASE_URL = "clip/";

export async function getClipsFromServer(term) {
  const url = `${BASE_URL}?term=${term}`;
  const artists = await httpService.get(url);
  return artists;
}
