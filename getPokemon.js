// URL de la API
const apiUrlAbilities = "https://pokeapi.co/api/v2/ability/1/";
let abilities = []  // Cambié el nombre de 'companies' a 'abilities'
const companyRequests = [];

const maxID = 1025; // Última ID a consultar
const batchSize = 1; // Número de peticiones simultáneas

// Función para esperar
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para obtener una habilidad
async function fetchAbility(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
   
    const speciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);

    const [responsePromise, speciesResponse] = await Promise.all([response, speciesPromise]);
    
    const data = await responsePromise.json();
    const speciesData = await speciesResponse.json();

    let spanishName = speciesData.names.find(name => name.language.name === "es")?.name ||
                      speciesData.names.find(name => name.language.name === "en")?.name;

    // Obtener descripción en español o inglés
    let spanishDescription = 
      speciesData.flavor_text_entries.find(flavor => flavor.language.name === "es")?.flavor_text ||
      speciesData.flavor_text_entries.find(flavor => flavor.language.name === "en")?.flavor_text

    // Limpiar descripción
    const cleanDescription = spanishDescription?.replace(/\n|\f/g, ' ').trim();

    const movesList = data.moves
    .filter(p => p.move && p.move.url) // Aseguramos que 'move' y 'move.url' existen
    .map(p => {
      const urlParts = p.move.url.split('/').filter(Boolean); // Accedemos a 'move.url'
      const moveId = parseInt(urlParts[urlParts.length - 1]); // Extraemos el ID de la URL
      const latestVersion = p.version_group_details
      .sort((a, b) => b.level_learned_at - a.level_learned_at)[0];
      return {
        id: moveId,
        name: p.move.name, // Agregar el nombre del movimiento si es necesario
        nivel: latestVersion.level_learned_at, // Nivel más reciente
        metodo: latestVersion.move_learn_method.name
      };
    });

    const speciesList = speciesData.varieties
      .filter((p, index) => index !== 0) // Excluir la primera variedad (índice 0)
      .map(async (p) => {
        if (speciesData.varieties.length === 1 && p.is_default) {
          return null; // No procesar si solo tiene la variedad por defecto
        }

        if (p.pokemon && p.pokemon.url) {
          const urlParts = p.pokemon.url.split('/').filter(Boolean);
          const pokemonId = parseInt(urlParts[urlParts.length - 1]);

          // Hacer la llamada para obtener los detalles del Pokémon
          const response = await fetch(p.pokemon.url);
          const data = await response.json();

          const pokeImage = data.sprites.other.showdown.front_default || data.sprites.other["official-artwork"].front_default;

          return {
            id: pokemonId,
            name: data.name,
            grito: data.cries?.latest ?? null,
            imagen: pokeImage,
            peso: data.weight / 10,
            altura: data.height / 10,
            hp: data.stats[0].base_stat,
            ataque_f: data.stats[1].base_stat,
            ataque_e: data.stats[3].base_stat,
            defensa_f: data.stats[2].base_stat,
            defensa_e: data.stats[4].base_stat,
            velocidad: data.stats[5].base_stat,
            tipo: data.types[0]?.type?.name,
            tipo_secundario: data.types[1]?.type?.name ?? null,
          };
        }
      });

    // Ejecutamos las promesas para obtener los resultados
    const speciesResults = await Promise.all(speciesList);
    const filteredResults = speciesResults.filter(result => result !== null);

    const pokeImage = data.sprites.other.showdown.front_default || data.sprites.other["official-artwork"].front_default;

    const urlParts = speciesData.generation.url.split('/').filter(Boolean);
    const generacionId = parseInt(urlParts[urlParts.length - 1]);

    // Crear un nuevo objeto 'ability' para evitar sobrescritura
    const ability = {
      id: data.id,
      nombre: spanishName,
      descripcion: cleanDescription,
      grito: data.cries.latest ?? null,
      imagen: pokeImage,
      peso: data.weight/10,
      altura: (data.height/10),
      hp: data.stats[0].base_stat,
      ataque_f: data.stats[1].base_stat,
      ataque_e: data.stats[3].base_stat,
      defensa_f: data.stats[2].base_stat,
      defensa_e: data.stats[4].base_stat,
      velocidad: data.stats[5].base_stat,
      legendario: speciesData.is_legendary,
      mitico: speciesData.is_mythical,
      generacion: generacionId,
      tipo: data.types[0].type.name,
      tipo_secundario: data.types[1]?.type?.name ?? null,
      movimientos: movesList,
      especies: filteredResults
    };

    
    return ability; // Devuelve el objeto con los datos de la habilidad
  } catch (error) {
    console.error(`Error al obtener habilidad para la ID ${id}:`, error);
    return null; // Devuelve null si hay un error
  }
}

// Función para enviar las habilidades al servidor
async function sendAbilitiesToServer() {
    /*try {
      const response = await fetch("./php/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "companies=" + encodeURIComponent(JSON.stringify(abilities))
      });
  
      const data = await response.text();
      console.log("Respuesta del servidor:", data);
  
      // Limpiar el array después de enviar los datos
      abilities = [];
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
    }*/
  }
  

// Función principal para obtener las habilidades en lotes
async function fetchAbilitiesInBatches() {
  for (let i = 1; i <= maxID; i += batchSize) {
    const batchRequests = [];

    // Crear un lote de promesas de fetch
    for (let j = i; j < i + batchSize && j <= maxID; j++) {
      batchRequests.push(fetchAbility(j));
    }

    // Esperar a que todas las solicitudes del lote terminen
    const results = await Promise.allSettled(batchRequests);


    // Filtrar resultados exitosos y agregarlos al array
    abilities.push(...results.filter(r => r.status === "fulfilled" && r.value).map(r => r.value));

    console.log(`Completado hasta la ID: ${Math.min(i + batchSize - 1, maxID)}`);

    // Enviar los datos al servidor después de cada lote
    await sendAbilitiesToServer();

    // Esperar 1 segundo entre lotes para evitar sobrecarga
    await delay(6000);
  }

  console.log("Todas las habilidades han sido procesadas.");
}

// Iniciar el proceso
fetchAbilitiesInBatches();
