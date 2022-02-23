
const Puntuaciones = require('../database/models/Puntuaciones');


exports.cambiarPuntuacion = async(req,res)=>{
    await Puntuaciones.findOne({
        where:{
            id_nino: req.body.id_nino,
        }
    }).then(async puntuacion => {
        if(puntuacion == null){
            try{
                // let nuevaPuntuacion = await crearPuntuacion(req.body.record,req.body.puntuacion,req.body.id_nino);
                let nuevaPuntuacion = await crearPuntuacion(req.body.puntuacion,req.body.puntuacion,req.body.id_nino);
                res.status(400).json(nuevaPuntuacion);
            }catch(error){
                console.log("error al crear la puntuación")
                console.log(error);
                res.status(500).json(error);
            }
            
        }else{
            
            try{
                // let nuevaPuntuacion = await crearPuntuacion(req.body.record,req.body.puntuacion,req.body.id_nino);
                
                
                let puntuacionActualizada = await actualizarPuntuacion(puntuacion, req.body.puntuacion, req.body.id_nino);
                res.status(400).json(puntuacionActualizada);
            }catch(error){
                console.log("error al crear la puntuación")
                console.log(error);
                res.status(500).json(error);
            }
        }
        
    });
    
    
}

async function crearPuntuacion(record,puntuacion,id_nino){
    return await Puntuaciones.create({
        record: record,
        puntuacion: puntuacion,
        id_nino: id_nino,
    }).then(puntuacion => {
        return puntuacion;
    });
}
async function actualizarPuntuacion(puntuacion,nuevaPuntuacion, idNino){
    console.log(puntuacion.dataValues)
    if(puntuacion.dataValues.record > nuevaPuntuacion){
        var datos = {
            puntuacion: nuevaPuntuacion
        }
    }else{
        var datos = {
            record: nuevaPuntuacion,
            puntuacion: nuevaPuntuacion
        }
    }
    return await Puntuaciones.update(
        datos,
        {
          where: {
            id_nino: idNino,
          },
        }
      ).then(rowsUpdated=> {
        return rowsUpdated;
    })
}

