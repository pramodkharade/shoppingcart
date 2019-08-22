const fs = require('fs');

const deleteFile  = (filepath)=>{
    fs.unlink(filepath,(error)=>{
        if(error){
            throw(error);
        }
    });

};
exports.deleteFile = deleteFile;
