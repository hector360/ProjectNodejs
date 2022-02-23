const Posts = require("../database/models/Posts");
const ParrafoPost = require("../database/models/ParrafoPost");
const SubPosts = require("../database/models/SubPosts");
const ParrafoSubPosts = require("../database/models/ParrafoSubPosts");
const { getPostBySlug } = require("../repository/postsRepository");
const fs = require("fs");

exports.getPostSlug = async (req, res, next) => {
  const slug = req.params.slug;

  const resp = await getPostBySlug(slug);
  if (res.isBoom) next(res);

  res.status(200).json({
    status: res.statusCode,
    message: resp,
  });
};

exports.getPosts = async (req, res, next) => {
  try {
    // const posts = await Posts.find();
    const posts = await Posts.findAll();
    res.json(posts);
  } catch (err) {
    // console.log(err);
    next();
  }
};

exports.getPost = async (req, res, next) => {
  try {
    // const posts = await Posts.find({_id: req.params.IdPosts});
    const posts = await Posts.findAll({
      where: {
        id: req.params.IdPosts,
      },
    });
    res.json(posts);
  } catch (err) {
    // console.log(err);
    next();
  }
};

exports.getSubPosts = async (req, res, next) => {
  try {
    const subPosts = await SubPosts.findAll({
      where: {
        idPost: req.params.IdPosts,
      },
    });
    res.json(subPosts);
  } catch (err) {
    // console.log(err);
    next();
  }
};

exports.getParrafosPosts = async (req, res, next) => {
  try {
    // const parrafoPost = await ParrafoPost.find({IdPost: req.params.IdPosts});
    const parrafoPost = await ParrafoPost.findAll({
      where: {
        IdPost: req.params.IdPosts,
      },
    });
    res.json(parrafoPost);
  } catch (err) {
    // console.log(err);
    next();
  }
};

exports.getParrafosSubPosts = async (req, res, next) => {
  try {
    const parrafoSubPosts = await ParrafoSubPosts.findAll({
      where: {
        idSubPosts: req.params.IdSubPosts,
      },
    });
    res.json(parrafoSubPosts);
  } catch (err) {
    // console.log(err);
    next();
  }
};

exports.crearPosts = async (req, res, next) => {
  // var nombreImg = req.body.nombreImg;
  // nombreImg = nombreImg.toString();
  // var nuevoNombreImg = nombreImg.replace(/\s/g, '');
  Posts.create({
    titulo: req.body.titulo,
    urlImagenPost: "/uploads/" + req.body.nombreImg,
    idTag: req.body.tag,
  })
    .then((posts) => {
      // res.json(posts)
      var parrafos = req.body.descripcion.split("%-%");

      parrafos.map(async function (parrafo) {
        if (parrafo != "") {
          await ParrafoPost.create({
            parrafo: parrafo,
            idPost: posts.id,
          }).catch((err) => {
            // console.log(err)
          });
        }
      });
      res.redirect("/mostrar-posts");
      // res.json({
      //   "posts": posts
      // })
    })
    .catch((err) => {
      // console.log(err)
    });
};

exports.crearSubPosts = async (req, res, next) => {
  // console.log(req.file, req.body);

  if (req.body.nombreImg == "vacio") {
    var UrlImagenPost = "vacio";
  } else {
    var UrlImagenPost = "/uploads/" + req.body.nombreImg;
  }
  // const subPosts = new SubPosts({

  var parrafos = req.body.descripcion.split("%-%");
  try {
    // await subPosts.save();
    const subPosts = await SubPosts.create({
      // Parrafo: req.body.descripcion,
      subtitulo: req.body.subtitulo,
      urlImagenPost: UrlImagenPost,
      idPost: req.body.idPost,
    });
    parrafos.map(async function (parrafo) {
      // var parrafoSubPosts = new ParrafoSubPosts({
      if (parrafo != "") {
        await ParrafoSubPosts.create({
          parrafo: parrafo,
          idSubPosts: subPosts.id,
        });
      }
      // await parrafoSubPosts.save();
    });

    // res.render("cursosTalleres");
    res.redirect("/editar-posts/" + req.body.idPost);
    // res.json({mensaje: "Se creo el post correctamente", response: posts._id})
  } catch (error) {
    console.log(error);
    // res.json({mensaje: 'Hubo un error'});
    res.render("crearCurso");
    next();
  }
};

