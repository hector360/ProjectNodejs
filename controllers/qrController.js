
const QrCode = require('../database/models/QrCode');
const { encrypt, decrypt } = require('../functions/crpyto');

exports.createQrCode = async(req,res)=>{
    // console.log(req.file, req.body);
    const idCurso = req.body.idCurso;
    const nombreCurso = req.body.nombreCurso;
    const idUsuario = req.body.idUsuario;


    const hash = encrypt(`idCurso=${idCurso}&nombreCurso=${nombreCurso}&idUsuario=${idUsuario}`);
    const text = decrypt(hash);
    // console.log(hash);
    // console.log(text);

   // el iv y el content servira para crear la ruta
    try{

    }catch(err){
        // console.log(err);
    }
   const qrCode = await QrCode.create({
        
        idCurso: req.body.idCurso,
        nombreCurso: nombreCurso.trim(),
        idUsuario: req.body.idUsuario,
        iv: hash.iv,
        content: hash.content,

    })
    res.json({
        "iv": qrCode.iv,
        "content": qrCode.content
    });
}

exports.traerQrCode = async(req,res)=>{
    // console.log(req.file, req.body);
    const urlQrCode = req.params.urlQrCode;
    
    
    const nuevoUrlQrCode = urlQrCode.split("!!!")
    var hash = {
        "iv": nuevoUrlQrCode[0],
        "content": nuevoUrlQrCode[1]
    }
    const text = decrypt(hash);
    res.json(text);
}

