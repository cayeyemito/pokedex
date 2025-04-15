let guideChanged = false
let shinyChanged = false
let backgroundChanged = false
let = isOn = true
let stat = 1
let stat1 = document.getElementById("stat1")
let stat2 = document.getElementById("stat2")
let stat3 = document.getElementById("stat3")
let stat4 = document.getElementById("stat4")
let stat5 = document.getElementById("stat5")
let statsScreen = document.getElementById("statScreen")
let movementScreen = document.getElementById("movementScreen")
let infoScreen = document.getElementById("infoScreen")
let pokemon = []
let innerScreen = document.getElementById("inner-screen")
let innerScreenOverlay = document.getElementById("inner-screen-overlay")
let pokeNameIdText = document.getElementById("pokemon-name-text")
let pokemonScreenGlass = document.getElementById("inner-screen-overlay-glass")
let pokeHeight = document.getElementById("infoHeight")
let tipos = document.getElementById("tipos")
let pokeWeight = document.getElementById("infoWeight")
let tipo1 = document.getElementById("tipo1")
let tipo2 = document.getElementById("tipo2")
let chartInstance;

async function initialize(numberPokedex) {

    if (chartInstance) {
        chartInstance.destroy();
    }

    pokemon = await getPokemonInfo(numberPokedex);

    console.log(pokemon)

    innerScreenOverlay.style.backgroundImage = `url("${pokemon.imagen}")`
    innerScreen.style.backgroundImage = `url("img/tipos/${pokemon.tipo}/${pokemon.tipo}.jpg")`
    pokeNameIdText.innerText = `${pokemon.nombre}`
    pokeHeight.innerText = `${pokemon.altura} m`
    pokeWeight.innerText = `${pokemon.peso} kg`

    if(pokemon.tipo_secundario){
        tipos.innerText = 'Tipos'
        document.getElementById("empty").style.display = 'flex'
        document.getElementById("tipo2Container").style.display = 'flex'
        tipo1.src = `img/iconos_tipos/Icon_${pokemon.tipo}.webp`;
        tipo2.src = `img/iconos_tipos/Icon_${pokemon.tipo_secundario}.webp`;
    } else {
        tipos.innerText = 'Tipo'
        document.getElementById("empty").style.display = 'none'
        document.getElementById("tipo2Container").style.display = 'none'
        tipo1.src = `img/iconos_tipos/Icon_${pokemon.tipo}.webp`;
    }

    const habilidades = await getAllAbilities()
    console.log(habilidades)

    if (pokemon) {
        const pokemonStats = {
            labels: ['HP', 'Ataque', 'Defensa', 'Sp. Atk', 'Sp. Def', 'Vel.'],
            datasets: [{
                label: 'Stats base',
                data: [pokemon.hp, pokemon.ataque_f, pokemon.defensa_f, pokemon.ataque_e, pokemon.defensa_e, pokemon.velocidad],
                backgroundColor: [
                    '#ff6384', // HP
                    '#ff9f40', // Attack
                    '#ffcd56', // Defense
                    '#4bc0c0', // Sp. Atk
                    '#36a2eb', // Sp. Def
                    '#9966ff'  // Speed
                ],
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 8
            }]
        };

        const config = {
            type: 'bar',
            data: pokemonStats,
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            font: {
                                family: 'retro',
                                size: 14
                            },
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#222',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        titleFont: {
                            family: 'retro'
                        },
                        bodyFont: {
                            family: 'retro'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Estadísticas',
                        font: {
                            family: 'retro',
                            size: 18
                        },
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff',
                            font: {
                                family: 'retro',
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff',
                            font: {
                                family: 'retro',
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        };
        

        const ctx = document.getElementById('pokemonStatsChart').getContext('2d');
        chartInstance = new Chart(ctx, config);  // Crear la nueva instancia del gráfico
    } else {
        console.error('No se pudo obtener los datos del Pokémon.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initialize(1);
});

function showGuide(){
    let innerScreen = document.getElementById("inner-screen")
    let innerScreenOverlay = document.getElementById("inner-screen-overlay")
    let guideScreen = document.getElementById("guide-screen")

    if(!guideChanged){
        innerScreen.style.filter = "blur(1.5rem)"
        innerScreenOverlay.style.visibility = "blur(1.5rem)"
        guideScreen.style.visibility = "visible"
        guideChanged = true
    } else{
        innerScreen.style.filter = "blur(0)"
        innerScreenOverlay.style.visibility = "blur(0)"
        guideScreen.style.visibility = "hidden"
        guideChanged = false
    }
}

function showShiny(){
    let innerScreenOverlay = document.getElementById("inner-screen-overlay")

    if(!shinyChanged){
        innerScreenOverlay.style.backgroundImage = `url("${pokemon.imagen_shiny}")`
        shinyChanged = true
    } else {
        innerScreenOverlay.style.backgroundImage = `url("${pokemon.imagen}")`
        shinyChanged = false
    }
}

function changeBackground(){
    let innerScreen = document.getElementById("inner-screen")

    if(!backgroundChanged){
        innerScreen.style.backgroundImage = `url("img/tipos/${pokemon.tipo}/${pokemon.tipo}.gif")`
        backgroundChanged = true
    } else {
        innerScreen.style.backgroundImage = `url("img/tipos/${pokemon.tipo}/${pokemon.tipo}.jpg")`
        backgroundChanged = false
    }
}

function passNextStat() {
    if(stat === 1){
        statsScreen.style.visibility = "visible"
        infoScreen.style.visibility = "hidden"
        stat2.style.transform = "scale(1.3)" 
        stat1.style.transform = "scale(1)"
        stat++
    } else if (stat === 2){
        statsScreen.style.visibility = "hidden"
        movementScreen.style.visibility = "visible"
        stat3.style.transform = "scale(1.3)"
        stat2.style.transform = "scale(1)"
        stat++
    } else if (stat === 3){
        movementScreen.style.visibility = "hidden"
        stat4.style.transform = "scale(1.3)"
        stat3.style.transform = "scale(1)"
        stat++
    } else if (stat === 4){
        stat5.style.transform = "scale(1.3)"
        stat4.style.transform = "scale(1)"
        stat++
    } else {
        infoScreen.style.visibility = "visible"
        stat1.style.transform = "scale(1.3)"
        stat5.style.transform = "scale(1)"
        stat=1
    }
}

function passPreviousStat() {
    if(stat === 1){
        infoScreen.style.visibility = "hidden"
        stat5.style.transform = "scale(1.3)" 
        stat1.style.transform = "scale(1)"
        stat = 5
    } else if (stat === 2){
        statsScreen.style.visibility = "hidden"
        infoScreen.style.visibility = "visible"
        stat1.style.transform = "scale(1.3)"
        stat2.style.transform = "scale(1)"
        stat--
    } else if (stat === 3){
        statsScreen.style.visibility = "visible"
        movementScreen.visibility = "hidden"
        stat2.style.transform = "scale(1.3)"
        stat3.style.transform = "scale(1)"
        stat--
    } else if (stat === 4){
        movementScreen.style.visibility = "visible"
        stat3.style.transform = "scale(1.3)"
        stat4.style.transform = "scale(1)"
        stat--
    } else {
        stat4.style.transform = "scale(1.3)"
        stat5.style.transform = "scale(1)"
        stat--
    }
}

function searchPokemonInput(number){
    let numberToTry = document.getElementById("pokemon-name-text").innerText
    
    if(numberToTry === '0' || isNaN(numberToTry)){
        pokeNameIdText.innerText = number
    } else{
        numberToTry += number
        if(parseInt(numberToTry)>1025){
            pokeNameIdText.innerText = '1025'
        }
        else{
            pokeNameIdText.innerText = numberToTry
        }
    }
}

function searchPokemon(){
    let numberToTry = document.getElementById("pokemon-name-text").innerText
    let numeroPokedex = parseInt(numberToTry);
    
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); // Comienza a parpadear

    initialize(numeroPokedex).finally(() => {
        blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
    });
}

function deleteLastNumber(){
    let pokeNameIdText = document.getElementById("pokemon-name-text")
    let numberToTry = document.getElementById("pokemon-name-text").innerText

    if(isNaN(numberToTry)){
    } else if (parseInt(numberToTry)>= 0 && parseInt(numberToTry)<10) {
        pokeNameIdText.innerText = pokemon.nombre
    } else{
        pokeNameIdText.innerText = numberToTry.substring(0, numberToTry.length - 1)
    }
}

function turnOffScreen(){
    if(isOn){
        innerScreen.classList.add("screen-off")
        innerScreen.classList.remove("screen-on")
        innerScreenOverlay.style.visibility = "hidden"
        console.log()
        pokemonScreenGlass.style.visibility = "hidden"
        isOn = false
    } else {
        innerScreen.classList.remove("screen-off")
        innerScreen.classList.add("screen-on")
        innerScreen.removeEventListener('animationend', animationEndHandler);
        innerScreen.addEventListener('animationend', animationEndHandler);
        isOn = true
    }
}

async function getAllAbilities(){
    let habilidadesArray = pokemon.habilidades.split(",").map(Number);
    let habilidadesData = []

    for (let i = 0; i < habilidadesArray.length; i++) {
        try {
            const bodyData = new URLSearchParams();
            bodyData.append('habilidad', habilidadesArray[i]);
    
            const response = await fetch("../php/getThings.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyData.toString()
            });
    
            if (!response.ok) throw new Error("HTTP error " + response.status);
    
            const text = await response.text();
            const data = JSON.parse(text);
    
            if (data.status === "success") {
                habilidadesData.push(data.data);
            } else {
                console.warn("No se encontró el Pokémon:", data.message);
            }
    
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }
    return habilidadesData
}

function animationEndHandler() {
    innerScreenOverlay.style.visibility = 'visible';
    pokemonScreenGlass.style.visibility = "visible" // Se activa después de la animación
    innerScreen.removeEventListener('animationend', animationEndHandler); // Limpiar el listener
}

async function getPokemonInfo(numeroPokedex) {
    try {
        // Crea el cuerpo de la solicitud con el número de Pokémon  // Aquí deberías pasar el número que deseas buscar
        const bodyData = new URLSearchParams();
        bodyData.append('numero', numeroPokedex);
      
        // Realiza la solicitud POST
        const response = await fetch("../php/getPokemon.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyData.toString()  // Convierte el cuerpo de los parámetros en un string
        });
    
        // Verifica si la respuesta es exitosa
        if (!response.ok) throw new Error("HTTP error " + response.status);
    
        // Obtiene la respuesta como texto
        const text = await response.text();
    
        // Intenta parsear la respuesta JSON
        const data = JSON.parse(text);
    
        // Verifica si la respuesta es correcta
        if (data.status === "success") {
            return data.data
        } else {
            console.warn("No se encontró el Pokémon:", data.message);
        }
      
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}