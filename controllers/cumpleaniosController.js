const funcionesCumpleanios = require('../functions/funcionesCumpleanios');

exports.createCumpleanios = async(req,res,next) => {

}

exports.verificarFecha = async(req,res,next) => {
    console.log(req.body.fechaCumpleanios)
    console.log(req.body.horaCumpleanios)
    var fechaVerificada = await funcionesCumpleanios.verificarFecha(req.body.fechaCumpleanios, req.body.horaCumpleanios)
    if(fechaVerificada == null){
        var response = {
            status: "disponible"
        }
    }else{
        var response = {
            status: "ocupado"
        }
    }
    res.json(response);
}