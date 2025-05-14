let guideChanged = false
let shinyChanged = false
let backgroundChanged = false
let isOn = true
let stat = 1
let stat1 = document.getElementById("stat1")
let stat2 = document.getElementById("stat2")
let stat3 = document.getElementById("stat3")
let stat4 = document.getElementById("stat4")
let stat5 = document.getElementById("stat5")
let stat6 = document.getElementById("stat6")
let stat7 = document.getElementById("stat7")
let listScreen = document.getElementById("listScreen")
let listScreen2 = document.getElementById("listScreen2")
let statsScreen = document.getElementById("statScreen")
let movementScreen = document.getElementById("movementScreen")
let infoScreen = document.getElementById("infoScreen")
let evolutionScreen = document.getElementById("evolutionScreen")
let abilityScreen = document.getElementById("abilityScreen")
let pokemon = []
let innerScreen = document.getElementById("inner-screen")
let innerScreenOverlay = document.getElementById("inner-screen-overlay")
let pokeNameIdText = document.getElementById("pokemon-name-text")
let pokemonScreenGlass = document.getElementById("inner-screen-overlay-glass")
let abilityContainer = document.getElementById("abilityContainer")
let basicInfoContainer = document.getElementById("basicInfo")
let typeScreen = document.getElementById("typeScreen")
let guideScreen = document.getElementById("guide-screen")
let chartInstance;
let habilidades
let movimientos = {
    huevo: [],
    level: [],
    tutor: [],
    maquina: []
}
let id = 1
let idMovimiento = 0
let idAbility = 0
let idMovimientoTipo
let isChanged = false
let formasArray = [];
let formsScreen = document.getElementById("formsIcons")
let pokemonOriginal
let pokemonEspecialForm = false
let isMega = false
let isGigamax = false
let isFormaAlterna = false
let idEvolucion = 0
let comprobacion
let formasArrayId = [];
let esImportante = false;
let idForma = -1
let hasChanged = false
let overlayNotTouch = document.getElementById("notTouch")
let darmanitanGalar
const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"
];
const generations = [
    "kanto",
    "johto",
    "hoenn",
    "sinnoh",
    "unova",
    "kalos",
    "alola",
    "galar",
    "paldea"
];
let arrayFiltroId = []
let idPokemonFilter = 0
let hasFilter = false
let filterTypeNew = ""
let filterTypeOld = ""
let filterScreen = document.getElementById("filtrador")
let urshifu
let idForFilter
let isMovementsOptions
let galarZenId
let taurosPaldea
let taurosPaldeaArrayId = []
const audio = document.getElementById('bg-music');
let textSuperE = "";
let textDebil = "";
let textNeutro = "";
let textInmune = "";
let textResistente = "";
let textSuperResistente = "";

async function initialize(numberPokedex) {

    if (chartInstance) {
        chartInstance.destroy();
    }
    if(!pokemonEspecialForm && !hasFilter){
        pokemon = await getPokemonInfo(id);
        getForms()
    } else if(hasFilter && !pokemonEspecialForm){
        pokemon = await getPokemonInfo(numberPokedex);
        getForms()
    }
    else {
        pokemon = await getSpecialPokemonInfo(numberPokedex);
        Object.assign(pokemon, {
            genero: pokemonOriginal.genero,
            descripcion: pokemonOriginal.descripcion,
            nombre_region: pokemonOriginal.nombre_region
        })
        pokemonEspecialForm = false
        formsScreen.innerHTML = ""
        if(esImportante && formasArrayId.length != 0 && !isMega && !isGigamax && !isFormaAlterna){
            formsScreen.innerHTML += `<div class="mega-evolution-container">
                                        <img src="img/flecha-izquierda-forma.png" class="mega-evolution-icon" onclick="
                                            passPreviousForm()">
                                    </div>`
        }
        if(hasFilter){
            idForFilter = pokemonOriginal.numero_pokedex
        } else {
            idForFilter = id
        }
        if(isMega && pokemon.nombre.includes("mega")){
            formsScreen.innerHTML +=`<div class="mega-evolution-container">
                                    <img src="img/megaevolucion.png" class="mega-evolution-icon" onclick="startMegaEvo(${idForFilter})">
                                </div>`
        } else if(isMega && pokemon.nombre.includes("kyogre-primal")){
            formsScreen.innerHTML +=`<div class="mega-evolution-container">
                                        <img src="img/kyogrePrimal.png" class="mega-evolution-icon" onclick="startMegaEvo(${idForFilter})">
                                    </div>`
        } else if(isMega && pokemon.nombre.includes("groudon-primal")){
            formsScreen.innerHTML +=`<div class="mega-evolution-container">
                                        <img src="img/groudonPrimal.png" class="mega-evolution-icon" onclick="startMegaEvo(${idForFilter})">
                                    </div>`
        } else if(isGigamax){
            formsScreen.innerHTML +=`<div class="mega-evolution-container">
                                        <img src="img/gigamax.png" class="mega-evolution-icon" onclick="startGigamax(${idForFilter})">
                                    </div>`
        } else if (isFormaAlterna) {
            let juego = "";
        
            if (pokemon.nombre.toLowerCase().includes("hisui")) {
                juego = "hisui";
            } else if (pokemon.nombre.toLowerCase().includes("paldea")) {
                juego = "paldea";
            } else if (pokemon.nombre.toLowerCase().includes("alola")) {
                juego = "alola";
            } else if (pokemon.nombre.toLowerCase().includes("galar")) {
                juego = "galar";
            }
            formsScreen.innerHTML += `
                <div class="mega-evolution-container">
                    <img src="img/${juego}.png" class="mega-evolution-icon logo-sol-icono"
                         onclick="toggleFormaRegional(${idForFilter})">
                </div>`;
        } else if(!esImportante){
            formsScreen.innerHTML = `<div class="mega-evolution-container">
                                        <img src="img/flecha-izquierda-forma.png" class="mega-evolution-icon" onclick="
                                            passPreviousForm()">
                                    </div>
                                    <div class="mega-evolution-container">
                                        <img src="img/flecha-derecha-forma.png" class="mega-evolution-icon" onclick="
                                            passNextForm()">
                                    </div>`;
        }
        if(esImportante && formasArrayId.length != 0 && !isMega && !isGigamax && !isFormaAlterna){
            formsScreen.innerHTML += `<div class="mega-evolution-container">
                                        <img src="img/flecha-derecha-forma.png" class="mega-evolution-icon" onclick="
                                            passNextForm()">
                                    </div>`
        }
        if(pokemon.nombre.includes("rapid-strike") && !pokemon.nombre.includes("rapid-strike-gmax") || pokemon.nombre.includes("galar-standard") || pokemon.nombre.includes("galar-zen") || pokemon.nombre.includes("tauros-paldea")) {
            formsScreen.innerHTML = ""
            getForms()
        }
        if(pokemon.nombre.includes("rapid-strike-gmax") && pokemon.nombre.includes("galar-zen")){
            idForma = -1
        }
    }

    if(pokemon.nombre.includes("Urshifu") && !pokemon.nombre.includes("gmax") && !pokemon.nombre.includes("rapid-strike")){
        urshifu = pokemon
    }

    showMovementsOptions(0)
    
    createBasicInfo()
    
    innerScreenOverlay.style.backgroundImage = `url("${pokemon.imagen}")`
    innerScreen.style.backgroundImage = `url("img/tipos/${pokemon.tipo}/${pokemon.tipo}.jpg")`
    pokeNameIdText.innerText = `${pokemon.nombre_region.charAt(0).toUpperCase() + pokemon.nombre_region.slice(1).toLowerCase()}`
    
    createEvolutionChain()

    habilidades = await getAllAbilities()
    habilidades.sort((a, b) => a.oculta - b.oculta);
    createAbiltyInfo()

    createTypesInfo()

    createList()

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
                        color: '#ff5b5b'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ff5b5b',
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
                            color: '#ff5b5b',
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

    window.addEventListener("resize", checkLandscape);
    window.addEventListener("orientationchange", checkLandscape);

    checkLandscape();

    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando");
    overlayNotTouch.style.display = "flex"

    initialize(id).finally(() => {
        blueButton.classList.remove("parpadeando")
        overlayNotTouch.style.display = "none"
    });
});

function showGuide(){
    if (getComputedStyle(filterScreen).visibility === "visible") {
        filterScreen.style.visibility = "hidden";
        guideChanged = false
    }
    if (!guideChanged) {
        innerScreen.style.filter = "blur(1.5rem)";
        innerScreenOverlay.style.filter = "blur(1.5rem)";
        guideScreen.style.visibility = "visible";
        guideChanged = true;
    } else {
        innerScreen.style.filter = "blur(0)";
        innerScreenOverlay.style.filter = "blur(0)";
        guideScreen.style.visibility = "hidden";
        guideChanged = false;
    }    
}

