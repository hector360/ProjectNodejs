const Usuarios = require('../database/models/Usuarios');
const Producto = require('../database/models/Producto');
const Cursos = require('../database/models/Cursos');

exports.getPrincipal = async(req,res, next)=>{
    try{
        
        const usuarios = await Usuarios.findAll();
        const productos = await Producto.findAll();
        const cursos = await Cursos.findAll();

        var datos = {
            "totalUsuarios": usuarios.length,
            "totalProductos": productos.length,
            "totalCursos": cursos.length
        }
        res.json(datos);
    }catch(err){
        // console.log(err);
        next();
    }
}