const router = require("express").Router();
const principalController = require("../controllers/principalController");
const cursoController = require("../controllers/cursoController");
const usuariosController = require("../controllers/usuariosController");
const postsController = require("../controllers/postsController");
const tagsController = require("../controllers/tagsController");
const serviciosController = require("../controllers/serviciosController");
const brazaleteController = require("../controllers/brazaleteController");
const productosController = require("../controllers/productosController");
const pagosController = require("../controllers/pagosController");
const carteleraController = require("../controllers/carteleraController");
const membresiaController = require("../controllers/membresiaController");
const ticketController = require("../controllers/ticketController");
const ninosMembresiaController = require("../controllers/ninosMembresiaController");
const espectaculosController = require("../controllers/espectaculosController");
const registroESController = require("../controllers/registroESController");
const puntuacionController = require("../controllers/puntuacion2Controller");
const carritoController = require("../controllers/carritoController");
const paymentLinkRepository = require("../repository/paymentLinkRepository");
const asientosController = require("../controllers/asientosController");
const carritoRepository = require("../repository/carritoRepository");
const cafeteriaController = require("../controllers/cafeteriaController");
const momentController = require("../controllers/momentController");
const snacksController = require("../controllers/snacksController");
const cumpleaniosController = require("../controllers/cumpleaniosController");
const checkoutController = require("../controllers/checkoutController");
const funcionesMembresia = require("../functions/funcionesMembresia");

const ticketEspectaculosController = require("../controllers/ticketEspectaculosController");
const ColorsProduct = require("./colorsProduct");
const tarjetasDigitalesController = require("../controllers/tarjetasDigitalesController");

const TallaProduct = require("./tallaProduct");
const Ticket = require("./ticketRoutes");
const Beneficios = require("./beneficios");
const ProductoCaracteristica = require("./productoCaracteristica");
const passport = require("passport");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const { sendEmail } = require("../functions/sendEmail");
const envConfig = require("../config.js");
const stripe = require("stripe")(
  envConfig.env == "dev"
    ? envConfig.stripe.private_developer_key
    : envConfig.stripe.private_production_key
);
// const stripe = require('stripe')('clave');
const { generarRegistroCompra } = require("../functions/generarRegistroCompra");
const { URLMAGICCRM } = require("../variableGlobal/config");
const URLMAGIC = URLMAGICCRM;

var multer = require("multer");
const auth = require("../middleware/auth");
const Producto = require("../database/models/Producto");
const funcionesTicket = require("../functions/funcionesTicket");
const TarjetasDigitales = require("../database/models/TarjetasDigitales");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    // console.log("aqui va el dato: ",req.body.nombreImg)
    cb(null, req.body.nombreImg);
  },
});

const storage2 = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    // console.log("aqui va el dato: ",req.body.nombreImg)
    // console.log(req.body)
    // console.log(req.file)
    // console.log(req)
    var img2 = windowGuid();
    var imagen = img2 + ".png";
    localStorage.setItem("myFirstKey", imagen);
    cb(null, imagen);
  },
});

router.get(
  "/",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/principal");
  }
);
router.get(
  "/home",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/principal");
  }
);

router.get(
  "/reclamarBrazalete",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/reclamarBrazalete");
  }
);
router.get(
  "/crearServicios",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    // console.log(req.session.usuario_token)
    res.render("vistasCrm/crearServicios");
  }
);
router.get(
  "/servicios",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/servicios");
  }
);
router.get(
  "/servicio/:IdServicio",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/servicio");
  }
);
router.get(
  "/tipoServicios",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/tipoServicios");
  }
);
router.get(
  "/crearTipoServicios",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/crearTipoServicios");
  }
);
router.get(
  "/createBrazalete",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/createBrazalete");
  }
);

router.get(
  "/mostrarBrazaletes",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/mostrarBrazaletes");
  }
);

router.get(
  "/editar-productos/:IdProducto",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/editarProductos");
  }
);

router.get(
  "/cursos-talleres",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/cursosTalleres");
  }
);
router.get(
  "/crear-curso",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/crearCurso");
  }
);

