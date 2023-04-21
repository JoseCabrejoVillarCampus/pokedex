let currentPokemonIndex = 0;


async function getdata() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1281`);
        const data = await response.json();
        const pokemonDataElement = document.getElementById('pokemon-data');
        const pokemonInfoElement = document.createElement('div');
        pokemonDataElement.appendChild(pokemonInfoElement);

        async function showPokemonInfo() {
            try {
                const pokemon = data.results[currentPokemonIndex];
                const response = await fetch(pokemon.url);
                const pokemonData = await response.json();
                mostrarpokimos(pokemonData);
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

                //insertamos en nuestro index, en el selector #pingPongItems
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

        showPokemonInfo();
    } catch (error) {
        console.error(error);
    }

}

getdata();

// Const name = pokemonData.name;
//                     const type = pokemonData.types[0].type.name;
//                     const imageUrl = pokemonData.sprites.other.dream_world.front_default;
//                     const height = pokemonData.height;
//                     const weight = pokemonData.weight;
//                     pokemonInfoElement.innerHTML = `
//             <h3>${name}</h3>
//             <img src="${imageUrl}" alt="${name}">
//             <p></p>
//             <p>First Type: ${type}</p>
//             <p>Height: ${height}</p>
//             <p>Weight: ${weight}</p>
//             `;