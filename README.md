# gestionPokeAPI
gestión de la pokeAPI

1. Comprensión de la API

¿Qué tipo de datos ofrece?
La PokéAPI ofrece una base de datos exhaustiva sobre el mundo Pokémon, incluyendo nombres, tipos, habilidades, estadísticas, movimientos y recursos visuales (sprites) de más de 1000 criaturas.

¿Es necesario obtener una clave de API (API Key)?
No, es una API abierta y gratuita de uso público que no requiere autenticación ni el uso de una API Key para realizar consultas.

¿Cómo se estructura una solicitud a la API?

Método HTTP: GET.

URL Base: https://pokeapi.co/api/v2/

Parámetros comunes: Los recursos individuales se acceden mediante el nombre o el ID del Pokémon (ej: /pokemon/{id o nombre}).

2. Descripción del Proyecto

Esta aplicación web es una interfaz interactiva que permite a los usuarios visualizar una lista de los primeros 20 Pokémon. La aplicación consume datos en tiempo real de la PokéAPI y presenta cada Pokémon en una "tarjeta" que incluye su ID, nombre, imagen y sus tipos elementales. Además, cuenta con un sistema de búsqueda dinámica que permite filtrar los resultados por nombre o ID.

3. Detalles Técnicos

URL de la API utilizada: https://pokeapi.co/api/v2/pokemon/

Ejemplo de una consulta de prueba:

Para obtener la lista inicial: https://pokeapi.co/api/v2/pokemon/ , por defecto te muestra los primeros 20 Pokémon.

Para obtener detalles de un Pokémon específico (Pikachu): https://pokeapi.co/api/v2/pokemon/25

4. Problemas Encontrados y Soluciones

Problema de la Información Incompleta: Al realizar la primera petición (fetch) a la lista de Pokémon, la API solo devolvía el nombre y una URL de cada uno, pero no las imágenes ni los tipos.

Solución: Implementé un "doble fetch" utilizando Promise.all(). Primero obtengo la lista y luego, de forma asíncrona, realizo peticiones individuales a las URLs de detalle de cada Pokémon para obtener toda su información antes de renderizar.

Sincronización de Datos Asíncronos: Al principio, la página intentaba mostrar los datos antes de que las imágenes hubieran terminado de cargar.

Solución: Utilicé el encadenamiento de promesas (.then()) para asegurar que la función de renderizado solo se ejecute una vez que el array global de Pokémon esté completamente lleno y procesado.

Filtrado por ID y Nombre: El buscador no encontraba resultados si se escribía en mayúsculas o si se buscaba por ID, ya que los tipos de datos no coincidían.

Solución: Utilicé el método .toLowerCase() para normalizar la búsqueda y transformé los IDs a texto para que la comparación fuera efectiva. También cambié la comparación estricta por el método .includes() para permitir búsquedas parciales.