router.get(
  "/usuarios",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/usuarios");
  }
);
router.get(
  "/crearUsuario",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/crearUsuario");
  }
);
router.get(
  "/editar-curso/:IdCurso",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res, next) => {
    res.render("vistasCrm/editarCurso");
  }
);

router.get(
  "/mostrar-posts",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  function (req, res) {
    res.render("vistasCrm/mostrarPosts");
  }
);
router.get(
  "/crear-posts",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  function (req, res) {
    res.render("vistasCrm/crearPosts");
  }
);
router.get(
  "/crear-Tags",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/crearTags");
  }
);
router.get(
  "/editar-posts/:IdPosts",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  function (req, res) {
    res.render("vistasCrm/editarPosts");
  }
);
router.get(
  "/mostrar-tags",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  function (req, res) {
    res.render("vistasCrm/mostrarTags");
  }
);
router.get(
  "/get-productos",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/getProductos");
  }
);
router.get(
  "/crear-producto",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/crearProducto");
  }
);
router.get(
  "/crear-tipoProducto",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/crearTipoProducto");
  }
);
router.get(
  "/cartelera",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/cartelera");
  }
);
router.get(
  "/crear-cartelera",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/crear-cartelera");
  }
);
router.get(
  "/tipoProducto",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
  },
  (req, res) => {
    res.render("vistasCrm/tipoProducto");
  }
);
router.get("/vincularBrazalete", (req, res) => {
  res.render("vistasCrm/vincularBrazalete");
});
router.get("/vincularBrazalete/paso1", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("layouts/vincularPaso1");
});
router.get("/camera", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("layouts/camera");
});

router.get("/getPrincipal", principalController.getPrincipal);
router.get(
  "/getUsuarioFromIdP/:user_idP",
  usuariosController.getUsuarioFromIdP
);

router.get("/getCursos", cursoController.getCursos);
router.get("/getCurso/:IdCurso", cursoController.getCurso);
router.post(
  "/crearCurso",
  multer({ storage: storage }).single("myImage"),
  cursoController.crearCurso
);
router.post("/eliminarCurso/:IdCurso", cursoController.eliminarCurso);
router.post("/editarCurso/:IdCurso", cursoController.editarCurso);
router.post(
  "/editarImagenCurso",
  multer({ storage: storage }).single("imagenSubParrafoEditar"),
  cursoController.editarImagenCurso
);
//--------------------------------stripe--------------------------------

//------------ENDPOINT SHOWS---------------

// router.post('/')
router.get("/prueba-barras", (req, res, next) => {
  res.render("vistasCrm/prueba-barras");
});
//------------ENDPOINT SHOWS---------------

router.post("/checkout", pagosController.crearPago);
router.post("/checkoutPasarela", pagosController.crearPagoPasarela);
router.post("/create-checkout-session", pagosController.createCheckoutSession);
router.post("/cart-checkout", carritoController.getSessionIdByCartId);
router.post("/pay-cartSistem", carritoController.payCartSistem2);
router.post(
  "/create-checkout-session2",
  pagosController.createCheckoutSession2
);
router.get("/pruebaMoment", momentController.pruebaMoment);
router.get("/seCreoPago", pagosController.seCreoPago);

router.post("/renewMembership", membresiaController.renewMembership);

