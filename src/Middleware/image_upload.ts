const path = require('path')

const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        const destinationPath = path.join(__dirname, '../../Images');
        callback(null, destinationPath);
    },
    filename:(req,file,callback)=>{
        console.log(file,"multer");
        
        callback(null,Date.now()+path.extname(file.originalname))
    }
})

export const upload = multer({storage:storage});