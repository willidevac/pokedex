const pokemonGrid = document.getElementById("pokemon-grid");
const loadMoreButton = document.querySelector('[data-id="load-more-button"]');
const searchButton = document.querySelector('[data-id="search-button"]');
const searchInput = document.querySelector('[data-id="search-input"]');
const visibleCount = document.getElementById("visible-count");
const pokemonDialog = document.querySelector('[data-id="dialog"]');
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.querySelector('[data-id="close-dialog-button"]');
const loadMoreLabel = loadMoreButton.querySelector("strong");
const pageSize = 20;
const maximumPokemon = 151;
let loadedPokemon = [];
let nextOffset = 0;
let activePokemonIndex = 0;


function showGridMessage(message, dataId = "") {
  pokemonGrid.innerHTML = getStatusMessage(message, dataId);
}


function renderPokemonCards(pokemonList) {
  pokemonGrid.innerHTML = pokemonList.map(getPokemonCard).join("");
}


function updateVisibleCount() {
  visibleCount.textContent = `${loadedPokemon.length} visible / Gen I`;
}


function setLoadMoreState(isLoading) {
  const allPokemonLoaded = loadedPokemon.length >= maximumPokemon;
  loadMoreButton.disabled = isLoading || allPokemonLoaded;
  loadMoreButton.classList.toggle("is-loading", isLoading);
  if (allPokemonLoaded) loadMoreLabel.textContent = "All Gen I entries loaded";
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


function findPokemon(id) {
  return loadedPokemon.find((pokemon) => pokemon.id === Number(id));
}


function updateDialogNavigation() {
  const prevButton = document.querySelector('[data-id="prev-button"]');
  const nextButton = document.querySelector('[data-id="next-button"]');
  prevButton.disabled = activePokemonIndex === 0;
  nextButton.disabled = activePokemonIndex === loadedPokemon.length - 1;
}


async function loadSpeciesData(pokemon) {
  try {
    await fetchPokemonSpecies(pokemon.species.url);
  } catch (error) {
    console.error(error);
  }
}


function showPokemonDialog(pokemon) {
  dialogContent.innerHTML = getDialogContent(pokemon);
  updateDialogNavigation();
  loadSpeciesData(pokemon);
}


function openPokemonDialog(card) {
  const pokemon = findPokemon(card.dataset.pokemonId);
  activePokemonIndex = loadedPokemon.indexOf(pokemon);
  showPokemonDialog(pokemon);
  pokemonDialog.showModal();
  document.body.classList.add("dialog-open");
}


function closePokemonDialog() {
  pokemonDialog.close();
  unlockPage();
}


function unlockPage() {
  document.body.classList.remove("dialog-open");
}


function handleCardClick(event) {
  const card = event.target.closest('[data-id="card"]');
  if (card) openPokemonDialog(card);
}


function handleDialogClick(event) {
  if (event.target === pokemonDialog) closePokemonDialog();
}


function changeDialogPokemon(step) {
  activePokemonIndex += step;
  showPokemonDialog(loadedPokemon[activePokemonIndex]);
}


function handleDialogNavigation(event) {
  if (event.target.matches('[data-id="prev-button"]')) changeDialogPokemon(-1);
  if (event.target.matches('[data-id="next-button"]')) changeDialogPokemon(1);
}


function handleLoadingError(error) {
  showGridMessage("The Pokémon could not be loaded.", "not-found");
  console.error(error);
}


async function fetchNextPokemon() {
  const loadAmount = Math.min(pageSize, maximumPokemon - nextOffset);
  const newPokemon = await loadPokemon(loadAmount, nextOffset);
  loadedPokemon.push(...newPokemon);
  nextOffset += loadAmount;
}


async function loadNextPokemon() {
  setLoadMoreState(true);
  try {
    if (nextOffset) resetSearch();
    await fetchNextPokemon();
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
  pokemonGrid.addEventListener("click", handleCardClick);
  closeDialogButton.addEventListener("click", closePokemonDialog);
  pokemonDialog.addEventListener("click", handleDialogClick);
  dialogContent.addEventListener("click", handleDialogNavigation);
  pokemonDialog.addEventListener("cancel", unlockPage);
  pokemonDialog.addEventListener("close", unlockPage);
}


function startPokedex() {
  showGridMessage("Loading Pokémon...");
  updateSearchButton();
  addEventListeners();
  loadNextPokemon();
}


startPokedex();
