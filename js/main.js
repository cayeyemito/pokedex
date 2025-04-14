let guideChanged = false
let shinyChanged = false
let backgroundChanged = false
let stat = 1
let stat1 = document.getElementById("stat1")
let stat2 = document.getElementById("stat2")
let stat3 = document.getElementById("stat3")
let stat4 = document.getElementById("stat4")
let stat5 = document.getElementById("stat5")
let statsScreen = document.getElementById("statScreen")
let movementScreen = document.getElementById("movementScreen")

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
        innerScreenOverlay.style.backgroundImage = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/25.gif')"
        shinyChanged = true
    } else {
        innerScreenOverlay.style.backgroundImage = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif')"
        shinyChanged = false
    }
}

function changeBackground(){
    let innerScreen = document.getElementById("inner-screen")

    if(!backgroundChanged){
        innerScreen.style.backgroundImage = 'url("img/tipos/electric/electric.gif")'
        backgroundChanged = true
    } else {
        innerScreen.style.backgroundImage = "url('img/tipos/electric/electric.jpg')"
        backgroundChanged = false
    }
}

function passNextStat() {
    if(stat === 1){
        statsScreen.style.display = "none"
        movementScreen.style.display = "flex"
        stat2.style.transform = "scale(1.3)" 
        stat1.style.transform = "scale(1)"
        stat++
    } else if (stat === 2){
        stat3.style.transform = "scale(1.3)"
        stat2.style.transform = "scale(1)"
        stat++
    } else if (stat === 3){
        stat4.style.transform = "scale(1.3)"
        stat3.style.transform = "scale(1)"
        stat++
    } else if (stat === 4){
        stat5.style.transform = "scale(1.3)"
        stat4.style.transform = "scale(1)"
        stat++
    } else {
        statsScreen.style.display = "flex"
        movementScreen.style.display = "none"
        stat1.style.transform = "scale(1.3)"
        stat5.style.transform = "scale(1)"
        stat=1
    }
}

function passPreviousStat() {
    if(stat === 1){
        statsScreen.style.display = "none"
        movementScreen.style.display = "flex"
        stat5.style.transform = "scale(1.3)" 
        stat1.style.transform = "scale(1)"
        stat = 5
    } else if (stat === 2){
        statsScreen.style.display = "flex"
        movementScreen.style.display = "none"
        stat1.style.transform = "scale(1.3)"
        stat2.style.transform = "scale(1)"
        stat--
    } else if (stat === 3){
        stat2.style.transform = "scale(1.3)"
        stat3.style.transform = "scale(1)"
        stat--
    } else if (stat === 4){
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
    let pokeNameIdText = document.getElementById("pokemon-name-text")
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

function deleteLastNumber(){
    let pokeNameIdText = document.getElementById("pokemon-name-text")
    let numberToTry = document.getElementById("pokemon-name-text").innerText

    if(isNaN(numberToTry)){
    } else if (parseInt(numberToTry)>= 0 && parseInt(numberToTry)<10) {
        pokeNameIdText.innerText = 'Charizard'
    } else{
        pokeNameIdText.innerText = numberToTry.substring(0, numberToTry.length - 1)
    }
}

const ctx = document.getElementById('pokemonStatsChart').getContext('2d');
const pokemonStats = {
    labels: ['HP', 'Ataque', 'Defensa', 'Sp. Atk', 'Sp. Def', 'Vel.'],
    datasets: [{
    label: 'Stats base',
    data: [80, 105, 70, 95, 85, 100], // <-- Reemplazá por los stats del Pokémon actual
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
                display: false
            },
            tooltip: {
                backgroundColor: '#222',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#fff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
                },
                x: {
                ticks: {
                    color: '#fff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    }
};

getPokemonInfo(1)

function getPokemonInfo(numeroPokedex) {
    fetch(`get_pokemon.php?numero=${numeroPokedex}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del Pokémon:", data);
            // Aquí puedes actualizar tu HTML con los datos recibidos
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}

new Chart(ctx, config);