export default{


    showFirstData(){

        let setoff = 0;
        const ws = new Worker("./../storage/ws.js", {type:"module"});
        ws.postMessage({accion:"showData",body:setoff});
        ws.addEventListener("message",(e)=>{
            document.querySelector('#pokemon-data').innerHTML = e.data;
        })

    }



}