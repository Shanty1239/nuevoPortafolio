const MAX_POKEMON = 898;

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

const typeTranslations = {
  normal: "normal",
  fire: "fuego",
  water: "agua",
  electric: "eléctrico",
  grass: "planta",
  ice: "hielo",
  fighting: "lucha",
  poison: "veneno",
  ground: "tierra",
  flying: "volador",
  psychic: "psíquico",
  bug: "bicho",
  rock: "roca",
  ghost: "fantasma",
  dragon: "dragón",
  dark: "siniestro",
  steel: "acero",
  fairy: "hada"
};

const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;

fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("pokemon-name").textContent = data.name.toUpperCase();

    document.getElementById("pokemon-img").style.backgroundImage =
      `url(${data.sprites.other["official-artwork"].front_default})`;

    document.getElementById("pokemon-icon").style.backgroundImage =
      `url(${data.sprites.front_default})`;

    document.getElementById("ID").textContent = `#${data.id}`;

    const power = data.stats.find(stat => stat.stat.name === "attack");
    document.getElementById("pokemon-power").textContent = `Poder: ${power.base_stat}`;

    const types = data.types.map(t => t.type.name);
    const typeText = types.map(t => typeTranslations[t] || t).join(" / ");

    const typeElement = document.getElementById("pokemon-type");
    const descripcionBox = document.querySelector(".descripcion");

    typeElement.textContent = typeText;

    if (types.length === 1) {
      const color = typeColors[types[0]] || "#777";
      descripcionBox.style.background = color;
    } else {
      const color1 = typeColors[types[0]] || "#777";
      const color2 = typeColors[types[1]] || "#999";
      descripcionBox.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
    }

    const height = data.height / 10;
    document.getElementById("pokemon-height").textContent = `Altura: ${height.toFixed(1)} m`;

    const statsContainer = document.getElementById("pokemon-stats");
    statsContainer.innerHTML = "";

    const statTranslations = {
      "hp": "HP",
      "attack": "ATAQUE",
      "defense": "DEFENSA",
      "special-attack": "ATQ ESP",
      "special-defense": "DEF ESP",
      "speed": "VELOCIDAD"
    };

    const statsToShow = ["hp", "attack", "defense", "speed"];

    const orderedStats = data.stats
      .filter(stat => statsToShow.includes(stat.stat.name))
      .sort((a, b) => {
        return statsToShow.indexOf(a.stat.name) - statsToShow.indexOf(b.stat.name);
      });

    orderedStats.forEach(stat => {
      const statName = stat.stat.name;
      const statValue = stat.base_stat;
      const displayName = statTranslations[statName] || statName.toUpperCase();

      const bar = document.createElement("div");
      bar.className = "stat-bar";

      bar.innerHTML = `
        <span class="stat-name">${displayName}:</span>
        <div class="bar-bg">
          <div class="bar-fill" style="width: ${Math.min(statValue, 100)}%;"></div>
        </div>
        <span class="stat-value">${statValue}</span>
      `;

      statsContainer.appendChild(bar);
    });

    // 🔻 Mostrar debilidades
    mostrarDebilidades(types);
  })
  .catch(err => {
    console.error("Error al obtener el Pokémon:", err);
    document.getElementById("pokemon-name").textContent = "Error al cargar";
  });

function mostrarDebilidades(types) {
  const debilidadesContainer = document.getElementById("debilidades-container");
  debilidadesContainer.innerHTML = "";

  const debilidadesSet = new Set();

  types.forEach(async (typeName) => {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const data = await res.json();

    data.damage_relations.double_damage_from.forEach((weakness) => {
      debilidadesSet.add(weakness.name);
    });

    const debilidadesArray = Array.from(debilidadesSet).slice(0, 3);

    debilidadesContainer.innerHTML = "";

    debilidadesArray.forEach((weakness) => {
      const btn = document.createElement("button");
      btn.textContent = typeTranslations[weakness] || weakness;
      btn.classList.add("debilidad-btn"); // clase para estilos desde CSS
      btn.style.backgroundColor = typeColors[weakness] || "#999"; // solo color aquí
      debilidadesContainer.appendChild(btn);
    });
  });
}
