const level = require("level");

const db = level("././data/wallet/UTXOPool", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});


module.exports = class UTXOHandler{

    constructor(){

    }

    UpdateUTXO(Transaction){
        //Validate the sender key and amount

        //Check if the receiver is present in the list
            //if yes - modify the coins present 
            //else  create a new field 

    }

    SaveData(key, amount){
        db.put(key, amount, (err)=>{
            if (err) console.log("error is ", err);
        });
        console.log("Success ");
    }

    GetUTXO(key){
        db.get(key, (err, data) =>{
            if(err) 
            console.log(data);
        });
    }

    GetUTXOList(){
        var utxo = [];
        db.createReadStream().on("data", (data) => {
            console.log(data);
            utxo.push(data);
        }).on("error", (err)=>{ console.log(err); 
        }).on("close", (data) => { console.log(data) 
        });
            return utxo;
    }

}