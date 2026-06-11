function getTypeBadges(types) {
  return types.map((type) => `<span class="type-badge">${type}</span>`).join("");
}


function getStatusMessage(message, dataId = "") {
  const attribute = dataId ? ` data-id="${dataId}"` : "";
  return `<p class="status-message"${attribute}>${message}</p>`;
}


function getPokemonCard(pokemon) {
  const pokemonId = String(pokemon.id).padStart(4, "0");
  const pokemonTypes = pokemon.types.map((item) => item.type.name);
  const pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
  return `
    <button class="pokemon-card type-${pokemonTypes[0]}" data-id="card" data-pokemon-id="${pokemon.id}" type="button">
      <span class="pokemon-card__number">#${pokemonId}</span>
      <strong class="pokemon-card__name">${pokemon.name}</strong>
      <span class="pokemon-card__types">${getTypeBadges(pokemonTypes)}</span>
      <span class="pokemon-card__image-area"><img data-id="card-image" src="${pokemonImage}" alt="${pokemon.name}"></span>
      <span class="pokemon-card__action">Open dossier <b>→</b></span>
    </button>
  `;
}


function getDialogStats(stats) {
  return stats.slice(0, 3).map(getDialogStat).join("");
}


function getDialogStat(item) {
  return `<li><span>${item.stat.name}</span><strong>${item.base_stat}</strong></li>`;
}


function getDialogContent(pokemon) {
  const types = pokemon.types.map((item) => item.type.name);
  const image = pokemon.sprites.other["official-artwork"].front_default;
  return `
    <p class="eyebrow">Live specimen dossier / #${String(pokemon.id).padStart(4, "0")}</p>
    <h2>${pokemon.name}</h2>
    <div class="dialog-card__types">${getTypeBadges(types)}</div>
    <img data-id="dialog-image" src="${image}" alt="${pokemon.name}">
    <ul class="dialog-card__stats">${getDialogStats(pokemon.stats)}</ul>
  `;
}
