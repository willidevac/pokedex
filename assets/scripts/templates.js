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


function formatStatName(name) {
  const map = {
    hp: "HP", attack: "Atk", defense: "Def",
    "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed"
  };
  return map[name] || name;
}


function getDialogStats(stats) {
  return stats.map((item) => {
    const pct = Math.round((item.base_stat / 255) * 100);
    return `<li>
      <span>${formatStatName(item.stat.name)}</span>
      <strong>${item.base_stat}</strong>
      <div class="stat-bar"><div class="stat-bar__fill" style="width:${pct}%"></div></div>
    </li>`;
  }).join("");
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


function getLevelUpMoves(pokemon) {
  return pokemon.moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === "level-up"))
    .map((m) => {
      const detail = m.version_group_details.find((d) => d.move_learn_method.name === "level-up");
      return { name: m.move.name, level: detail.level_learned_at || 1 };
    })
    .sort((a, b) => a.level - b.level);
}


function getDialogMoves(pokemon) {
  const moves = getLevelUpMoves(pokemon);
  if (!moves.length) return "";
  const items = moves.map((m) =>
    `<li><span>Lv.${m.level}</span>${m.name.replace(/-/g, " ")}</li>`
  ).join("");
  return `
    <p class="dialog-card__label">Level-up moves</p>
    <ul class="dialog-card__moves">${items}</ul>
  `;
}


function getMatchupBadges(types) {
  if (!types.length) return `<span class="matchup-pill">none</span>`;
  return types.map((type) => `<span class="matchup-pill">${type}</span>`).join("");
}


function getMatchupGroup(title, types) {
  return `<div><p>${title}</p><div class="matchup-list">${getMatchupBadges(types)}</div></div>`;
}


function getMatchupContent(matchups) {
  return `${getMatchupGroup("Strong against", matchups.strong)}${getMatchupGroup("Weak against", matchups.weak)}`;
}


function getMatchupPlaceholder() {
  return `<section class="dialog-card__matchups" data-id="type-matchups"><p>Loading type matchups...</p></section>`;
}


function getDialogShinyButton(pokemon) {
  const artwork = pokemon.sprites.other["official-artwork"];
  if (!artwork.front_shiny) return "";
  return `
    <button class="dialog-card__shiny" data-id="shiny-button"
      data-normal-src="${artwork.front_default}"
      data-shiny-src="${artwork.front_shiny}"
      type="button">✦ Shiny</button>
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


function getDialogDetails(pokemon) {
  return `
    <ul class="dialog-card__stats">${getDialogStats(pokemon.stats)}</ul>
    ${getDialogFacts(pokemon)}
    ${getMatchupPlaceholder()}
    ${getDialogMoves(pokemon)}
    <p class="dialog-card__description" data-id="species-description">Loading species notes...</p>
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
    ${getDialogShinyButton(pokemon)}
    ${getDialogDetails(pokemon)}
    ${getDialogNavigation()}
  `;
}
