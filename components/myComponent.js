export async function getdata() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
        const data = await response.json();
        const pokemonDataElement = document.getElementById('pokemon-data');
        const pokemonInfoElement = document.createElement('div');
        pokemonDataElement.appendChild(pokemonInfoElement);

        async function showPokemonInfo(pokemon) {
            try {
                mostrarpokimos(pokemon);
                mostrarstats(pokemon);
            } catch (error) {
                console.error(error);
            }
        }

        function mostrarpokimos(pokemons) {
            const ws = new Worker("./storage/wsMyComponent.js", {
                type: "module"
            });

        ws.postMessage({
                    module: "showPoke",
                    data: pokemons
                });
            let id = ["#pokemon-data"];
                let count = 0;

            ws.addEventListener("message", (e) => {

                //estamos parseando lo que trae el evento (mensaje)
                let doc = new DOMParser().parseFromString(e.data, "text/html");

                //insertamos en nuestro index, en el selector #pokemon-data
                if(pokemons.sprites.other.dream_world.front_default)
                document.querySelector(id[count]).append(...doc.body.children);
                
                //finalizamos el worker
                /* (id.length - 1 == count) ? ws.terminate(): count++; */
            })
        }
        function mostrarstats(pokemons) {
            const WS = new Worker("./storage/wsMyComponent.js", {
                type: "module"
            });
            document.querySelector("#btnStates").addEventListener("click", (e)=>{
                document.querySelector(id[count]).innerHTML = ""
                WS.postMessage({
                    module: "showStats",
                    data: pokemons
                });
            })
            let id = ["#pokemon-data"];
                let count = 0;

            WS.addEventListener("message", (e) => {

                //estamos parseando lo que trae el evento (mensaje)
                let doc = new DOMParser().parseFromString(e.data, "text/html");

                document.querySelector(id[count]).append(...doc.body.children);
                
                //finalizamos el worker
                /* (id.length - 1 == count) ? WS.terminate(): count++; */
            })
        }

        let offset = 0;

        const cargarDatos = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
                const data = await response.json();
                const pokemonDataElement = document.getElementById('pokemon-data');
                pokemonDataElement.innerHTML = ''; // Eliminar los resultados anteriores

                for (let pokemon of data.results) {
                    const response = await fetch(pokemon.url);
                    const pokemonData = await response.json();
                    showPokemonInfo(pokemonData);
                }
            } catch (error) {
                console.error(error);
            }
        }

        const anterior = document.getElementById('but1');
        anterior.addEventListener('click', async () => {
            offset -= 20; // Actualizar el offset
            await cargarDatos();
        });

        const siguiente = document.getElementById('but');
        siguiente.addEventListener('click', async () => {
            offset += 20; // Actualizar el offset
            await cargarDatos();
        });

        // Cargar los primeros 20 resultados al cargar la página
        cargarDatos();

        /* const stats= document.querySelector('#pokemon-data')
        stats.addEventListener('click',async()=>{

        }) */

        let formulario = document.getElementById('formulario')
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            let data1 = Object.fromEntries(new FormData(e.target));
            let nuestro = data1.buscar;
            formulario.reset()

            if (nuestro) {
                const searchResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nuestro}`);
                const searchData = await searchResponse.json();
                pokemonDataElement.innerHTML = '';
                showPokemonInfo(searchData);
            } else {
                pokemonDataElement.innerHTML = '';
                for (let pokemon of data.results) {
                    const response = fetch(pokemon.url);
                    const pokemonData = response.json();
                    showPokemonInfo(pokemonData);
                }
            }
        });

        let formularioTipo = document.getElementById('formularioTipo')
        formularioTipo.addEventListener('submit', async (e) => {
            e.preventDefault();
            let data2 = Object.fromEntries(new FormData(e.target));
            let tipo = data2.buscar1;
            formularioTipo.reset()

            if (tipo) {
                const searchResponse1 = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
                const searchData1 = await searchResponse1.json();
                const pokemonList = searchData1.pokemon.map(p => p.pokemon.name);
                pokemonDataElement.innerHTML = '';
                for (let pokemon of searchData1.pokemon) {
                    const response = await fetch(pokemon.pokemon.url);
                    const pokemonData2 = await response.json();
                    showPokemonInfo(pokemonData2);
                }
                console.log(pokemonList);
                showPokemonInfo(pokemonData2);
            } else {
                pokemonDataElement.innerHTML = '';
                for (let pokemon of data.results) {
                    const response = fetch(pokemon.url);
                    const pokemonData1 = response.json();
                    showPokemonInfo(pokemonData1);
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
}