const pokemonApiUrl = "https://pokeapi.co/api/v2/pokemon";
const pokemonCache = new Map();
const pokemonListCache = new Map();
const speciesCache = new Map();
const typeCache = new Map();


async function fetchPokemonList(limit, offset) {
  const url = `${pokemonApiUrl}?limit=${limit}&offset=${offset}`;
  if (pokemonListCache.has(url)) return pokemonListCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("The Pokémon list could not be loaded.");
  const list = await response.json();
  pokemonListCache.set(url, list);
  return list;
}


async function fetchPokemonType(url) {
  if (typeCache.has(url)) return typeCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokemon type could not be loaded.");
  const type = await response.json();
  typeCache.set(url, type);
  return type;
}


async function fetchPokemonDetails(url) {
  if (pokemonCache.has(url)) return pokemonCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokémon details could not be loaded.");
  const pokemon = await response.json();
  pokemonCache.set(url, pokemon);
  return pokemon;
}


async function loadPokemon(limit, offset) {
  const list = await fetchPokemonList(limit, offset);
  const settled = await Promise.allSettled(list.results.map((p) => fetchPokemonDetails(p.url)));
  return settled.filter((r) => r.status === "fulfilled").map((r) => r.value);
}


async function searchPokemonByName(searchTerm, limit) {
  const list = await fetchPokemonList(limit, 0);
  const matches = list.results.filter((pokemon) => pokemon.name.includes(searchTerm));
  const settled = await Promise.allSettled(matches.map((pokemon) => fetchPokemonDetails(pokemon.url)));
  return settled.filter((r) => r.status === "fulfilled").map((r) => r.value);
}


async function fetchPokemonSpecies(url) {
  if (speciesCache.has(url)) return speciesCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokémon species could not be loaded.");
  const species = await response.json();
  speciesCache.set(url, species);
  return species;
}
