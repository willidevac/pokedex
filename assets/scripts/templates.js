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
  return stats.slice(0, 3).map((item) =>
    `<li><span>${item.stat.name}</span><strong>${item.base_stat}</strong></li>`
  ).join("");
}


function getDialogFacts(pokemon) {
  const ability = pokemon.abilities[0].ability.name;
  return `
    <dl class="dialog-card__facts">
      <div><dt>Height</dt><dd>${pokemon.height / 10} m</dd></div>
      <div><dt>Weight</dt><dd>${pokemon.weight / 10} kg</dd></div>
      <div><dt>Ability</dt><dd>${ability}</dd></div>
    </dl>
  `;
}


function getSpeciesDescription(species) {
  const entry = species.flavor_text_entries.find((item) => item.language.name === "en");
  if (!entry) return "No species notes available.";
  return entry.flavor_text.replace(/\s+/g, " ");
}


function getDialogNavigation() {
  return `
    <nav class="dialog-card__navigation" aria-label="Pokémon navigation">
      <button data-id="prev-button" type="button" disabled>← Previous</button>
      <button data-id="next-button" type="button" disabled>Next →</button>
    </nav>
  `;
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
    ${getDialogFacts(pokemon)}
    <p class="dialog-card__description" data-id="species-description">Loading species notes...</p>
    ${getDialogNavigation()}
  `;
}
