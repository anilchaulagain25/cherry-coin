const secp256k1 = require("secp256k1");
const crypto = require("crypto");

const privKey;
const pubKey;

class Crypt{
    constructor(){
    }

    GenerateSignature(dataHash){

        var res = secp256k1.sign(hash, privKey).on("error", (error)=>{
            console.log(error);
        });

        return res.signature;
    }

    GenerateHash(data){
        //check for valid data
        var sha = crypto.createHash("SHA256");
        var hash = sha.update(data).digest("base64");
        return hash;
    }
}