async function showFilter(){
    if (getComputedStyle(guideScreen).visibility === "visible") {
        guideScreen.style.visibility = "hidden";
        innerScreen.style.filter = "blur(0)";
        innerScreenOverlay.style.filter = "blur(0)";
        guideChanged = false
    }
    if(!guideChanged){
        let limits = {};
        overlayNotTouch.style.display = "flex";

        filterScreen.style.visibility = "visible";
        filterScreen.innerHTML = `
            <div class="loader-overlay">
                <div class="loader"></div>
            </div>
        `;

        await fetch('../php/getLimits.php')
        .then(r => r.json())
        .then(json => {
            limits = json;
        }).catch(error => {
        console.error("Error al obtener los límites:", error);
        })
        .finally(() => {
            overlayNotTouch.style.display = "none"; // Ocultar overlay cuando termina la llamada
        });
        
        innerScreen.style.filter = "blur(1.5rem)"
        innerScreenOverlay.style.visibility = "blur(1.5rem)"
        filterScreen.style.visibility = "visible"
        filterScreen.innerHTML = ""
        filterScreen.innerHTML = `<div class="tipo-container-filter-title">
                                    <h1 class="title-filtros-text">Tipos</h1>
                                </div>
                                ${pokemonTypes.map(t => `
                                    <div class="tipo-container-filter">
                                    <img 
                                        src="img/iconos_tipos/Icon_${t}.webp" 
                                        class="iconos_tipos2" 
                                        onclick="establecerFiltro('${t}')"
                                    >
                                    </div>
                                `).join('')}

                                <div class="tipo-container-filter-title">
                                    <h1 class="title-filtros-text">Generación</h1>
                                </div>
                                ${generations.map(g => `
                                    <div class="tipo-container-filter">
                                    <img 
                                        src="img/generaciones/${g}.webp" 
                                        class="iconos_tipos2" 
                                        onclick="establecerFiltro('${g}')"
                                    >
                                    </div>
                                `).join('')}`
        filterScreen.innerHTML += `<div class="tipo-container-filter-title">
                                        <h1 class="title-filtros-text">Altura (m)</h1>
                                    </div>
                                    <div class="slider-wrapper">
                                        <div>
                                            <div id="slider-altura"></div>
                                            <div class="range-values">
                                                <span id="alturaMin">${limits.altura_min}</span> – 
                                                <span id="alturaMax">${limits.altura_max}</span> m
                                            </div>
                                            <button id="applyAlturaFilter" class="apply-button">Aplicar filtro</button>
                                        </div>
                                    </div>

                                    <div class="tipo-container-filter-title">
                                        <h1 class="title-filtros-text">Peso (kg)</h1>
                                    </div>

                                    <div class="slider-wrapper">
                                        <div>
                                            <div id="slider-peso"></div>
                                            <div class="range-values">
                                                <span id="pesoMin">${limits.peso_min}</span> – 
                                                <span id="pesoMax">${limits.peso_max}</span> m
                                            </div>
                                            <button id="applyPesoFilter" class="apply-button">Aplicar filtro</button>
                                        </div>
                                    </div>
                                    <div class="espacio">
                                    </div>
                                `;
        let rangeAltura = document.getElementById('slider-altura');
        
        noUiSlider.create(rangeAltura, {
            start: [limits.altura_min, limits.altura_max],
            range: {
                'min': limits.altura_min,
                'max': limits.altura_max
            }
        });
        const alturaMin = document.getElementById('alturaMin');
        const alturaMax = document.getElementById('alturaMax');

        rangeAltura.noUiSlider.on('update', (values) => {
            alturaMin.textContent = values[0];
            alturaMax.textContent = values[1];
        });

        let rangePeso = document.getElementById('slider-peso');
        
        noUiSlider.create(rangePeso, {
            start: [limits.peso_min, limits.peso_max],
            range: {
                'min': limits.peso_min,
                'max': limits.peso_max
            }
        });
        const pesoMin = document.getElementById('pesoMin');
        const pesoMax = document.getElementById('pesoMax');

        rangePeso.noUiSlider.on('update', (values) => {
            pesoMin.textContent = values[0];
            pesoMax.textContent = values[1];
        });

        document.getElementById('applyAlturaFilter').addEventListener('click', function () {
            let values = rangeAltura.noUiSlider.get();
            let minAltura = parseFloat(values[0]);
            let maxAltura = parseFloat(values[1]);

            establecerFiltro(null, {
                altura_min: minAltura,
                altura_max: maxAltura
            });
        });

        document.getElementById('applyPesoFilter').addEventListener('click', function () {
            let values = rangePeso.noUiSlider.get();
            let minPeso = parseFloat(values[0]);
            let maxPeso = parseFloat(values[1]);

            establecerFiltro(null, {
                peso_min: minPeso,
                peso_max: maxPeso
            });
        });
        guideChanged = true
    } else{
        innerScreen.style.filter = "none";
        filterScreen.style.visibility = "hidden";
        guideChanged = false;
    }
}

