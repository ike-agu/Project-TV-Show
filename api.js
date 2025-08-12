const getAllEpisodesApi = "https://api.tvmaze.com/shows/82/episodes";

async function getAllEpisodesData() {
  try {
    const response = await fetch(getAllEpisodesApi);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        "Sorry, something went wrong while loading episodes. Please try refreshing the page.",
    };
  }
}
