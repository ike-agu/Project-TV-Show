const baseApi = "https://api.tvmaze.com";

// Cache to store shows and episodes
// This will help avoid unnecessary API calls and improve performance
const cache = {
  shows: null, // one-time list of shows
  episodesByShow: new Map(), // showId -> episodes[]
};

//Get all shows from the API
async function getShowsList() {
  if (cache.shows) return { success: true, data: cache.shows }; // serve from cache
  try {
    const response = await fetch(`${baseApi}/shows?page=0`);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();

    // Sort shows by name in a case-insensitive manner
    data.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    cache.shows = data; // store in cache
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        "Sorry, something went wrong while loading shows list. Please try refreshing the page.",
    };
  }
}

//Get episodes by show ID from the API
async function getEpisodesByShowId(showId) {
  if (cache.episodesByShow.has(showId)) {
    return { success: true, data: cache.episodesByShow.get(showId) };
  }
  try {
    const response = await fetch(`${baseApi}/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    cache.episodesByShow.set(showId, data);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        "Sorry, something went wrong while loading episodes. Please try refreshing the page.",
    };
  }
}

// Get all shows data from the API
// This function is used to fetch shows data at the start of the application
async function getAllShowsData() {
  return getShowsList();
}