async function establecerFiltro(valor = null, alturaMinMax = null) {
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando");
    overlayNotTouch.style.display = "flex";

    const esTipo = pokemonTypes.includes(valor);
    const esGeneracion = generations.includes(valor);

    if (valor) filterTypeNew = valor;

    if (!hasFilter && filterTypeOld != filterTypeNew) {
        hasFilter = true;
        filterTypeOld = filterTypeNew;
    } else {
        if (filterTypeNew === filterTypeOld && !alturaMinMax) {
            hasFilter = false;
            idPokemonFilter = 0;
            filterTypeOld = "";
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none";
            });
            innerScreen.style.filter = "blur(0)";
            innerScreenOverlay.style.visibility = "blur(0)";
            filterScreen.style.visibility = "hidden";
            arrayFiltroId = [];
            return;
        } else {
            filterTypeOld = filterTypeNew;
            arrayFiltroId = [];
            idPokemonFilter = 0;
        }
    }

    try {
        const bodyData = new URLSearchParams();

        if (esTipo) bodyData.append('tipo', valor);
        else if (esGeneracion) bodyData.append('generacion', valor);
        if (alturaMinMax) {
            if ('altura_min' in alturaMinMax && 'altura_max' in alturaMinMax) {
                bodyData.append('altura_min', alturaMinMax.altura_min);
                bodyData.append('altura_max', alturaMinMax.altura_max);
            }

            if ('peso_min' in alturaMinMax && 'peso_max' in alturaMinMax) {
                bodyData.append('peso_min', alturaMinMax.peso_min);
                bodyData.append('peso_max', alturaMinMax.peso_max);
            }
        }
        const response = await fetch("../php/getPokemon.php", {
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
            arrayFiltroId = data.data;
            arrayFiltroId.sort((a, b) => a.numero_pokedex - b.numero_pokedex);
        } else {
            console.warn("No se encontró el Pokémon:", data.message);
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
    initialize(arrayFiltroId[idPokemonFilter]?.numero_pokedex ?? id).finally(() => {
        blueButton.classList.remove("parpadeando");
        overlayNotTouch.style.display = "none";
    });

    innerScreen.style.filter = "blur(0)";
    innerScreenOverlay.style.visibility = "blur(0)";
    filterScreen.style.visibility = "hidden";
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
    if (stat === 1) {
        statsScreen.style.visibility = "visible";
        infoScreen.style.visibility = "hidden";
        stat2.style.transform = "scale(1.3)";
        stat1.style.transform = "scale(1)";
        stat++;
    } else if (stat === 2) {
        isMovementsOptions = true;
        statsScreen.style.visibility = "hidden";
        movementScreen.style.visibility = "visible";
        if(isChanged === true){
            animacionFlechas();
        }
        stat3.style.transform = "scale(1.3)";
        stat2.style.transform = "scale(1)";
        stat++;
    } else if (stat === 3) {
        evolutionScreen.style.visibility = "visible";
        movementScreen.style.visibility = "hidden";
        if(comprobacion.length>1){
            animacionFlechas();
        }
        stat4.style.transform = "scale(1.3)";
        stat3.style.transform = "scale(1)";
        isMovementsOptions = false;
        stat++;
    } else if (stat === 4) {
        abilityScreen.style.visibility = "visible";
        evolutionScreen.style.visibility = "hidden";
        if(habilidades.length > 1){
            animacionFlechas();
        }
        stat5.style.transform = "scale(1.3)";
        stat4.style.transform = "scale(1)";
        stat++;
    } else if (stat === 5) {
        abilityScreen.style.visibility = "hidden";
        typeScreen.style.visibility = "visible";
        stat6.style.transform = "scale(1.3)";
        stat5.style.transform = "scale(1)";
        stat++;
    } else if (stat === 6) {
        typeScreen.style.visibility = "hidden";
        listScreen2.classList.remove('hidden');
        listScreen2.style.visibility = "visible";
        stat7.style.transform = "scale(1.3)";
        stat6.style.transform = "scale(1)";
        stat++;
    } else {
        listScreen2.classList.add('hidden');
        listScreen2.style.visibility = "hidden";
        infoScreen.style.visibility = "visible";
        stat1.style.transform = "scale(1.3)";
        stat7.style.transform = "scale(1)";
        stat = 1;
    }
    
}

function passPreviousStat() {
    if (stat === 1) {
        listScreen2.classList.remove('hidden');
        listScreen2.style.visibility = "visible";
        infoScreen.style.visibility = "hidden";
        stat7.style.transform = "scale(1.3)";
        stat1.style.transform = "scale(1)";
        stat = 7;
    } else if (stat === 2) {
        statsScreen.style.visibility = "hidden";
        infoScreen.style.visibility = "visible";
        stat1.style.transform = "scale(1.3)";
        stat2.style.transform = "scale(1)";
        stat--;
    } else if (stat === 3) {
        statsScreen.style.visibility = "visible";
        movementScreen.style.visibility = "hidden";
        stat2.style.transform = "scale(1.3)";
        stat3.style.transform = "scale(1)";
        isMovementsOptions = false;
        stat--;
    } else if (stat === 4) {
        isMovementsOptions = true;
        movementScreen.style.visibility = "visible";
        evolutionScreen.style.visibility = "hidden";
        if(isChanged === true){
            animacionFlechas();
        }
        stat3.style.transform = "scale(1.3)";
        stat4.style.transform = "scale(1)";
        stat--;
    } else if (stat === 5) {
        evolutionScreen.style.visibility = "visible";
        abilityScreen.style.visibility = "hidden";
        if(comprobacion.length>1){
            animacionFlechas();
        }
        stat4.style.transform = "scale(1.3)";
        stat5.style.transform = "scale(1)";
        stat--;
    } else if (stat === 6) {
        abilityScreen.style.visibility = "visible";
        typeScreen.style.visibility = "hidden";
        if(habilidades.length > 1){
            animacionFlechas();
        }
        stat5.style.transform = "scale(1.3)";
        stat6.style.transform = "scale(1)";
        stat--;
    } else {
        typeScreen.style.visibility = "visible";
        listScreen2.classList.add('hidden');
        listScreen2.style.visibility = "hidden";
        stat6.style.transform = "scale(1.3)";
        stat7.style.transform = "scale(1)";
        stat--;
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
    if(!hasFilter){
        id = parseInt(numberToTry);
        if(id!=0){
            overlayNotTouch.style.display = "flex"
            resetAll()
            const blueButton = document.querySelector(".blue-button")
            blueButton.classList.add("parpadeando");

            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
        } else {
            pokeNameIdText.innerText = "ERROR";
            pokeNameIdText.classList.add("blink");

            setTimeout(() => {
            pokeNameIdText.classList.remove("blink");
            pokeNameIdText.innerText = `${pokemon.nombre_region.charAt(0).toUpperCase() + pokemon.nombre_region.slice(1).toLowerCase()}`
            }, 3000);
        }
    } else {
        let idFilter = parseInt(numberToTry);
        if(idFilter!=0){
            overlayNotTouch.style.display = "flex"
            resetAll()
            const blueButton = document.querySelector(".blue-button")
            blueButton.classList.add("parpadeando");

            let encontrado = false;


            for (let i = 0; i < arrayFiltroId.length; i++) {
                if (idFilter == arrayFiltroId[i].numero_pokedex) {
                    idPokemonFilter = i
                    initialize(arrayFiltroId[i].numero_pokedex).finally(() => {
                        blueButton.classList.remove("parpadeando");
                        overlayNotTouch.style.display = "none";
                    });
                    return
                }
            }

            if (!encontrado) {
                // Buscar el índice del valor más cercano
                let closestIndex = 0;
                let minDiff = Math.abs(idFilter - arrayFiltroId[0].numero_pokedex);

                for (let i = 1; i < arrayFiltroId.length; i++) {
                    let currentDiff = Math.abs(idFilter - arrayFiltroId[i].numero_pokedex);

                    if (
                        currentDiff < minDiff ||
                        (currentDiff === minDiff && arrayFiltroId[i].numero_pokedex > arrayFiltroId[closestIndex].numero_pokedex)
                    ) {
                        minDiff = currentDiff;
                        closestIndex = i;
                    }
                }

                idPokemonFilter = closestIndex; // Guardamos la posición del valor más cercano

                initialize(arrayFiltroId[idPokemonFilter].numero_pokedex).finally(() => {
                    blueButton.classList.remove("parpadeando");
                    overlayNotTouch.style.display = "none";
                });
            }
        } else {
            pokeNameIdText.innerText = "ERROR";
            pokeNameIdText.classList.add("blink");

            setTimeout(() => {
            pokeNameIdText.classList.remove("blink");
            pokeNameIdText.innerText = `${pokemon.nombre_region.charAt(0).toUpperCase() + pokemon.nombre_region.slice(1).toLowerCase()}`
            }, 3000);
        }
    }        
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

async function getAllMovements(num, movimientos){
    let idsArray = []
    if(num === 1){
        idsArray = movimientos.split(",").map(par => {
            let [id, nivel] = par.split("-").map(Number);
            return [id, nivel];
        });
    } else {
        idsArray = movimientos.split(",").map(Number);
    }
    let movimientosData = []

    for (let i = 0; i < idsArray.length; i++) {
        try {
            const bodyData = new URLSearchParams();
            bodyData.append('movimiento', idsArray[i]);
    
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
                let movimiento = data.data;
                if(num === 1){
                    movimiento.level = idsArray[i][1];
                }
                movimientosData.push(movimiento);
            } else {
                console.warn("No se encontró el Pokémon:", data.message);
            }
    
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }
    return movimientosData
}

async function getAllAbilities(){
    let habilidadesArray = pokemon.habilidades.split(",").map(par => {
        let [id, esOculta] = par.split("-").map(Number);
        return [id, esOculta];
    });
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
                let habilidad = data.data;
                habilidad.oculta = habilidadesArray[i][1]; // añadís si es oculta
                habilidadesData.push(habilidad);
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

async function getSpecialPokemonInfo(numeroPokedex) {
    try {
        // Crea el cuerpo de la solicitud con el número de Pokémon  // Aquí deberías pasar el número que deseas buscar
        const bodyData = new URLSearchParams();
        bodyData.append('numero', numeroPokedex);
      
        // Realiza la solicitud POST
        const response = await fetch("../php/getEspecialPokemon.php", {
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
        let data = JSON.parse(text);
    
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

function reproSoundCry(){
    const bgMusic = document.getElementById('bg-music'); // Música de fondo
    const audio = new Audio(pokemon.grito); // Sonido del grito

    // Pausar la música de fondo si está sonando
    if (!bgMusic.paused) {
        bgMusic.pause(); // Pausar música
        const currentTime = bgMusic.currentTime; // Guardar el tiempo actual de la música

        // Reanudar música de fondo después de que el grito termine
        audio.onended = function() {
            bgMusic.currentTime = currentTime; // Reanudar desde el mismo lugar
            bgMusic.play(); // Reproducir música de fondo
        };
    }

    // Reproducir el grito
    audio.play().catch(error => {
        console.error("Error al reproducir el grito:", error);
    });
}

function nextPokemon(){
    resetAll()
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando");
    overlayNotTouch.style.display = "flex"
    disableControls(true);
    if(!hasFilter){
        if(id<1025){
            id++
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
                disableControls(false);
            });
        } else{
            id = 1
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
                disableControls(false);
            });
        }
    } else {
        if(idPokemonFilter < arrayFiltroId.length-1){
            idPokemonFilter++
            initialize(arrayFiltroId[idPokemonFilter].numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
                disableControls(false);
            });
        } else {
            idPokemonFilter = 0
            initialize(arrayFiltroId[idPokemonFilter].numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
                disableControls(false);
            });
        }
    }
}

function resetAll(){
    isMega = false;
    isGigamax = false;
    isFormaAlterna = false;
    idAbility = 0
    idForma = -1
    formasArrayId = []
    formasArray = []
    hasChanged = false
}

function previousPokemon() {
    resetAll();
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando");
    overlayNotTouch.style.display = "flex";
    disableControls(true);  // Deshabilitar botones y teclas

    if (!hasFilter) {
        if (id > 1) {
            id--;
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none";
                disableControls(false);  // Habilitar botones y teclas
            });
        } else {
            id = 1025;
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none";
                disableControls(false);  // Habilitar botones y teclas
            });
        }
    } else {
        if (idPokemonFilter > 0) {
            idPokemonFilter--;
            initialize(arrayFiltroId[idPokemonFilter].numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none";
                disableControls(false);  // Habilitar botones y teclas
            });
        } else {
            idPokemonFilter = arrayFiltroId.length - 1;
            initialize(arrayFiltroId[idPokemonFilter].numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none";
                disableControls(false);  // Habilitar botones y teclas
            });
        }
    }
}

