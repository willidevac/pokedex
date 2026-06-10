const pokemonList = [
  createPokemon("0001", "Bulbasaur", ["grass", "poison"]),
  createPokemon("0002", "Ivysaur", ["grass", "poison"]),
  createPokemon("0003", "Venusaur", ["grass", "poison"]),
  createPokemon("0004", "Charmander", ["fire"]),
  createPokemon("0005", "Charmeleon", ["fire"]),
  createPokemon("0006", "Charizard", ["fire", "flying"]),
  createPokemon("0007", "Squirtle", ["water"]),
  createPokemon("0025", "Pikachu", ["electric"]),
];


function createPokemon(id, name, types) {
  const imageId = Number(id);
  const imagePath = "https://raw.githubusercontent.com/PokeAPI/sprites/master";
  const image = `${imagePath}/sprites/pokemon/other/official-artwork/${imageId}.png`;
  return { id, name, types, image };
}


function renderPokemonCards() {
  const pokemonGrid = document.getElementById("pokemon-grid");
  pokemonGrid.innerHTML = pokemonList.map(getPokemonCard).join("");
}


renderPokemonCards();
