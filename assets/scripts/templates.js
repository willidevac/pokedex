function getTypeBadges(types) {
  return types.map((type) => `<span class="type-badge">${type}</span>`).join("");
}


function getPokemonCard(pokemon) {
  return `
    <button class="pokemon-card type-${pokemon.types[0]}" data-id="card" type="button">
      <span class="pokemon-card__number">#${pokemon.id}</span>
      <strong class="pokemon-card__name">${pokemon.name}</strong>
      <span class="pokemon-card__types">${getTypeBadges(pokemon.types)}</span>
      <span class="pokemon-card__image-area">
        <img data-id="card-image" src="${pokemon.image}" alt="${pokemon.name}">
      </span>
      <span class="pokemon-card__action">Open dossier <b>→</b></span>
    </button>
  `;
}