// router.post('/webhookPago', bodyParser.raw({type: 'application/json'}), pagosController.webhookPago);
router.post(
  "/webhook-pago",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("entramos al webhook");
    try {
      // const payload = {
      //     id: 'evt_test_webhook',
      //     object: 'event',
      //   };

      if (req.body.data.object.metadata.idTipoProducto == "renew_membership") {
        const sku = req.body.data.object.metadata.sku;

        const renew = await funcionesMembresia.renewMembership(sku);
      }

      if (req.body.data.object.metadata.idTipoProducto == "payment_link") {
        const paymentLinkResume =
          await paymentLinkRepository.setPaymentLinkResume({
            concept: req.body.data.object.metadata.title,
            amount: req.body.data.object.metadata.price / 100,
            email: req.body.data.object.customer_details.email,
            stripeId: req.body.id,
          });

        if (paymentLinkResume) {
          console.log("PaymentLink data almacenado");
        } else {
          console.log(paymentLinkResume);
        }
      } else if (
        req.body.data.object.metadata.idTipoProducto == "cart_checkout"
      ) {
        const metadata = req.body.data.object.metadata;
        const carrito = await carritoRepository.checkOut({
          idUsuario: metadata.idCarrito,
          tipoCarrito: "undefined",
        });
        carrito.map(async (item, index) => {
          const product = await Producto.findOne({
            where: {
              id: item.idProducto,
            },
          });
          console.log(
            `Existen ${item.cantidad} de este producto: ${item.idProducto}`
          );
          if (product.idTipoProducto != 10) {
            for (let i = 0; i < item.cantidad; i++) {
              const data = {
                customer: req.body.data.object.customer,
                customerTicketId: req.body.id,
                usuarioId: metadata.userId,
                idTipoProducto: product.idTipoProducto,
                idProducto: item.idProducto,
                nombrenino: item.childName,
                idTicket: metadata.ticketId,
                horasTotales:
                  product.idTipoProducto == 7 ? product.horasTotales : 0,
                cartItem: item,
                idProducto: product.id,
              };
              await generarRegistroCompra(data, true);
              await carritoRepository.destroyCart({ id: item.id });
            }
          } else if (product.idTipoProducto == 10) {
            const data = {
              idTicket: metadata.ticketId,
              cartItem: item,
              idProducto: product.id,
            };
            await carritoRepository.saveShowFromCart(
              data,
              JSON.parse(item.showDetalle)
            );
            await carritoRepository.updateTicket(
              req.body.id,
              metadata.ticketId
            );
            await carritoRepository.destroyCart({ id: item.id });
          }
        });
      } else if (
        req.body.data.object.metadata.idTipoProducto == "espectaculos-ticket"
      ) {
        console.log("este es el webhook de los espectaculos");
        const metadata = req.body.data.object.metadata;

        var datosTicketA = {
          id_ticket: metadata.id_ticket,
          customerTicketID: req.body.id,
        };
        await funcionesTicket.actualizarTicket(datosTicketA);
      } else {
        console.log("elpayload");
        // console.log(req.body.data.object.metadata)
        console.log("nombres y correo del usuario: ");
        console.log(req.body.data.object.metadata);
        console.log(req.body.data.object.metadata.nombreUsuario);
        // console.log("metadatos")
        // console.log(req.body.data)
        // console.log(req.body.data.object.metadata)
        const payload = req.body;
        const payloadString = JSON.stringify(payload, null, 2);
        const secret = "whsec_UAErussVATEDBmXxUeP7acrlh05kxBR2";

        const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret,
        });

        const event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          secret
        );
        // console.log("evento: ")
        // console.log(event)
        // Do something with mocked signed event
        //   expect(event.id).to.equal(payload.id);
        // res.json({received: true});
        var ticket = await generarRegistroCompra(req.body);
        let mensaje = `Hola tripulante muchas gracias por formar parte de magic planet, a continuación te dejamos el ticket de tu producto: https://magicplanet.club/ticket/${req.body.data.object.metadata.idTicketProdSecret}`;
        sendEmail(
          req.body.data.object.metadata.email,
          mensaje,
          `Gracias por tu compra ${req.body.data.object.metadata.nombreUsuario}`
        );
        // console.log(ticket)
        // res.redirect(`https://dev.magicplanet.club/ticket/${ticket.id}`)
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntent = event.data.object;
    //     // Then define and call a method to handle the successful payment intent.
    //     // handlePaymentIntentSucceeded(paymentIntent);
    //     break;
    //   case 'payment_method.attached':
    //     const paymentMethod = event.data.object;
    //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //     // handlePaymentMethodAttached(paymentMethod);
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

//--------------------------------stripe--------------------------------
router.post("/get-paymentlink", pagosController.generatePaymentLink);
router.get("/getMembresia/:IdProducto", membresiaController.getMembresia);
router.get(
  "/getMembresiasFromUser/:IdUser",
  membresiaController.getMembresiasFromUser
);

