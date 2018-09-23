const fs=require('fs');
const ERROR_LOGGER_FILE="EXCEPTION.TXT"; 


const lineBreaker="\r\n";

var logException=(error)=>{
    
    var msg=`${lineBreaker+lineBreaker}
    ************${new Date().toLocaleString()}*************${lineBreaker}
    ${error||'NO ANY ERROR MESSAGE TO LOG'}${lineBreaker}
    *******************************************************`;
    fs.appendFile(ERROR_LOGGER_FILE, msg, function (err) {
        if (err) throw err;
    });
};

var log = (severity, system_msg, user_msg, supress, ...args) => {
    if (!severity) {return;}
    if(!supress){
        //msg to user
    }
	let msg=`${lineBreaker+lineBreaker}
    ************${new Date().toLocaleString()} :: ${severity}  *************${lineBreaker}
    ${system_msg||'NO ANY ERROR MESSAGE TO LOG'}
    ${user_msg||'NO ANY ERROR MESSAGE TO LOG'}
    	* ${args.toString()}${lineBreaker}
    *******************************************************`;
    fs.appendFile(ERROR_LOGGER_FILE, msg, function (err) {
        if (err) throw err;
    });
}

module.exports={logException, log};
