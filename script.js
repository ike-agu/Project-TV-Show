//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  //displays all episode cards
  const allEpisodesList = [];
  for (const item of episodeList) {
    allEpisodesList.push(allEpisodesCard(item));
  }
  rootElem.append(...allEpisodesList);
}


// Helper function. Creates and appends HTML element to a parent element e.g <h3>, <p>, <img> etc
function episodeCard(tagName, textContent, src, parentElement) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
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
function allEpisodesCard(episode){
  const cardForEpisodes = document.createElement("section")
  episodeCard("img", `${episode.image.medium}`,  episode.image.medium,  cardForEpisodes);
  episodeCard("h3", `Episode: ${episode.name}`, null,  cardForEpisodes);
  episodeCard("p", `Season: ${episode.season}`,null, cardForEpisodes);
  episodeCard("p", `Episode Number: ${episode.number}`, null, cardForEpisodes);
  episodeCard("p", `Summary: ${episode.summary}`, null, cardForEpisodes);

   return cardForEpisodes;
}



window.onload = setup;
