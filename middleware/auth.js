const jwt = require('jsonwebtoken');
const URLMAGICCRM = require('../variableGlobal/config');
const PRIVATEKEY = URLMAGICCRM.PRIVATEKEY;

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('No autenticado no hay JWT');
        error.statusCode = 401;
        throw error;
    }
    //obtener el token y verificarlo
    // Authorization: Bearer 90130910930913013

    const token = authHeader.split(' ')[1]
    let revisarToken;
    try{
        // revisarToken = jwt.verify(token, 'LLAVESECRETAACCESO'); 
        revisarToken = jwt.verify(token, PRIVATEKEY); 
        console.log('revisarToken')
        console.log(revisarToken)
    }catch(error){
        error.statusCode=500;
        throw error;
    }
    //si es un token valido, pero hay algun error
    if(!revisarToken){
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }
    next();
}