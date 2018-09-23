const level = require("level");


const Response = function () {
    this.success = false;
    this.data;
    this.msg;
}


class UTXOHandler{

    constructor(){
        this.db = level("././data/wallet/UTXOPool", {valueEncoding : "json"}, (err) => {
            if(err) console.log(err);
        });
    }

    UpdateUTXO(Transaction){
        //Validate the sender key and amount

        //Check if the receiver is present in the list
            //if yes - modify the coins present 
            //else  create a new field 

        }

        SaveData(key, amount){
        if(this.db.isClosed()) this.db.open();
            this.db.put(key, amount, (err)=>{
                if (err) console.log("error is ", err);
                this.db.close();
            });
            console.log("Success");
        }

    // GetUTXO(key){
    //         this.db.get(key, (err, data) =>{
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
        if(this.db.isClosed()) this.db.open();
            this.db.get(key, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
                this.db.close();
            });
        })
    }

    GetUTXOList(){
        var utxo = [];
        return new Promise((resolve, reject) =>{
        if(this.db.isClosed()) this.db.open();
            this.db.createReadStream().on("data", (data) => {
                utxo.push(data);
            }).on("error", (err)=>{ {
                reject(err);
                this.db.close();
            }; 
            }).on("end", (data) => { 
                resolve(utxo);
                this.db.close();
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

module.exports = UTXOHandler;

// var utxo = new UTXOHandler();
// var key = "BM09qzxp0DimjPyvb1OldbOB+qtNwaIgdEx9PJZhWjLg2oXL9SLgjNJ/vF/PrAtQWY2rWAN6UL15kaBS6DWHR78=";
// var key1 = "BFo00n7Qxepg5klo1n+EDOOpgMZTEspKYG7J9W1m1otjs01U+7hZHt6UxSmiPEvqz4KDDckB7zFVWN5rsthkjK4=";
// var data = utxo.GetUTXO(key1);
// var list = utxo.GetUTXOList();
// // console.log(list.then((data)=> console.log(data)));
// console.log(data);