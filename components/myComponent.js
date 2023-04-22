export async function getdata() {
    let currentPokemonIndex = 0;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1281`);
        const data = await response.json();
        const pokemonDataElement = document.getElementById('pokemon-data');
        const pokemonInfoElement = document.createElement('div');
        pokemonDataElement.appendChild(pokemonInfoElement);

        async function showPokemonInfo() {
            try {
                let pokemon = null;
                let searchInput = document.getElementById('search-input').value.trim();

                if (searchInput !== '') {
                    const searchResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
                    pokemon = await searchResponse.json();
                } else {
                    pokemon = data.results[currentPokemonIndex];
                    const response = await fetch(pokemon.url);
                    pokemon = await response.json();
                }

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
        
        const prevButton = document.createElement('button');
        prevButton.innerHTML = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentPokemonIndex = Math.max(currentPokemonIndex - 1, 0);
            showPokemonInfo();
        });
        pokemonDataElement.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Siguiente';
        nextButton.addEventListener('click', () => {
            currentPokemonIndex = Math.min(currentPokemonIndex + 1, data.results.length - 1);
            showPokemonInfo();
        });
        pokemonDataElement.appendChild(nextButton);

        const searchContainer = document.createElement('div');
        const searchInput = document.createElement('input');
        const searchButton = document.createElement('button');

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);

        searchInput.placeholder = 'Buscar por nombre o ID';
        searchButton.innerText = 'Buscar';
        searchButton.addEventListener('click', showPokemonInfo);

        pokemonDataElement.insertBefore(searchContainer, pokemonDataElement.firstChild);

        showPokemonInfo();
    } catch (error) {
        console.error(error);
    }
}