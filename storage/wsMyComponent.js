const wsMyComponent ={
    showPoke(p1){
        return`
            <div id="card-pokemon">
            <h3>${p1.name}</h3>
            <p>Id:# ${p1.id}</p>
            <img src="${p1.sprites.other.dream_world.front_default}" alt="${p1.name}">
            <p>First Type: ${p1.types[0].type.name}</p>
            <p>Height: ${p1.height}</p>
            <p>Weight: ${p1.weight}</p>
            </div>
            
        `
    },
    showStats(p1){
        return`
        <div id="card-pokemon">
        <h3>Stats</h3>
        <p>${p1.stats[0].stat.name} : ${p1.stats[0].base_stat}</p>
        <p>${p1.stats[1].stat.name} : ${p1.stats[1].base_stat}</p>
        <p>${p1.stats[2].stat.name} : ${p1.stats[2].base_stat}</p>
        <p>${p1.stats[3].stat.name} : ${p1.stats[3].base_stat}</p>
        <p>${p1.stats[4].stat.name} : ${p1.stats[4].base_stat}</p>
        `
    },
    showAll(p1) {
        const pokeHtml = this.showPoke(p1);
        const statsHtml = this.showStats(p1);
        return pokeHtml + statsHtml;
    }

}
self.addEventListener("message",(e)=>{
    postMessage(wsMyComponent[`${e.data.module}`](e.data.data));
})