function passNextForm(){
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); 
    overlayNotTouch.style.display = "flex"
    if(!hasChanged && !pokemon.nombre.includes("darmanitan-galar") && !pokemon.nombre.includes("tauros-paldea")){
        console.log("no ha cambiado")
        pokemonOriginal = pokemon
        hasChanged = true
    }
    pokemonEspecialForm = true;
    if(pokemon.nombre.includes("galar-standard")){
        initialize(galarZenId).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
        return
    } 
    if(pokemon.nombre.includes("galar-zen")){
        initialize(darmanitanGalar.numero_pokedex).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
        return
    }
    if(pokemon.nombre.includes("tauros-paldea")){
        if(idForma < taurosPaldeaArrayId.length-1){
            idForma++
            initialize(taurosPaldeaArrayId[idForma]).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            return
        } else {
            initialize(taurosPaldea.numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            idForma = -1
            return
        }
    }
    if(idForma<formasArrayId.length-1){
        idForma++
        initialize(formasArrayId[idForma]).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        }); 
    } else{
        pokemonEspecialForm = false
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
        formasArray = []
        idForma = -1
    }
}

function passPreviousForm(){
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); 
    overlayNotTouch.style.display = "flex"
    if(!hasChanged && !pokemon.nombre.includes("darmanitan-galar") && !pokemon.nombre.includes("tauros-paldea")){
        pokemonOriginal = pokemon
        hasChanged = true
    }
    pokemonEspecialForm = true;
    if(pokemon.nombre.includes("galar-standard")){
        initialize(galarZenId).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
        return
    } 
    if(pokemon.nombre.includes("galar-zen")){
        initialize(darmanitanGalar.numero_pokedex).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
        return
    }
    if(pokemon.nombre.includes("tauros-paldea")){
        if(idForma>0){
            idForma--
            initialize(taurosPaldeaArrayId[idForma]).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            return
        } else if(idForma > -1){
            idForma = -1;
            initialize(taurosPaldea.numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            return
        } 
        else{
            idForma = taurosPaldeaArrayId.length-1
            initialize(taurosPaldeaArrayId[idForma]).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            return
        }
    }
    if(idForma>0){
        idForma--
        initialize(formasArrayId[idForma]).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
    } else if(idForma > -1){
        idForma = -1;
        formasArray = []
        pokemonEspecialForm = false
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
    } 
    else{
        idForma = formasArrayId.length-1
        initialize(formasArrayId[idForma]).finally(() => {
            blueButton.classList.remove("parpadeando")
            overlayNotTouch.style.display = "none"
        });
    }
}

async function passNextAttack() {
    if (stat === 3 && isChanged === true) {
        const tipoMap = {
            1: 'level',
            2: 'huevo',
            3: 'maquina',
            4: 'tutor'
        };

        const tipoClave = tipoMap[idMovimientoTipo];

        // Si aún es una promesa (porque se está cargando), esperamos a que termine
        if (movimientos[tipoClave] instanceof Promise) {
            movimientos[tipoClave] = await movimientos[tipoClave];
        }

        const movimientosTipo = movimientos[tipoClave];
        if (!movimientosTipo || movimientosTipo.length === 0) return;
        

        idMovimiento = (idMovimiento === movimientosTipo.length - 1)
            ? 0
            : idMovimiento + 1;
        showMovements(idMovimientoTipo);
    } else if(stat === 5) {
        idAbility = (idAbility === habilidades.length - 1)
            ? 0
            : idAbility + 1;
        createAbiltyInfo()
        if(habilidades.length>1){
            animacionFlechas();
        }
    } else if(stat === 4 && comprobacion.length > 0){
        idEvolucion = (idEvolucion === comprobacion.length - 1)
            ? 0
            : idEvolucion + 1;
        if(comprobacion.length>1){
            animacionFlechas();
        }
        createEvolutionChain()
    }
}


async function passPreviousAttack() {
    if (stat === 3 && isChanged === true) {
        const tipoMap = {
            1: 'level',
            2: 'huevo',
            3: 'maquina',
            4: 'tutor'
        };

        const tipoClave = tipoMap[idMovimientoTipo];
        if (movimientos[tipoClave] instanceof Promise) {
            movimientos[tipoClave] = await movimientos[tipoClave];
        }

        const movimientosTipo = movimientos[tipoClave];

        if (!movimientosTipo || movimientosTipo.length === 0) return;

        animacionFlechas();

        idMovimiento = (idMovimiento === 0)
            ? movimientosTipo.length - 1
            : idMovimiento - 1;

        showMovements(idMovimientoTipo);
    } else if(stat === 5) {
        idAbility = (idAbility === 0)
            ? habilidades.length - 1
            : idAbility - 1;
        if(habilidades.length>1){
            animacionFlechas();
        }
        createAbiltyInfo()
    } else if(stat === 4 && comprobacion.length > 0){
        idEvolucion = (idEvolucion ===0)
            ? comprobacion.length - 1
            : idEvolucion - 1;
        if(comprobacion.length>1){
            animacionFlechas();
        }
        createEvolutionChain()
    }
}

async function showMovements(num){
    isChanged = true;
    idMovimientoTipo = num;
    isMovementsOptions = false;

    let arrayMoves;
    let level = "";
    movementScreen.innerHTML = `
            <div class="loader-overlay">
                <div class="loader"></div>
            </div>
        `;
    // Esperar si la promesa aún no se ha resuelto
    switch (num) {
        case 1:
            arrayMoves = await movimientos.level;
            arrayMoves.sort((a, b) => a.level - b.level);
            level = `Lv${arrayMoves[idMovimiento]?.level ?? "-"}`;
            break;
        case 2:
            arrayMoves = await movimientos.huevo;
            break;
        case 3:
            arrayMoves = await movimientos.maquina;
            break;
        case 4:
            arrayMoves = await movimientos.tutor;
            break;
        default:
            arrayMoves = [];
    }

    const movimiento = arrayMoves[idMovimiento] || {};

    const pot = movimiento.potencia ?? "-";
    const pp = movimiento.pp ?? "-";
    const pre = movimiento.precision_ataque ?? "-";


    movementScreen.innerHTML = ""
    movementScreen.classList.add('flex-direction')
    movementScreen.innerHTML = `<div class="top-container-movements">
                                    <div class="movement-title-container">
                                        <h1 class="movement-name-text line-ability">${arrayMoves[idMovimiento].nombre}</h1>
                                    </div>
                                    <div class="movement-level-container">
                                        <h1 class="movement-name-text-level">${level}</h1>
                                    </div>
                                    <div class="movement-type-container" data-tooltip="${traducirTipo(arrayMoves[idMovimiento].tipo)}">
                                        <img src="img/iconos_tipos/Icon_${arrayMoves[idMovimiento].tipo}.webp" class="icono-ataques-tipo">
                                    </div>
                                    <div class="movement-categorie-container" data-tooltip="${traducirCategorias(arrayMoves[idMovimiento].categoria)}">
                                        <img src="img/categorias/${arrayMoves[idMovimiento].categoria}.png" class="icono-ataques-categoria">
                                    </div>
                                </div>
                                <div class="middle-container-movements">
                                    <h1 class="movement-description-text">${arrayMoves[idMovimiento].descripcion}</h1>
                                </div>
                                <div class="bottom-container-movements">
                                    <div class="potency-container">
                                        <h1 class="potency">Potencia: <br></h1>
                                        <h1 class="valor">${pot}</h1>
                                    </div>
                                    <div class="precision-container">
                                        <h1 class="precision">Precision: <br></h1>
                                        <h1 class="valor">${pre}</h1>
                                    </div>
                                    <div class="pp-container">
                                        <h1 class="pp">PP: <br></h1>
                                        <h1 class="valor">${pp}</h1>
                                    </div>
                                    <div class="back-container">
                                        <img src="img/cerrar.png" class="icono-cruz" onclick="showMovementsOptions(1)")>
                                    </div>
                                </div>`
    animacionFlechas();
}