router.get("/getProductoDetalle/:slug", productosController.getProductoDetalle);

router.get("/getMaestros", usuariosController.getMaestros);
router.get("/getUsuarios", usuariosController.getUsuarios);
router.get("/getUsuario/:IdUsuario", usuariosController.getUsuario);
router.get(
  "/getUsuarioidPersonal/:IdUsuario",
  usuariosController.getUsuarioPersonal
);
router.post("/crear-cuenta-privada", usuariosController.crearCuentaPrivada);
router.get("/getMaestros", usuariosController.getMaestros);

router.get("/getPosts", postsController.getPosts);
router.post("/getPostWithId/:IdTag", postsController.getPostWithId);
router.get("/getShows", postsController.getShows);
router.post(
  "/editarImagenPost",
  multer({ storage: storage }).single("imagenSubParrafoEditar"),
  postsController.editarImagenPost
);

router.post(
  "/crearPosts",
  multer({ storage: storage }).single("imagenSubParrafo"),
  postsController.crearPosts
);
router.post("/eliminarPost/:IdPost", postsController.eliminarPost);
router.get("/getPost/:IdPosts", postsController.getPost);
router.get("/getParrafosPosts/:IdPosts", postsController.getParrafosPosts);
router.get("/getSubPosts/:IdPosts", postsController.getSubPosts);
router.get(
  "/getParrafosSubPosts/:IdSubPosts",
  postsController.getParrafosSubPosts
);
router.post(
  "/crearTipoProducto",
  multer({ storage: storage }).single("imagenSubParrafo"),
  productosController.crearTipoProducto
);

router.get("/getTags", tagsController.getTags);
router.post(
  "/createTags",
  multer({ storage: storage }).single("imagenSubParrafo"),
  tagsController.createTags
);

router.get("/getServicios", auth, serviciosController.getServicios);
router.get("/getTipoServicios", serviciosController.getTipoServicios);

router.get("/getBrazaletes", brazaleteController.getBrazaletes);

router.post("/getProductos", productosController.getProductos);
router.get("/getProductosMixtos", productosController.getProductosMixtos);
router.get("/getProductosApi", productosController.getProductosApi);
router.get("/getTipoProducto", productosController.getTipoProducto);
router.get("/getProducto/:IdProducto", productosController.getProducto);
router.post(
  "/editarImagenProducto",
  multer({ storage: storage }).single("imagenSubParrafoEditar"),
  productosController.editarImagenProducto
);
router.post(
  "/getProductosEspecificos",
  productosController.getProductosEspecificos
);
router.post(
  "/crearProducto",
  multer({ storage: storage }).single("imagenSubParrafo"),
  productosController.crearProducto
);
router.post("/editarProducto/:IdProducto", productosController.editarProducto);

router.post("/cambiarPuntuacion", puntuacionController.cambiarPuntuacion);
router.post("/getCarrito", auth, pagosController.getCarrito);

router.post("/crearCarrito", pagosController.crearCarrito);
router.post(
  "/eliminarProductoCarro/:IdCarrito",
  pagosController.eliminarProductoCarro
);
router.post(
  "/eliminarProducto/:IdProducto",
  productosController.eliminarProducto
);

//-----cumpleaños-------
router.post("/createCumpleanios", cumpleaniosController.createCumpleanios);
router.post("/verificarFecha", cumpleaniosController.verificarFecha);

//-----cumpleaños-------
// router.get('/getCarrito', pagosController.getCarrito);

router.post("/crearCartelera", carteleraController.crearCartelera);
router.get("/getCartelera/:IdFechaCartelera", carteleraController.getCartelera);
router.get("/getFechaCartelera", carteleraController.getFechaCartelera);

router.post("/crearBrazalete", brazaleteController.crearBrazalete);

router.post("/signup2", usuariosController.signup2);
router.post("/registro-leads", usuariosController.registroLeads);
router.post("/signin2", usuariosController.signin2);
router.post("/getUsuarioVinculacion", usuariosController.getUsuarioVinculacion);
router.get("/post/:slug", postsController.getPostSlug);

