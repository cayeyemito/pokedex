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
let abilityContainer = document.getElementById("abilityContainer")
let basicInfoContainer = document.getElementById("basicInfo")
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
let idMovimientoTipo
let isChanged = false
let formasArray = [];
let formsScreen = document.getElementById("formsIcons")
let pokemonOriginal
let pokemonEspecialForm = false
let isMega = true

async function initialize(numberPokedex) {

    if (chartInstance) {
        chartInstance.destroy();
    }

    if(!pokemonEspecialForm){
        pokemon = await getPokemonInfo(numberPokedex);
        getForms()
    } else {
        pokemon = await getSpecialPokemonInfo(numberPokedex);
        Object.assign(pokemon, {
            genero: pokemonOriginal.genero,
            descripcion: pokemonOriginal.descripcion,
            nombre_region: pokemonOriginal.nombre_region
        })
        pokemonEspecialForm = false
        formsScreen.innerHTML =`<div class="mega-evolution-container">
                                    <img src="img/megaevolucion.png" class="mega-evolution-icon" onclick="megaEvolution(${id})">
                                </div>`
    }

    const tiposMovimiento = [
        { tipo: 'level', id: 1, icono: 'levelup.png' },
        { tipo: 'huevo', id: 2, icono: 'huevo-de-pascua.png' },
        { tipo: 'maquina', id: 3, icono: 'computadora.png', extraClass: 'white' },
        { tipo: 'tutor', id: 4, icono: 'profesor.png' }
    ];
    
    tiposMovimiento.forEach(({ tipo, id, icono, extraClass = '' }) => {
        // Usamos la notación dinámica para obtener el atributo correcto
        const movKey = `mov${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`; 
    
        const data = pokemon[movKey]; 
        const element = document.getElementById(tipo);
    
        if (data != null) {
            element.style.display = 'flex';
            element.innerHTML = `
                <img src="img/${icono}" class="icono-movimientos ${extraClass}" onclick="showMovements(${id})">
            `;
            movimientos[tipo] = getAllMovements(id, data); // sin await
        } else {
            element.style.display = 'none';
        }
    });
    
    createBasicInfo()
    
    innerScreenOverlay.style.backgroundImage = `url("${pokemon.imagen}")`
    innerScreen.style.backgroundImage = `url("img/tipos/${pokemon.tipo}/${pokemon.tipo}.jpg")`
    pokeNameIdText.innerText = `${pokemon.nombre_region.charAt(0).toUpperCase() + pokemon.nombre_region.slice(1).toLowerCase()}`    

    habilidades = await getAllAbilities()
    habilidades.sort((a, b) => a.oculta - b.oculta);

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
    // Escucha los cambios de tamaño y de orientación
    window.addEventListener("resize", checkLandscape);
    window.addEventListener("orientationchange", checkLandscape);

    // Llama a la función al cargar la página para detectar la orientación inicial
    checkLandscape();

    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); // Comienza a parpadear

    initialize(id).finally(() => {
        blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
    });
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
        movementScreen.style.visibility = "hidden"
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
    id = parseInt(numberToTry);
    
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); // Comienza a parpadear

    initialize(id).finally(() => {
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
    const audio = new Audio(pokemon.grito);
    audio.play().catch(error => {
        console.error("Error al reproducir el grito:", error);
    });
}

function nextPokemon(){
    showMovementsOptions(1)
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); // Comienza a parpadear
    if(id<1025){
        id++
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
        });
    } else{
        id = 1
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
        });
    }
}

