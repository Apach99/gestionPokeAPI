// Elementos y variables globales
const buscador = document.getElementById("buscador");
const lista = document.getElementById("lista");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const paginaInfo = document.getElementById("pagina-info");

let pokemonsActuales = []; // Guarda los Pokémon del lote de paginación
let controller;            // Para cancelar peticiones con AbortController
let offset = 0;            // Punto de inicio para la paginación
const LIMIT = 20;          // Pokémon por página

//Función modular: Carga una página de Pokémon (Paginación)

async function cargarPagina() {
    // Cancelamos cualquier petición en curso antes de iniciar una nueva
    if (controller) controller.abort();
    controller = new AbortController();
    const { signal } = controller;

    try {
        lista.innerHTML = "<p class='mensaje'>Cargando lista...</p>";
        
        // Realizamos la petición con el offset actual
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`, { signal });
        if (!resp.ok) throw new Error("Error al obtener la lista");
        const data = await resp.json();

        // Obtenemos los detalles individuales (imágenes y tipos) en paralelo
        const promesas = data.results.map(p => 
            fetch(p.url, { signal }).then(res => res.json())
        );
        const detalles = await Promise.all(promesas);

        // Mapeamos los datos al formato que necesitamos
        pokemonsActuales = detalles.map(p => ({
            nombre: p.name,
            id: p.id.toString(),
            img: p.sprites.front_default,
            tipos: p.types.map(t => t.type.name)
        }));

        renderizar(pokemonsActuales);
        actualizarPaginacionUI(data.previous, data.next);

    } catch (error) {
        if (error.name === 'AbortError') return; // Ignoramos si fue una cancelación manual
        console.error("Error:", error);
        lista.innerHTML = "<p class='error'>Hubo un problema al cargar los datos.</p>";
    }
}

//Función modular: Busca un Pokémon específico en TODA la API
async function buscarEnTodaLaApi(termino) {
    if (controller) controller.abort();
    controller = new AbortController();
    const { signal } = controller;

    try {
        lista.innerHTML = "<p class='mensaje'>Buscando en la base de datos...</p>";
        
        // Consultamos directamente al endpoint del Pokémon específico
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${termino}`, { signal });
        
        if (!resp.ok) {
            lista.innerHTML = "<p class='mensaje'>No se encontró ningún Pokémon con ese nombre o ID.</p>";
            btnAnterior.disabled = true;
            btnSiguiente.disabled = true;
            return;
        }

        const p = await resp.json();
        
        const pokemonEncontrado = {
            nombre: p.name,
            id: p.id.toString(),
            img: p.sprites.front_default,
            tipos: p.types.map(t => t.type.name)
        };

        // Renderizamos solo el resultado. Lo pasamos como array [p] para el forEach
        renderizar([pokemonEncontrado]);
        
        // Bloqueamos la paginación mientras hay un resultado de búsqueda activa
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        paginaInfo.textContent = "Resultado de búsqueda";

    } catch (error) {
        if (error.name === 'AbortError') return;
        lista.innerHTML = "<p class='error'>Error al conectar con la base de datos.</p>";
    }
}

//Dibuja las tarjetas en el HTML
function renderizar(array) {
    lista.innerHTML = "";
    array.forEach(p => {
        const li = document.createElement("li");
        li.classList.add("carta_pokemon");
        li.innerHTML = `
            <span>#${p.id}</span>
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.tipos.join(" / ")}</p>
        `;
        lista.appendChild(li);
    });
}

//Control de botones y texto de página
function actualizarPaginacionUI(tienePrev, tieneNext) {
    btnAnterior.disabled = !tienePrev;
    btnSiguiente.disabled = !tieneNext;
    paginaInfo.textContent = `Página ${(offset / LIMIT) + 1}`;
}



// Escucha cada pulsación de tecla para búsqueda en tiempo real
buscador.addEventListener("input", () => {
    const valor = buscador.value.toLowerCase().trim();

    if (valor === "") {
        // Si el buscador está vacío, volvemos a la lista paginada
        cargarPagina();
    } else {
        // Si hay texto, buscamos en toda la API
        buscarEnTodaLaApi(valor);
    }
});

btnSiguiente.addEventListener("click", () => {
    offset += LIMIT;
    cargarPagina();
});

btnAnterior.addEventListener("click", () => {
    if (offset > 0) {
        offset -= LIMIT;
        cargarPagina();
    }
});

// Inicio de la App
cargarPagina();