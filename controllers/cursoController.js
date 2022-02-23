const Curso = require('../database/models/Cursos');
const Usuario = require('../database/models/Usuarios');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.crearCurso = async(req,res)=>{
    // console.log(req.file, req.body);
    Curso.create({
        nombre: req.body.nombreCurso,
        horarioClaseEntrada: req.body.horarioClaseEntrada,
        horarioClaseSalida: req.body.horarioClaseSalida,
        duracionCurso: req.body.duracionCurso,
        unidadTiempo: req.body.unidadTiempo,
        fechaInicial: new Date(req.body.fechaInicial),
        fechaTerminacion: new Date(req.body.fechaTerminacion),
        descripcionCurso: req.body.descripcionCurso,
        idMaestro: req.body.maestro,
        rutaImagen: '/uploads/'+req.body.nombreImg, 

      })
      .then(() => {
        
        res.redirect('/cursos-talleres');
        
      })
      .catch(err => {
        //   console.log(err)
    })
}

exports.getCursos = async(req,res,next)=>{
    try{
        const cursos = await Curso.findAll();
        res.json(cursos);
    }catch(err){
        // console.log(err);
        next();
    }
}
exports.getCurso = async(req,res)=>{
    try{
        const curso = await Curso.findAll({
            where: {
                id: req.params.IdCurso
            }
        });
        const maestro = await Usuario.findAll({
            where: {
                id: curso[0].idMaestro
            }
        });
        
        let array = [{
            "id": curso[0].id,
            "rutaImagen": curso[0].rutaImagen,
            "nombre": curso[0].nombre,
            "descripcionCurso": curso[0].descripcionCurso,
            "duracionCurso": curso[0].duracionCurso,
            "unidadTiempo": curso[0].unidadTiempo,
            "fechaInicial": curso[0].fechaInicial,
            "fechaTerminacion": curso[0].fechaTerminacion,
            "horarioClaseEntrada": curso[0].horarioClaseEntrada,
            "horarioClaseSalida": curso[0].horarioClaseSalida,
            "idMaestro": curso[0].idMaestro,
            "maestro": maestro[0].nombre
        }];
        res.json(array);
    }catch(err){
        // console.log(err);
        next();
    }
}

exports.editarCurso = async(req,res,next)=>{
    await Curso.update(
        req.body,
        {where: {
          id: req.params.IdCurso
        }}
      )
      .then(function(rowsUpdated) {
        res.json(rowsUpdated)
      })
      .catch(next)
}

exports.eliminarCurso = async(req,res,next)=>{

    const curso = await Curso.findAll({
        where:{
            id: req.params.IdCurso
        }
    });

    await Curso.destroy({ 
        where:{id: req.params.IdCurso}
       })
      .then(async function(eliminado){
        if(curso[0].rutaImagen==null){
            // res.json("ya se borro");
            // console.log("ya se borro")
        }else{
            // const separado = post[0].urlImagenPost.split("/static/");
            // const path = "./public/"+separado[1];
            const path = "./public/"+curso[0].rutaImagen;
            try {
                
                var existe = fileExists(path);
                // res.json(existe);
                // res.json(existe);
                if(existe){
                    fs.unlinkSync(path)
                    // console.log("imagen Eliminado")
                    // res.json("imagen Eliminado");
                }else{
                    // res.json("no existia la imagen");
                    console.log("no existia la imagen")
                }
                res.redirect('/cursos-talleres');
                // res.redirect('/get-productos');
                
            } catch(err) {
                console.error(err)
            }
        }
      }).catch(next)
 
}
exports.editarImagenCurso = async(req,res,next)=>{

    // console.log(req.body.idProducto);
   console.log("se edito la imagen")
   res.redirect(`/editar-curso/${req.body.idProducto}`);
}

function fileExists(path) {
    try {
      if(fs.accessSync(path)) {
        
      }
      return true;
    } catch (e) {
      return false;
    }
  }