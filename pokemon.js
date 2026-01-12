//Capturamos los elementos del HTML por  su ID para poder manipularlos

const buscador = document.getElementById("buscador");
const btnBuscador = document.getElementById("btn-buscador");
const lista = document.getElementById("lista");

//Creamos un array vacio donde más tarde almacenaré el resultado de los Pokémon
let pokemons = [];

//Función que se encarga de la comunicación con la API y el procesamiento de datos
function mostrarPokemon() {
    try {
        //Primera comnunicación con la API para obtener la lista de los primeros 20 Pokémon
        fetch("https://pokeapi.co/api/v2/pokemon/")
            .then(response => {
                //Verificamos que la respuesta del servidor es correcta
                if (!response.ok) {
                    throw new Error("Error en la petición");
                }
                return response.json(); //Convertimos la respuesta a formato JSON
            })
            .then(data => {
                // La API nos da un array en 'results', pero solo contiene nombres y URLs
                const listaResultados = data.results;

                // Para obtener imágenes y tipos, necesitamos ir a la URL específica de cada Pokémon.
                // Creamos un array de promesas (peticiones fetch) usando .map()
                const todasLasURL = listaResultados.map(elemento => {
                    return fetch(elemento.url)
                    .then(res => res.json());
                });
                // Promise.all espera a que TODAS las peticiones individuales se resuelvan
                // Esto es mucho más eficiente que pedir los Pokémon uno por uno
                return Promise.all(todasLasURL);
            })
            .then(data2 => {

                // Una vez tenemos los datos detallados (data2), "limpiamos" la información.
                // Mapeamos los datos gigantes de la API a un objeto sencillo que nosotros controlamos.
            
                const infoPokemon = data2;

                const pokemon = infoPokemon.map(elemento => {
                    return {
                        nombre: elemento.name,
                        id: elemento.id.toString(),//Aquí lo pasamos a string para poder compararlo luego en la función de busqueda
                        img: elemento.sprites.front_default,
                        // El tipo es un array, así que mapeamos para obtener solo el nombre del tipo
                        tipo: elemento.types.map(tipos => {
                            return tipos.type.name
                        })
                    }
                })
                // Guardamos los datos limpios en nuestra variable global
                pokemons = pokemon;

                // Llamamos a la función encargada de pintar los Pokémon en el HTML
                renderizarPokemon(pokemons);
            });
    } catch (error) {
        //Aquí capturamos cualquier error que se pueda producir
        console.error("Error:", error);
    };
}

//Función encargada de generar el HTML de forma dinámica
function renderizarPokemon(pokemons) {
    //Recorremos el array
    pokemons.forEach(pokemon => {

        //Creamos los elementos HTML
        const li = document.createElement("li");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const span = document.createElement("span");
        const p = document.createElement("p");

        //Asignamos la información a cada elemento HTML
        img.src = pokemon.img;
        h3.textContent = pokemon.nombre;
        span.textContent = pokemon.id;
        p.textContent = pokemon.tipo;

        //Usamos append para meter toodos los elementos a la vez en el elemento li
        li.append(h3, img, span, p);

        //Le añadimos la clase carta_pokemon a cada li
        li.classList.add("carta_pokemon");

        lista.appendChild(li);
    });
}

//Escuchamos el evento click en el botón de búsqueda
btnBuscador.addEventListener("click", ()=>{

    //Obtenemos el valor  del input de búsqueda y lo pasamos a minúsculas
    const valorBusqueda = buscador.value.toLowerCase();
    
    //Filtramos el array pokemons según el criterio del usuario y devolvemos el resultado
    const resultado = pokemons.filter(pokemon =>{return  pokemon.nombre.includes(valorBusqueda) || valorBusqueda === pokemon.id});

    //Limpiamos el conternido actual de la lista para que no se duplique
    lista.innerHTML="";

    //Y renderizamos el resulado
    renderizarPokemon(resultado);
});

//Ejecutamos la función por primera vez al cargar la página
mostrarPokemon();