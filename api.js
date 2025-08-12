const getAllEpisodesApi = "https://api.tvmaze.com/shows/82/episodes";

async function getAllEpisodesData() {
  try {
    const response = await fetch(getAllEpisodesApi);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("failed to fetch episodes", error.message);
    //return an empty array to avoid the app from crashing
    return [];
  }
}
