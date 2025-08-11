//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  //create a container for controls
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

  //create a live search input for episodes

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search";
  searchInput.name = "search";
  searchInput.placeholder = "Search term";

  controlsContainer.appendChild(searchInput);

  const rootElem = document.getElementById("root");
  document.body.insertBefore(controlsContainer, rootElem);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}
    E${String(episode.number).padStart(2, "0")} - ${episode.name}`;

    selectElem.appendChild(option);
  });

  selectElem.addEventListener("change", (event) => {
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
  });

  searchInput.addEventListener("input", (event) => {
    selectElem.value = "";
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.summary.toLowerCase().includes(searchTerm) ||
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.season.toString().includes(searchTerm)
    );

    makePageForEpisodes(filteredEpisodes);
  });
  // 4. Create footer
  const footer = document.createElement("footer");

  // create TV shows source link
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

  //displays all episode cards
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

//Creates episode cards  with all its information
function allEpisodesCard(episode) {
  const cardForEpisodes = document.createElement("section");
  cardForEpisodes.classList.add("card-for-episodes");

  const seasonNumber = `${episode.season}`;
  const episodeNumber = `${episode.number}`;
  const episodeCode =
    "S" + seasonNumber.padStart(2, 0) + "E" + episodeNumber.padStart(2, 0); //create Episode Code

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

window.onload = setup;
