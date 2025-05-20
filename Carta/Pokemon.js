
const MAX_POKEMON = 898;

// Obtener un número aleatorio del 1 al 898
const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;

// Obtener el Pokémon aleatorio
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

 
    document.getElementById("pokemon-type").textContent =
      data.types.map(t => t.type.name).join(" / ");

    
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
    
    // Crear barras para cada estadística
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
  })
  .catch(err => {
    console.error("Error al obtener el Pokémon:", err);
    document.getElementById("pokemon-name").textContent = "Error al cargar";
  });