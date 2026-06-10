const pokemonGrid = document.getElementById("pokemon-grid");
const notFoundMessage = document.querySelector('[data-id="not-found"]');


function showLoadingMessage() {
  pokemonGrid.innerHTML = '<p class="loading-message">Loading Pokémon...</p>';
}


function renderPokemonCards(pokemonList) {
  pokemonGrid.innerHTML = pokemonList.map(getPokemonCard).join("");
}


function showLoadingError() {
  notFoundMessage.textContent = "The Pokémon could not be loaded.";
  notFoundMessage.hidden = false;
  pokemonGrid.innerHTML = "";
}


async function startPokedex() {
  showLoadingMessage();
  try {
    const pokemonList = await loadPokemon();
    renderPokemonCards(pokemonList);
  } catch (error) {
    showLoadingError();
    console.error(error);
  }
}


startPokedex();
