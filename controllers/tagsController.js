const Tags = require('../database/models/Tags');

exports.createTags = async(req,res)=>{
    await Tags.create({
        nombre: req.body.nombreTag,
    	urlImagen: '/uploads/'+req.body.nombreImg
    })
    .then(tag =>{
        res.redirect('/mostrar-tags');
        // res.json(tag)
    })
    .catch(err => console.log(err))
}


exports.getTags = async(req,res)=>{
    try{
        // const posts = await Posts.find();
        const tags = await Tags.findAll();
        res.json(tags);
    }catch(err){
        // console.log(err);
        next();
    }
}

exports.getCategoriasWithId = async(req,res,next)=>{
    try{
        // const posts = await Posts.find();
        // comida
        // fotografia
        // juegos
        // musica
        // viajes
        // deportes
        const tags = await Tags.findAll();
        let array = [];
        tags.map(function(categoria){
            if(categoria.id == 1 || categoria.id == 2 || categoria.id == 3 || categoria.id == 4 || categoria.id == 5 || categoria.id == 6){
                array.push(categoria)
            }
            
        })
        res.json(array);
    }catch(err){
        // console.log(err);
        next();
    }
}