router.post(
  "/crearSubPosts",
  multer({ storage: storage }).single("imagenSubParrafo"),
  postsController.crearSubPosts
);

router.get("/ticket/:ticketId", ticketController.getTicketById);

router.get("/signin", (req, res, next) => {
  // var source = req.headers['user-agent']
  // var ua = useragent.parse(source);
  // var isMobile = ua.isMobile
  // if(isMobile){
  //     res.render('view-discover');
  // }else{
  res.render("inicioSesion/signin");
  // }
});

//-----------ACIENTOSSSS-----------
router.post("/reservarAsiento", asientosController.reservarAsiento);
router.post("/crearTipoAsiento", asientosController.crearTipoAsiento);

//-----------ACIENTOSSSS-----------
router.post(
  "/logincrm",
  passport.authenticate("local-signin", {
    successRedirect: "/home",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

// router.get("/forgot", usuariosController.forgot);
router.post("/send-email", usuariosController.sendEmail);
router.post("/traerUsuarios", usuariosController.traerUsuarios);
router.post("/traerUsuario", usuariosController.traerUsuario);

router.post("/change-password", usuariosController.changePassword);

router.post("/hooks/deployCrm", async (req, res, next) => {
  exec(
    "cd /home/magicplanet/magicCRM && git pull origin master && pm2 restart crm"
  );
  res.status(200).json({
    status: res.statusCode,
  });
});
router.post("/hooks/deployCrm/dev", async (req, res, next) => {
  exec(
    "cd /home/magicplanet/dev/magicCRM && git pull origin dev && pm2 restart crmdev"
  );
  res.status(200).json({
    status: res.statusCode,
  });
});
router.get("/prueba1", async (req, res, next) => {
  res.json("hola amigos");
});

//-------------------ENTRADA-------------------------------
router.get("/pruebaMoment", registroESController.pruebaMoment);
router.get("/prueba-cron", registroESController.pruebaCron);

router.get("/entrada-user", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("entrada/entrada-user");
});
router.get("/seleccion-usuario2", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("entrada/seleccion-usuario");
});
router.get("/seleccion-datos2", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("entrada/seleccion-datos");
});

//----------------------Vinculacion de los brazaletes---------------------

router.get("/seleccion-vincular", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("entrada/seleccion-vincular");
});

//----------------------Vinculacion de los brazaletes---------------------

router.get("/compra-cliente2", (req, res, next) => {
  // console.log(req.session.usuario_token)
  res.render("entrada/compra-cliente");
});

//------------carro---------------
router.post("/crearCarrito", pagosController.crearCarrito);
router.get("/getCarrito/:idUsuario", pagosController.getCarrito);
router.post("/getCarritoSistema/:idUsuario", pagosController.getCarritoSistema);

router.delete("/deleteCarrito/:idCarrito", pagosController.deleteCarrito);
router.post("/checarCarro", carritoController.checarCarro);

//------------carro---------------

//_______________ENTRADAS Y SALIDAS___________________

router.post(
  "/asignar-entrada-salida",
  registroESController.asignarEntradaSalida
);
router.get("/checar-entrada", (req, res, next) => {
  res.render("entradaHoras/checar-entrada");
});

//_______________ENTRADAS Y SALIDAS___________________

//---------------SNACKS-------------
router.get("/venta-snacks", (req, res, next) => {
  res.render("snacks/venta-snacks");
});
router.get("/venta-boutique", (req, res, next) => {
  res.render("boutique/venta-boutique");
});
router.get("/venta-snacks-carro", (req, res, next) => {
  res.render("snacks/venta-snacks-carro");
});
router.get("/venta-boutique-carro", (req, res, next) => {
  res.render("boutique/venta-boutique-carro");
});

router.get(
  "/getUsuarioFromMembresia/:codigo_brazalete",
  snacksController.getUsuarioFromMembresia
);
router.get(
  "/getProductosSnack/:id_tipo_producto",
  snacksController.getProductosSnack
);
router.get(
  "/getProductosBoutique/:id_tipo_producto",
  snacksController.getProductosBoutique
);

