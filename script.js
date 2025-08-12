
//Global variable to store all episode data for filtering and searching
let allEpisodes = [];
async function setup() {
  const rootElement = document.getElementById("root");
  rootElement.textContent = "Loading episodes, Please wait...";

  // Fetch episode data from the API (this is an async operation)
  const episodeData = await getAllEpisodesData();

  if (episodeData.success) {
    allEpisodes = episodeData.data;
    rootElement.textContent = "";
    makePageForEpisodes(episodeData.data);
    createControls();
    createFooter();
  } else {
    rootElement.textContent = episodeData.error;
  }

  //Creates the control panel with dropdown selector and search input
  function createControls() {
    //create a container div to hold all control elements
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "controls-container";

    // Create dynamic select dropdown for episodes
    const selectElem = document.createElement("select");
    selectElem.id = "selected-episode";
    selectElem.name = "episodes";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select an episode";
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

    // Loop through all episodes to create dropdown options
    allEpisodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `S${String(episode.season).padStart(2, "0")}
    E${String(episode.number).padStart(2, "0")} - ${episode.name}`;

      selectElem.appendChild(option);
    });

    // Add event listeners
    selectElem.addEventListener("change", handleEpisodeSelection);
    searchInput.addEventListener("input", handleSearch);
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
        episode.summary.toLowerCase().includes(searchTerm) ||
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

    const episodesContainer = document.createElement("div");
    episodesContainer.classList.add("episodes-container");

    //Displays all episode cards
    const allEpisodesList = episodeList.map(allEpisodesCard);
    rootElem.append(...allEpisodesList);
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

    episodeCard(
      "img",
      `${episode.image.medium}`,
      episode.image.medium,
      cardForEpisodes
    );
    episodeCard("h3", `${episode.name}`, null, cardForEpisodes);
    episodeCard("p", `${episodeCode}`, null, cardForEpisodes);

    const summaryDiv = document.createElement("div");
    summaryDiv.innerHTML = `Summary:${episode.summary}`;
    cardForEpisodes.appendChild(summaryDiv);

    return cardForEpisodes;
  }
}

window.onload = setup;
