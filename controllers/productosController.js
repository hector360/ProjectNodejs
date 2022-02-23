
const Producto = require('../database/models/Producto');
const TipoProducto = require('../database/models/TipoProducto');
const CaracteristicasProducto = require('../database/models/CaracteristicasProducto');
const Tallas = require('../database/models/TallaProduct');
const Colores = require('../database/models/ColorProduct');
const fs = require('fs');
const funcionesProductos = require('../functions/funcionesProductos');

exports.crearProducto = async(req,res,next)=>{
    console.log(req.body)
    var slug = generarSlug(req.body.nombreProducto);
    await Producto.create({
        nombreProducto: req.body.nombreProducto,
        urlImagenPost: '/uploads/'+req.body.nombreImg,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        idTipoProducto: req.body.tipoProducto,
        temporada: req.body.temporada,
        slug: slug,
        precio_ninos: req.body.precioNino
      }).then(function(producto){
        // console.log(producto)
        res.redirect('/get-productos');
      }).catch(next);
    
}

exports.crearTipoProducto = async(req,res, next)=>{
    var nombreSimple = generarNombreImg(req.body.nombreTipoProducto)
    var urlTipoProducto = nombreSimple;
    await TipoProducto.create({
        nombre: req.body.nombreTipoProducto,
        urlImagenPost: '/uploads/'+req.body.nombreImg,
        descripcion: req.body.descripcion,
        urlTipoProducto: urlTipoProducto,
      }).then(function(producto){
        // console.log(producto)
        res.redirect('/get-productos');
      }).catch(next);
}

exports.getTipoProducto = async(req,res,next)=>{
    try{
        // const posts = await Posts.find();
        const tipoProducto = await TipoProducto.findAll();
        res.json(tipoProducto);
    }catch(err){
        // console.log(err);
        next();
    }
}