//---------------SNACKS-------------
router.post("/get-usuarios-personas", usuariosController.getUsuariosPersonas);
router.post("/create-vinculacion", brazaleteController.createVinculacion);
router.post("/pago-compra-cliente", pagosController.pagoCompraCliente);
router.get(
  "/get-vinculos-brazalete/:idUsuarioP",
  brazaleteController.getVinculosBrazalete
);
router.post("/eliminar-vinculo", brazaleteController.eliminarVinculo);

//-------------------ENTRADA------------/ticket-------------------

router.get(
  "/get-ninos-membresias",
  ninosMembresiaController.getNinosMembresias
);
router.post("/get-ninosPadres", ninosMembresiaController.getNinosPadres);
router.get("/get-espectaculos", espectaculosController.getEspectaculos);
router.get(
  "/getImagenesEspectaculos/:slug",
  espectaculosController.getImagenesEspectaculos
);

//-----------ESPECTACULOS----------
router.get(
  "/getDatosEspectaculo/:slug",
  espectaculosController.getDatosEspectaculo
);

router.post(
  "/createTicketEspectaculo",
  ticketEspectaculosController.createTicketEspectaculo
);
router.get(
  "/getTicketEspectaculoData/:ticketId",
  ticketEspectaculosController.getTicketEspectaculoData
);
router.get(
  "/getFechasEspectaculo/:slug",
  espectaculosController.getFechasEspectaculo
);
router.get("/getHoras/:id_cartelera", espectaculosController.getHoras);
router.get(
  "/getCarteleraFromFecha/:fecha",
  carteleraController.getCarteleraFromFecha
);
router.get("/getAllEspectaculos", espectaculosController.getAllEspectaculos);
router.post(
  "/createImagenEspectaculos",
  espectaculosController.createImagenEspectaculos
);

//-----------ESPECTACULOS----------

//------cafeteria------
router.post(
  "/createProductoCafeteria",
  cafeteriaController.createProductoCafeteria
);
router.get(
  "/getProductosCafeteriaPE/:tipo_producto",
  cafeteriaController.getProductosCafeteriaPE
);

//------cafeteria------

//-------------CHECKOUT-----------------

router.get("/checkout", (req, res, next) => {
  res.render("layoutSistemaO/checkout");
});
router.get("/checar-checkout", (req, res, next) => {
  res.render("layoutSistemaO/checar-checkout");
});

router.get("/getDeudasHoras/:id_usuarioP", checkoutController.getDeudasHoras);
router.get(
  "/getDeudasCuentaAbierta/:id_usuarioP",
  checkoutController.getDeudasCuentaAbierta
);
router.post("/payCartDeuda", checkoutController.payCartDeuda);

router.get(
  "/checarHorasMembresias/:id_usuarioP",
  checkoutController.checarHorasMembresias
);
router.get(
  "/getHorasRestantes/:sku_membresia",
  checkoutController.getHorasRestantes
);
router.post(
  "/pagarDeudasPorMembresia",
  checkoutController.pagarDeudasPorMembresia
);

//---------------------VISTA EVENTO--------------------

router.get("/login-evento", (req, res, next) => {
  res.render("eventoLayout/login-evento");
});
router.post(
  "/logincrm-evento",
  passport.authenticate("local-signin", {
    successRedirect: "/registro-evento",
    failureRedirect: "/login-evento",
    failureFlash: true,
  })
);

router.get(
  "/registro-evento",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login-evento");
  },
  (req, res, next) => {
    // console.log(req.session.usuario_token)
    res.render("eventoLayout/principal");
  }
);
router.get(
  "/seleccion-usuario",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login-evento");
  },
  (req, res, next) => {
    res.render("eventoLayout/seleccion-usuario");
  }
);
router.get(
  "/seleccion-datos",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login-evento");
  },
  (req, res, next) => {
    res.render("eventoLayout/seleccion-datos");
  }
);
router.get(
  "/compra-cliente",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login-evento");
  },
  (req, res, next) => {
    res.render("eventoLayout/compra-cliente");
  }
);

