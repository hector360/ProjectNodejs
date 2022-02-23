

function MiSistema(){
    var arrayProdSeleccioando = [];
    var arrayCarro = [];
    var precioTotal = 0;
    var arrayTotalNombres = [];
    var arrayHora = "";
    var arrayNino = "";
    var precioTotalPop = 0;
    var contadorCajas = 0;
    var arrayCodigosT = [];
    var contadorPrecio = 0;
    var contadorPrecioHoras = 0;
    var arrayTicketId = [];
    var arraySkuBanco = [];

    this.traerUsuario = async function(){
        let email = document.getElementById("correo").value;
        var error = '';
        if(email == ""){
            error +=
            `<div class="error">Agrega el correo</div>`;
            $('#cont-error').html(error)
            return 
        }
        
        var htmlUsuario = '';
        var htmlBoton = '';
        await MagicPlanet.MiSistema.getUsuario(email)
            .then(usuario => {
                if(usuario != null){
                    console.log(usuario)
                    htmlUsuario +=
                        `<div class="row">
                            <div class="col-md-3">
                                <label>Nombres</label>
                                <input type="text" class="form-control" value="${usuario.nombres}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Apellidos</label>
                                <input type="text" class="form-control" value="${usuario.apellidos}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Email</label>
                                <input type="text" class="form-control" value="${usuario.email}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Celular</label>
                                <input type="text" class="form-control" value="${usuario.celular}" readonly>
                            </div>
                        </div>`;

                        htmlBoton +=
                        `<a href="/seleccionar-compra?id=${usuario.idUsuarioPersonalizado}" class="btn btn-primary btn-control">Siguiente</a>`;
                        $('#cont-botonSiguiente').html(htmlBoton)
                }else{
                    htmlUsuario +=
                    `<div>Usuario no existe</div>`;
                }
                
            }).catch(error => {
                htmlUsuario +=
                `<div>Usuario no existe</div>`;
            })
        
        
        

        $('#caja-resultado').html(htmlUsuario);
        
    }
    this.traerUsuarioFromIdP = async function(id_usuarioP){
        
        
        var htmlUsuario = '';
        var htmlBoton = '';
        await MagicPlanet.MiSistema.getUsuarioFromIdP(id_usuarioP)
            .then(usuario => {
                if(usuario != null){
                    console.log(usuario)
                    htmlUsuario +=
                        `<div class="row">
                            <div class="col-md-3">
                                <label>Nombres</label>
                                <input type="text" class="form-control" value="${usuario.nombres}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Apellidos</label>
                                <input type="text" class="form-control" value="${usuario.apellidos}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Email</label>
                                <input type="text" class="form-control" value="${usuario.email}" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>Celular</label>
                                <input type="text" class="form-control" value="${usuario.celular}" readonly>
                            </div>
                        </div>`;

                        htmlBoton +=
                        `<a href="/seleccionar-compra?id=${usuario.idUsuarioPersonalizado}" class="btn btn-primary btn-control">Siguiente</a>`;
                        $('#cont-botonSiguiente').html(htmlBoton)
                }else{
                    htmlUsuario +=
                    `<div>Usuario no existe</div>`;
                }
                
            }).catch(error => {
                htmlUsuario +=
                `<div>Usuario no existe</div>`;
            })
        
        
        

        $('#caja-resultado').html(htmlUsuario);
    }

    this.traerProductosCarro = async function(){
        var productosCarro = await MagicPlanet.MiSistema.getProductosCarro();
        console.log(productosCarro)
        var contProductos = '';
        productosCarro.tarjetas.map(prodCa => {
            if(prodCa.slug == "horas-indefinidas"){
                contProductos +=
                `<div class="caja-prod" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.seleccionarProdCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio})">
                    <div class="cont-titulo">
                        <h2>${prodCa.nombreProducto}</h2>
                    </div>
                </div>`;
            }else{
                contProductos +=
                `<div class="caja-prod" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.seleccionarProdCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio})">
                    <div class="cont-titulo">
                        <h2>${prodCa.nombreProducto}</h2>
                    </div>
                    <div class="cont-imagen">
                        <img src="${prodCa.urlImagenMovil}" />
                    </div>
                </div>`;
            }
            
        })
        productosCarro.cumpleaños.map(prodCa => {
            console.log(prodCa)
            contProductos +=
            `<div class="caja-prod" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.seleccionarProdCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio})">
                <div class="cont-titulo">
                    <h2>${prodCa.nombreProducto}</h2>
                </div>
                <div class="cont-imagen">
                    <img src="${prodCa.urlImagenMovil}" />
                </div>
            </div>`;
        })
        productosCarro.membresias.map(prodCa => {
            console.log(prodCa)
            if(prodCa.slug != "membresia-visitante"){
                contProductos +=
                `<div class="caja-prod" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.seleccionarProdCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio})">
                    <div class="cont-titulo">
                        <h2>${prodCa.nombreProducto}</h2>
                    </div>
                    <div class="cont-imagen">
                        <img src="${prodCa.urlImagenMovil}" />
                    </div>
                </div>`;
            }
            
        })
        
        
        $('#cont-productos').html(contProductos);
    }
    this.getProductShows = async function(){
        var shows = await this.getAllShows();
        var showArrayreturn = [];
        var showsArray = await Promise.all(shows.map(async show =>{
            var showContent = await this.getShow(show.slug);
            return showContent;
        }));
        for(var i=0;i<showsArray.length;i++){
            if(showsArray[i].length>0){
                for(var j=0;j<showsArray[i].length;j++){
                    showArrayreturn.push(showsArray[i][j]);
                }
            }
        }
        return showArrayreturn;
    }
    this.traerProductosCarro2 = async function(idUsuario){
        var productosCarro = await MagicPlanet.MiSistema.getProductosCarro();
        console.log("productosCarro")
        console.log(productosCarro)
        var shows = await this.getProductShows();
       // console.log(shows);
        var contProductos = '';
        contProductos += `<div class="clearfix"></div>
            <div class="col-md-4"><h2>Horas</h2>`;
        productosCarro.tarjetas.map(prodCa => {
            //console.log(prodCa)
            if(prodCa.slug == "horas-indefinidas"){
                contProductos +=
                `<div class="col-md-12">
                    <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                        <div class="contenido">
                            <h3>${prodCa.nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${prodCa.precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        });
        contProductos += `</div>`;
        contProductos +=
            `<div class="col-md-4"><h2>Entrada</h2>
            <div class="col-md-12">
                    <div class="card-producto" id="${productosCarro.entrada.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${productosCarro.entrada.slug}','${productosCarro.entrada.nombreProducto}',${productosCarro.entrada.precio},${productosCarro.entrada.idTipoProducto},'${idUsuario}','${productosCarro.entrada.id}')">
                        <div class="contenido">
                            <h3>${productosCarro.entrada.nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${productosCarro.entrada.precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        contProductos += `</div>`;
        contProductos +=
            `<div class="col-md-4"><h2>Calcetines</h2>
            <div class="col-md-12">
                    <div class="card-producto" id="${productosCarro.calcetines[0].slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${productosCarro.calcetines[0].slug}','${productosCarro.calcetines[0].nombreProducto}',${productosCarro.calcetines[0].precio},${productosCarro.calcetines[0].idTipoProducto},'${idUsuario}','${productosCarro.calcetines[0].id}')">
                        <div class="contenido">
                            <h3>${productosCarro.calcetines[0].nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${productosCarro.calcetines[0].precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        contProductos += `</div>`;
        contProductos += `<div class="clearfix"></div><div class="col-md-12"><h2>Entradas a Shows</h2></div>`;
            shows.map(showCa => {
                //console.log(prodCa)
                if(showCa.status!=false){
                contProductos +=
                `<div class="col-md-4">`;

                contProductos +=`<div class="card-producto" id="${showCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarroShow('${showCa.slug}','${idUsuario}','${showCa.id_producto}','${showCa.fecha}')">`;

                contProductos +=`<div class="imagen" style="max-height:120px;overflow:hidden">
                            <img src="${showCa.image}" class="img-fluid"/>
                        </div>
                        <div class="contenido">
                            <h3>${showCa.name}</h3>
                            <div class="precio">
                                Fecha <span> ${showCa.fecha}</span>`;
                contProductos +=`</div>
                        </div>
                    </div>
                </div>`;
                }
            });

        contProductos += `<div class="clearfix"></div><div class="col-md-12"><h2>Tarjetas de Horas</h2></div>`;
        productosCarro.tarjetas.map(prodCa => {
            //console.log(prodCa)
            if(prodCa.slug == "horas-indefinidas"){
            }else{
                contProductos +=
                `<div class="col-md-4">
                    <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                        <div class="imagen">
                            <img src="${prodCa.urlImagenMovil}" class="img-fluid"/>
                        </div>
                        <div class="contenido">
                            <h3>${prodCa.nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${prodCa.precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            }  
        })
        contProductos += `<div class="col-md-12"><h2>Cumpleaños</h2></div>`;
        productosCarro.cumpleaños.map(prodCa => {
            //console.log(prodCa)
            contProductos +=
            `<div class="col-md-4">
                <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                    <div class="imagen">
                        <img src="${prodCa.urlImagenMovil}" class="img-fluid"/>
                    </div>
                    <div class="contenido">
                        <h3>${prodCa.nombreProducto}</h3>
                        <div class="precio">
                            Precio <span>$ ${prodCa.precio} mxn</span>
                        </div>
                    </div>
                    
                </div>
            </div>`;
        })
        contProductos += `<div class="clearfix"></div><div class="col-md-12"><h2>Membresias</h2></div>`;
        productosCarro.membresias.map(prodCa => {
            //console.log(prodCa)
            if(prodCa.slug != "membresia-visitante"){
                contProductos +=
                `<div class="col-md-4"> 
                    <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                        
                        <div class="imagen">
                            <img src="${prodCa.urlImagenMovil}" class="img-fluid"/>
                        </div>
                        <div class="contenido">
                            <h3>${prodCa.nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${prodCa.precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
            
        })
        
        
        $('#cont-productos').html(contProductos);
    }

    this.traerProductosSnack = async function(idUsuario){
        // var productosCarro = await MagicPlanet.MiSistema.getProductosCarro();
        var snaks = await MagicPlanet.MiSistema.getProductosSnack()
        console.log(snaks);
        var shows = await this.getProductShows();
       // console.log(shows);
        var contProductos = '';
        contProductos += `<div class="clearfix"></div><div class="col-md-12"><h2>Horas</h2></div>`;
        snaks.map(prodCa => {
            
                contProductos +=
                `<div class="col-md-4">
                    <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                        <div class="contenido">
                            <h3>${prodCa.nombreProducto}</h3>
                            <div class="precio">
                                Precio <span>$ ${prodCa.precio} mxn</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            
        });
        
        
        $('#cont-productos').html(contProductos);
    }
    this.traerProductosBoutique = async function(idUsuario){
        // var productosCarro = await MagicPlanet.MiSistema.getProductosCarro();
        var productosBoutique = await MagicPlanet.MiSistema.getProductosBoutique()
        console.log(productosBoutique);
        var shows = await this.getProductShows();
       // console.log(shows);
        var contProductos = '';
        contProductos += `<div class="clearfix"></div><div class="col-md-12"><h2>Horas</h2></div>`;
        productosBoutique.almohadas.map(prodCa => {
            
                contProductos +=
                `<div class="col-md-4">
                <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                    <div class="imagen">
                        <img src="${prodCa.urlImagenPost}" class="img-fluid"/>
                    </div>
                    <div class="contenido">
                        <h3>${prodCa.nombreProducto}</h3>
                        <div class="precio">
                            Precio <span>$ ${prodCa.precio} mxn</span>
                        </div>
                    </div>
                </div>
            </div>`;
            
        });
        
        productosBoutique.gorras.map(prodCa => {
            
            contProductos +=
            `<div class="col-md-4">
                <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                    <div class="imagen">
                        <img src="${prodCa.urlImagenPost}" class="img-fluid"/>
                    </div>
                    <div class="contenido">
                        <h3>${prodCa.nombreProducto}</h3>
                        <div class="precio">
                            Precio <span>$ ${prodCa.precio} mxn</span>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        productosBoutique.libros.map(prodCa => {
            
            contProductos +=
            `<div class="col-md-4">
                <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                    <div class="imagen">
                        <img src="${prodCa.urlImagenPost}" class="img-fluid"/>
                    </div>
                    <div class="contenido">
                        <h3>${prodCa.nombreProducto}</h3>
                        <div class="precio">
                            Precio <span>$ ${prodCa.precio} mxn</span>
                        </div>
                    </div>
                </div>
            </div>`;
        
    });
    productosBoutique.playeras.map(prodCa => {
            
        contProductos +=
        `<div class="col-md-4">
            <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                <div class="imagen">
                    <img src="${prodCa.urlImagenPost}" class="img-fluid"/>
                </div>
                <div class="contenido">
                    <h3>${prodCa.nombreProducto}</h3>
                    <div class="precio">
                        Precio <span>$ ${prodCa.precio} mxn</span>
                    </div>
                </div>
            </div>
        </div>`;
    
    });
    productosBoutique.tazas.map(prodCa => {
            
        contProductos +=
        `<div class="col-md-4">
            <div class="card-producto" id="${prodCa.slug}" onclick="MagicPlanet.MiSistema.popUpCarro('${prodCa.slug}','${prodCa.nombreProducto}',${prodCa.precio},${prodCa.idTipoProducto},'${idUsuario}','${prodCa.id}')">
                <div class="imagen">
                    <img src="${prodCa.urlImagenPost}" class="img-fluid"/>
                </div>
                <div class="contenido">
                    <h3>${prodCa.nombreProducto}</h3>
                    <div class="precio">
                        Precio <span>$ ${prodCa.precio} mxn</span>
                    </div>
                </div>
            </div>
        </div>`;
    
    });
        
        
        $('#cont-productos').html(contProductos);
    }

    this.getProductosSnack = function(){
        var settings = {
            "url": `/getProductosSnack/12`,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.getProductosBoutique = function(){
        var settings = {
            "url": `/getProductosBoutique/12`,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.popUpCarro = async function(slug,nombreProducto,precio, idTipoProducto, idUsuario, idProducto){
        console.log("aqui va el popup")

        console.log(idUsuario);
        //var cantidad = MagicPlanet.MiSistema.cantidadPopup;
        //console.log(cantidad);

        var cantidad = 1;
        var htmlPop = '';

        var cantemp = 1;
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <div class="cont-error" id="cont-error"></div>
                    <h2 class="text-center">${nombreProducto}</h2>`;
                    if(idTipoProducto == 6){
                        htmlPop +=
                        `<div class="row">
                            <div class="col-md-6">
                                <label>Nombre del niño</label>
                                <input type="text" name="nombreNino" id="nombreNino" class="form-control"/>
                                <input type="hidden" id="cantidad-popup" value="1">
                            </div>
                            <div class="col-md-6 text-right pt-4">
                                <h3>Total: $ ${precio} mxn</h3>
                            </div>
                        </div>`
                    }else if(idProducto == 65){
                        //aqui va el array de los morros
                        var membresias = await MagicPlanet.MiSistema.getMembresiasFromUser(idUsuario);
                        console.log(membresias)
                        htmlPop +=
                        `<div class="row">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="cont-error" id="cont-error"></div>
                                        <label>Escoge un niño</label>
                                        <select name="ninoExistente" id="ninoExistente" class="form-control">
                                        <option value="noexiste" selected>Buscar Niño</option>`;
                                        membresias.map(mem => {
                                            htmlPop +=
                                            `<option value="${mem.nombre}">${mem.nombre}</option>`;
                                        });
                                    htmlPop +=
                                        `</select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <label>Nombre del niño</label>
                                        <input type="text" name="nombreNino" class="form-control" id="nombreNino">
                                    </div>
                                </div>
                                <label>Cantidad de horas</label>
                                <div class="row">
                                    <div class="col-md-3 text-right">
                                        <button id="cajaMenos-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadHoras('menos')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                    </div>
                                    <div class="col-md-3 pl-0 pr-0">
                                        <input type="number" name="horasIndefinidas" id="horasIndefinidas" value="1" class="form-control inp" readonly/>`;
                                    htmlPop += `</div>
                                    <div class="col-md-3">
                                        <button id="cajaMas-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadHoras('mas')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 text-right pt-4">
                                <h3>Total: $ ${precio} mxn</h3>
                            </div>
                        </div>
                       <!-- <div class="cont-nombre" id="cont-nombre">
                            <div class="dato">
                                <input type="text" name="nombreNino" id="nombreNino" placeholder="Nombre del Niño" />
                            </div>
                        </div>-->`
                    }else if(idTipoProducto == 9){
                        htmlPop +=
                            `
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-6">
                                    <div class="row">
                                    <div class="col-md-12">
                                        <label>Nombre del Adulto</label>
                                        <input type="text" name="nombreNino" class="form-control" id="nombreNino">
                                    </div>
                                </div>
                                    </div>
                                    <div class="col-md-6 text-right pt-4">
                                        <h3>Total: $ ${precio} mxn</h3>
                                    </div>
                            </div>`;
                    }else{
                        htmlPop +=
                    `
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-3 text-right">
                                        <button id="cajaMenos-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadpopup('menos')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                    </div>
                                    <div class="col-md-3 pl-0 pr-0">
                                        <input type="number" name="cantidad-popup" id="cantidad-popup" value="1" class="form-control inp" readonly/>`;
                                    htmlPop += `</div>
                                    <div class="col-md-3">
                                        <button id="cajaMas-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadpopup('mas')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 text-right pt-4">
                                <h3>Total: $ ${precio} mxn</h3>
                            </div>
                    </div>`;
                    }
                    var fechaHoy = moment().format('YYYY-MM-DD');   
                    var fechaLimite = moment().add(365, 'days').calendar();
                    var hora = moment().format('LT'); 
                    fechaLimite = moment(fechaLimite).format('YYYY-MM-DD');   
                    console.log(fechaLimite);
                    hora = hora.split(" ");
                    console.log(hora[0]);
                    if(idTipoProducto == 8){
                        htmlPop +=
                        `<div class="col-md-12 mt-5">
                            <div>
                                <input type="date" id="fechaCumpleanios" name="fechaCumpleanios" value="${fechaHoy}" min="${fechaHoy}" max="${fechaLimite}">
                                <input type="time" id="horaCumpleanios" name="horaCumpleanios" value="12:00" required>
                            </div>
                        </div>`;
                    }
                    
                    htmlPop +=
                    `
                    <div class="col-md-12 mt-5">
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-aceptar btn-lg" onclick="MagicPlanet.MiSistema.prepararCarropopup('${idUsuario}', '${idProducto}', ${idTipoProducto})">Aceptar</button>
                                
                            </div>
                            <div class="col-md-6 text-right">
                                <button class="btn btn-cancelar btn-lg" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.canjearCodigo = async function(){
        // contadorCajas
        // console.log(contInput)
        var codigo_tarjeta = document.getElementById(`canjear_tarjeta`);
        // console.log(codigo_tarjeta.value);
        var datosCodigo = await MagicPlanet.MiSistema.exchangeCode(codigo_tarjeta.value);
        console.log(datosCodigo)
        if(datosCodigo.status == false){
            if(codigo_tarjeta.value != ""){
                var errorMessage = '';
                errorMessage += `
                    <div class="error">Error el codigo no existe</div>
                `;
                $('#cont-error').html(errorMessage);
            }else{
                $('#cont-error').html("");
            }
            

        }
        if(datosCodigo.status == true){
            const _horasRestantes = datosCodigo.tarjetaHora.horas_restantes;
            localStorage.setItem("horas_tarjeta", _horasRestantes);            
            if(_horasRestantes == 0){
                console.log("no quedan horas en tu tarjeta papi")
                var errorMessage2 = '';
                errorMessage2 += `
                    <div class="error">Error no quedan horas</div>`;
                $('#cont-error').html(errorMessage2);
            }else{
                $('#cont-error').html("");
                // precioTotalPop = datosCodigo.tarjetaHora.horas_restantes
                // console.log(precio);
                var horasRestantes = '';
                horasRestantes += `
                    <div>Horas Tarjeta: ${_horasRestantes}</div>`;
                    $(`#contHorasRestantes`).html(horasRestantes);

            }
            console.log(_horasRestantes)
            
        }
    }
    this.exchangeCode = async function(codigo_tarjeta){
        var settings = {
            "url": `/exchangeCode`,
            "method": "POST",
            "timeout": 0,
            "data": {
                "codigo_tarjeta": codigo_tarjeta
            }
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }

    this.popUpCarroShow = async function(slug, idUsuario, idProducto, fecha){
        //console.log("aqui va el popup")
        //console.log("producto:" + idProducto);
        //console.log("slug: " + slug);
        //console.log("fecha" + fecha);

        var show = await this.getShow(slug);
        console.log(show);

        //console.log(idUsuario);
        //var cantidad = MagicPlanet.MiSistema.cantidadPopup;
        //console.log(cantidad);

        var cantidad = 1;
        var htmlPop = '';

        var cantemp = 1;
        for(var i = 0; i<show.length;i++){
            if(show[i].fecha==fecha && show[i].id_producto==idProducto){
                htmlPop += `
                            <div class="background-pop">
                                <div class="pop-up">
                                    <div class="cont-error" id="cont-error"></div>
                                    <h2 class="text-center">${show[i].name}<br>${show[i].fecha}</h2>
                                    <div class="row mt-2">`;
                                    show[i].horarios.map(hora => {
                                        var hor = hora.split(":");
                htmlPop += `
                                    <div class="col-md-4">
                                        <button class="btn btn-primary btn-block btn-horas" id="hora_${hor[0]}" onclick="MagicPlanet.MiSistema.getHoraShow('${hora}')">${hora}</button>
                                    </div>
                                        
                `;                        
                                    })
                htmlPop += `
                                    <input type="hidden" name="horaShow" id="horaShow">
                                    </div>
                                    <div class="row mt-3">`;
                var asientosArray = [];
                //console.log(asientosArray);
                show[i].asientos.map(asiento => {
                    asientosArray.push(asiento.asiento_slug);
                htmlPop += `            <div class="col-md-12 mt-4">
                                            <div class="row">
                                                <div class="col-md-4"><h3>${asiento.name}</h3></div>
                                                <div class="col-md-3">$ ${asiento.price} mxn</div>
                                                <div class="col-md-5">
                                                    <div class="row">
                                                        <div class="col-md-4 text-right">
                                                            <button id="cajaMenos-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadpopupShow('menos','${asiento.asiento_slug}')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                                        </div>
                                                        <div class="col-md-3 pl-0 pr-0">
                                                            <input type="number" name="cantidad-popup_${asiento.asiento_slug}" id="cantidad-popup_${asiento.asiento_slug}" value="0" class="form-control inp" readonly/>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <button id="cajaMas-popup" onclick="MagicPlanet.MiSistema.cambiarCantidadpopupShow('mas','${asiento.asiento_slug}')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                })
                //console.log(asientosArray);
                htmlPop += `        </div>
                                    <div class="col-md-12 mt-5">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button class="btn btn-aceptar btn-lg" onclick="MagicPlanet.MiSistema.prepararCarropopupShow('${idUsuario}', '${idProducto}', 'show', '${asientosArray}','${fecha}')">Aceptar</button>   
                                            </div>
                                            <div class="col-md-6 text-right">
                                                <button class="btn btn-cancelar btn-lg" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `;
            }
        }
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }

    this.getHoraShow = function(hora){
        $("#horaShow").val(hora);
        var hor = hora.split(":");
        var element = document.getElementsByClassName("btn-horas");
        for (var i = 0; i<element.length; i++) {
            element[i].classList.remove("hora_seleccionada");
         }
        var elemento = document.getElementById(`hora_${hor[0]}`);

        elemento.className += " hora_seleccionada";
        
    }

    this.cantidadPopup = function(){
        return 1;
    }

    this.cambiarCantidadpopup = function(tipo){
        var cant = document.getElementById(`cantidad-popup`).value;
        //console.log("entra a la funcion");
        //console.log(cant);
        if(tipo == "menos"){
            cant--;
        }else if(tipo == "mas"){
            cant++;
        }
        
        $("#cantidad-popup").val(cant);
    }
    this.cambiarCantidadHoras = function(tipo){
        var cant = document.getElementById(`horasIndefinidas`).value;
        //console.log("entra a la funcion");
        //console.log(cant);
        if(tipo == "menos"){
            cant--;
        }else if(tipo == "mas"){
            cant++;
        }
        
        $("#horasIndefinidas").val(cant);
    }
    
    this.cambiarCantidadpopupShow = function(tipo,slug){
        var cant = document.getElementById(`cantidad-popup_${slug}`).value;
        //console.log("entra a la funcion");
        //console.log(cant);
        if(tipo == "menos"){
            cant--;
        }else if(tipo == "mas"){
            cant++;
        }
        
        $(`#cantidad-popup_${slug}`).val(cant);
    }
    this.prepararCarropopup=function(idusuario,idproducto,idtipoproducto){
        var cantidad = document.getElementById(`cantidad-popup`);
        if(cantidad != null){
            cantidad = cantidad.value;
        }else{
            cantidad = 1;
        }
        this.prepararCarro(idusuario,idproducto, cantidad,idtipoproducto);
    }
    this.prepararCarropopupShow=function(idusuario,idproducto,idtipoproducto,asientos,fecha){
        //console.log(idusuario);
        //console.log(idproducto);
        //console.log(idtipoproducto);
        //console.log(asientos);
        var asientosArray = asientos.split(",");
        //console.log(asientosArray);
        asientosArray.map(asiento =>{
            var cantidad = document.getElementById(`cantidad-popup_${asiento}`).value;
            var hora = document.getElementById(`horaShow`).value;
            console.log(cantidad);
            if(cantidad>0){
                this.prepararCarroShow(idusuario,idproducto, cantidad,idtipoproducto,asiento,fecha,hora);
            }
        });
        //var cantidad = document.getElementById(`cantidad-popup`).value;
        //this.prepararCarro(idusuario,idproducto, cantidad,idtipoproducto);
    }
    this.cancelarPopUp = function(){
        $('#cont-popup').removeClass("cont-popup");
        $('#cont-popup').html('');
    }

    this.showCarrito = function(carro, htmlCarro, idUsuario){
        var htmlCarro = '';
        carro.arrayCarro.map(arrayCarrito => {
            htmlCarro +=`
            <div class="col-md-12"> 
                <div class="row resumen">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-8">
                                <span class="nombre_producto">${arrayCarrito.nombreProducto}</span>`;
            if(arrayCarrito.idTipoProducto==10){
                var datos_show = JSON.parse(arrayCarrito.showDetails);
                console.log(datos_show);
                htmlCarro +=`   <span class="nombre_producto">${datos_show.fecha_espectaculo} | ${datos_show.hora_espectaculo}</span>`;
            }
            htmlCarro +=`   </div>
                            <div class="col-md-4 pl-0"><div class="precio_producto">${arrayCarrito.precio_format}</div></div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 pr-0 imagen-carrito"><img src="${arrayCarrito.urlImagen}" class="img-fluid"/></div>
                            <div class="col-md-9">
                                <div class="row">`;
                                if(arrayCarrito.idTipoProducto != 6 && arrayCarrito.idProducto != 65){
                                    htmlCarro += `
                                    <div class="col-md-3">
                                        <button id="cajaMenos-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMenos','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                    </div>
                                    <div class="col-md-3 pl-0 pr-0">
                                        <input type="number" name="cantidad-${arrayCarrito.idProducto}" id="cantidad-${arrayCarrito.idProducto}" value="${arrayCarrito.cantidad}" class="form-control inp" readonly/>
                                    </div>
                                    <div class="col-md-3">
                                        <button id="cajaMas-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMas','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                    </div>`;
                                }else{
                                    htmlCarro +=`
                                    <div class="col-md-9"><strong>Niño: ${arrayCarrito.child_name}</strong></div>`;
                                }
                                htmlCarro +=`
                                    <div class="col-md-3">
                                        <button class="btn btn-danger btn-control" onclick="MagicPlanet.MiSistema.popUpborrarCarrito(${arrayCarrito.id}, '${idUsuario}', '${arrayCarrito.nombreProducto}')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>`;
           })

           if(carro.totalCarro > 0){

            htmlCarro +=
            `<div class="col-md-12 total">
                <div class="row">
                    <div class="col-md-4 etotal">Total</div>
                    <div class="col-md-8 text-right price">${carro.totalCarro_format}</div>
                </div>
            </div>`;
            
       }
       $('#cont-carro').html(htmlCarro);
    }

    this.traerCarrito = async function(idUsuario){
        //console.log(idUsuario);
        var tipoCarrito = document.getElementById('tipoCarrito').value;

       var carro = await MagicPlanet.MiSistema.getCarro(idUsuario, tipoCarrito);
       //console.log("carro: ")
       console.log(carro)      
       carro.totalWithDisccount = this.formatearNumero(carro.totalCarro); 
       localStorage.setItem("carrito", JSON.stringify(carro));

       MagicPlanet.MiSistema.showCarrito(carro, htmlCarro, idUsuario);
       
       usuario = await this.getInfoUsuario(idUsuario);
       console.log(usuario);
       if(usuario.nombres == "Publico"){
           if(carro.totalCarro>0){
        var htmlCarro = `
            <div class="cont-carro col-md-12 mt-3 pb-3"> 
                <div class="row resumen">
                    <div class="col-md-12">
                        <label>Nombre del padre</label>
                        <input type="text" class="form-control" name="nombre_padre" id="nombre_padre">
                    </div>
                    <div class="col-md-12 mt-2">
                        <label>Teléfono</label>
                        <input type="text" class="form-control" name="telefono_padre" id="telefono_padre">
                    </div>
                    <div class="col-md-12 mt-2">
                        <label>Email</label>
                        <input type="text" class="form-control" name="email_padre" id="email_padre">
                    </div>
                </div>
            </div>
            <div class="boton-pago mt-4" onclick="MagicPlanet.MiSistema.confirmarPago('${idUsuario}', '${carro.totalCarro_format}', ${carro.totalCarro})"><i class="fa fa-credit-card"></i> Confirmar Pago</div>`;
           }
        }else{
            

            var htmlCarro = `
            <div class="boton-pago mt-4" onclick="MagicPlanet.MiSistema.confirmarPago('${idUsuario}', '${carro.totalCarro_format}', ${carro.totalCarro})"><i class="fa fa-credit-card"></i> Confirmar Pago</div>`;
            
        }
        if(window.location.pathname != "/venta-snacks-carro" && window.location.pathname != "/venta-boutique-carro"){
            htmlCarro +=
            `<div class="cont-error" id="cont-error">
                    
            </div>
            <h3>Canjear codigo:</h3>
            <div class="cont-canjear">
                <input type="text" name="canjear_tarjeta" id="canjear_tarjeta" onchange="MagicPlanet.MiSistema.canjearCodigo()" />
                <div class="cont-plus" onclick="MagicPlanet.MiSistema.agregarTarjeta()">Aplicar</div>
            </div>
            <div id="contHorasRestantes"></div>
            </div>`;
        }
        
            
        $('.boton-pagar').html(htmlCarro);
       
    }
    this.agregarTarjeta = async function(contNum){
        
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const id = search_params.get('id');
        
        
        var canjear_tarjeta = document.getElementById("canjear_tarjeta").value;
        if(canjear_tarjeta != ""){

        }
        var id_usuarioP = id
        const _tarjetas = localStorage.getItem("tarjetas") ? JSON.parse(localStorage.getItem("tarjetas")) : [];

        if (!(_tarjetas.length > 0 && _tarjetas.find(value => value.codigo == canjear_tarjeta))) {
            MagicPlanet.MiSistema.addTarjeta(canjear_tarjeta)
        }else {
            console.log("Ya usaste esta tarjeta");
        }    
        this.agregarNuevoCarro(id);
        $('#canjear_tarjeta').val('');
        $('#contHorasRestantes').html('');
    }
    this.agregarNuevoCarro = function(idUsuario){
        // JSON.parse(localStorage.getItem("carrito"));
    //    console.log('localStorage.getItem("carrito")');
    //    console.log(localStorage.getItem("carrito"));
       var nuevoCarro = JSON.parse(localStorage.getItem("carrito"));

    //    nuevoCarro.map()
       var htmlCarro = '';
       nuevoCarro.arrayCarro.map(arrayCarrito => {
           console.log("arrayCarrito")
           console.log(arrayCarrito)
            htmlCarro +=`
            <div class="col-md-12"> 
                <div class="row resumen">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-8">
                                <span class="nombre_producto">${arrayCarrito.nombreProducto}</span>`;
                            if(arrayCarrito.idTipoProducto==10){
                                var datos_show = JSON.parse(arrayCarrito.showDetails);
                                console.log(datos_show);
                                htmlCarro +=`   <span class="nombre_producto">${datos_show.fecha_espectaculo} | ${datos_show.hora_espectaculo}</span>`;
                            }
            htmlCarro +=`   </div>
                            <div class="col-md-4 pl-0">`;
                            if(arrayCarrito.precioProducto == arrayCarrito.precio_unitario){
                                htmlCarro +=`<div class="precio_producto">${arrayCarrito.precio_format}</div>`;
                            }else{
                                htmlCarro +=`<div class="precio_producto"><span class="precioCancelado">${arrayCarrito.precio_format}</span> ${this.formatearNumero(arrayCarrito.precio_unitario)}</div>`;
                            }
                                
                            htmlCarro +=`  
                            </div>

                                                        
                        <div class="row">
                            <div class="col-md-3 pr-0 imagen-carrito"><img src="${arrayCarrito.urlImagen}" class="img-fluid"/></div>
                            <div class="col-md-9">
                                <div class="row">`;
                                if(arrayCarrito.idTipoProducto != 6 && arrayCarrito.idProducto != 65){
                                    htmlCarro += `
                                    <div class="col-md-3">
                                        <button id="cajaMenos-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMenos','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                    </div>
                                    <div class="col-md-3 pl-0 pr-0">
                                        <input type="number" name="cantidad-${arrayCarrito.idProducto}" id="cantidad-${arrayCarrito.idProducto}" value="${arrayCarrito.cantidad}" class="form-control inp" readonly/>
                                    </div>
                                    <div class="col-md-3">
                                        <button id="cajaMas-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMas','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                    </div>`;
                                }else{
                                    htmlCarro +=`
                                    <div class="col-md-9"><strong>Niño: ${arrayCarrito.child_name}</strong></div>`;
                                }
                                htmlCarro +=`
                                    <div class="col-md-3">
                                        <button class="btn btn-danger btn-control" onclick="MagicPlanet.MiSistema.popUpborrarCarrito(${arrayCarrito.id}, '${idUsuario}', '${arrayCarrito.nombreProducto}')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>`;
           })

           

            htmlCarro +=
            `<div class="col-md-12 total">
                <div class="row">
                    <div class="col-md-4 etotal">Total</div>
                    <div class="col-md-8 text-right price">${nuevoCarro.totalWithDisccount}</div>
                </div>
            </div>`;
            
       
       $('#cont-carro').html(htmlCarro);
    }
    this.addTarjeta = function(tarjeta_code){
        const _tarjetas = localStorage.getItem("tarjetas") ? JSON.parse(localStorage.getItem("tarjetas")) : [];        
        
        const _carrito = JSON.parse(localStorage.getItem("carrito"));    
        let newTotal = 0;    
        _carrito.arrayCarro.map((car, index) => {
            let _horas = localStorage.getItem("horas_tarjeta");
            if (car.idProducto == 65 && _horas >= 0){                
                const _precioUnitario = car.precioProducto / car.horas;
                const _totalHoras = car.precio_unitario / _precioUnitario;

                const _horasRes = _horas - _totalHoras;
                if (_horasRes >= 0){                    
                    _carrito.arrayCarro[index].precio_unitario = 0;
                }else {
                    const _horasResTmp = _horasRes * -1;
                    _carrito.arrayCarro[index].precio_unitario = _horasResTmp * _precioUnitario;
                }

                localStorage.setItem("horas_tarjeta", _horasRes)
            }

            newTotal += car.precio_unitario;                        
        });
        _carrito.totalCarro = newTotal;
        _carrito.totalWithDisccount = this.formatearNumero(newTotal);

        console.log(_carrito);
        localStorage.setItem("carrito", JSON.stringify(_carrito));

        if (_tarjetas){
            _tarjetas.push({
                codigo: tarjeta_code,
                horas_restantes: localStorage.getItem("horas_tarjeta") <= 0 ? 0 : localStorage.getItem("horas_tarjeta")
            });
            localStorage.setItem("tarjetas", JSON.stringify(_tarjetas));
        }else {
            localStorage.setItem("tarjetas", JSON.stringify(_tarjetas));
        }
    }
    this.traerCarritoSnacks = async function(idUsuario){
        var tipoCarrito = document.getElementById('tipoCarrito').value;

        var carro = await MagicPlanet.MiSistema.getCarro(idUsuario, tipoCarrito);
        //console.log("carro: ")
        console.log(carro)
        var htmlCarro = '';
 
        carro.arrayCarro.map(arrayCarrito => {
         htmlCarro +=`
         <div class="col-md-12"> 
             <div class="row resumen">
                 <div class="col-md-12">
                     <div class="row">
                         <div class="col-md-8"><span class="nombre_producto">${arrayCarrito.nombreProducto}</span></div>
                         <div class="col-md-4 pl-0"><div class="precio_producto">${arrayCarrito.precio_format}</div></div>
                     </div>
                     <div class="row">
                         <div class="col-md-3 pr-0"><img src="${arrayCarrito.urlImagen}" class="img-fluid"/></div>
                         <div class="col-md-9">
                             <div class="row">`;
                             if(arrayCarrito.idTipoProducto != 6 && arrayCarrito.idProducto != 65){
                                 htmlCarro += `
                                 <div class="col-md-3">
                                     <button id="cajaMenos-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMenos','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-minus"></i></button>
                                 </div>
                                 <div class="col-md-3 pl-0 pr-0">
                                     <input type="number" name="cantidad-${arrayCarrito.idProducto}" id="cantidad-${arrayCarrito.idProducto}" value="${arrayCarrito.cantidad}" class="form-control inp" readonly/>
                                 </div>
                                 <div class="col-md-3">
                                     <button id="cajaMas-${arrayCarrito.idProducto}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMas','${arrayCarrito.idProducto}',${arrayCarrito.precioProducto},'${arrayCarrito.nombreProducto}','${arrayCarrito.idUsuario}','${arrayCarrito.idProducto}','${arrayCarrito.idTipoProducto}')" class="btn btn-primary btn-control"><i class="fas fa-plus"></i> </button>
                                 </div>`;
                             }else{
                                 htmlCarro +=`
                                 <div class="col-md-9"><strong>Niño: ${arrayCarrito.child_name}</strong></div>`;
                             }
                             htmlCarro +=`
                                 <div class="col-md-3">
                                     <button class="btn btn-danger btn-control" onclick="MagicPlanet.MiSistema.popUpborrarCarrito(${arrayCarrito.id}, '${idUsuario}', '${arrayCarrito.nombreProducto}')"><i class="fas fa-trash"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div> 
         </div>`;
        })
        if(carro.totalCarro > 0){
             htmlCarro +=
             `<div class="col-md-12 total">
                 <div class="row">
                     <div class="col-md-4 etotal">Total</div>
                     <div class="col-md-8 text-right price">${carro.totalCarro_format}</div>
                 </div>
             </div>`;
             
        }
        $('#cont-carro').html(htmlCarro);
        usuario = await this.getInfoUsuario(idUsuario);
        if(usuario.nombres == "Publico"){
         var htmlCarro = `
             <div class="cont-carro col-md-12 mt-3 pb-3"> 
                 <div class="row resumen">
                     <div class="col-md-12">
                         <label>Nombre del padre</label> 
                         <input type="text" class="form-control" name="nombre_padre" id="nombre_padre">
                     </div>
                     <div class="col-md-12 mt-2">
                         <label>Teléfono</label>
                         <input type="text" class="form-control" name="telefono_padre" id="telefono_padre">
                     </div>
                     <div class="col-md-12 mt-2">
                         <label>Email</label>
                         <input type="text" class="form-control" name="email_padre" id="email_padre">
                     </div>
                 </div>
             </div>
             <div class="boton-pago mt-4" onclick="MagicPlanet.MiSistema.popUpPagoCarro('${idUsuario}', '${carro.totalCarro_format}', ${carro.totalCarro})"><i class="fa fa-credit-card"></i> Confirmar Pago</div>`;
         }else{
             var htmlCarro = `
             <div class="boton-pago mt-4" onclick="MagicPlanet.MiSistema.popUpPagoCarro('${idUsuario}', '${carro.totalCarro_format}', ${carro.totalCarro})"><i class="fa fa-credit-card"></i> Confirmar Pago</div>`;
         }
 
         $('.boton-pagar').html(htmlCarro);
    }
    
    this.popUpborrarCarrito = async function(idCarrito, idUsuario, nombreProducto){
        var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>¿Deseas Eliminar este producto del carrito?</h2>
                    <div class="cont-producto"><div class="dato">Producto: ${nombreProducto}</div></div>
                    <div class="cont-botones" id="cont-botones">
                        <div class="boton verde" onclick="MagicPlanet.MiSistema.deleteCarrito(${idCarrito}, '${idUsuario}');">Si</div>
                        <div class="boton rojo" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    
    this.seleccionarProdCarro = function(slug, nombre, precio){
        //console.log(slug)
        if(arrayProdSeleccioando.indexOf(slug) < 0){
            arrayProdSeleccioando.push(slug);
            arrayCarro.push({slug, nombre, precio})
            arrayTotalNombres.push({slug, cantidadInput: 1, precio})
            precioTotal += parseInt(precio)
            $(`#${slug}`).addClass("seleccionado");
        }else{
            //console.log("se quitara del array")
            const index = arrayProdSeleccioando.indexOf(slug);
            // arrayCarro.indexOf({slug, nombre, precio})
            if (index > -1) {
                arrayProdSeleccioando.splice(index, 1);
                arrayCarro.splice(index, 1);
                arrayTotalNombres.splice(index, 1);
                $(`#${slug}`).removeClass("seleccionado");
                precioTotal -= parseInt(precio)
            }
        }
        
        MagicPlanet.MiSistema.mostrarCarro();
        
    }
    this.mostrarCarro = async function(){
        //console.log(arrayProdSeleccioando)
        //console.log(arrayCarro)
        var htmlCarro = '';
        var precioTotalFormat = MagicPlanet.MiSistema.formatearNumero(precioTotal);
        arrayCarro.map(ac => {
            var precio = MagicPlanet.MiSistema.formatearNumero(ac.precio);
            
            htmlCarro +=
            `<div class="carro">
                <div class="cont-titulo">
                    <h2>${ac.nombre}</h2>
                </div>
                <div class="cont-cantidad">
                    <div class="cajaMenos" id="cajaMenos-${ac.slug}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMenos','${ac.slug}',${ac.precio},'${ac.nombre}')">-</div>
                    <input type="number" name="cantidad-${ac.slug}" id="cantidad-${ac.slug}" value="1" />
                    <div class="cajaMas" id="cajaMas-${ac.slug}" onclick="MagicPlanet.MiSistema.cambiarCantidad('cajaMas','${ac.slug}',${ac.precio},'${ac.nombre}')">+</div>
                </div>
                <div class="seccion">
                    <div class="dato" id="dato-${ac.slug}">${precio}</div>
                </div>
            </div>`
        });
        htmlCarro +=
            `<div class="carro">
                <div class="cont-titulo">
                    <h2>Total</h2>
                </div>
                <div class="cont-cantidad">
                </div>
                <div class="seccion">
                    <div class="dato">${precioTotalFormat}</div>
                </div>
            </div>`
        // $('#cont-carro').html(htmlCarro);

    }
    this.cambiarCantidad = async function(accion, slug, precio, nombreP, idUsuario, idProducto, idTipoProducto){
        var cantidadInput = document.getElementById(`cantidad-${slug}`).value;
        cantidadInput = parseInt(cantidadInput);
        if(accion == "cajaMas"){
            cantidadInput = cantidadInput + 1

        }else if(accion == "cajaMenos"){
            if(cantidadInput > 1){
                cantidadInput = cantidadInput - 1
            }
            
        }
        var nuevoPrecio = precio * cantidadInput;
        var nuevoPrecioFormat = MagicPlanet.MiSistema.formatearNumero(nuevoPrecio);
        //console.log(nuevoPrecio)
       
        $(`#dato-${slug}`).html(`<span>${nuevoPrecioFormat}</span>`);
        $(`#cantidad-${slug}`).val(cantidadInput);

        arrayTotalNombres.push({slug, cantidadInput, precio})
        // idUsuario, idProducto, cantidad, idTipoProducto
        MagicPlanet.MiSistema.prepararCarro(idUsuario, idProducto, cantidad, idTipoProducto)
        MagicPlanet.MiSistema.agregarCampoNombre(slug,nombreP);
    }
    this.agregarCampoNombre = async function(slug,nombreP){
        var htmlNombre = '';
        //console.log(arrayTotalNombres)
        // arrayCarro.map(datoACarro => {
        //     console.log(datoACarro)
        // });
        htmlNombre +=
        `<div class="caja-nombre">
            <div class="titulo">
                <h2>Nombre del niño para tu ${nombreP}</h2>
            </div>
            <div class="nombre">
                <input type="text" name="nombre-${slug}" id="nombre-${slug}" />
            </div>
        </div>`;
        $(`#cont-nombres`).html(htmlNombre);
    }
    this.traerUsuariosPersonas = async function(idUsuarioPersonalizado){
        let html = `<table class="table">
            <tr>
                <th>Nombres</th>
                <th>Horas Globales</th>
                <th>Status</th>
                <th></th>
            </tr>`;

        let datosUsuarios = await MagicPlanet.MiSistema.getUsuariosPersonas(idUsuarioPersonalizado);
       // console.log(datosUsuarios);
        let nombreUserP = datosUsuarios.nombres+" "+datosUsuarios.apellidos;
        html +=
        `<tr>
                <td>${nombreUserP}</td>
                <td><span class="horasGlobales"></span></td>
                <td><span class="horasGlobales"></span></td>
                <td class="text-right">
                    <button class="btn btn-primary btn-sm btn-control" onclick="MagicPlanet.MiSistema.escogerPersona('${nombreUserP}','${datosUsuarios.idUsuarioPersonalizado}','usuario-principal')"><i class="fas fa-user-plus"></i></button>
                </td>
            </tr>`;
        datosUsuarios.ninoUser.map(ninosUser =>{
            html +=
            `<tr>
                <td>${ninosUser.nombre}</td>
                <td>${ninosUser.horas_globales}</td>
                <td>${ninosUser.status}</td>
                <td class="text-right">
                    <button class="btn btn-primary btn-sm btn-control" onclick="MagicPlanet.MiSistema.escogerPersona('${ninosUser.nombre}','${ninosUser.sku_membresia}','usuario-nino')"><i class="fas fa-user-plus"></i></button>
                </td>
            </tr>`;
        });
        datosUsuarios.padresUsuario.map(padresUser =>{
            html +=
            `<tr>
                <td>${padresUser.nombre}</td>
                <td><span class="horasGlobales"></span></td>
                <td>${padresUser.status}</td>
                <td class="text-right">
                    <button class="btn btn-primary btn-sm btn-control" onclick="MagicPlanet.MiSistema.escogerPersona('${padresUser.nombre}','${padresUser.id}','usuario-padre')"><i class="fas fa-user-plus"></i></button>
                </td>
            </tr>`;
        });

        html += `
            </table>
        `;

        $('#cont-personasUsuarios').html(html);
    }

    this.traerVinculosBrazalete = async function(idUser){
        console.log(idUser)
        var vb = await MagicPlanet.MiSistema.getVinculosBrazalete(idUser);
        let html = '';
        console.log("vb");
        console.log(vb);
        html += `<table class="table">`;
        vb.map(vinculosP => {
           console.log(vinculosP.usuario)
            if(vinculosP.usuario.nombres != null){
                var nombres = vinculosP.usuario.nombres+" "+vinculosP.usuario.apellidos;
            }else{
                var nombres = vinculosP.usuario.nombre;
            }
            html +=
                `<tr>
                    <td>${nombres}</td>
                    <td>${vinculosP.codigo_brazalete}</td>
                    <td class="text-right">
                        <button class="btn btn-default btn-borrar" onclick="MagicPlanet.MiSistema.eliminarVinculo(${vinculosP.id},'${idUser}')"><i class="fas fa-trash"></i></button>
                    </td>
                    
                </tr>`;
        });
        html += `</table>`;

            $('#cont-vinculados').html(html);

    }
    this.confirmarPago = async function(idUsuario, precio_format, totalCarro){
        //console.log("pagando");
        var usuario = await this.getInfoUsuario(idUsuario);
        console.log("contadorCajas")
        console.log(contadorCajas)
        // arrayCodigosT = [];
        // var canjear_tarjeta = document.getElementById("canjear_tarjeta").value;
        // if(canjear_tarjeta != ""){
        //     console.log("si hay tarjeta")
            
        //     // for(var i = 0; i <= contadorCajas; i++){
        //     //     let canjear_tarjeta = document.getElementById(`canjear_tarjeta-${i}`).value;
        //     //     console.log("array codigos:")
        //     //     // console.log(canjear_tarjeta);
        //     //     arrayCodigosT.push(canjear_tarjeta) 
        //     //     console.log(arrayCodigosT)
        //     // }
        // }else{
        //     console.log("no hay tarjeta")
        // }
        if(usuario.nombres == "Publico"){
            var nombre_padre = document.getElementById(`nombre_padre`).value;
            var telefono_padre = document.getElementById(`telefono_padre`).value;
            var email_padre = document.getElementById(`email_padre`).value;

            this.actualizarUsuarioNuevo(idUsuario,nombre_padre,email_padre,telefono_padre);
        }
        MagicPlanet.MiSistema.popUpTipoPago(idUsuario, precio_format, totalCarro);
        // MagicPlanet.MiSistema.popUpPago(idUsuario, precio_format);
    }
    this.traerDeudas = async function(idUsuario){
        var htmldeuda = '';
        var htmldeuda2 = '';
        
        var deudasHoras = await MagicPlanet.MiSistema.getDeudasHoras(idUsuario);
        var deudaCuentaA = await MagicPlanet.MiSistema.getDeudasCuentaAbierta(idUsuario);
        var horasDisponibles = await MagicPlanet.MiSistema.checarHorasMembresias(idUsuario);
        console.log("horasDisponibles")
        console.log(horasDisponibles)
        // console.log(deudasHoras);
        // console.log(deudaCuentaA);
        htmldeuda += `<div class="tituloTabla">Deuda Horas</div>
            <table>
                <tr>
                    <th>Id Membresia</th>
                    <th>Tipo Deuda</th>
                    <th>Cantidad Horas</th>
                    <th>Total Deuda</th>
                </tr>`;
                
        deudasHoras.map(deudaHora => {
            if(deudaHora.deuda_horas != 0 && deudaHora.deuda_horas != null){
                arraySkuBanco.push({
                    sku_membresia: deudaHora.sku_membresia,
                    deuda_horas: deudaHora.deuda_horas
                });
                let precioDeuda = parseInt(deudaHora.deuda_horas) * 130;
                contadorPrecioHoras = contadorPrecioHoras + precioDeuda;
                precioDeuda = MagicPlanet.MiSistema.formatearNumero(precioDeuda)
                htmldeuda += 
                `<tr>
                    <td>${deudaHora.sku_membresia}</td>
                    <td>Deuda por hora</td>
                    <td>${deudaHora.deuda_horas}</td>
                    <td>${precioDeuda}</td>`;
                    if(horasDisponibles.length > 0){
                        htmldeuda += 
                        `<td><div class="botonCanjear" onclick="MagicPlanet.MiSistema.popUpCanjear('${idUsuario}','${deudaHora.sku_membresia}','${deudaHora.deuda_horas}')">Canjear</div></td>`;
                    }
                htmldeuda += 
                `</tr>`;
            }
        });
        htmldeuda += `</table>
        <div class="cont-totalT">
            <div class="totalT">${MagicPlanet.MiSistema.formatearNumero(contadorPrecioHoras)}</div>
        </div>`;

            htmldeuda2 +=
            `<div class="tituloTabla">Deudas Cuenta Abierta</div>
            <table>
                <tr>
                    <th>TIPO PAGO</th>
                    <th>PRODUCTO</th>
                    <th>CANTIDAD</th>
                    <th>PRECIO UNITARIO</th>
                    <th>TOTAL PRODUCTO</th>
                </tr>`;
                
        // deudaCuentaA.ticket_productos.map(deudaca => {
        //     let precioDeuda = MagicPlanet.MiSistema.formatearNumero(deudaca.precio_unitario)
        //     let precioTotal = parseInt(deudaca.precio_unitario) * parseInt(deudaca.cantidad);
        //     contadorPrecio = contadorPrecio + precioTotal;
        //     precioTotal = MagicPlanet.MiSistema.formatearNumero(precioTotal)
        //         htmldeuda2 +=
        //             `<tr>
        //                 <td>${deudaCuentaA.customerTicketId}</td>
        //                 <td>${deudaca.producto.nombreProducto}</td>
        //                 <td>${deudaca.cantidad}</td>
        //                 <td>${precioDeuda}</td>
        //                 <td>${precioTotal}</td>
        //             </tr>`
            
        // });
        var contadorID = 0;
        deudaCuentaA.map(deudaca => {
            arrayTicketId.push({
                idTicketSecret: deudaca.idTicketSecret,
            });
            deudaca.ticket_productos.map(deudaca2 => {
                contadorID = contadorID + 1;
                let precioDeuda = MagicPlanet.MiSistema.formatearNumero(deudaca2.precio_unitario)
                let precioTotal = parseInt(deudaca2.precio_unitario) * parseInt(deudaca2.cantidad);
                contadorPrecio = contadorPrecio + precioTotal;
                precioTotal = MagicPlanet.MiSistema.formatearNumero(precioTotal)
                    htmldeuda2 +=
                        `<tr>
                            <td>${contadorID}</td>
                            <td>${deudaca.customerTicketId}</td>
                            <td>${deudaca2.producto.nombreProducto}</td>
                            <td>${deudaca2.cantidad}</td>
                            <td>${precioDeuda}</td>
                            <td>${precioTotal}</td>
                        </tr>`;
            })
            
            
        });
        htmldeuda2 +=
        `</table>
        <div class="cont-totalT">
            <div class="totalT">${MagicPlanet.MiSistema.formatearNumero(contadorPrecio)}</div>
        </div>
        <div class="cont-totalT">
            <div class="totalT">${MagicPlanet.MiSistema.formatearNumero(contadorPrecio + contadorPrecioHoras)}</div>
        </div>`;


        $('#cont-deudasHoras').html(htmldeuda);
        $('#cont-cuentaAbierta').html(htmldeuda2);
    }
    this.popUpCanjear = async function(idUsuario, sku_membresia, deuda_horas){

        var horasDisponibles = await MagicPlanet.MiSistema.checarHorasMembresias(idUsuario);
        htmlPop = '';
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>Canjear Horas de membresia para pagar deuda</h2>
                    <div class="col-md-12">
                        <div class="row"> 
                            <div class="col-md-12">
                                <div>Escoge la cuenta de donde utilizaras horas para pagar tu deuda.</div>
                            </div>
                        </div>
                        <div class="row cont-deuditas"> 
                            <select name="select_pagarDeudas" id="select_pagarDeudas" class="selectPop" onchange="MagicPlanet.MiSistema.cambioMembresia()">`;
                            horasDisponibles.map((hd, index) => {
                                console.log(index)
                                if(index == 0){
                                    htmlPop +=
                                    `<option value="${hd.sku_membresia}" selected>${hd.sku_membresia}</option>`;
                                }else{
                                    htmlPop +=
                                    `<option value="${hd.sku_membresia}">${hd.sku_membresia}</option>`;
                                }
                                
                            });
                        htmlPop +=
                            `</select>
                            <input type="hidden" name="horasRest" id="horasRest" value="${horasDisponibles[0].horas_restantes}" />
                            <div class="horasRestantes" id="cont_horasRestantes">${horasDisponibles[0].horas_restantes}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <button class="btn btn-default boton-tarjeta" onclick="MagicPlanet.MiSistema.pagarDeudasPorMembresia('${sku_membresia}', ${deuda_horas},${horasDisponibles[0].horas_restantes},'${idUsuario}')">Pasar Horas</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-defautl boton-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()"><i class="far fa-window-close"></i> Regresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
        
    }
    this.pagarDeudasPorMembresia = async function(sku_membresia, deuda_horas, horas_restantes, idUsuario){
        var select_pagarDeudas = document.getElementById("select_pagarDeudas");
        var horasRest = document.getElementById("horasRest").value;
        console.log(select_pagarDeudas.value);
        console.log(sku_membresia)
        console.log(deuda_horas)
        var response = await MagicPlanet.MiSistema.payDeudaMembresia(select_pagarDeudas.value, sku_membresia, deuda_horas, horasRest);
        console.log(response.status);
        window.location.href = `/checar-checkout?id=${idUsuario}`;
    }
    this.payDeudaMembresia = function(select_pagarDeudas, sku_membresia, deuda_horas, horas_restantes){
        console.log(select_pagarDeudas)
        console.log(sku_membresia)
        console.log(deuda_horas)
        console.log(horas_restantes)
        
        var settings = {
            "url": `/pagarDeudasPorMembresia`,
            "method": "POST",
            "timeout": 0,
            "data": {
                "select_pagarDeudas": select_pagarDeudas,
                "sku_membresia": sku_membresia,
                "deuda_horas": deuda_horas,
                "horas_restantes": horas_restantes
                
            }
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.traerMembresiasFromUser = async function(id_userP){
        var membresias = await MagicPlanet.MiSistema.getMembresiasFromUser(id_userP);
        console.log(membresias)

    }
    this.cambioMembresia = async function(){
        var select_pagarDeudas = document.getElementById("select_pagarDeudas");

        var horasRestantes = await MagicPlanet.MiSistema.getHorasRestantes(select_pagarDeudas.value);
        console.log("horasRestantes")
        console.log(horasRestantes)
        $('#horasRest').val(horasRestantes);
        $('#cont_horasRestantes').html(horasRestantes);
    }
    this.getHorasRestantes = function(sku_membresia){
        var settings = {
            "url": `/getHorasRestantes/${sku_membresia}`,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.getDeudasHoras = function(id_user){
        var settings = {
            "url": `/getDeudasHoras/${id_user}`,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.getDeudasCuentaAbierta = function(id_user){
        var settings = {
            "url": `/getDeudasCuentaAbierta/${id_user}`,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.getMembresiasFromUser = function(id_user){
        var settings = {
            "url": `/getMembresiasFromUser/${id_user}`,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.actualizarUsuarioNuevo= function(idUsuario,nombrePadre,emailPadre,telefonoPadre){

        var nombres = nombrePadre.split(' ');
        //console.log(nombres);
        if(nombres.length>1){
            var nombre = nombres[0];
            var apellido = nombres[1];
        }else{
            var nombre = nombres[0];
            var apellido = "";
        }
        //console.log("nombre: " + nombre);
        //console.log("apellido: " +apellido);
        var settings = {
            "url": "/actualizar-usuario-temporal",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "idUsuario": idUsuario,
              "nombrePadre": nombre,
              "apellidoPadre": apellido,
              "emailPadre": emailPadre,
              "telefonoPadre": telefonoPadre
            }
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.popUpTipoPago = function(idUsuario, precio_format, totalCarro){
        var htmlPop = '';
        const _tarjetas = localStorage.getItem("tarjetas")
        const carrito = JSON.parse(localStorage.getItem("carrito"));
        if(carrito.totalWithDisccount == undefined){
            var precioMostrar = carrito.totalCarro_format;
        }else{
            var precioMostrar = carrito.totalWithDisccount;
        }

        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>Forma de pago</h2>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">
                                <button class="btn btn-default boton-tarjeta" onclick="MagicPlanet.MiSistema.popUpPagoTarjeta('${idUsuario}','${precioMostrar}')"><i class="far fa-credit-card"></i> Pago con<br>Tarjeta</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-default boton-efectivo" onclick="MagicPlanet.MiSistema.popUpPagoEfectivo('${idUsuario}','${precioMostrar}','${carrito.totalCarro}')"><i class="fas fa-money-bill-wave"></i> Pagar en<br>Efectivo</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-default boton-despues" onclick="MagicPlanet.MiSistema.popUpPagoCuentaA('${idUsuario}','${precioMostrar}','${carrito.totalCarro}')"><i class="fas fa-shopping-basket"></i> Cuenta abierta</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-defautl boton-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()"><i class="far fa-window-close"></i> Regresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.popUpDeudas = function(){
        
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const idUsuario = search_params.get('id');
        var precioMostrar = MagicPlanet.MiSistema.formatearNumero(contadorPrecio + contadorPrecioHoras);
        var totalDeuda = contadorPrecio + contadorPrecioHoras;
        htmlPop = '';
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>Forma de pago</h2>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">
                                <button class="btn btn-default boton-tarjeta" onclick="MagicPlanet.MiSistema.popUpPagoTarjetaDeuda('${idUsuario}','${precioMostrar}')"><i class="far fa-credit-card"></i> Pago con<br>Tarjeta</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-default boton-efectivo" onclick="MagicPlanet.MiSistema.popUpPagoEfectivoDeuda('${idUsuario}','${precioMostrar}','${totalDeuda}')"><i class="fas fa-money-bill-wave"></i> Pagar en<br>Efectivo</button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-defautl boton-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()"><i class="far fa-window-close"></i> Regresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.popUpPagoTarjetaDeuda = function(idUsuario, precio_format){

        var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>Pago con tarjeta de crédito o debito</h2>
                    <div class="col-md-12">
                        <h3>Cantidad a Pagar: ${precio_format}</h3>
                    </div>
                    <div class="col-md-12">
                        <label>Folio del voucher generado por terminal</label>
                        <input type="text" name="id-ticket" id="id-ticket" class="form-control" />
                    </div>
                    <div class="col-md-12 mt-4">
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-default btn-pagar" onclick="MagicPlanet.MiSistema.pagarCarroDeuda('${idUsuario}')">Pagar</button>
                            </div>
                            <div class="col-md-6 text-right">
                                <button class="btn btn-default btn-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button>
                            </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.pagarCarroDeuda = async function(id_usuario){
        var id_ticket = document.getElementById("id-ticket");
        var cantidadEfectivo = document.getElementById("cantidadEfectivo");
        var cuentaAbierta = document.getElementById("cuentaAbierta");
        var tipoCarrito = document.getElementById('tipoCarrito');
        if(tipoCarrito != null){
            tipoCarrito = tipoCarrito.value
        }else{
            tipoCarrito = "indefinido"
        }
        var errorHtml = '';

        if(id_ticket != null){
            if(id_ticket.value == ""){
                errorHtml += `<div class="error">Falta por insertar el codigó del ticket</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            id_ticket = id_ticket.value;
        }else{
            
            id_ticket = "EFECTIVO"
            
        }
    
       
        
        var responseCarro = await MagicPlanet.MiSistema.payCartDeuda(id_ticket, id_usuario);
        console.log("responseCarro")
        console.log(responseCarro)
        window.location.href = `/checar-checkout?id=${id_usuario}`;
       // console.log(responseCarro.message)
       
    //    if(tipoCarrito == "carro-recepcion"){
    //    htmlPop = `
    //         <div class="background-pop">
    //             <div class="pop-up">
    //                 <div class="cont-error" id="cont-error"></div>
    //                 <h2>Pago en Efectivo</h2>
    //                 <div class="col-md-12 mt-3">
    //                     <div class="row">
    //                         <div class="col-md-4"><button class="btn btn-primary btn-lg r-whatsapp" onclick="MagicPlanet.MiSistema.enviarTicket('${id_ticket}','whatsapp','${id_usuario}')"><i class="fab fa-whatsapp"></i><br>Whatsapp Recibo</button></div>
    //                         <div class="col-md-4"><button class="btn btn-primary btn-lg r-email" onclick="MagicPlanet.MiSistema.enviarTicket('${id_ticket}','email','${id_usuario}')"><i class="far fa-envelope"></i><br>Email Recibo</button></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //    `;
    //    $('#cont-popup').html(htmlPop);
    //    }else{
    //     window.location.replace(`/venta-snacks`);
    //    }

        
        
    }
    this.payCartDeuda = function(id_ticket, usuarioId){
        console.log("id_ticket")
        console.log(id_ticket)
        console.log("arrayTicketId")
        console.log(arrayTicketId)
        console.log("arraySkuBanco")
        console.log(arraySkuBanco)
        
        var settings = {
            "url": "/payCartDeuda",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data":{
                "id_ticket": id_ticket,
                "arrayTicketId": arrayTicketId,
                "arraySkuBanco": arraySkuBanco,
                "usuarioId": usuarioId
            }
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.popUpPagoTarjeta = function(idUsuario, precio_format){

        var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <h2>Pago con tarjeta de crédito o debito</h2>
                    <div class="col-md-12">
                        <h3>Cantidad a Pagar: ${precio_format}</h3>
                    </div>
                    <div class="col-md-12">
                        <label>Folio del voucher generado por terminal</label>
                        <input type="text" name="id-ticket" id="id-ticket" class="form-control" />
                    </div>
                    <div class="col-md-12 mt-4">
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-default btn-pagar" onclick="MagicPlanet.MiSistema.pagarCarro('${idUsuario}')">Pagar</button>
                            </div>
                            <div class="col-md-6 text-right">
                                <button class="btn btn-default btn-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button>
                            </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    
    this.popUpPagoEfectivo = function(idUsuario, precio_format,totalCarro){
        var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <div class="cont-error" id="cont-error">
                    
                    </div>
                    <h2>Pago en Efectivo</h2>
                    <div class="col-md-12">
                        <h3>Cantidad a pagar: ${precio_format}</h3>
                    </div>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">Efectivo entregado</div>
                            <div class="col-md-3"><input type="text" class="form-control" name="cantidadEfectivo" id="cantidadEfectivo"></div>
                            <div class="col-md-3"><button class="btn btn-primary" onclick="MagicPlanet.MiSistema.cambioEfectivo('${idUsuario}',${totalCarro})">Cambio</button></div>
                            <div class="col-md-3"><div class="cont-cambio" id="cont-cambio"></div></div>
                        </div>
                        <div class="row mt-4" id="cont-botones">
                        </div>
                    </div>
                    
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.popUpPagoEfectivoDeuda = function(idUsuario, precio_format,totalCarro){
        var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <div class="cont-error" id="cont-error">
                    
                    </div>
                    <h2>Pago en Efectivo</h2>
                    <div class="col-md-12">
                        <h3>Cantidad a pagar: ${precio_format}</h3>
                    </div>
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-3">Efectivo entregado</div>
                            <div class="col-md-3"><input type="text" class="form-control" name="cantidadEfectivo" id="cantidadEfectivo"></div>
                            <div class="col-md-3"><button class="btn btn-primary" onclick="MagicPlanet.MiSistema.cambioEfectivoDeuda('${idUsuario}',${totalCarro})">Cambio</button></div>
                            <div class="col-md-3"><div class="cont-cambio" id="cont-cambio"></div></div>
                        </div>
                        <div class="row mt-4" id="cont-botones">
                        </div>
                    </div>
                    
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.popUpPagoCuentaA = function(idUsuario, precio_format,totalCarro){

            var htmlPop = '';
        
        htmlPop +=
            `<div class="background-pop">
                <div class="pop-up">
                    <div class="cont-error" id="cont-error">
                    
                    </div>
                    <h2>Pago de cuenta abierta</h2>
                    <div class="col-md-12">
                        <h3>Cantidad a Pagar: ${precio_format}</h3>
                    </div>
                    <div class="col-md-12">
                        <label>Confirma si deseas que el total de ${precio_format} quede a cuenta abierta</label>
                        <input type="hidden" name="cuentaAbierta" id="cuentaAbierta" value="true" />
                    </div>
                    <div class="col-md-12 mt-4">
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-default btn-pagar" onclick="MagicPlanet.MiSistema.pagarCarro('${idUsuario}')">Pagar</button>
                            </div>
                            <div class="col-md-6 text-right">
                                <button class="btn btn-default btn-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button>
                            </div>
                    </div>
                </div>
            </div>`;
            
            $('#cont-popup').addClass("cont-popup");
            $('#cont-popup').html(htmlPop);
    }
    this.cambioEfectivo = function(idUsuario, totalCarro){
        var cantidadEfectivo = document.getElementById("cantidadEfectivo");
        var htmlBotones = '';
        var htmlCambio = '';
        var errorHtml = '';

        
            if(cantidadEfectivo.value == ""){
                errorHtml += `<div class="error">Falta por insertar el total en efectivo</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            if(parseInt(cantidadEfectivo.value) < parseInt(totalCarro)){
                errorHtml += `<div class="error">El Efectivo es menor al Precio Total</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            var cambio = parseInt(cantidadEfectivo.value) - parseInt(totalCarro);
            cambio = MagicPlanet.MiSistema.formatearNumero(cambio)
            htmlCambio += 
            `<div class="cambio">Cambio: ${cambio}</div>`;

            htmlBotones +=
            `<div class="col-md-6"><button class="btn btn-pagar" onclick="MagicPlanet.MiSistema.pagarCarro('${idUsuario}')">Pagar</button></div>
            <div class="col-md-6 text-right"><button class="btn btn-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button></div>`;
        $('#cont-cambio').html(htmlCambio);
        $('#cont-botones').html(htmlBotones);
    }
    this.cambioEfectivoDeuda = function(idUsuario, totalCarro){
        var cantidadEfectivo = document.getElementById("cantidadEfectivo");
        var htmlBotones = '';
        var htmlCambio = '';
        var errorHtml = '';

        
            if(cantidadEfectivo.value == ""){
                errorHtml += `<div class="error">Falta por insertar el total en efectivo</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            if(parseInt(cantidadEfectivo.value) < parseInt(totalCarro)){
                errorHtml += `<div class="error">El Efectivo es menor al Precio Total</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            var cambio = parseInt(cantidadEfectivo.value) - parseInt(totalCarro);
            cambio = MagicPlanet.MiSistema.formatearNumero(cambio)
            htmlCambio += 
            `<div class="cambio">Cambio: ${cambio}</div>`;

            htmlBotones +=
            `<button class="btn btn-default btn-pagar" onclick="MagicPlanet.MiSistema.pagarCarroDeuda('${idUsuario}')">Pagar</button>
            <div class="col-md-6 text-right"><button class="btn btn-cancelar" onclick="MagicPlanet.MiSistema.cancelarPopUp()">Cancelar</button></div>`;
        $('#cont-cambio').html(htmlCambio);
        $('#cont-botones').html(htmlBotones);
    }
    this.pagarCarro = async function(id_usuario){
        var id_ticket = document.getElementById("id-ticket");
        var cantidadEfectivo = document.getElementById("cantidadEfectivo");
        var cuentaAbierta = document.getElementById("cuentaAbierta");
        var tipoCarrito = document.getElementById('tipoCarrito');
        if(tipoCarrito != null){
            tipoCarrito = tipoCarrito.value
        }else{
            tipoCarrito = "indefinido"
        }
        var errorHtml = '';
        var tipoPago;
        if(cuentaAbierta != null){
            console.log("es cuenta abierta")
            cuentaAbierta = cuentaAbierta.value;
        }else{
            console.log("es cuenta cerrada")
            cuentaAbierta = false;
        }
        if(id_ticket != null){
            if(id_ticket.value == ""){
                errorHtml += `<div class="error">Falta por insertar el codigó del ticket</div>`;
    
                $('#cont-error').html(errorHtml)
                return;
            }
            id_ticket = id_ticket.value;
        }else{
            if(cuentaAbierta){
                id_ticket = "CUENTA ABIERTA"
            }else{
                id_ticket = "EFECTIVO"
            }
            
        }
        const carrito = JSON.parse(localStorage.getItem("carrito"));
        if(!localStorage.getItem("tarjetas") == []){
            var tarjetas = JSON.parse(localStorage.getItem("tarjetas"));
        }else{
            var tarjetas = [];
        }
       
        
        var responseCarro = await MagicPlanet.MiSistema.payCartSistem(id_usuario, id_ticket, cuentaAbierta, tipoCarrito, carrito, tarjetas);
       // console.log(responseCarro.message)
       var id_ticket=responseCarro.message;
       if(tipoCarrito == "carro-recepcion"){
       htmlPop = `
            <div class="background-pop">
                <div class="pop-up">
                    <div class="cont-error" id="cont-error"></div>
                    <h2>Pago en Efectivo</h2>
                    <div class="col-md-12 mt-3">
                        <div class="row">
                            <div class="col-md-4"><button class="btn btn-primary btn-lg r-whatsapp" onclick="MagicPlanet.MiSistema.enviarTicket('${id_ticket}','whatsapp','${id_usuario}')"><i class="fab fa-whatsapp"></i><br>Whatsapp Recibo</button></div>
                            <div class="col-md-4"><button class="btn btn-primary btn-lg r-email" onclick="MagicPlanet.MiSistema.enviarTicket('${id_ticket}','email','${id_usuario}')"><i class="far fa-envelope"></i><br>Email Recibo</button></div>
                        </div>
                    </div>
                </div>
            </div>
       `;
       $('#cont-popup').html(htmlPop);
       }else{
        window.location.replace(`/venta-snacks`);
       }

        
        
    }
    this.enviarTicket = async function(ticket,tipo,idUsuario){
        var usuario = await this.getInfoUsuario(idUsuario);
        console.log(usuario);
        var settings = {
            "url": `/ticket-pdf/${ticket}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
              
            },
          };
          
          $.ajax(settings).done(function (response) {
            if(response.status==200){
                var urlTicket = response.message.rutaPdf;
                var settings = {
                    "url": "/send-ticket-whatsapp",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "Content-Type": "application/json"
                      
                    },
                    "data": JSON.stringify({
                      "numberPhone": `${usuario.phone}`,
                      "urlTicket": `${urlTicket}`
                    }),
                  };
                  
                  $.ajax(settings).done(function (response) {
                    window.location.replace(`/seccion-opciones?id_ticket=${ticket}&user_id=${idUsuario}`);
                  });
            }
          });
    }
    this.vincularBrazalete = async function(){
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const id = search_params.get('id');

        let codigo_brazalete = document.getElementById('codigo_brazalete').value;
        let tipoAdulto = document.getElementById('tipoAdulto');
        let id_usuario_personalizado = document.getElementById('id').value;
        let identificadorPersona = document.getElementById('identificadorPersona').value;
        let tBrazalete = document.getElementById('tBrazalete').value;
        //console.log('tBrazalete')
        //console.log(tBrazalete)
        if(tipoAdulto == null){
            tipoAdulto = ""
        }else{
            tipoAdulto = tipoAdulto.value
        }
        var vinculacion = await MagicPlanet.MiSistema.createVinculacion(codigo_brazalete,tipoAdulto,id_usuario_personalizado,identificadorPersona,tBrazalete);
        // window.location.replace(`/vincular-brazalete?id=${id_usuario_personalizado}`);
        window.location.href = `/vincular-brazalete?id=${id_usuario_personalizado}`;
        //console.log('vinculacion');
        //console.log(vinculacion);
        
        //window.location.replace(`/vincular-brazalete?id=${id}`);
        // console.log(codigo_brazalete);
        // console.log(tipoBrazalete);
        // console.log(id_usuario_personalizado)
        // console.log(identificadorPersona)
    }
    this.generarEntradaSalida = async function(){
        let codigo_brazalete = document.getElementById("codigo_brazalete").value;
        
        //console.log(codigo_brazalete);
        var respuestaES = await MagicPlanet.MiSistema.sendEntradaSalida(codigo_brazalete)
        //console.log(respuestaES)
        var mensajeRespuesta = '';
        $('#cont-principal').html('')
        if(respuestaES.access){
            
                mensajeRespuesta += 
                `<div class="con-mensaje">
                    <div class="centrar">
                        <div class="mensaje verde">Acceso Exitoso, <a href="/chequeo-entrada">regresar al punto de chequeo</a></div>
                    </div>
                </div>`;
        }else if(respuestaES.access == false){
            
            if(respuestaES.out){
                mensajeRespuesta += 
                    `<div class="con-mensaje">
                        <div class="centrar">
                            <div class="mensaje verde">Salida Exitosa, hasta luego, <a href="/chequeo-entrada">regresar al punto de chequeo</a></div>
                        </div>
                    </div>`;
            }else{
                mensajeRespuesta += 
                `<div class="con-mensaje">
                    <div class="centrar">
                        <div class="mensaje rojo">${respuestaES.mensaje}, <a href="/chequeo-entrada">regresar al punto de chequeo</a></div>
                    </div>
                </div>`;
            }
            
                
        }
        
        $('#cont-principal').html(mensajeRespuesta)
    }
    this.traerTarjetasHoras = async function(id_usuarioP){
        var tarjetas_digitales = await MagicPlanet.MiSistema.getTarjetasHoras(id_usuarioP)
        //console.log(tarjetas_digitales);
        var tarjeta = '';
        tarjetas_digitales.map((tarjetaDigital,index) => {
            tarjeta +=
            `<div class="cont-tarjeta hora-tarjeta" id="hora-${index}" onclick="MagicPlanet.MiSistema.seleccionarHora('${tarjetaDigital.tarjeta_code}','hora-${index}')">
                <div class="cont-texto">
                    <div class="seccion">
                        <h2>Horas</h2>
                        <div class="texto">${tarjetaDigital.total_horas}</div>
                    </div>
                    <div class="seccion">
                        <h2>Codigo Canjeo</h2>
                        <div class="texto">${tarjetaDigital.tarjeta_code}</div>
                    </div>
                </div>
            </div>`;
        });
        $('#cont-tarjetas').html(tarjeta);
    }
    this.seleccionarHora = function(tarjeta_code, horaId){
        // console.log(tarjeta_code)
        arrayHora = tarjeta_code;
        // console.log(arrayHora)
        $('.hora-tarjeta').removeClass("seleccionado")
        $(`#${horaId}`).addClass("seleccionado");
    }
    this.traerNinos = async function(id_usuarioP){

        var ninos = await MagicPlanet.MiSistema.getTodosNinos(id_usuarioP);
        console.log(ninos)

        var ninoshtml = '';
        //console.log(ninos);
        ninos.map((niños,index) => {
            ninoshtml +=
            `<div class="col-md-4" >
                <div class="col-md-12 card-membresias" id="ninos-${index}" onclick="MagicPlanet.MiSistema.seleccionarNino('${niños.sku_membresia}','ninos-${index}')">
                    <h3>Nombre</h3>
                    <span>${niños.nombre}</span><br>
                    <h3>Membresia</h3>
                    <span>${niños.sku_membresia}</span><br>
                    <button class="btn btn-primary btn-control mt-3">Seleccionar</button>
                </div>
            </div>`;
        });
        $('#cont-membresias').html(ninoshtml);
    }
    this.seleccionarNino = function(sku_membresia, ninoId){
        // console.log(sku_membresia)
        arrayNino = sku_membresia;
        // console.log(arrayHora)
        $('.nino-tarjeta').removeClass("seleccionado")
        $(`#${ninoId}`).addClass("seleccionado");
    }
    this.vincularHoras = async function(){
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const id = search_params.get('id');
        //console.log(arrayHora)
        //console.log(arrayNino)
        var horasVinculadas = await MagicPlanet.MiSistema.vinculateHoras(arrayHora,arrayNino,id);
        //console.log(horasVinculadas)
        window.location.href = `/asignar-horas?id=${id}`;
    }
    this.crearNino = async function(id_usuarioP){
        const nombre_nino = document.getElementById("nombre_nino").value;
        var ninos = await MagicPlanet.MiSistema.ninoCreate(id_usuarioP,nombre_nino);
        //console.log(ninos);
        window.location.href = `/asignar-horas?id=${id_usuarioP}`;
    }
    this.vinculateHoras = function(arrayH, arrayN, id_user){
        var settings = {
            "url": "/vinculateHoras",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data":{
                arrayH,
                arrayN,
                id_user
            }
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.ninoCreate = function(id_usuarioP,nombre_nino){
        var settings = {
            "url": "/ninoCreate",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data":{
                id_usuarioP,
                nombre_nino
            }
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.checarHorasMembresias = function(id_usuarioP){
        var settings = {
            "url": "/checarHorasMembresias/"+id_usuarioP,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.getTodosNinos = function(id_usuarioP){
        var settings = {
            "url": "/getMembresiasFromUser/"+id_usuarioP,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.getTarjetasHoras = function(id_usuarioP){
        var settings = {
            "url": "/getTarjetasHoras/"+id_usuarioP,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }
    this.sendEntradaSalida = function(codigo_brazalete){
        var settings = {
            "url": "/asignar-entrada-salida",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "codigo_brazalete": codigo_brazalete
            }
          };
          
          return $.ajax(settings).done(function (response) {
            return response;
          });
    }

    this.createVinculacion = function(codigo_brazalete,tipoAdulto,id_usuario_personalizado,identificadorPersona,tBrazalete){
       // console.log('entramos a la vinculacion');

        var settings = {
            "url": "/create-vinculacion",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "codigo_brazalete": codigo_brazalete,
              "tipoAdulto": tipoAdulto,
              "id_usuario_personalizado": id_usuario_personalizado,
              "tipo_brazalete": tBrazalete,
              "identificadorPersona": identificadorPersona,
            }
          };
          
          return $.ajax(settings).done(function (response) {
           // console.log(response);
           
            //window.location.href = `/vincular-brazalete?id=${id_usuario_personalizado}`;
            return response;
          });
    }
    this.eliminarVinculo = function(idVinculo,idUser){
        
        var settings = {
            "url": "/eliminar-vinculo",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "idVinculo": idVinculo
            }
            
          };
          
          $.ajax(settings).done(function (response) {
            //console.log(response)
            window.location.href = `/vincular-brazalete?id=${idUser}`;
          });
    }

    this.payCartSistem = function(id_usuario, id_ticket, cuentaAbierta, tipoCarrito, carrito, tarjetas){
        console.log(carrito)
        console.log(tarjetas)
        var settings = {
            "url": "/pay-cartSistem",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "id_usuario": id_usuario,
                "id_ticket": id_ticket,
                "cuentaAbierta": cuentaAbierta,
                "tipoCarrito": tipoCarrito,
                "carrito": carrito, 
                "tarjetas": tarjetas
            }
            
          };
          
          return $.ajax(settings).done(function (response) {
            return response
          });
    }
    // this.getVinculosBrazalete = function(idUser){
    //     //console.log(idUser)
    //     //console.log('idUser')
    //     var settings = {
    //         "url": "/get-vinculos-brazalete/"+idUser,
    //         "method": "GET",
    //         "timeout": 0,
    //         "headers": {
    //           "Content-Type": "application/x-www-form-urlencoded"
    //         },
            
    //       };
          
    //       return $.ajax(settings).done(function (response) {
    //         return response
    //       });
    // }

    this.getVinculosBrazalete = function(idUser){
       // console.log(idUser)
        //console.log('idUser')
        var settings = {
            "url": "/get-vinculos-brazalete/"+idUser,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            
          };
          
          return $.ajax(settings).done(function (response) {
            return response
          });
    }

    this.getUsuario = function(email){
        
        var settings = {
            "url": "/get-usuario-from-email/"+email,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {
        
            return response;
        });
    }
    this.getUsuarioFromIdP = function(id_usuarioP){
        console.log("consiguiendo usuario")
        var settings = {
            "url": "/getUsuarioFromIdP/"+id_usuarioP,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {
        
            return response;
        });
    }
    this.getUsuariosPersonas = async function(idUsuarioPersonalizado){
        var settings = {
            "url": "/get-usuarios-personas",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "idUsuarioPersonalizado": idUsuarioPersonalizado
            }
          };
          
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            return response;
          });
    }

    this.getProductosCarro = function(){
        
        var settings = {
            "url": "/getProductosCarro",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            return response;
          });
    }

    this.getAllShows = function(){
        
        var settings = {
            "url": "/getAllEspectaculos",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            return response;
          });
    }
    this.getShow = async function(slug){
        var asientos_regular=[];
        var asientos_vip=[];
        var asientos_mesa_vip=[];
        var asientos_adicional=[];
        var asientos=[];
        var arrayShow = [];
        var settings = {
            "url": `/getDatosEspectaculo/${slug}`,
            "method": "GET",
            "timeout": 0
          };
          
        await $.ajax(settings).done(function (response) {
                //console.log("shows");
              //console.log(response);
            //return response;
            response.cartelera.map(cartel => {
                 asientos_regular = {
                    name:"Asiento Regular",
                    price:response.precio_regular,
                    asiento_slug:"precio_regular",
                    disponibilidad:response.asientos_filas
                }
                 asientos_vip = {
                    name:"Asiento VIP",
                    price:response.precio_vip,
                    asiento_slug:"precio_vip",
                    disponibilidad:response.asientos_vip
                }
                asientos_mesa_vip = {
                    name:"Mesa VIP",
                    price:response.precio_mesa_vip,
                    asiento_slug:"precio_mesa_vip",
                    disponibilidad:response.mesas_vip
                }
                asientos_adicional = {
                    name:"Asiento Adulto",
                    price:response.precio_adicional,
                    asiento_slug:"precio_adicional",
                    disponibilidad:response.asientos_mesas
                }
                asientos[0]=asientos_regular;
                asientos[1]=asientos_vip;
                asientos[2]=asientos_mesa_vip;
                asientos[3]=asientos_adicional;

                showArray = {
                    name:response.nombre,
                    fecha:cartel.fecha,
                    horarios:cartel.horarios,
                    id_producto:response.id_producto,
                    asientos:asientos,
                    slug:response.slug,
                    image:response.urlImagenPost,
                    status:cartel.status
                }
                arrayShow.push(showArray);

            });
        });
        //console.log(arrayShow);

        return arrayShow;
    }

    this.prepararCarro = async function(idUsuario, idProducto, cantidad, idTipoProducto){
        var child_name = document.getElementById('nombreNino')
        var ninoExistente = document.getElementById('ninoExistente');
        var horasIndefinidas = document.getElementById('horasIndefinidas')
        var tipoCarrito = document.getElementById('tipoCarrito');
        var fechaCumpleanios = document.getElementById('fechaCumpleanios');
        var horaCumpleanios = document.getElementById('horaCumpleanios');

        if(fechaCumpleanios != null && horaCumpleanios != null){

           var fecha = await MagicPlanet.MiSistema.verificarFecha(fechaCumpleanios.value, horaCumpleanios.value);

           if(fecha.status == "ocupado"){
            $('#cont-error').html(`<div class="error">Esta fecha esta ocupada</div>`)
            return;
           }
        } 

        if(tipoCarrito != null){
            tipoCarrito = tipoCarrito.value
        }else{
            tipoCarrito = "indefinido"
        }
       
        if(fechaCumpleanios != null){
            fechaCumpleanios = fechaCumpleanios.value;
        }else{
            fechaCumpleanios = null;
        }
        if(horaCumpleanios != null){
            horaCumpleanios = horaCumpleanios.value;
        }else{
            horaCumpleanios = null;
        }
        //var cantidad = document.getElementById('horasIndefinidas');
        var errorHtml = '';
        // console.log(child_name)
        if(child_name != null){
            child_name = child_name.value;
            if(ninoExistente != null){
                if(child_name == "" && ninoExistente.value == "noexiste"){
                    errorHtml += `<div class="error">Falta por insertar el Nombre del niño</div>`;
        
                    $('#cont-error').html(errorHtml)
                    return;
                }
            }else{
                if(child_name == ""){
                    errorHtml += `<div class="error">Falta por insertar el Nombre del niño</div>`;
        
                    $('#cont-error').html(errorHtml)
                    return;
                }
            }
            
        }else{
            child_name = "";
        }
        if(ninoExistente != null){
            if(ninoExistente.value != "noexiste"){
                child_name = ninoExistente.value
            }
        }
        if(horasIndefinidas != null){
            horasIndefinidas = horasIndefinidas.value;
        }else{
            horasIndefinidas = 0;
        }

        
          
        var existeCarro = await MagicPlanet.MiSistema.checarCarro(idProducto, idUsuario)
        var dataCarro = {
            idUsuario: idUsuario,
            idProducto: idProducto,
            cantidad: cantidad,
            id_color: 0,
            id_talla: 0,
            child_name: child_name,
            action: "create",
            horas: horasIndefinidas,
            tipoCarrito: tipoCarrito,
            horaCumpleanios: horaCumpleanios,
            fechaCumpleanios: fechaCumpleanios
        }
        
        if(existeCarro == ""){
            //console.log("no existe el carro se creara uno")
            var dataCarro = {
                idUsuario: idUsuario,
                idProducto: idProducto,
                cantidad: cantidad,
                id_color: 0,
                id_talla: 0,
                child_name: child_name,
                action: "create",
                horas: horasIndefinidas,
                tipoCarrito: tipoCarrito,
                horaCumpleanios: horaCumpleanios,
                fechaCumpleanios: fechaCumpleanios

            }
        }else{
          //  console.log("ya existe el carro se actualizara")
            if(idTipoProducto == 6 || horasIndefinidas > 0){
                var dataCarro = {
                    idUsuario: idUsuario,
                    idProducto: idProducto,
                    cantidad: cantidad,
                    id_color: 0,
                    id_talla: 0,
                    child_name: child_name,
                    action: "create",
                    horas: horasIndefinidas,
                    tipoCarrito: tipoCarrito,
                    horaCumpleanios: horaCumpleanios,
                    fechaCumpleanios: fechaCumpleanios
                }
            }else{
                var dataCarro = {
                    idUsuario: idUsuario,
                    idProducto: idProducto,
                    cantidad: cantidad,
                    id_color: 0,
                    id_talla: 0,
                    child_name: child_name,
                    action: "update",
                    horas: horasIndefinidas,
                    tipoCarrito: tipoCarrito,
                    horaCumpleanios: horaCumpleanios,
                    fechaCumpleanios: fechaCumpleanios
                }
            }
            
        }
        var carroCreado = await MagicPlanet.MiSistema.enviarCarro(dataCarro)
        //console.log(dataCarro)
        //console.log(carroCreado)
    }
    
    this.prepararCarroShow = async function(idUsuario, idProducto, cantidad, idTipoProducto,slug,fecha,hora){

        //var existeCarro = await MagicPlanet.MiSistema.checarCarro(idProducto, idUsuario)
        var asiento_adultos_r = slug=="precio_adicional" ? true : false;
        var asiento_ninos_r = slug=="precio_regular" ? true : false;
        var asiento_ninos_v = slug=="precio_vip" ? true : false;
        var mesa_vip = slug=="precio_mesa_vip" ? true : false;
        var tipoCarrito = document.getElementById('tipoCarrito').value;

        var show_detalles = {
            fecha_espectaculo:fecha,
            hora_espectaculo:hora,
            asiento_adultos_r:asiento_adultos_r,
            asiento_ninos_r:asiento_ninos_r,
            asiento_ninos_v:asiento_ninos_v,
            mesa_vip:mesa_vip
        }
        var detalles = JSON.stringify(show_detalles);
        var dataCarro = {
            idUsuario: idUsuario,
            idProducto: idProducto,
            cantidad: cantidad,
            id_color: 0,
            id_talla: 0,
            action: "create",
            show_detalles: detalles,
            tipoCarrito: tipoCarrito
        }
        console.log(dataCarro);
        
        /*if(existeCarro == ""){
            //console.log("no existe el carro se creara uno")
            var dataCarro = {
                idUsuario: idUsuario,
                idProducto: idProducto,
                cantidad: cantidad,
                id_color: 0,
                id_talla: 0,
                child_name: child_name,
                action: "create",
                horas: horasIndefinidas
            }
        }else{
          //  console.log("ya existe el carro se actualizara")
            if(idTipoProducto == 6 || horasIndefinidas > 0){
                var dataCarro = {
                    idUsuario: idUsuario,
                    idProducto: idProducto,
                    cantidad: cantidad,
                    id_color: 0,
                    id_talla: 0,
                    child_name: child_name,
                    action: "create",
                    horas: horasIndefinidas
                }
            }else{
                var dataCarro = {
                    idUsuario: idUsuario,
                    idProducto: idProducto,
                    cantidad: cantidad,
                    id_color: 0,
                    id_talla: 0,
                    child_name: child_name,
                    action: "update",
                    horas: horasIndefinidas
                }
            }
            
        }*/
        var carroCreado = await MagicPlanet.MiSistema.enviarCarro(dataCarro)
        //console.log(dataCarro)
        //console.log(carroCreado)
    }
    this.escogerPersona = async function(persona,identificadorPersona,tipoBrazalete){
       // console.log(persona)
        let html = '';
        let html2 = '';

            html +=
                `<div class="personaS">${persona}</div>`;

            html2 +=
                ` <select name="tipoAdulto" id="tipoAdulto" class="form-control">
                    <option value="adulto">Adulto</option>
                    <option value="adultoresponsable">Adulto responsable</option>
                </select>`;

        $('#cont-personaSeleccionada').html(html);
        $('#identificadorPersona').val(identificadorPersona);
        $('#cont-tipoBrazalete').html(`<span>${tipoBrazalete}</span>`);
        $('#tBrazalete').val(tipoBrazalete);
        if(tipoBrazalete == "usuario-principal" || tipoBrazalete == "usuario-padre"){
            $('#cont-selectTipo').html(html2);
        }else{
            $('#cont-selectTipo').html('');
        }

        
    }
    this.checarCarro = function(idProducto, idUsuario){
        var settings = {
            "url": "/checarCarro",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "idProducto": idProducto,
                "idUsuario": idUsuario
            }
          };
          
          return $.ajax(settings).done(function (response) {
            
            return response;
          });
    }
    this.verificarFecha = function(fechaCumpleanios, horaCumpleanios){
        var settings = {
            "url": "/verificarFecha",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "fechaCumpleanios": fechaCumpleanios,
                "horaCumpleanios": horaCumpleanios
            }
          };
          
          return $.ajax(settings).done(function (response) {
            
            return response;
          });
    }
    this.enviarCarro = function(data){
        console.log(data);
        
        var settings = {
            "url": "/crearCarrito",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": data
          };
          
          return $.ajax(settings).done(function (response) {
             console.log(response);
            $('#cont-popup').removeClass("cont-popup");
            $('#cont-popup').html('');
            MagicPlanet.MiSistema.traerCarrito(data.idUsuario)
            return response;
          });
    }
    this.getCarro = function(idUsuario, tipoCarrito){
        var settings = {
            "url": `/getCarritoSistema/${idUsuario}`,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "tipoCarrito": tipoCarrito
            }
          };
          
          return $.ajax(settings).done(function (response) {
            
            return response;
          });
    }
    this.deleteCarrito = function(idCarrito, idUsuario){
        var settings = {
            "url": `/deleteCarrito/${idCarrito}`,
            "method": "DELETE",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
            $('#cont-popup').removeClass("cont-popup");
            $('#cont-popup').html('');
            MagicPlanet.MiSistema.traerCarrito(idUsuario)
            return response;
          });
        
    }
    this.formatearNumero = function(numero){
        var n = new Number(numero);
        var myObj = {
          style: "currency",
          currency: "MXN"
        }
        return n.toLocaleString("mxn", myObj);
    }

    this.traerusuarioTemporal = async function(){
        var settings = {
            "url": "/get-usuario-temporal",
            "method": "get",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };
          
          return await $.ajax(settings).done(function (response) {
            return response;
          });
    }

    this.getInfoUsuario = async function(id){
        var datos = [];
        var settings = {
            "url": `/getUsuarioidPersonal/${id}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          var promiseObj = new Promise(function(resolve, reject){
            $.ajax(settings).done(function (response) {
                console.log(response);
                datos={
                    nombres:response[0].nombres,
                    apellidos:response[0].apellidos,
                    email:response[0].email,
                    phone:response[0].celular
                }
                resolve(datos);
          })});
          //console.log(datos);
          return promiseObj;
    }
    this.obtenerUsuario = async function(user_idP){
        console.log("enviando")
        var settings = {
            "url": `/obtenerUsuario/${user_idP}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };
          
          return await $.ajax(settings).done(function (response) {
            return response;
          });
    }

}