//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodesContainer = document.createElement("div");
  episodesContainer.classList.add("episodes-container");

  //displays all episode cards
  const allEpisodesList = episodeList.map(allEpisodesCard)
  rootElem.append(...allEpisodesList);

  // 4. Create footer
  const footer = document.createElement("footer");

  // create TV shows source link
  const sourceLink = document.createElement("a");
  sourceLink.textContent = "TV Shows and Series are from TVMaze.com";
  sourceLink.href = "https://www.tvmaze.com/";
  sourceLink.target = "_blank";
  sourceLink.ref = "noopener noreferrer";

  footer.appendChild(sourceLink);
  document.body.append(footer);
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
  const episodeCode = "S" + seasonNumber.padStart(2, 0) + "E" + episodeNumber.padStart(2, 0);//create Episode Code

  episodeCard("img",`${episode.image.medium}`, episode.image.medium, cardForEpisodes);
  episodeCard("h3", `${episode.name}`, null, cardForEpisodes);
  episodeCard("p", `${episodeCode}`, null, cardForEpisodes);
  episodeCard("p", `Summary: ${episode.summary}`, null, cardForEpisodes);

  return cardForEpisodes;
}

window.onload = setup;
