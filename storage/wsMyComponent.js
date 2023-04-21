let wsMyComponent ={
    showPoke(p1){
        return`
            <div id="card-pokemon">
            <h3>${p1.name}</h3>
            <img src="${p1.sprites.other.dream_world.front_default}" alt="${p1.name}">
            <p></p>
            <p>First Type: ${p1.types[0].type.name}</p>
            <p>Height: ${p1.height}</p>
            <p>Weight: ${p1.weight}</p>
            </div>
        `
    }
}


self.addEventListener("message",(e)=>{
    postMessage(wsMyComponent[`${e.data.module}`](e.data.data));
})