router.get(
  "/compra-completada",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login-evento");
  },
  (req, res, next) => {
    res.render("eventoLayout/compra-completada");
  }
);

// router.get("/servicios", (req,res,next)=>{
//   if(req.isAuthenticated()) return next();
//   res.redirect("/signin");
// },(req, res, next) => {
//   res.render("vistasCrm/servicios");
// });

//---------------------VISTA EVENTO--------------------
router.get("/traer-usuariosEvento", usuariosController.traerUsuariosEvento);
router.get("/mostrar-usuariosEvento", (req, res, next) => {
  res.render("vistasCrm/mostrar-usuariosEvento");
});

//-------------layoutSistemaO --------------------

router.get("/seleccionar-usuario", (req, res, next) => {
  res.render("layoutSistemaO/seleccionar-usuario");
});

router.get("/usuario-existente", (req, res, next) => {
  res.render("layoutSistemaO/usuario-existente");
});

router.get("/seleccionar-compra", (req, res, next) => {
  res.render("layoutSistemaO/seleccionar-compra");
});
router.get("/compra-carrito", (req, res, next) => {
  res.render("layoutSistemaO/compra-carrito");
});
router.get("/compra-carrito2", (req, res, next) => {
  res.render("layoutSistemaO/compra-carrito2");
});
router.get("/asignar-horas", (req, res, next) => {
  res.render("layoutSistemaO/asignar-horas");
});

router.get("/vincular-brazalete", (req, res, next) => {
  res.render("layoutSistemaO/vincular-brazalete");
});

router.get("/seccion-opciones", (req, res, next) => {
  res.render("layoutSistemaO/seccion-opciones");
});
router.get("/imprimir-ticket", (req, res, next) => {
  res.render("layoutSistemaO/imprimir-ticket");
});

router.get("/chequeo-entrada", (req, res, next) => {
  res.render("layoutSistemaO/chequeo-entrada");
});
router.get("/crear-ninos", (req, res, next) => {
  res.render("layoutSistemaO/crear-ninos");
});
router.get("/reclamar-tarjetas", (req, res, next) => {
  res.render("layoutSistemaO/reclamar-tarjetas");
});

// Rutas punto de venta

router.get("/punto-venta", (req, res, next) => {
  res.render("layoutSistemaO/seleccionar-usuario");
});

router.get("/venta-general", (req, res, next) => {
  res.render("layoutSistemaO/compra-general");
});

router.post("/exchangeCode", tarjetasDigitalesController.exchangeCode);

router.get("/getProductosCarro", productosController.getProductosCarro);
router.get(
  "/getTarjetasHoras/:id_usuarioP",
  tarjetasDigitalesController.getTarjetasHoras
);
router.get(
  "/getTodosNinos/:id_usuarioP",
  ninosMembresiaController.getTodosNinos
);
router.post("/ninoCreate", ninosMembresiaController.ninoCreate);
router.post("/vinculateHoras", tarjetasDigitalesController.vinculateHoras);

router.post("/addTarjeta", tarjetasDigitalesController.addTarjeta);

//back--

router.get(
  "/get-usuario-from-email/:email",
  usuariosController.getUsuarioFromEmail
);

//crea un usuario temporal para la compra de cliente no registrado
router.get("/get-usuario-temporal", usuariosController.userTemporal);
//actualizar un usuario temporal con la información real
router.post(
  "/actualizar-usuario-temporal",
  usuariosController.updateUserTemporal
);

//-------------layoutSistemaO --------------------

router.get(
  "/user/purchases/:userId",
  usuariosController.getPurchasesByUserController
);

router.get(
  "/membership/get_token/:sku",
  membresiaController.getStripeTokenMembership
);

router.get("/membership_by_sku/:sku", membresiaController.getMembershipBySku);

ColorsProduct.colorsRoutes(router);
TallaProduct.getRoutes(router);
ProductoCaracteristica.getRoutes(router);
Ticket.getRoutes(router);
Beneficios.getRoutes(router);

module.exports = router;
