
const ur = 'https://pokeapi.co/api/v2/pokemon/'

const pintarAll = async (poke)=>{
    try {
        const data = await fetch(`${ur}${poke}`)
        const result = await data.json();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}


pintarAll(2)



