const level = require("level");


const db = level("././data/wallet/UTXOPool", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});

const Response = function () {
    this.success = false;
    this.data;
    this.msg;
}


class UTXOHandler{

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
        console.log("Success");
    }

    // GetUTXO(key){
    //         db.get(key, (err, data) =>{
    //             console.log(data);
    //     // debugger;   

    //     //         if(err) {
    //     //             console.log(err);
    //     //             debugger;   
    //     //             return err;
    //     //         }
    //     //         else return data;
    //         });
    // }


    GetUTXO(key){
        return new Promise((resolve, reject)=>{
            db.get(key, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
            });
        })
    }

    GetUTXOList(){
        var utxo = [];
        return new Promise((resolve, reject) =>{
            db.createReadStream().on("data", (data) => {
                utxo.push(data);
            }).on("error", (err)=>{ reject(err); 
            }).on("end", (data) => { resolve(utxo);
            });
        }).catch((err) => {
            console.error(err)
        })
    }

    // CheckAvailableOutputSikka(key, amount){
    //     key = "BFo00n7Qxepg5klo1n+EDOOpgMZTEspKYG7J9W1m1otjs01U+7hZHt6UxSmiPEvqz4KDDckB7zFVWN5rsthkjK4="; //xx
    //     var response = new Response;
    //     this.GetUTXO(key).then((blnc) => {
    //         if (blnc > amount) {
    //             response.success = true;
    //         }else{
    //             response.msg = "Insufficient Source Sikka(s)";
    //         }
    //         return response;
    //     }).catch((err) => {
    //         console.error(err);
    //         response.msg = err;
    //         return response;
    //     });
    // }

}

module.exports = new UTXOHandler();

// var utxo = new UTXOHandler();
// var key = "BM09qzxp0DimjPyvb1OldbOB+qtNwaIgdEx9PJZhWjLg2oXL9SLgjNJ/vF/PrAtQWY2rWAN6UL15kaBS6DWHR78=";
// var key1 = "BFo00n7Qxepg5klo1n+EDOOpgMZTEspKYG7J9W1m1otjs01U+7hZHt6UxSmiPEvqz4KDDckB7zFVWN5rsthkjK4=";
// var data = utxo.GetUTXO(key1);
// var list = utxo.GetUTXOList();
// // console.log(list.then((data)=> console.log(data)));
// console.log(data);