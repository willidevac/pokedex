const pokemonApiUrl = "https://pokeapi.co/api/v2/pokemon";
const pokemonCache = new Map();
const pokemonListCache = new Map();


async function fetchPokemonList(limit = 20, offset = 0) {
  const url = `${pokemonApiUrl}?limit=${limit}&offset=${offset}`;
  if (pokemonListCache.has(url)) return pokemonListCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("The Pokémon list could not be loaded.");
  const list = await response.json();
  pokemonListCache.set(url, list);
  return list;
}


async function fetchPokemonDetails(url) {
  if (pokemonCache.has(url)) return pokemonCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokémon details could not be loaded.");
  const pokemon = await response.json();
  pokemonCache.set(url, pokemon);
  return pokemon;
}


async function loadPokemon(limit = 20, offset = 0) {
  const list = await fetchPokemonList(limit, offset);
  return Promise.all(list.results.map((pokemon) => fetchPokemonDetails(pokemon.url)));
}