exports.getProductos = async(req,res, next)=>{
    try{
        //"TodosProductos"
        // console.log(req.body.pagina)
        // console.log(req.body.tipoProducto)
        var tipoProducto = req.body.tipoProducto;
        var pagina = req.body.pagina;
        var cantidadP = req.body.cantidadP;
       
        var productosTotales = pagina * cantidadP;
        // console.log("cantidadP: ",pagina)
        if(tipoProducto == "TodosProductos"){
            // var tipoProducto = await TipoProducto.findAll();
            // tipoProducto.map(async (tp)=>{
                
                // var productos = await Producto.findAll({
                //     where: {
                //         idTipoProducto: tp.id
                //     }
                // });
            // });

            var productos = await Producto.findAll();
            // productos = productos.sort() 
            
        }else{
            // console.log("tipoProducto: ",tipoProducto)
            var productos = await Producto.findAll({
                where: {
                    idTipoProducto: tipoProducto
                }
            });
        }
      

      var valorResta = productosTotales - productos.length;
      var totalCiclo;
      if(valorResta > 0){
          totalCiclo = productos.length;
      }else if(valorResta <= 0){
          totalCiclo = productosTotales;
      }
      const array = [];
      for(var i = 0; i < totalCiclo; i++){
          if(productos[i].slug != "horas-indefinidas"){
                array.push({
                    "createdAt": productos[i].createdAt,
                    "descripcion": productos[i].descripcion,
                    "id": productos[i].id,
                    "idTipoProducto": productos[i].idTipoProducto,
                    "nombreProducto": productos[i].nombreProducto,
                    "precio": productos[i].precio,
                    "updatedAt": productos[i].updatedAt,
                    "urlImagenPost": productos[i].urlImagenPost,
                    "totalDatos": productos.length,
                    "pagina": pagina,
                    "urlMercadoShop": productos[i].urlMercadoShop,
                    "slug": productos[i].slug,
                    "urlImagenMovil": productos[i].urlImagenMovil,
                    
                })
          }
          
      }  

        // const productos = await Producto.findAll();

        res.json(array);
        // res.json(tipoProducto);
    }catch(err){
        // console.log(err);
        next();
    }
}
exports.getProductosMixtos = async(req,res,next)=>{
    
    var tipoP = await TipoProducto.findAll();
    var maximoTipoProductos = tipoP.length + 1;
    var array = [];
    for(var i = 1; i < maximoTipoProductos; i++){
        var producto = await Producto.findAll({
            where:{
                idTipoProducto: i
            }
        });
        // array.push(producto[0])
        array.push({
            "id": producto[0].id,
            "nombreProducto": producto[0].nombreProducto,
            "urlImagenPost": producto[0].urlImagenPost,
            "descripcion": producto[0].descripcion,
            "precio": producto[0].precio,
            "idTipoProducto": producto[0].idTipoProducto,
            "tipoProducto": tipoP[i-1].nombre,
            "createdAt": producto[0].createdAt,
            "updatedAt": producto[0].updatedAt,
            "urlMercadoShop": producto[0].urlMercadoShop,
            "urlImagenMovil": producto[0].urlImagenMovil,
        })
    }
    res.json(array);
    
    // res.json(tipoP[0].id);

}
exports.getProductosEspecificos = async(req,res,next)=>{
    var product = Producto;
    var carProduct = CaracteristicasProducto;
    var tallas = Tallas;
    var colores = Colores;

    product.hasMany(carProduct, { foreignKey: 'id_producto' });
    carProduct.belongsTo(product, { foreignKey: 'id_producto' });    
    
    tallas.hasMany(carProduct, { foreignKey: 'id_talla' });
    carProduct.belongsTo(tallas, { foreignKey: 'id_talla' });

    colores.hasMany(carProduct, { foreignKey: 'id_color' });
    carProduct.belongsTo(colores, { foreignKey: 'id_color' });

    var tipoProducto = await TipoProducto.findAll({
        where:{
           urlTipoProducto: req.body.urltipoProducto
        }
    });
     await product.findAll({
         include: [{
             model: carProduct,
             include: [tallas, colores],
             attributes: ['id', 'id_talla', 'id_color'],             
         }],
        where:{
            idTipoProducto: tipoProducto[0].id
        }
    }).then((producto)=>{

        var array = [];
        
        producto.map((p)=>{
           
        //    console.log(precio_format)
            if(p.slug != "membresia-visitante" && p.slug != "horas-indefinidas"){
                let precio_format = formatearNumero(p.precio)
                let tallas = []
                p.caracteristicas_productos.map((c) => {
                    var found = tallas.find(talla => talla.id_size == c.id_talla); 
                    if (!found){
                        let colores = [];
                        p.caracteristicas_productos.map((c1) => {                                                        
                            if (c1.id_talla == c.id_talla){
                                colores.push({
                                    id_color: c1.id_color,
                                    color_label: c1.color_product.color
                                });
                            }
                        });

                        tallas.push({
                            id: c.id,
                            id_size: c.id_talla,
                            size_label: c.talla_product.talla,
                            colores: colores
                        });
                    }
                });
       
                array.push({
                    "createdAt": p.createdAt,
                    "descripcion": p.descripcion,
                    "id": p.id,
                    "idTipoProducto": p.idTipoProducto,
                    "nombreProducto": p.nombreProducto,
                    "precio": p.precio,
                    "updatedAt": p.updatedAt,
                    "urlImagenPost": p.urlImagenPost,
                    "temporada": p.temporada,
                    "tipoProducto": tipoProducto[0].nombre,
                    "urlMercadoShop": p.urlMercadoShop,
                    "slug": p.slug,
                    "urlImagenMovil": p.urlImagenMovil,
                    "precio_format": precio_format,
                    "tallas": tallas
                })
            }
        }) 
        res.json(array);
    });
    
    
}
exports.getProductosApi = async(req,res, next)=>{
    try{
        
            
            var productos = await Producto.findAll();
        

        res.json(productos);
        // res.json(tipoProducto);
    }catch(err){
        // console.log(err);
        next();
    }
}


