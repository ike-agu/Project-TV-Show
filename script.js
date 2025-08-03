//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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

window.onload = setup;
