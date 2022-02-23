const moment = require('moment');

exports.pruebaMoment = async(req,res,next)=>{
    console.log(moment().format())
    res.json({
        entrada: moment().format(),
        salida: moment().add(30, 'days').format()     
    })
}