function showMovementsOptions(numMov) {
    isChanged = false;
    isMovementsOptions = true;
    idMovimiento = 0;
    movementScreen.innerHTML = "";
    movementScreen.classList.remove('flex-direction');

    if (numMov === 1) {
        linea1 = linea2 = linea3 = linea4 = "";
    }

    const tiposMovimiento = [
        { tipo: 'level', id: 1, icono: 'levelup.png' },
        { tipo: 'huevo', id: 2, icono: 'huevo-de-pascua.png', extraClass2: "egg-movements"},
        { tipo: 'maquina', id: 3, icono: 'computadora.png', extraClass: 'white', extraClass2: "machine-movements"},
        { tipo: 'tutor', id: 4, icono: 'profesor.png' }
    ];

    let htmlFinal = "";

    tiposMovimiento.forEach(({ tipo, id, icono, extraClass = '', extraClass2 = ''}) => {
        const movKey = `mov${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        const data = pokemon[movKey];

        if (data != null) {
            htmlFinal += `
                <div class="${tipo}-movements ${extraClass2}" id="${tipo}">
                    <img src="img/${icono}" class="icono-movimientos ${extraClass}" onclick="showMovements(${id})">
                </div>
            `;
            movimientos[tipo] = getAllMovements(id, data); // si lo necesitas aquí sin await
        }
    });

    movementScreen.innerHTML = htmlFinal;
}

function createBasicInfo(){

    if(pokemon.tipo_secundario != null){
        tipo2 = `<div class="movement-categorie-container" data-tooltip="${traducirTipo(pokemon.tipo_secundario)}">
                    <img src="img/iconos_tipos/Icon_${pokemon.tipo_secundario}.webp" class="icono-ataques-tipo">
                </div>`;
        widht = "bigWidht"
    } else {
        tipo2 = ""
        widht = "biggerWidht"
    }

    const genero = getGenderHTML(pokemon.genero); 
    const nombre = pokemon.nombre
        .split("-")
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
        .join(" ");
        let idMotrada
        if(pokemon.numero_pokedex<=1025){
            idMotrada = "#" + pokemon.numero_pokedex;
        } else{
            idMotrada = "#" + pokemonOriginal.numero_pokedex;
        }

    basicInfoContainer.innerHTML = `<div class="top-container-movements">
                                        <div class="movement-title-container ${widht}">
                                            <h1 class="movement-name-text line-ability">${nombre} ${idMotrada}</h1>
                                        </div>
                                        <div class="movement-type-container" data-tooltip="${traducirTipo(pokemon.tipo)}">
                                            <img src="img/iconos_tipos/Icon_${pokemon.tipo}.webp" class="icono-ataques-tipo">
                                        </div>
                                        ${tipo2}
                                    </div>
                                    <div class="middle-container-movements">
                                        <h1 class="movement-description-text">${pokemon.descripcion}</h1>
                                    </div>
                                    <div class="bottom-container-movements">
                                        <div class="potency-container">
                                            <h1 class="potency">Peso <br></h1>
                                            <h1 class="valor">${pokemon.peso} kg</h1>
                                        </div>
                                        <div class="precision-container">
                                            <h1 class="precision">Altura <br></h1>
                                            <h1 class="valor">${pokemon.altura} m</h1>
                                        </div>
                                        ${genero}
                                    </div>`
}

function getGenderHTML(genderRate) {
    const genderMap = {
        "-1": [],
        "0": [{ img: "hombre.png", class: "h-container", percent: "100%" }],
        "1": [
            { img: "hombre.png", class: "h-container", percent: "87.5%" },
            { img: "mujer.png", class: "m-container", percent: "12.5%" }
        ],
        "2": [
            { img: "hombre.png", class: "h-container", percent: "75%" },
            { img: "mujer.png", class: "m-container", percent: "25%" }
        ],
        "3": [
            { img: "hombre.png", class: "h-container", percent: "62.5%" },
            { img: "mujer.png", class: "m-container", percent: "37.5%" }
        ],
        "4": [
            { img: "hombre.png", class: "h-container", percent: "50%" },
            { img: "mujer.png", class: "m-container", percent: "50%" }
        ],
        "5": [
            { img: "hombre.png", class: "h-container", percent: "37.5%" },
            { img: "mujer.png", class: "m-container", percent: "62.5%" }
        ],
        "6": [
            { img: "hombre.png", class: "h-container", percent: "25%" },
            { img: "mujer.png", class: "m-container", percent: "75%" }
        ],
        "7": [
            { img: "hombre.png", class: "h-container", percent: "12.5%" },
            { img: "mujer.png", class: "m-container", percent: "87.5%" }
        ],
        "8": [{ img: "mujer.png", class: "m-container", percent: "100%" }]
    };
  
    const genderInfo = genderMap[genderRate];
  
    if (!genderInfo) return "Valor desconocido";
  
    if (genderInfo.length === 0) return ""; // Caso sin género
  
    return genderInfo
    .map(
        (g) => `
        <div class="genero-container">
            <div class="${g.class}">
                <img src="img/${g.img}" class="icono-genero">
                <h1 class="valor2">${g.percent}</h1>
            </div>
        </div>`
    )
    .join("");
}

function createAbiltyInfo(){
    let oculta = ""
    let widht = "big-widht"
    if(habilidades[idAbility].oculta===1){
        oculta = "Oculta"
        widht = ""
    }
    abilityScreen.innerHTML = `<div class="top-container-movements">
                                        <div class="movement-title-container ${widht}">
                                            <h1 class="movement-name-text line-ability">${habilidades[idAbility].nombre}</h1>
                                        </div>
                                        <div class="movement-type-container2">
                                            <h1 class="movement-name-text">${oculta}</h1>
                                        </div>
                                    </div>
                                    <div class="middle-container-movements">
                                        <h1 class="movement-description-text">${habilidades[idAbility].descripcion}</h1>
                                </div>`
}

async function createTypesInfo(){
    const bodyData = new URLSearchParams();
    bodyData.append('tipo1', pokemon.tipo);
    bodyData.append('tipo2', pokemon.tipo_secundario);

    // Realiza la solicitud POST
    const response = await fetch("../php/getFunctions.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyData.toString()
    });

    // Obtiene la respuesta como texto
    const text = await response.text();

    const resultado = JSON.parse(text); // text es el JSON recibido del fetch
    const key = Object.keys(resultado[0])[0]; // Extraemos la única clave
    const texto = resultado[0][key]; // El contenido de efectividades

    textSuperE = "";
    textDebil = "";
    textNeutro = "";
    textInmune = "";
    textResistente = "";
    textSuperResistente = "";

    const lineas = texto.split('\n');
    const efectividades = {};

    lineas.forEach(linea => {
    const [tipo, valores] = linea.split(':');
    if (tipo && valores) {
            efectividades[tipo.trim()] = valores.split(',').map(v => v.trim());
        }
    });

    for (const categoria in efectividades) {
        efectividades[categoria] = efectividades[categoria].map(e => e.toLowerCase());
    }

    let typeHTML = ""
    
    // X4 - Super Débil
    if (efectividades.superdebil && efectividades.superdebil.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x4')">X4</div>`;
        for (let i = 0; i < efectividades.superdebil.length; i++) {
            textSuperE += generarImgTipo(efectividades.superdebil[i]);
        }
    }

    // X2 - Débil
    if (efectividades.debil && efectividades.debil.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x2')">X2</div>`;
        for (let i = 0; i < efectividades.debil.length; i++) {
            textDebil += generarImgTipo(efectividades.debil[i]);
        }
    }

    // X1 - Neutro
    if (efectividades.neutro && efectividades.neutro.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x1')">X1</div>`;
        for (let i = 0; i < efectividades.neutro.length; i++) {
            textNeutro += generarImgTipo(efectividades.neutro[i]);
        }
    }

    // X1/2 - Resistente
    if (efectividades.resistente && efectividades.resistente.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x1/2')">X1/2</div>`;
        for (let i = 0; i < efectividades.resistente.length; i++) {
            textResistente += generarImgTipo(efectividades.resistente[i]);
        }
    }

    // X1/4 - Superresistente
    if (efectividades.superresistente && efectividades.superresistente.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x1/4')">X1/4</div>`;
        for (let i = 0; i < efectividades.superresistente.length; i++) {
            textSuperResistente += generarImgTipo(efectividades.superresistente[i]);
        }
    }

    // X0 - Inmune
    if (efectividades.inmune && efectividades.inmune.length > 0) {
        typeHTML += `<div class="typeContent" onclick="changeTypeEffectiveness('x0')">X0</div>`;
        for (let i = 0; i < efectividades.inmune.length; i++) {
            textInmune += generarImgTipo(efectividades.inmune[i]);
        }
    }

    typeScreen.innerHTML = `<div class="typeSection">
                                <div class="typeHeader">
                                    ${typeHTML}
                                </div>
                                <div class="typeAll" id="typeAll">
                                </div>
                            </div>`;
                      
    changeTypeEffectiveness('x1')
}

let allPokemonsForTyping = [];

// Función que dibuja la lista a partir de un array dado
function renderList(pokemons) {
    const container = document.getElementById('listScreen');
    container.innerHTML = '';  

    const ul = document.createElement('ul');
    ul.id = 'pokemon-list';

    pokemons.forEach(p => {
        const li = document.createElement('li');
        li.className = 'pokemon-item';
        if (p.id === id) li.classList.add('highlight');
        li.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <span class="pokemon-name">${p.name}</span>
        <span class="pokemon-id">#${p.id}</span>
        `;

        li.addEventListener('click', () => {
            id = p.id;
            resetAll()
            const blueButton = document.querySelector(".blue-button");
            blueButton.classList.add("parpadeando");
            overlayNotTouch.style.display = "flex"
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando")
                overlayNotTouch.style.display = "none"
            });
            document.getElementById('filterInput').value = '';
        });


        ul.appendChild(li);
    });

    container.appendChild(ul);

    // Auto-scroll al resaltado
    const highlighted = ul.querySelector('.pokemon-item.highlight');
    if (highlighted) {
        highlighted.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
}

// Carga inicial y guardado del array completo
async function createList() {
    try {
        const resp = await fetch('../php/getAllPoke.php');
        const json = await resp.json();
        if (!json.success) throw new Error(json.error);

        allPokemons = json.data;  
        renderList(allPokemons);
    } catch (e) {
        console.error('Error al obtener/parsear Pokémon:', e);
    }
}

// Filtrado en tiempo real
document.getElementById('filterInput').addEventListener('input', e => {
    let term = e.target.value.trim().toLowerCase().replace('#', '');

    // Si es un número mayor a 1025, limitamos la búsqueda a '1025'
    if (!isNaN(term) && Number(term) > 1025) {
        term = '1025';
    }

    if (!term) {
        renderList(allPokemons, null);
        return;
    }

    const filtered = allPokemons.filter(p => {
        return p.name.toLowerCase().includes(term)
            || String(p.id).includes(term);
    });

    renderList(filtered, null);
});

function getForms(){
    let countMega = 0;
    let idMega = [];
    let x = 0, y = 0, mega = 0;
    let gmax = null, paldea = null, alola = null, hisui = null, galar = null, kyogrePrimal = null, groudonPrimal = null, gmaxUrshi1 = null, gmaxUrshi2 = null;
    if (pokemon.nombre.includes("darmanitan-galar-standard")) {
        darmanitanGalar = pokemon
    }
    if (pokemon.nombre.includes("tauros-paldea-combat-breed")) {
        taurosPaldea = pokemon
    }
    if (pokemon.formaEspecial != null || pokemon.nombre.includes("rapid-strike") && !pokemon.nombre.includes("rapid-strike-gmax") || pokemon.nombre.includes("galar-standard") || pokemon.nombre.includes("galar-zen") || pokemon.nombre.includes("tauros-paldea")) {
        let formasArrayNombre
        if(pokemon.nombre.includes("rapid-strike") || pokemon.nombre.includes("galar-standard") || pokemon.nombre.includes("galar-zen") || pokemon.nombre.includes("tauros-paldea")){
            formasArrayNombre = pokemonOriginal.nombresFormaEspecial.split(",").map(s => s.trim().toLowerCase());
            formasArrayIdSinRecortar = pokemonOriginal.formaEspecial.split(",").map(s => s.trim());
            formasArrayId = pokemonOriginal.formaEspecial.split(",").map(s => s.trim());
            formsScreen.innerHTML = "";
        } else {
            formasArrayNombre = pokemon.nombresFormaEspecial.split(",").map(s => s.trim().toLowerCase());
            formasArrayIdSinRecortar = pokemon.formaEspecial.split(",").map(s => s.trim());
            formasArrayId =pokemon.formaEspecial.split(",").map(s => s.trim());
            formsScreen.innerHTML = "";
        }
        let recorte = false

        for (let i = 0, k = 0; i < formasArrayNombre.length; i++, k++) {
            const forma = formasArrayNombre[i];
            recorte = false

            if (forma.includes("mega")) {
                countMega++;
                mega = i;
                idMega.push(formasArrayIdSinRecortar[i]);
                esImportante = true;
                recorte = true;

                if (forma.includes("x")) x = i;
                else y = i;

            } else if (forma.includes("gmax")) {
                if(forma.includes("single-strike-gmax")){
                    gmaxUrshi1 = i;
                }else if(forma.includes("rapid-strike-gmax")){
                    gmaxUrshi2 = i;
                }else{
                    gmax = i;
                }
                esImportante = true;
                recorte = true;
            } else if (forma.includes("hisui")) {
                hisui = i;
                esImportante = true;
                recorte = true;
            } else if (forma.includes("alola") && !forma.includes("totem") && !forma.includes("pikachu")) {
                alola = i;
                esImportante = true;
                recorte = true;
            } else if (forma.includes("paldea") && !forma.includes("tauros-paldea-blaze-breed") && !forma.includes("tauros-paldea-aqua-breed")) {
                paldea = i;
                esImportante = true;
                recorte = true;
            } else if (forma.includes("galar") && !forma.includes("zen")) {
                galar = i;
                esImportante = true;
                recorte = true;
            } else if (forma.includes("kyogre-primal")) {
                kyogrePrimal = i;
                esImportante = true;
                recorte = true;
            } else if (forma.includes("groudon-primal")) {
                groudonPrimal = i;
                esImportante = true;
                recorte = true; 
            } else if (forma.includes("totem")) {
                recorte = true;
            } else if (forma.includes("galar-zen")) {
                galarZenId = formasArrayIdSinRecortar[i];
                recorte = true;
            } else if (forma.includes("tauros-paldea-blaze-breed") || forma.includes("tauros-paldea-aqua-breed")) { 
                taurosPaldeaArrayId.push(formasArrayIdSinRecortar[i]);
                esImportante = true;
                recorte = true;
            }

            formasArray.push({ id: formasArrayIdSinRecortar[i], nombre: forma });

            if (recorte) {
                formasArrayId.splice(k, 1);
                k--;
            }
        }
        if (taurosPaldeaArrayId.length > 2) {
            taurosPaldeaArrayId = taurosPaldeaArrayId.slice(0, 2);
        }
        // Mega evoluciones
        if (countMega === 1) {
            formsScreen.innerHTML += `
                <div class="mega-evolution-container">
                    <img src="img/megaevolucion.png" class="mega-evolution-icon" onclick="startMegaEvo(${idMega[mega]})">
                </div>`;
        } else if (countMega === 2) {
            formsScreen.innerHTML += `
                <div class="mega-evolution-container">
                    <img src="img/mega-x.png" class="mega-evolution-icon2 mega-left" onclick="startMegaEvo(${idMega[x]})">
                    <img src="img/mega-y.png" class="mega-evolution-icon2 mega-right" onclick="startMegaEvo(${idMega[y]})">
                </div>`;
        }

        // Detectar forma actual para decidir qué gigamax mostrar
        let gmaxActual = null;
        if (pokemon.nombre.includes("rapid-strike")) {
            gmaxActual = gmaxUrshi2;
        } else if (pokemon.nombre.includes("Urshifu")) {
            gmaxActual = gmaxUrshi1;
        } else {
            gmaxActual = gmax;
        }

        // Formas especiales
        const formasEspeciales = [
            { nombre: "gigamax", clase: "blanco", funcion: "startGigamax", index: gmaxActual },
            { nombre: "alola", clase: "logo-sol-icono", funcion: "toggleFormaRegional", index: alola },
            { nombre: "hisui", clase: "logo-leyendas-icono", funcion: "toggleFormaRegional", index: hisui },
            { nombre: "paldea", clase: "logo-leyendas-icono", funcion: "toggleFormaRegional", index: paldea },
            { nombre: "galar", clase: "logo-sol-icono", funcion: "toggleFormaRegional", index: galar },
            { nombre: "kyogrePrimal", clase: "logo-primal-k-icono", funcion: "startMegaEvo", index: kyogrePrimal },
            { nombre: "groudonPrimal", clase: "logo-primal-k-icono", funcion: "startMegaEvo", index: groudonPrimal },
        ];

        if(esImportante && formasArrayId.length != 0 || taurosPaldeaArrayId.length != 0 && pokemon.nombre != "Tauros"){
            formsScreen.innerHTML += `<div class="mega-evolution-container">
                                        <img src="img/flecha-izquierda-forma.png" class="mega-evolution-icon" onclick="
                                            passPreviousForm()">
                                    </div>`
        }

        formasEspeciales.forEach(forma => {
            if (forma.index !== null && formasArray[forma.index] && formasArrayId.length === 0) {
                formsScreen.innerHTML += `
                    <div class="mega-evolution-container">
                        <img src="img/${forma.nombre}.png" class="mega-evolution-icon ${forma.clase}" onclick="
                        ${forma.funcion}(${formasArray[forma.index].id})">
                    </div>`;
            } else if(forma.index !== null && formasArray[forma.index] && formasArrayId.length != 0){
                formsScreen.innerHTML += `
                    <div class="mega-evolution-container">
                        <img src="img/${forma.nombre}.png" class="mega-evolution-icon ${forma.clase}" onclick="
                        ${forma.funcion}(${formasArray[forma.index].id})">
                    </div>`;
            } else if(!esImportante){
                formsScreen.innerHTML = `<div class="mega-evolution-container">
                                            <img src="img/flecha-izquierda-forma.png" class="mega-evolution-icon" onclick="
                                                passPreviousForm()">
                                        </div>
                                        <div class="mega-evolution-container">
                                            <img src="img/flecha-derecha-forma.png" class="mega-evolution-icon" onclick="
                                                passNextForm()">
                                        </div>`;
            }
        });

        if(esImportante && formasArrayId.length != 0 || taurosPaldeaArrayId.length != 0 && pokemon.nombre != "Tauros"){
            formsScreen.innerHTML += `<div class="mega-evolution-container">
                                        <img src="img/flecha-derecha-forma.png" class="mega-evolution-icon" onclick="
                                            passNextForm()">
                                    </div>`
        }
    }else {
        formsScreen.innerHTML = "";
    }
}

async function createEvolutionChain(){
    evolutionScreen.innerHTML = ""
    let preevos = []
    let evos = []
    if (pokemon.preevolutions || pokemon.evolutions) {
        if (pokemon.preevolutions != null) {
            preevos = pokemon.preevolutions.split("<-");
        }
        if (pokemon.evolutions != null) {
            comprobacion = pokemon.evolutions.split(";");
            comprobacion = comprobacion.filter((c1, i) => 
                !comprobacion.some((c2, j) => i !== j && c2.includes(c1))
            );
            evos = comprobacion[idEvolucion].split("->");
        }

        let ids = [];
        let metodos = [];

        if (evos.length === 5) {
            ids = [evos[0], evos[2], evos[4]];
            metodos = [evos[1], evos[3]]
        } else if (evos.length === 3 && preevos.length === 3) {
            ids = [preevos[0], evos[0], evos[2]]; 
            metodos = [preevos[1], evos[1]]
        } else if(evos.length === 3){
            ids = [evos[0], evos[2]];
            metodos = [evos[1]]
        } else if(preevos.length === 3) {
            ids = [preevos[0], preevos[2]];
            metodos = preevos[1]
        } else {
            ids = [preevos[0], preevos[2], preevos[4]];
            metodos = [preevos[1], preevos[3]]
        }

        try {
            const bodyData = new URLSearchParams();
            bodyData.append('evoluciones', ids.join(',')); 

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
                const pokemonsEvo = data.data;
                for (let i = 0; i < pokemonsEvo.length; i++) {
                    // Mostrar el Pokémon
                    evolutionScreen.innerHTML += `
                        <div class="pokemon">
                            <img src="${pokemonsEvo[i].imagen}" class="pokeImageEvo">
                        </div>
                    `;
                
                    // Si no es el último, añadir una flecha
                    if (i < pokemonsEvo.length - 1) {
                        if (Array.isArray(metodos)) {
                            metodo = metodos[i];
                        } else {
                            metodo = metodos
                        }
                        evolutionScreen.innerHTML += `
                            <div class="separator">
                                <img src="img/flecha-derecha.png" class="flecha-evolucion">
                                <span class="tooltip-text">${metodo}</span>
                            </div>
                        `;
                    }
                }
            } else {
                console.warn("No se encontraron los Pokémon:", data.message);
            }

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    } else {
        evolutionScreen.innerHTML = `<h1 style="color: white;" class="clamp">Sin evolución</h1>`;
    }
}

function startMegaEvo(newId) {
    toggleForm({
        newId,
        isFormActive: isMega,
        setFormActive: (val) => isMega = val,
        animImageSrc: 'img/animacion-mega.png',
        screenId: 'megaEvoScreen',
        animId: 'megaEvoAnim',
        screen2Id: 'megaEvoScreen2',
        anim2Id: 'mega2',
        glowClass: 'animate-glow'
    });
}

function toggleFormaRegional(newId) {
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); 
    const goingToForm = !isFormaAlterna;
    isFormaAlterna = goingToForm;
    overlayNotTouch.style.display = "flex"
    if (goingToForm) {
        pokemonOriginal = pokemon;
        pokemonEspecialForm = true;
        initialize(newId).finally(() => {
            blueButton.classList.remove("parpadeando");
            overlayNotTouch.style.display = "none"
        });
    } else {
        pokemonEspecialForm = false;
        if(hasFilter){
            initialize(pokemonOriginal.numero_pokedex).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none"
            });
        }else{
            pokemonEspecialForm = false;
            initialize(id).finally(() => {
                blueButton.classList.remove("parpadeando");
                overlayNotTouch.style.display = "none"
            });
        }
    }
}

function startGigamax(newId) {
    toggleForm({
        newId,
        isFormActive: isGigamax,
        setFormActive: (val) => isGigamax = val,
        animImageSrc: 'img/dinamax-ball.png',
        screenId: 'megaEvoScreen',
        animId: 'megaEvoAnim',
        screen2Id: 'megaEvoScreen3',
        anim2Id: 'gmax',
        glowClass: 'animate-glow2 red-glow'
    });
}

async function toggleForm({
    newId,
    isFormActive,
    setFormActive,
    animImageSrc,
    screenId,
    animId,
    screen2Id,
    anim2Id,
    glowClass
}) {
    const screen = document.getElementById(screenId);
    const anim = document.getElementById(animId);
    const container = document.getElementById("megaContainer");
    const screen2 = document.getElementById(screen2Id);
    const anim2 = document.getElementById(anim2Id);
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); 
    overlayNotTouch.style.display = "flex"

    // Mostrar pantalla de animación
    screen.style.display = 'flex';
    screen.classList.add('active');


    // Reiniciar animaciones (forzar reflow)
    anim.classList.remove('mega-animation');
    anim2.classList.remove('smooth');
    container.classList.remove('animate-glow', 'red-glow', 'animate-glow2');
    void anim.offsetWidth;
    void anim2.offsetWidth;
    void container.offsetWidth;
    anim.src = animImageSrc;
    anim.classList.add('mega-animation');
    container.classList.add(...glowClass.split(" "));
    anim2.classList.add('smooth');

    const goingToForm = !isFormActive;
    setFormActive(goingToForm);

    if (goingToForm) {
        if(pokemon.nombre.includes("rapid-strike")){
            pokemonOriginal = urshifu;
        } else {
            pokemonOriginal = pokemon;
        }
        pokemonEspecialForm = true;
    } else {
        pokemonEspecialForm = false;
    }

    let targetId;

    if (hasFilter) {
        targetId = newId;
    } else {
        targetId = goingToForm ? newId : id;
    }

    const screen2Timeout = setTimeout(() => {
        screen2.style.display = 'flex';
        screen2.classList.add('active');
    }, 2500);
    anim.addEventListener("animationend", function () {
        clearTimeout(screen2Timeout);
        initialize(targetId).finally(() => {
            screen.classList.remove('active');
            anim.classList.remove('mega-animation');
            container.classList.remove('animate-glow', 'red-glow', 'animate-glow2');
            screen.style.display = 'none';
            screen2.classList.remove('active');
            screen2.style.display = 'none';
            anim2.classList.remove('smooth');
            blueButton.classList.remove("parpadeando");
            overlayNotTouch.style.display = "none"
        });
    }, { once: true });
}


function checkLandscape() {
    const warningDiv = document.querySelector("#orientation-warning");
    const pokedexContent = document.querySelector("#pokedex-content"); // Asegúrate de tener un ID para el contenido de la Pokédex
    
    if (window.innerHeight > window.innerWidth) {
        // Si está en orientación vertical (portrait), muestra el aviso y oculta el contenido
        if (!warningDiv) {
            const newWarningDiv = document.createElement("div");
            newWarningDiv.id = "orientation-warning"; // ID único para poder encontrarlo fácilmente
            newWarningDiv.style.textAlign = "center";
            newWarningDiv.style.padding = "2rem";
            newWarningDiv.style.fontFamily = "sans-serif";
            newWarningDiv.innerHTML = `
                <h2>Por favor gira tu dispositivo</h2>
                <p>Esta app funciona mejor en orientación horizontal.</p>
            `;
            document.body.appendChild(newWarningDiv);
        }

        // Oculta el contenido de la Pokédex (o cualquier otro contenido relevante)
        if (pokedexContent) {
            pokedexContent.classList.add("hide-content");
        }
    } else {
        // Si está en horizontal (landscape), elimina el aviso y muestra el contenido
        if (warningDiv) {
            warningDiv.remove();
        }

        // Muestra el contenido de la Pokédex
        if (pokedexContent) {
            pokedexContent.classList.remove("hide-content");
        }
    }
}

const filterInput = document.getElementById('filterInput');

filterInput.addEventListener('input', () => {
    const value = filterInput.value;

    // Si es número y pasa de 1025 → lo recortamos
    if (!isNaN(value) && Number(value) > 1025) {
        filterInput.value = '1025';
    }
});

function disableControls(disable) {
    // Deshabilitar los botones de cambio
    document.getElementById('right-pad-button').disabled = disable;
    document.getElementById('left-pad-button').disabled = disable;
    document.getElementById('pass-previous-stat').disabled = disable;
    document.getElementById('pass-next-stat').disabled = disable;
    document.getElementById('search-pokemon').disabled = disable;
    document.getElementById('erase-number').disabled = disable;
    document.getElementById('cry-button').disabled = disable;
    document.getElementById('change-background').disabled = disable;
    document.getElementById('show-guide').disabled = disable;
    for (let i = 0; i <= 9; i++) {
        document.getElementById(`buton${i}`).disabled = disable;
    }
    document.getElementById(`show-shiny`).disabled = disable;
    document.getElementById('turn-on-off').disabled = disable;
    document.getElementById('show-filter').disabled = disable;
    document.getElementById('pass-next-attack').disabled = disable;
    document.getElementById('pass-previous-attack').disabled = disable;
    // Deshabilitar el listener de teclas
    if (disable) {
        document.removeEventListener('keydown', keyboardNavigation);
    } else {
        document.addEventListener('keydown', keyboardNavigation);
    }
}

let volumeInterval;

document.addEventListener("keydown", function (event) {
    const bgMusic = document.getElementById("bg-music");

    if (volumeInterval) return; // evitar múltiples intervalos

    if (event.key === "+" || event.key === "=") {
        // Subir volumen
        volumeInterval = setInterval(() => {
            bgMusic.volume = Math.min(1, bgMusic.volume + 0.01);
        }, 50);
    } else if (event.key === "-") {
        // Bajar volumen
        volumeInterval = setInterval(() => {
            bgMusic.volume = Math.max(0, bgMusic.volume - 0.01);
        }, 50);
    }
});

document.addEventListener("keyup", function (event) {
    if (
        event.key === "+" ||
        event.key === "=" ||
        event.key === "-"
    ) {
        clearInterval(volumeInterval);
        volumeInterval = null;
    }
});

function keyboardNavigation(event) {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

    if (isTyping) return;

    if (event.key === "ArrowRight") {
        nextPokemon();
    } else if (event.key === "ArrowLeft") {
        previousPokemon();
    } else if (event.key === "a") {
        passPreviousStat();
    } else if (event.key === "d") {
        passNextStat();
    } else if (event.key === "Enter") {
        searchPokemon();
    } else if (event.key === "Backspace") {
        deleteLastNumber()
    } else if (event.key === "c") {
        reproSoundCry();   
    } else if (event.key === "f") {
        changeBackground();
    } else if (event.key === "g") {
        showGuide();
    } else if (event.key === "0") {
        searchPokemonInput(0)
    } else if (event.key === "1") {
        if(isMovementsOptions === true){
            showMovements(1)
        } else {
            searchPokemonInput(1)
        }
    }else if (event.key === "2") {
        if(isMovementsOptions === true){
            showMovements(2)
        } else {
            searchPokemonInput(2)
        }
    } else if (event.key === "3") {
        if(isMovementsOptions === true){
            showMovements(3)
        } else {
            searchPokemonInput2(3)
        }
    } else if (event.key === "4") {
        if(isMovementsOptions === true){
            showMovements(4)
        } else {
            searchPokemonInput(4)
        }
    } else if (event.key === "5") {
        searchPokemonInput(5);
    } else if (event.key === "6") {
        searchPokemonInput(6);
    } else if (event.key === "7") {
        searchPokemonInput(7);
    } else if (event.key === "8") {
        searchPokemonInput(8);
    } else if (event.key === "9") {
        searchPokemonInput(9);
    } else if (event.key === "p") {
        showShiny();
    } else if (event.key === "Escape") {
        if(isChanged === true){
            showMovementsOptions(1);
        } else {
            turnOffScreen();
        }
    } else if (event.key === "h") {
        showFilter();
    } else if (event.key === "ArrowDown" || event.key === "s") {
        passNextAttack();
    } else if (event.key === "ArrowUp" || event.key === "w") {
        passPreviousAttack();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    audio.volume = 0.2; // Ajusta el volumen aquí (0.0 a

    function enableMusic() {
        audio.play().catch(() => {});
        document.removeEventListener('click', enableMusic);
        document.removeEventListener('keydown', enableMusic);
    }

    document.addEventListener('click', enableMusic);
    document.addEventListener('keydown', enableMusic);
});

// Event listener para las teclas, solo se habilita cuando no se está cargando
document.addEventListener('keydown', keyboardNavigation);

function animacionFlechas(){
    buttonUp = document.getElementById("pass-previous-attack")
    bottonDown = document.getElementById("pass-next-attack")

    let countForAnim = 0;
    const animate = () => {
        if (countForAnim >= 3) return;
        buttonUp.classList.add('up-animate');
        bottonDown.classList.add('down-animate');
  
        setTimeout(() => {
            buttonUp.classList.remove('up-animate');
            bottonDown.classList.remove('down-animate');
            countForAnim++;
            setTimeout(animate, 200); // tiempo entre pulsos
        }, 100); // duración de cada "pulsación"
    };

    animate();
}

function changeTypeEffectiveness(weakness){
    let typeContentAll = document.getElementById("typeAll")
    switch (weakness) {
        case "x4":
            typeContentAll.innerHTML = textSuperE;
            break;
        case "x2":
            typeContentAll.innerHTML = textDebil;
            break;
        case "x1":
            typeContentAll.innerHTML = textNeutro;
            break;
        case "x0":
            typeContentAll.innerHTML = textInmune;
            break;
        case "x1/2":
            typeContentAll.innerHTML = textResistente;
            break;
        case "x1/4":
            typeContentAll.innerHTML = textSuperResistente;
            break;
    }    
}

function traducirTipo(tipoIngles) {
    const traducciones = {
        normal: "Normal",
        fire: "Fuego",
        water: "Agua",
        electric: "Eléctrico",
        grass: "Planta",
        ice: "Hielo",
        fighting: "Lucha",
        poison: "Veneno",
        ground: "Tierra",
        flying: "Volador",
        psychic: "Psíquico",
        bug: "Bicho",
        rock: "Roca",
        ghost: "Fantasma",
        dragon: "Dragón",
        dark: "Siniestro",
        steel: "Acero",
        fairy: "Hada"
    };

    return traducciones[tipoIngles] || tipoIngles.charAt(0).toUpperCase() + tipoIngles.slice(1);
}

function generarImgTipo(tipo) {
    return `<div class="iconTypeStat" data-tooltip="${traducirTipo(tipo)}">
                <img src="img/iconos_tipos/Icon_${tipo}.webp" alt="${tipo}">
            </div>`;
}

function traducirCategorias(categoriaIngles) {
    const traducciones = {
        physical: "Físico",
        special: "Especial",
        status: "Estado"
    };

    return traducciones[categoriaIngles] || categoriaIngles.charAt(0).toUpperCase() + categoriaIngles.slice(1);
}