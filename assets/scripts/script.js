const pokemonGrid = document.getElementById("pokemon-grid");
const loadMoreButton = document.querySelector('[data-id="load-more-button"]');
const searchButton = document.querySelector('[data-id="search-button"]');
const searchInput = document.querySelector('[data-id="search-input"]');
const visibleCount = document.getElementById("visible-count");
const pageSize = 20;
let loadedPokemon = [];
let nextOffset = 0;


function showGridMessage(message, dataId = "") {
  pokemonGrid.innerHTML = getStatusMessage(message, dataId);
}


function renderPokemonCards(pokemonList) {
  pokemonGrid.innerHTML = pokemonList.map(getPokemonCard).join("");
}


function updateVisibleCount() {
  visibleCount.textContent = `${loadedPokemon.length} visible / National order`;
}


function setLoadMoreState(isLoading) {
  loadMoreButton.disabled = isLoading;
  loadMoreButton.classList.toggle("is-loading", isLoading);
}


function updateSearchButton() {
  searchButton.disabled = searchInput.value.trim().length < 3;
}


function resetSearch() {
  searchInput.value = "";
  updateSearchButton();
}


function handleSearchInput() {
  updateSearchButton();
  if (!searchInput.value.trim()) renderPokemonCards(loadedPokemon);
}


function searchPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const results = loadedPokemon.filter((pokemon) => pokemon.name.includes(searchTerm));
  if (results.length) return renderPokemonCards(results);
  showGridMessage("No match found.", "not-found");
}


function handleLoadingError(error) {
  showGridMessage("The Pokémon could not be loaded.", "not-found");
  console.error(error);
}


async function loadNextPokemon() {
  setLoadMoreState(true);
  if (nextOffset) resetSearch();
  try {
    const newPokemon = await loadPokemon(pageSize, nextOffset);
    loadedPokemon.push(...newPokemon);
    nextOffset += pageSize;
    renderPokemonCards(loadedPokemon);
    updateVisibleCount();
  } catch (error) {
    handleLoadingError(error);
  } finally {
    setLoadMoreState(false);
  }
}


function addEventListeners() {
  loadMoreButton.addEventListener("click", loadNextPokemon);
  searchButton.addEventListener("click", searchPokemon);
  searchInput.addEventListener("input", handleSearchInput);
}


function startPokedex() {
  showGridMessage("Loading Pokémon...");
  updateSearchButton();
  addEventListeners();
  loadNextPokemon();
}


startPokedex();