function previousPokemon(){
    showMovementsOptions(1)
    const blueButton = document.querySelector(".blue-button");
    blueButton.classList.add("parpadeando"); // Comienza a parpadear
    if(id>1){
        id--
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
        });
    } else{
        id = 1025
        initialize(id).finally(() => {
            blueButton.classList.remove("parpadeando"); // Deja de parpadear cuando termine
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

        idMovimiento = (idMovimiento === 0)
            ? movimientosTipo.length - 1
            : idMovimiento - 1;

        showMovements(idMovimientoTipo);
    }
}

async function showMovements(num){
    isChanged = true;
    idMovimientoTipo = num;

    let arrayMoves;
    let level = "";

    // Esperar si la promesa aún no se ha resuelto
    switch (num) {
        case 1:
            arrayMoves = await movimientos.level;
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
                                    <div class="movement-type-container">
                                        <img src="img/iconos_tipos/Icon_${arrayMoves[idMovimiento].tipo}.webp" class="icono-ataques-tipo">
                                    </div>
                                    <div class="movement-categorie-container">
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
                                        <img src="img/cerrar.png" class="icono-cruz" onclick="showMovementsOptions(0)")>
                                    </div>
                                </div>`
}

function showMovementsOptions(numeroOption){
    isChanged = false
    idMovimiento = 0
    movementScreen.innerHTML = ""
    movementScreen.classList.remove('flex-direction')
    let linea1 = ""
    let linea2 = ""
    let linea3 = ""
    let linea4 = ""
    if(numeroOption === 0){
        linea1 = `<img src="img/levelup.png" class="icono-movimientos" onclick="showMovements(1)">`
        linea2 = `<img src="img/huevo-de-pascua.png" class="icono-movimientos" onclick="showMovements(2)">`
        linea3 = `<img src="img/computadora.png" class="icono-movimientos white" onclick="showMovements(3)">`
        linea4 = `<img src="img/profesor.png" class="icono-movimientos" onclick="showMovements(4)">`
    }
    movementScreen.innerHTML = `<div class="level-movements" id="level">
                                    ${linea1}
                                </div>
                                <div class="egg-movements" id="huevo">
                                    ${linea2}
                                </div>
                                <div class="machine-movements" id="maquina">
                                    ${linea3}
                                </div>
                                <div class="tutor-movements" id="tutor">
                                    ${linea4}
                                </div>`
}

function createBasicInfo(){

    if(pokemon.tipo_secundario != null){
        tipo2 = `<div class="movement-categorie-container">
                    <img src="img/iconos_tipos/Icon_${pokemon.tipo_secundario}.webp" class="icono-ataques-tipo">
                </div>`;
        widht = "bigWidht"
    } else {
        tipo2 = ""
        widht = "biggerWidht"
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
      
      // Ejemplo de uso:
    const description = getGenderHTML(pokemon.genero);      

    basicInfoContainer.innerHTML = `<div class="top-container-movements">
                                        <div class="movement-title-container ${widht}">
                                            <h1 class="movement-name-text line-ability">${pokemon.nombre}</h1>
                                        </div>
                                        <div class="movement-type-container">
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
                                        ${description}
                                    </div>`
}

function getForms(){
    if(pokemon.formaEspecial != null){
        let formasArrayNombre = pokemon.nombresFormaEspecial.split(",").map(String);
        let formasArrayId = pokemon.formaEspecial.split(",").map(String);
        for(i = 0; i<formasArrayNombre.length; i++){
            formasArray.push({id:formasArrayId[i], nombre:formasArrayNombre[i]})
        }
        for(i = 0; i<formasArray.length;i++){
            if(formasArray[i].nombre.includes("mega") || pokemon.nombre.includes("mega")){
                formsScreen.innerHTML =`<div class="mega-evolution-container">
                                            <img src="img/megaevolucion.png" class="mega-evolution-icon" onclick="megaEvolution(${formasArray[i].id})">
                                        </div>`
            }
        }
    } else {
        formsScreen.innerHTML = ""
    }
}

async function megaEvolution(newId) {
    let megaEvo = document.getElementById("megaEvoScreen");
    let megaEvoAnim = document.getElementById("megaEvoAnim");
    let megaCont = document.getElementById("megaContainer");

    pokemonOriginal = pokemon;
    pokemonEspecialForm = true;

    // Determinar el ID final según si está mega o no
    const finalId = isMega ? newId : id;
    isMega = !isMega;

    // Mostrar contenedor y activar clases
    megaEvo.style.display = 'flex';
    megaEvo.classList.add('active');

    // Reiniciar animaciones quitando y reañadiendo clases
    megaEvoAnim.classList.remove('mega-animation');
    megaCont.classList.remove('animate-glow');

    // Forzar reflow para que la animación vuelva a ejecutarse
    void megaEvoAnim.offsetWidth;
    void megaCont.offsetWidth;

    // Reaplicar clases que activan la animación
    megaEvoAnim.classList.add('mega-animation');
    megaCont.classList.add('animate-glow');

    // Esperar a que termine la animación UNA vez
    megaEvoAnim.addEventListener("animationend", function () {
        initialize(finalId).finally(() => {
            megaEvo.classList.remove('active');
            megaEvoAnim.classList.remove('mega-animation');
            megaCont.classList.remove('animate-glow');
            megaEvo.style.display = 'none';
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