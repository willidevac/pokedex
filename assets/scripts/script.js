const pokemonGrid = document.getElementById("pokemon-grid");
const loadMoreButton = document.getElementById("load-more-button");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const visibleCount = document.getElementById("visible-count");
const pokemonDialog = document.getElementById("pokemon-dialog");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog-button");
const loadMoreLabel = loadMoreButton.querySelector("strong");
const pageSize = 20;
const maximumPokemon = 151;
let loadedPokemon = [];
let visiblePokemon = [];
let nextOffset = 0;
let activePokemonIndex = 0;


function showGridMessage(message, dataId = "") {
  pokemonGrid.innerHTML = getStatusMessage(message, dataId);
}


function renderPokemonCards(pokemonList) {
  visiblePokemon = pokemonList;
  pokemonGrid.innerHTML = pokemonList.map(getPokemonCard).join("");
  updateVisibleCount();
}


function updateVisibleCount() {
  visibleCount.textContent = `${visiblePokemon.length} visible / Gen I`;
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


function showSearchResults(results) {
  if (results.length) return renderPokemonCards(results);
  visiblePokemon = [];
  updateVisibleCount();
  showGridMessage("No match found.", "not-found");
}


async function searchPokemon(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm.length < 3) return updateSearchButton();
  searchButton.disabled = true;
  try {
    showSearchResults(await searchPokemonByName(searchTerm, maximumPokemon));
  } catch (error) {
    handleLoadingError(error);
  } finally {
    updateSearchButton();
  }
}


function findPokemon(id) {
  return visiblePokemon.find((pokemon) => pokemon.id === Number(id));
}


function updateDialogNavigation() {
  const prevButton = document.querySelector('[data-id="prev-button"]');
  const nextButton = document.querySelector('[data-id="next-button"]');
  prevButton.disabled = activePokemonIndex === 0;
  nextButton.disabled = activePokemonIndex === visiblePokemon.length - 1;
}


function showSpeciesDescription(pokemon, description) {
  if (pokemon !== visiblePokemon[activePokemonIndex]) return;
  const text = dialogContent.querySelector('[data-id="species-description"]');
  text.textContent = description;
}


async function loadSpeciesData(pokemon) {
  try {
    const species = await fetchPokemonSpecies(pokemon.species.url);
    showSpeciesDescription(pokemon, getSpeciesDescription(species));
  } catch (error) {
    showSpeciesDescription(pokemon, "Species notes could not be loaded.");
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
  activePokemonIndex = visiblePokemon.indexOf(pokemon);
  showPokemonDialog(pokemon);
  pokemonDialog.showModal();
  document.body.classList.add("dialog-open");
}


function closePokemonDialog() {
  pokemonDialog.close();
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
  const next = activePokemonIndex + step;
  if (next < 0 || next >= visiblePokemon.length) return;
  activePokemonIndex = next;
  showPokemonDialog(visiblePokemon[activePokemonIndex]);
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
  } catch (error) {
    handleLoadingError(error);
  } finally {
    setLoadMoreState(false);
  }
}


function addEventListeners() {
  loadMoreButton.addEventListener("click", loadNextPokemon);
  searchForm.addEventListener("submit", searchPokemon);
  searchInput.addEventListener("input", handleSearchInput);
  pokemonGrid.addEventListener("click", handleCardClick);
  closeDialogButton.addEventListener("click", closePokemonDialog);
  pokemonDialog.addEventListener("click", handleDialogClick);
  dialogContent.addEventListener("click", handleDialogNavigation);
  pokemonDialog.addEventListener("close", unlockPage);
}


function startPokedex() {
  showGridMessage("Loading Pokémon...");
  updateSearchButton();
  addEventListeners();
  loadNextPokemon();
}


startPokedex();