exports.getProducto = async(req,res, next)=>{
    try{
        const producto = await Producto.findAll({
            where: {
                slug: req.params.IdProducto
            }
        });
        const tipoProducto = await TipoProducto.findAll({
            where: {
                id: producto[0].idTipoProducto
            }
        });

        const array = [{
            "nombreProducto": producto[0].nombreProducto,
            "descripcion": producto[0].descripcion,
            "id": producto[0].id,
            "tipoProducto": tipoProducto[0].urlTipoProducto,
            "precio": producto[0].precio,
            "urlImagenPost": producto[0].urlImagenPost,
            "createdAt": producto[0].createdAt,
            "urlImagenMovil": producto[0].urlImagenMovil,
            "slug": producto[0].slug,
        }]; 
        res.json(array);
    }catch(err){
        // console.log(err);
        next();
    }
}

exports.editarProducto = async(req,res,next)=>{
    await Producto.update(
        req.body,
        {where: {
          id: req.params.IdProducto
        }}
      )
      .then(function(rowsUpdated) {
        res.json(rowsUpdated)
      })
      .catch(next)
}

exports.editarImagenProducto = async(req,res,next)=>{

    // console.log(req.body.idProducto);
   console.log("se edito la imagen")
   res.redirect(`/editar-productos/${req.body.idProducto}`);
  }

exports.eliminarProducto = async(req,res,next)=>{

        const producto = await Producto.findAll({
            where:{
                id: req.params.IdProducto
            }
        });

        await Producto.destroy({ 
            where:{id: req.params.IdProducto}
           })
          .then(async function(eliminado){
            if(producto[0].urlImagenPost==null){
                // res.json("ya se borro");
                console.log("ya se borro")
            }else{
                // const separado = post[0].urlImagenPost.split("/static/");
                // const path = "./public/"+separado[1];
                const path = "./public/"+producto[0].urlImagenPost;
                try {
                    
                    var existe = fileExists(path);
                    // res.json(existe);
                    // res.json(existe);
                    if(existe){
                        fs.unlinkSync(path)
                        console.log("imagen Eliminado")
                        // res.json("imagen Eliminado");
                    }else{
                        // res.json("no existia la imagen");
                        console.log("no existia la imagen")
                    }
                    res.redirect('/mostrar-posts');
                    // res.redirect('/get-productos');
                    
                } catch(err) {
                    // console.error(err)
                }
            }
          }).catch(next)
     
  }

  exports.getProductosCarro = async(req,res,next)=>{
        var membresias = await funcionesProductos.getProductofromTipoProduct(6);
        var tarjetas = await funcionesProductos.getProductofromTipoProduct(7);
        var cumpleaños = await funcionesProductos.getProductofromTipoProduct(8);
        var entrada = await funcionesProductos.getProductofromTipoProduct(9);
        var calcetines = await funcionesProductos.getProductofromTipoProduct(13);
        var arrayTodosPod = {
            membresias,
            tarjetas,
            cumpleaños,
            entrada: entrada[0],
            calcetines
        }
        res.json(arrayTodosPod);
    
  }
  exports.getProductoDetalle = async(req,res,next) => {
    var producto = await funcionesProductos.getProductoFromSlug(req.params.slug);
    res.json(producto);
  }
  function formatearNumero(numero){
    var n = new Number(numero);
    var myObj = {
      style: "currency",
      currency: "MXN"
    }
    return n.toLocaleString("mxn", myObj);
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
  

  function generarNombreImg(titulo){
    var sinEspacios = titulo.replace(/\s/g, '');
    sinEspacios = sinEspacios.toLowerCase();
    return sinEspacios;
}
function generarSlug(titulo){
    // var sinEspacios = titulo.replace(/\s/g, '');
    var sinEspacios =  titulo.replace(/\s/g, "-");
    sinEspacios = sinEspacios.toLowerCase();
    return sinEspacios;
}