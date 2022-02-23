const funcionesProductosCafeteria = require('../functions/funcionesProductosCafeteria');

exports.createProductoCafeteria = async (req,res,next) => {

    const productoC = await funcionesProductosCafeteria.createProductoCafeteria(req.body);
    res.json(productoC);
}

exports.getProductosCafeteriaPE = async (req,res,next) =>{
    const productosCEspectaculos = await funcionesProductosCafeteria.getProductosCE(req.params.tipo_producto);
    res.json(productosCEspectaculos)
}