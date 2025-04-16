// URL de la API
const apiUrlAbilities = "https://pokeapi.co/api/v2/ability/1/";
let abilities = []  // Cambié el nombre de 'companies' a 'abilities'
const companyRequests = [];

const maxID = 10277; // Última ID a consultar
const batchSize = 1; // Número de peticiones simultáneas

// Función para esperar
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para obtener una habilidad
async function fetchAbility(id) {
  try {
   
    const speciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);

    const [speciesResponse] = await Promise.all([speciesPromise]);
    
    const speciesData = await speciesResponse.json();


    // Crear un nuevo objeto 'ability' para evitar sobrescritura
    const ability = {
      id: id,
      genero: speciesData.gender_rate,
    };

    console.log(ability)
    
    return ability; // Devuelve el objeto con los datos de la habilidad
  } catch (error) {
    console.error(`Error al obtener habilidad para la ID ${id}:`, error);
    return null; // Devuelve null si hay un error
  }
}

// Función para enviar las habilidades al servidor
async function sendAbilitiesToServer() {
    try {
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
    }
  }
  

// Función principal para obtener las habilidades en lotes
async function fetchAbilitiesInBatches() {
  for (let i = 10001; i <= maxID; i += batchSize) {
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
    await delay(500);
  }

  console.log("Todas las habilidades han sido procesadas.");
}

// Iniciar el proceso
fetchAbilitiesInBatches();