exports.editarPost = async (req, res, next) => {
  await Posts.update(req.body, {
    where: {
      id: req.params.IdPost,
    },
  })
    .then(function (rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
};
exports.editarSubPosts = async (req, res, next) => {
  await SubPosts.update(req.body, {
    where: {
      id: req.params.IdSubPost,
    },
  })
    .then(function (rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
};

exports.editarParrafoPost = async (req, res, next) => {
  // let id = req.params.IdParrafo;
  // let body = req.body;

  // await ParrafoPost.update(id, body, (err, postDB) =>{
  //     if(err){
  //         return res.status(400).json({
  //             ok: false,
  //             err
  //         });
  //     }
  //     res.json({
  //         ok: true,
  //         post: postDB
  //     })
  // })

  // console.log(req.body)

  await ParrafoPost.update(
    { parrafo: req.body.parrafo },
    {
      where: {
        id: req.params.IdParrafo,
      },
    }
  )
    .then(function (rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
};

exports.editarParrafoSubPost = async (req, res, next) => {
  await ParrafoSubPosts.update(
    { parrafo: req.body.parrafo },
    {
      where: {
        id: req.params.IdParrafoSub,
      },
    }
  )
    .then(function (rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(next);
};

exports.editarImagenPost = async (req, res, next) => {
  //   console.log(req.body.idPost);
  //  console.log("se edito la imagen")
  res.redirect(`/editar-posts/${req.body.idPost}`);
};
exports.editarImagenSubPost = async (req, res, next) => {
  //   console.log(req.body.idPost);
  //  console.log("se edito la imagen")
  res.redirect(`/editar-posts/${req.body.idPost}`);
};

exports.eliminarPost = async (req, res, next) => {
  // try{
  const post = await Posts.findAll({
    where: { id: req.params.IdPost },
  });
  const subPosts = await SubPosts.findAll({
    where: { idPost: req.params.IdPost },
  });

  // subPosts.map(async function(subP){
  //   if(subP.urlImagenPost==null){
  //       // res.json("ya se borro");
  //       console.log("ya se borro")
  //   }else{
  //       const separado = subP.urlImagenPost.split("/");
  //       const path = "./public/"+separado[1];
  //       console.log(path);
  //       try {

  //           var existe = fileExists(path);
  //           // res.json(existe);
  //           // res.json(existe);
  //           if(existe){
  //               fs.unlinkSync(path)
  //               console.log("imagen Eliminado")
  //           }else{
  //               console.log("no existia la imagen")
  //           }
  //           // res.redirect('/mostrar-posts');

  //       } catch(err) {
  //           console.error(err)
  //       }
  //   }
  // })

  subPosts.map(async function (subP) {
    await ParrafoSubPosts.destroy({
      where: { idSubPosts: subP.id },
    })
      .then(async function (eliminado) {
        // console.log(eliminado)
        await SubPosts.destroy({
          where: { idPost: req.params.IdPost },
        })
          .then(async function (eliminado2) {
            // console.log(eliminado2)

            await ParrafoPost.destroy({
              where: { idPost: req.params.IdPost },
            })
              .then(function (eliminado3) {
                //  console.log(eliminado3)
              })
              .catch(next);
          })
          .catch(next);

        //eliminar imagen
        if (subP.urlImagenPost == null) {
          // res.json("ya se borro");
          console.log("ya se borro");
        } else {
          // const separado = subP.urlImagenPost.split("/static/");
          // const path = "./public/"+separado[1];
          const path = "./public/" + subP.urlImagenPost;
          // console.log(path);
          try {
            var existe = fileExists(path);
            // res.json(existe);
            // res.json(existe);
            if (existe) {
              fs.unlinkSync(path);
              console.log("imagen Eliminado");
            } else {
              console.log("no existia la imagen");
            }
            // res.redirect('/mostrar-posts');
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch(next);
  });

  await Posts.destroy({
    where: { id: req.params.IdPost },
  })
    .then(async function (eliminado) {
      if (post[0].urlImagenPost == null) {
        // res.json("ya se borro");
        console.log("ya se borro");
      } else {
        // const separado = post[0].urlImagenPost.split("/static/");
        // const path = "./public/"+separado[1];
        const path = "./public/" + post[0].urlImagenPost;
        try {
          var existe = fileExists(path);
          // res.json(existe);
          // res.json(existe);
          if (existe) {
            fs.unlinkSync(path);
            console.log("imagen Eliminado");
            // res.json("imagen Eliminado");
          } else {
            // res.json("no existia la imagen");
            console.log("no existia la imagen");
          }
          res.redirect("/mostrar-posts");
          // res.redirect('/get-productos');
        } catch (err) {
          console.error(err);
        }
      }
    })
    .catch(next);

  // subPosts.map(async function(spost){
  //     await SubPosts.findOneAndRemove({IdPost: req.params.IdPost},(err)=>{
  //         if(err){
  //             return res.status(400).json({
  //                 ok: false,
  //                 err
  //             });
  //         }
  //         if(spost.UrlImagenPost==null){
  //             // res.json("ya se borro");
  //             console.log("ya se borro")
  //         }else{
  //             const separado = spost.UrlImagenPost.split("/static/");
  //             const path = "./public/"+separado[1];
  //             try {

  //                 var existe = fileExists(path);
  //                 // res.json(existe);
  //                 // res.json(existe);
  //                 if(existe){
  //                     fs.unlinkSync(path)
  //                     console.log("imagen Eliminado")
  //                 }else{
  //                     console.log("no existia la imagen")
  //                 }
  //                 // res.redirect('/mostrar-posts');

  //             } catch(err) {
  //                 console.error(err)
  //             }
  //         }
  //     });
  // })

  // console.log(subPosts);

  // res.json(subPosts);

  // await Posts.findByIdAndRemove(req.params.IdPost, (err)=>{
  //     if(err){
  //         return res.status(400).json({
  //             ok: false,
  //             err
  //         });
  //     }
  //     if(post[0].UrlImagenPost==null){
  //         // res.json("ya se borro");
  //         console.log("ya se borro")
  //     }else{
  //         const separado = post[0].UrlImagenPost.split("/static/");
  //         const path = "./public/"+separado[1];
  //         try {

  //             var existe = fileExists(path);
  //             // res.json(existe);
  //             // res.json(existe);
  //             if(existe){
  //                 fs.unlinkSync(path)
  //                 console.log("imagen Eliminado")
  //                 // res.json("imagen Eliminado");
  //             }else{
  //                 // res.json("no existia la imagen");
  //                 console.log("no existia la imagen")
  //             }
  //             res.redirect('/mostrar-posts');
  //             // res.redirect('/get-productos');

  //         } catch(err) {
  //             console.error(err)
  //         }
  //     }

  // })

  // }catch(err){
  //     console.log(err);
  //     next();
  // }
};

exports.getPostWithId = async (req, res, next) => {
  try {
    // console.log(req.params.IdTag)
    var pagina = req.body.pagina;
    var postsTotales = pagina * 4;
    console.log("aqui estan las paginas: ");
    // console.log(postsTotales)
    const posts = await Posts.findAll({
      where: {
        idTag: req.params.IdTag,
      },
    });
    var valorResta = postsTotales - posts.length;
    var totalCiclo;
    if (valorResta > 0) {
      totalCiclo = posts.length;
    } else if (valorResta <= 0) {
      totalCiclo = postsTotales;
    }
    const array = [];
    for (var i = 0; i < totalCiclo; i++) {
      array.push({
        id: posts[i].id,
        titulo: posts[i].titulo,
        urlImagenPost: posts[i].urlImagenPost,
        idTag: posts[i].idTag,
        totalDatos: posts.length,
        pagina: pagina,
        slug: posts[i].slug,
      });
    }

    res.json(array);
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.getShows = async (req, res, next) => {
  await Posts.findAll({
    where: {
      idTag: 16,
    },
  })
    .then((post) => {
      res.json(post);
    })
    .catch((error) => {
      console.log(error);
      next();
    });
};
exports.guardarImagen = async (req, res) => {
  // console.log(req)
  var imagen = localStorage.getItem("myFirstKey");
  localStorage._deleteLocation();
  res.json({
    success: 1,
    file: {
      url: "http://localhost:3000/uploads/" + imagen,
      // any other image data you want to store, such as width, height, color, extension, etc
    },
  });
};

exports.subPostsEntero = async (req, res, next) => {
  //IdPosts

  //-------------------------
  //todavia no funcionan bien solo me regresa un solo subpost con todos sus parrafos.
  //-------------------------

  try {
    // const subPosts = await SubPosts.findAll({
    //   where: {
    //     idPost: req.params.IdPosts
    //   }
    // });
    // var array = [];
    // subPosts.map(async(subP) =>{
    //   const parrafoSubPosts = await ParrafoSubPosts.findAll({
    //     where: {
    //       idSubPosts: subP.id
    //     }

    //   });
    //   array.push({
    //     "id": 18,
    //     "subtitulo": "",
    //     "urlImagenPost": "/uploads/87edbb1f-ba8c-4c4b-9e75-4afdeab6692d.jpg",
    //     "idPost": 15,
    //     "parrafos": parrafoSubPosts
    //   })
    //   res.json(array);
    // })

    const subPosts = await SubPosts.findAll({
      where: {
        idPost: req.params.IdPosts,
      },
    }).then((subP) => {
      subP.map(async (sp) => {
        const parrafoSubPosts = await ParrafoSubPosts.findAll({
          where: {
            idSubPosts: sp.id,
          },
        }).then((parrafoSP) => {
          let array = [
            {
              id: sp.id,
              subtitulo: sp.subtitulo,
              urlImagenPost: sp.urlImagenPost,
              idPost: sp.idPost,
              parrafos: parrafoSP,
            },
          ];
          res.json(array);
        });
      });
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.getPostLista = async (req, res, next) => {
  try {
    await Posts.findAll({
      where: {
        idTag: req.params.IdTag,
      },
    }).then((posts) => {
      var array = [];
      posts.map(async (post) => {
        await ParrafoPost.findAll({
          where: {
            IdPost: post.id,
          },
        }).then((parrafoPost) => {
          array.push(parrafoPost);
          // res.json(parrafoPost)
        });
      });
      res.json(array);

      // res.json(posts)
    });

    // const array = [];
    // for(var i = 0; i < totalCiclo; i++){
    //     array.push({
    //         "id": posts[i].id,
    //         "titulo": posts[i].titulo,
    //         "urlImagenPost": posts[i].urlImagenPost,
    //         "idTag": posts[i].idTag,
    //         "totalDatos": posts.length,
    //         "pagina": pagina,
    //     })
    // }

    // var array = [];
    // posts.map(async (post)=>{
    //   await ParrafoPost.findAll({
    //     where: {
    //       IdPost: post.id
    //     }
    //   }).then(parrafoPost => array.push(parrafoPost))

    // })
    // res.json(array);
  } catch (err) {
    // console.log(err);
    next();
  }
};

function fileExists(path) {
  try {
    if (fs.accessSync(path)) {
    }
    return true;
  } catch (e) {
    return false;
  }
}
