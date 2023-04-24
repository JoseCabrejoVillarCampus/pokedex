export async function getdata() {
    let currentPokemonIndex = 0;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1281`);
        const data = await response.json();
        const pokemonDataElement = document.getElementById('pokemon-data');
        const pokemonInfoElement = document.createElement('div');
        pokemonDataElement.appendChild(pokemonInfoElement);

        async function showPokemonInfo(pokemon) {
            try {
                mostrarpokimos(pokemon);
            } catch (error) {
                console.error(error);
            }
        }

        function mostrarpokimos(pokemons) {
            const ws = new Worker("./storage/wsMyComponent.js", {
                type: "module"
            });

            //enviamos un mensaje el worker
            ws.postMessage({
                module: "showPoke",
                data: pokemons
            });
            let id = ["#pokemon-data"];
            let count = 0;
            //esto es lo que llega del worker
            ws.addEventListener("message", (e) => {

                //estamos parseando lo que trae el evento (mensaje)
                let doc = new DOMParser().parseFromString(e.data, "text/html");

                //insertamos en nuestro index, en el selector #pokemon-data
                document.querySelector(id[count]).append(...doc.body.children);

                //finalizamos el worker
                (id.length - 1 == count) ? ws.terminate(): count++;
            })

        }

        for (let pokemon of data.results) {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();
            showPokemonInfo(pokemonData);
        }
        const formulario = document.getElementById('formulario');
        const buscar = document.getElementById('buscar');

        formulario.addEventListener('click', async () => {
            const searchQuery = buscar.value.trim();

            if (searchQuery) {
                const searchResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
                const searchData = await searchResponse.json();
                pokemonDataElement.innerHTML = '';
                showPokemonInfo(searchData);
            } else {
                pokemonDataElement.innerHTML = '';
                for (let pokemon of data.results) {
                    const response = await fetch(pokemon.url);
                    const pokemonData = await response.json();
                    showPokemonInfo(pokemonData);
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
}