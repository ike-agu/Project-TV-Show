//Global variable to store all data
let allEpisodes = [];
let allShows = [];
let currentShow = null;
const rootElement = document.getElementById("root");

async function setup() {
  // const rootElement = document.getElementById("root");
  rootElement.textContent = "Loading shows and episodes, Please wait...";

  // Fetch shows data from the API first
  const showsData = await getAllShowsData();

  if (showsData.success) {
    allShows = showsData.data;
    rootElement.textContent = "";
    createControls();
    createFooter();

    // Select first show by default and load its episodes
    if (allShows.length > 0) {
      currentShow = allShows[0];
      await loadEpisodesForShow(currentShow.id);
    }
  } else {
    rootElement.textContent = showsData.error;
  }

  // Function to load episodes for a selected show
  async function loadEpisodesForShow(showId) {
    // const rootElement = document.getElementById("root");
    rootElement.textContent = "Loading episodes, Please wait...";

    // Fetch episode data from the API (this is an async operation)
    const episodeData = await getEpisodesByShowId(showId);

    if (episodeData.success) {
      allEpisodes = episodeData.data;
      rootElement.textContent = "";
      makePageForEpisodes(episodeData.data);

      // Update episode dropdown
      updateEpisodeDropdown();

      // Clear search input
      const searchInput = document.getElementById("search");
      if (searchInput) {
        searchInput.value = "";
      }
    } else {
      rootElement.textContent = episodeData.error;
    }
  }

  //Creates the control panel with dropdown selector and search input
  function createControls() {
    //create a container div to hold all control elements
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "controls-container";

    // Create show select dropdown
    const showSelectElem = document.createElement("select");
    showSelectElem.id = "selected-show";
    showSelectElem.name = "shows";

    // Add shows to dropdown
    allShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelectElem.appendChild(option);
    });

    controlsContainer.appendChild(showSelectElem);

    // Create dynamic select dropdown for episodes
    const selectElem = document.createElement("select");
    selectElem.id = "selected-episode";
    selectElem.name = "episodes";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Show all episodes";
    selectElem.appendChild(defaultOption);

    controlsContainer.appendChild(selectElem);

    // Create a text input for live search functionality
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "search";
    searchInput.name = "search";
    searchInput.placeholder = "Search term";

    controlsContainer.appendChild(searchInput);

    const rootElem = document.getElementById("root");
    document.body.insertBefore(controlsContainer, rootElem);

    // Add event listeners
    showSelectElem.addEventListener("change", handleShowSelection);
    selectElem.addEventListener("change", handleEpisodeSelection);
    searchInput.addEventListener("input", handleSearch);
  }

  // Update episode dropdown when show changes
  function updateEpisodeDropdown() {
    const selectElem = document.getElementById("selected-episode");

    selectElem.innerHTML = ""; // Clear existing options

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Show all episodes";
    selectElem.appendChild(defaultOption);

    // Add episodes for current show
    allEpisodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `S${String(episode.season).padStart(
        2,
        "0"
      )}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
      selectElem.appendChild(option);
    });
  }

  /**
   * Handles show selection from the dropdown
   * Updates current show, resets episode selector and search input,
   * then loads episodes for the newly selected show
   * @param {Event} event - The change event from show select dropdown
   */
  async function handleShowSelection(event) {
    const selectedShowId = parseInt(event.target.value, 10);
    currentShow = allShows.find((show) => show.id === selectedShowId);

    if (currentShow) {
      // Reset episode selector and search
      const episodeSelect = document.getElementById("selected-episode");
      const searchInput = document.getElementById("search");

      episodeSelect.value = "";
      searchInput.value = "";

      // Load episodes for selected show
      await loadEpisodesForShow(currentShow.id);
    }
  }

  //Handles when a user selects an episode from the dropdown
  function handleEpisodeSelection(event) {
    const searchInput = document.getElementById("search");
    searchInput.value = "";
    const selectedEpisodeValue = event.target.value;
    if (selectedEpisodeValue === "") {
      makePageForEpisodes(allEpisodes);
      return;
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id === parseInt(selectedEpisodeValue, 10)
      );
      if (selectedEpisode) {
        makePageForEpisodes([selectedEpisode]);
      }
    }
  }
  //Handles live search functionality as user types
  function handleSearch(event) {
    const selectElem = document.getElementById("selected-episode");
    selectElem.value = "";
    const searchTerm = event.target.value.toLowerCase();
    // Filter episodes that match the search term in summary, name, or season
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        (episode.summary &&
          episode.summary.toLowerCase().includes(searchTerm)) ||
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.season.toString().includes(searchTerm)
    );
    makePageForEpisodes(filteredEpisodes);
  }

  // Create footer
  function createFooter() {
    const footer = document.createElement("footer");
    // Create link to TVMaze (data source)
    const sourceLink = document.createElement("a");
    sourceLink.textContent = "TV Shows and Series are from TVMaze.com";
    sourceLink.href = "https://www.tvmaze.com/";
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";

    footer.appendChild(sourceLink);
    document.body.append(footer);
  }

  function makePageForEpisodes(episodeList) {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = "";
    //Displays all episode cards
    const allEpisodesList = episodeList.map(allEpisodesCard);
    rootElem.append(...allEpisodesList);
    //handles counter for episodes
    const EpisodeCounterContainer = document.getElementById(
      "episode-count-container"
    );
    EpisodeCounterContainer.innerHTML = "";
    const header = document.createElement("div");
    header.id = "episode-count";
    header.textContent = `Got ${episodeList.length} episode(s)`;
    EpisodeCounterContainer.appendChild(header);
  }

  // Helper function. Creates and appends HTML element to a parent element e.g <h3>, <p>, <img> etc
  function episodeCard(tagName, textContent, src, parentElement) {
    const element = document.createElement(tagName);
    if (tagName === "img") {
      element.src = src || textContent;
      element.alt = "Episode Image";
    } else {
      element.textContent = textContent;
    }
    parentElement.appendChild(element);
    return element;
  }

  //Creates a complete episode card with all episode information
  function allEpisodesCard(episode) {
    const cardForEpisodes = document.createElement("section");
    cardForEpisodes.classList.add("card-for-episodes");

    const seasonNumber = `${episode.season}`;
    const episodeNumber = `${episode.number}`;
    const episodeCode =
      "S" +
      seasonNumber.padStart(2, "0") +
      "E" +
      episodeNumber.padStart(2, "0"); //create Episode Code
    const imageUrl = episode.image
      ? episode.image.medium
      : "https://via.placeholder.com/210x295?text=No+Image";

    episodeCard("img", imageUrl, imageUrl, cardForEpisodes);
    episodeCard("h3", `${episode.name}`, null, cardForEpisodes);
    episodeCard("p", `${episodeCode}`, null, cardForEpisodes);

    const summaryDiv = document.createElement("div");
    summaryDiv.innerHTML = `Summary: ${
      episode.summary || "No summary available."
    }`;
    cardForEpisodes.appendChild(summaryDiv);

    return cardForEpisodes;
  }

  function makePageForTvShows(showList) {
    rootElement.innerHTML = "";
    // div to hold all tv show
    const showListDiv = document.createElement("div");
    showListDiv.id = "show-list";
    rootElement.appendChild(showListDiv);
    //clone tv show template
    const templateTvShow = document.getElementById("tv-show-template");

    showList.forEach((show) => {
      const showCard = templateTvShow.content.cloneNode(true);
      showCard.querySelector(".tv-show-title").textContent = show.name;
      showCard.querySelector(".tv-show-rating").textContent =
        show.rating?.average || "N/A";
      showCard.querySelector(".tv-show-genre").textContent =
        show.genres.join(",") || "N/A";
      showCard.querySelector(".tv-show-status").textContent = show.status;
      showCard.querySelector(".tv-show-runtime").textContent =
        show.runtime || "N/A";
      showCard.querySelector(".tv-show-summary").innerHTML = show.summary;
      // Handles tv show missing images
      const imgElementTvShow = showCard.querySelector(".tv-show-img");
      if (show.image) {
        imgElementTvShow.src = show.image?.medium || null;
      } else {
        imgElementTvShow.style.display = "none";
      }
      showListDiv.appendChild(showCard);
    });
  }

  makePageForTvShows(allShows);
}

window.onload = setup;
