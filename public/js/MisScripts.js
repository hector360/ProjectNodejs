

function MisScripts (){
   var contadorParrafo = 1;
   var arrayCarroC = [];
   var contadorCarroCompraP = 0;
   var totalDPago = 0;
//    var magicPlanetUrl = "http://magic-planet2.herokuapp.com";
    var magicPlanetUrl = "http://localhost:3000";
    this.crearUsuario = function(){
        
        // alert(document.getElementById("nombre").value)
        // alert(document.getElementById("email").value)
        // alert(document.getElementById("password").value)
        // alert(document.getElementById("tipoUsuario").value)
        var data = {
            email: document.getElementById("email").value,
            nombres: document.getElementById("nombres").value,
            password: document.getElementById("password").value,
            idTipoUsuario: document.getElementById("idTipoUsuario").value,
            celular: document.getElementById("celular").value,
            apellidos: document.getElementById("apellidos").value,
          };
        try {
            var data = {
                url: '/crear-cuenta-privada',
                type: 'POST',
                data: data,
                callback: "/usuarios"
        
            };
            MagicPlanet.MisScripts.CargaDatosCors(data);
        } catch (e) {
            console.log(e);
        }
        // alert("se enviaron los datos")
    }
    // this.RespuestaGuardado = function(resp){
    //     console.log(resp)
    // }

    this.ObtenerUsuarios = async function(){
        var contenedorDatos = document.getElementById("contenedorDatos");
        var response = await MagicPlanet.MisScripts.getUsuarios();
        
                var html = '';
                // response.forEach(usuario => {
                //     console.log(usuario.Email)
                // });
                response.map(function(usuario) {
                   console.log(usuario.Email)
                   html += 
                    '<tr>'+
                        '<td>'+usuario.nombres+'</td>'+
                        '<td>'+usuario.email+'</td>'+
                        '<td>'+usuario.tipoUsuario+'</td>'+
                    '</tr>';
                });
                // contenedorDatos.innerHTML(html);
                $('#contenedorDatos').html(html);
                $('#example').DataTable();
          
    }

    this.GetMaestros = function(){
        var fecha = new Date();

        console.log(fecha.getHours())
        var settings = {
            "url": "/getMaestros",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
                // console.log(response);
                var html = '';
                // response.forEach(usuario => {
                //     console.log(usuario.Email)
                // });
                html += 
                    '<select name="maestro" id="maestro">'+
                    '<option value="indefinido">Indefinido</option>';
                    response.map(function(usuario) {
                    console.log(usuario)
                    html+=
                            '<option value="'+usuario.id+'">'+usuario.nombres+'</option>';
                        
                    });
                html += '</select>';
                // contenedorDatos.innerHTML(html);
                $('#contenedorMaestro').html(html);
          });
    }

    this.crearCurso = function(){
        // var settings = {
        //     "url": "http://localhost:3000/crearCurso",
        //     "method": "POST",
        //     "timeout": 0,
        //     "headers": {
        //       "Content-Type": "application/x-www-form-urlencoded"
        //     },
            // alert(document.getElementById("nombreCurso").value);
            // alert(document.getElementById("horarioClaseEntrada").value);
            // alert(document.getElementById("horarioClaseSalida").value);
            // alert(document.getElementById("duracionCurso").value);
            // alert(document.getElementById("unidadTiempo").value);
            // alert(document.getElementById("fechaInicial").value);
            // alert(document.getElementById("fechaTerminacion").value);
            // alert(document.getElementById("descripcionCurso").value);
            // alert(document.getElementById("maestro").value);
        
        
          var data = {
            Nombre: document.getElementById("nombreCurso").value,
            HorarioClaseEntrada: document.getElementById("horarioClaseEntrada").value,
            HorarioClaseSalida: document.getElementById("horarioClaseSalida").value,
            DuracionCurso: document.getElementById("duracionCurso").value,
            UnidadTiempo: document.getElementById("unidadTiempo").value,
            FechaInicial: document.getElementById("fechaInicial").value,
            FechaTerminacion: document.getElementById("fechaTerminacion").value,
            DescripcionCurso: document.getElementById("descripcionCurso").value,
            IdMaestro: document.getElementById("maestro").value,
            File: document.getElementById("file").value
          };
        try {
            var data = {
                url: '/crearCurso',
                type: 'POST',
                data: data,
                callback: "/cursos-talleres"
        
            };
            MagicPlanet.MisScripts.CargaDatosCors(data);
        } catch (e) {
            console.log(e);
        }
    }

    this.getCursos = function(){
          try {
            
            
            var settings = {
                "url": '/getCursos',
                "method": 'GET',
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": ''
              };
              
              $.ajax(settings).done(function (response) {
                  console.log('imprimiendo los cursos')
                console.log(response);

                var html = '';
               
                response.map(function(usuario) {
                console.log(usuario.Nombre)
                html +=
                    '<div class="contBanner">'+
                        '<div class="centrador">'+
                            '<div class="seccion1">'+
                                '<img src="'+usuario.rutaImagen+'" />'+
                            '</div>'+
                            '<div class="seccion2">'+
                                '<h2>'+usuario.nombre+'</h2>'+
                                '<p>'+usuario.descripcionCurso+'</p>'+
                                '<div class="centrado">'+
                                    '<a href="/editar-curso/'+usuario.id+'">Editar</a>'+
                                    '<div class="botonEliminarP" onclick="MagicPlanet.PopUps.PopUpGeneral(`Eliminar Curso`, `Curso`,`'+usuario.rutaImagen+'`,`'+usuario.id+'`)">Eliminar</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                    
                });
                $('#cont-Cursos').html(html);

              });
        } catch (e) {
            console.log(e);
        }
           
    }
    this.getPosts = function(){
        try {
            
            
            var settings = {
                "url": '/getPosts',
                "method": 'GET',
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": ''
              };
              
              $.ajax(settings).done(function (response) {
                console.log(response);

                var html = '';
               
                response.map(function(post) {
                console.log(post.Nombre)
                let urlMagic = post.urlImagenPost;
                let nuevotitulo = post.titulo.substring(0, 25);
                if(post.titulo.length > 25){
                    nuevotitulo = nuevotitulo+"...";
                }
                
                html +=
                    '<div class="contBanner">'+
                        '<div class="centrador">'+
                            '<div class="seccion1">'+
                                '<img src="'+urlMagic+'" />'+
                            '</div>'+
                            '<div class="seccion2">'+
                                '<h2>'+nuevotitulo+'</h2>'+
                                '<p>'+post.descripcion+'</p>'+
                                '<div class="centrado">'+
                                    '<a href="/editar-posts/'+post.id+'">Editar</a>'+
                                    '<div class="botonEliminarP" onclick="MagicPlanet.PopUps.EliminarPostPopUp(`Eliminar Post`,`Post`,`'+post.urlImagenPost+'`,`'+post.id+'`)">Eliminar</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                    
                });
                $('#cont-Posts').html(html);
                
              });
        } catch (e) {
            console.log(e);
        }
    }
    this.mostrarTags = function(){
        try {
            
            
            var settings = {
                "url": '/getTags',
                "method": 'GET',
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": ''
              };
              
              $.ajax(settings).done(function (response) {
                console.log(response);

                let html = '';
               
                response.map(function(tag) {
                console.log(tag.nombre)
                html +=
                    '<div class="contBanner">'+
                        '<div class="centrador">'+
                            '<div class="seccion1">'+
                                '<img src="'+tag.urlImagen+'" />'+
                            '</div>'+
                            '<div class="seccion2">'+
                                '<h2>'+tag.nombre+'</h2>'+
                                '<div class="centrado">'+
                                    '<a href="/editar-posts/'+tag.id+'">Editar</a>'+
                                    '<div class="botonEliminarP" onclick="MagicPlanet.PopUps.EliminarTagPopUp(`Eliminar Tag`,`Tag`,`'+tag.urlImagen+'`,`'+tag.id+'`)">Eliminar</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                    
                });
                $('#content-Tags').html(html)
                
              });
        } catch (e) {
            console.log(e);
        }
        
    } 
    this.ObtenerPosts = function(){
    var url = window.location.pathname;
    var idPosts = url.substring(url.lastIndexOf('/') + 1);
        var settings = {
            "url": "/getPost/"+idPosts,
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
                console.log(response);
                var html = '';
                // console.log(response[0].Descripcion.split("%-%"))
                // var parrafos = response[0].Descripcion.split("%-%")
                
                   html += 
                   '<div class="cont-pagina">'+
                        '<div class="cont-titulo" id="titulo-posts">'+
                            '<h2 onclick="MagicPlanet.MisScripts.EditarTituloPost(`'+response[0].id+'`,`'+response[0].titulo+'`)">'+response[0].titulo+'</h2>'+
                        '</div>'+
                        '<div class="cont-fecha" id="fecha-posts">'+
                            '<span>'+response[0].FechaCreacion+'</span>'+
                        '</div>'+
                        '<div class="cont-img" id="cont-imgEditablePost">'+
                            '<img src="'+response[0].urlImagenPost+'" onclick="MagicPlanet.MisScripts.EditarImagenPost(`'+response[0].urlImagenPost+'`,`'+idPosts+'`)" />'+
                        '</div>'+
                        '<div class="cont-descripcion" id="cont-descripcion1">'+

                        '</div>'+
                    '</div>';
                    {/* '<h2>'+response[0].Titulo+'</h2>'; */}
                // contenedorDatos.innerHTML(html);
                $('#contenedorPag').html(html);
                $('#idPost').val(response[0].id);
                MagicPlanet.MisScripts.ObtenerParrafosPost(response[0].id)
                
                MagicPlanet.MisScripts.ObtenerSubPosts(response[0].id);
          });
          
    }
    this.ObtenerParrafosPost = function(idPost){
        var settings = {
            "url": "/getParrafosPosts/"+idPost,
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            let html = '';
                response.forEach(function(parrafo, index){
                    html += 
                        '<div class="cajaParrafo" id="'+index+'-cajaParrafo" >'+
                            '<p onclick="MagicPlanet.MisScripts.EditarParrafoPost(`'+parrafo.id+'`,`'+parrafo.parrafo+'`,`'+index+'`,`'+parrafo.idPost+'`)">'+parrafo.parrafo+'</p>'+
                        '</div>';
                });
            $('#cont-descripcion1').html(html);
          });
    }
    this.ObtenerSubPosts = function(idPost){
        var settings = {
            "url": "/getSubPosts/"+idPost,
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
              console.log("subpost")
            console.log(response);
            var html = '';
           
            response.map(function(subPost) {

                // var parrafos = subPost.Parrafo.split("%-%");
                
                html += 
                 '<div class="centrado">';
                 if(subPost.urlImagenPost=="vacio"){

                 }else{
                    html += '<div class="cont-img" id="cont-imgEditableSubPost'+subPost.id+'">'+
                                '<img src="'+subPost.urlImagenPost+'" onclick="MagicPlanet.MisScripts.EditarImagenSubPost(`'+subPost.urlImagenPost+'`,`'+subPost.id+'`,`'+idPost+'`)" />'+
                            '</div>';
                        
                 }
                  html += 
                  '<div class="cont-subtitulo" id="cont-subtitulo'+subPost.id+'">'+
                    '<h2 onclick="MagicPlanet.MisScripts.EditarSubTituloPost(`'+subPost.id+'`,`'+subPost.subtitulo+'`,`'+idPost+'`)">'+subPost.subtitulo+'</h2>'+
                  '</div>'+
                  '<div class="cont-parrafo" id="cont-parrafoSub'+subPost.id+'">'+
                    
                   '</div>'+
                 '</div>';
                 MagicPlanet.MisScripts.ObtenerParrafosSubPost(idPost, subPost.id)
             });
             $('#seccion-extra').html(html);
            
          });
    }
    this.ObtenerParrafosSubPost = function(idPost,idSubPost){
        var settings = {
            "url": "/getParrafosSubPosts/"+idSubPost,
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            let html = '';
                response.forEach(function(parrafo, index){
                    html += 
                        '<div class="cajaParrafo" id="'+index+'-cajaParrafoSub-'+parrafo.id+'" >'+
                            '<p onclick="MagicPlanet.MisScripts.EditarParrafoSubPost(`'+parrafo.id+'`,`'+parrafo.parrafo+'`,`'+index+'`,`'+idPost+'`)">'+parrafo.parrafo+'</p>'+
                        '</div>';
                });
            $('#cont-parrafoSub'+idSubPost).html(html);
          });
    }

    this.agregarParrafo = function(){
        contadorParrafo = contadorParrafo + 1;
        html = '';
        html += 
        '<div class="cont-seccion">'+
            '<h2>Parrafo '+contadorParrafo+'</h2>'+
            '<input type="text" name="parrafo'+contadorParrafo+'" id="parrafo'+contadorParrafo+'" />'+
        '</div>';

        $('#cont-parrafos').append(html);
    }
    this.removerParrafo = function(){
        contadorParrafo = contadorParrafo - 1;

        $('#cont-parrafos .cont-seccion').last().remove();
    }
    this.enviarPost = function(){
        // var parrafo1 = document.getElementById("parrafo1").value;
        // contadorParrafo
        var titulo = document.getElementById("titulo").value;
        var imagenSubParrafo = document.getElementById("imagenSubParrafo").value;
        var TodosLosParrafos = '';
        var tituloError = '';
        var imagenError = '';
        console.log(titulo)
        console.log(imagenSubParrafo)
        if(titulo && imagenSubParrafo != ""){
            for(var i = 1; i <= contadorParrafo; i++){
                var parrafon = document.getElementById("parrafo"+i).value;
               var parrafon2 = parrafon + "%-%";
               TodosLosParrafos += parrafon2;
            }
            console.log(TodosLosParrafos);
            var descripcion = $('#descripcion').val(TodosLosParrafos);
            document.getElementById("myPostForm").submit();
        }else{
            if(titulo == ""){
                tituloError +=
                `<div class="error">Falta el titulo</div>`;
                $('#tituloError').html(tituloError);
            }
            if(imagenSubParrafo == ""){
                imagenError +=
                `<div class="error">Falta la imagen</div>`;
                $('#imagenError').html(imagenError);
            }
        }
        
        
    }
    this.enviarSubPost = function(){
        var imagen = document.getElementById("imagenSubParrafo").value;
        var parrafo1 = document.getElementById("parrafo1").value;
        
        parrafo1 = parrafo1.trim()
        // if(nuevoParrafo==""){
        if(parrafo1==""&&imagen==""){
            var html = '';
            html += 
            '<div class="errorVacio">Para poder agregar un elemento tienes que agregar una imagen o un parrafo</div>';
            $('#cont-error').html(html);
            setTimeout(function(){
                $('#cont-error').html("");
            },5000)
        }
        if(imagen == ""){
            document.getElementById("nombreImg").value = "vacio";
        }
        var TodosLosParrafos = '';
        for(var i = 1; i <= contadorParrafo; i++){
            var parrafon = document.getElementById("parrafo"+i).value;
           var parrafon2 = parrafon + "%-%";
           TodosLosParrafos += parrafon2;
        }
        console.log(TodosLosParrafos);
        var descripcion = $('#descripcion').val(TodosLosParrafos);
        document.getElementById("mySubPostForm").submit();
    }

    this.enviarTags = function(){
        
    }
    this.getTags = function(){
        var settings = {
            "url": "/getTags",
            "method": "GET",
            "timeout": 0,
          };
          var html = '';
          $.ajax(settings).done(function (response) {
            console.log(response);
            html +=  '<select name="tag" id="tag">';
            response.map(function(tag){
               
                    html += '<option value="'+tag.id+'">'+tag.nombre+'</option>';
                
            })
            html += '</select>';
            $('#cont-tags').html(html);
          });
    }
    this.hoverIn = function(){
        $('#cont-icono').addClass("colorHover");
        
    }
    this.hoverOut = function(){
        $('#cont-icono').removeClass("colorHover");
        
    }
    this.handleChange = function(){
        let imagePreview = document.getElementById('imagePreview');
        let inpFile = document.getElementById('cont-imagen');
        let cambiarImagen = document.getElementById('cambiarImagen');
        
        imagePreview.classList.remove('esconder');
        inpFile.classList.add('esconder');

        cambiarImagen.classList.remove('esconder');
        
    }
    this.cambiarImagen = function(){
        let imagePreview = document.getElementById('imagePreview');
        let inpFile = document.getElementById('cont-imagen');
        let cambiarImagen = document.getElementById('cambiarImagen');
        let imagenSubParrafo = document.getElementById('imagenSubParrafo');

        imagePreview.classList.add('esconder');
        inpFile.classList.remove('esconder');

        cambiarImagen.classList.add('esconder');
        imagenSubParrafo.value = "";
    }
    this.obtenerProductos = function(){
        var settings = {
            "url": "/getProductosApi",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            let html = '';
            response.map(function(producto){
                // let urlImagen = magicPlanetUrl + producto.urlImagenPost;
                html += '<div class="cont-producto">'+
                            '<div class="cont-imagen">'+
                                '<img src="'+producto.urlImagenPost+'" />'+
                            '</div>'+
                            '<div class="cont-titulo">'+producto.nombreProducto+'</div>'+
                            '<div class="cont-descripcion">'+
                                '<div class="seccion1">'+
                                    '<div class="precio">$'+producto.precio+'</div>'+
                                '</div>'+
                                '<div class="seccion2">'+
                                    '<a href="/editar-productos/'+producto.id+'" class="cont-botonE">Editar</a>'+
                                    '<div class="cont-botonP" onclick="MagicPlanet.PopUps.PopUpGeneral(`Eliminar Producto`, `Producto`,`'+producto.urlImagenPost+'`,`'+producto.id+'`)">Eliminar</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
            });
            $("#cont-productos").html(html);

    

          });
    }
    this.CargaDatosCors = function (Op) {
        var _url = (Op.url) ? Op.url : '';
        var _data = (Op.data) ? Op.data : '';
        var _method = Op.type;
        var _callback = Op.callback;

        
        var settings = {
            "url": _url,
            "method": _method,
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": _data
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = _callback;
          });
    }

    this.getTipoProductos = function(){
        var settings = {
            "url": "/getTipoProducto",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            html = '';
            html +=
                '<h2>Categoria del Producto</h2>'+
                '<select name="tipoProducto" id="tipoProducto">';
                response.map(function(tipoProducto){
                  html += '<option value="'+tipoProducto.id+'">'+tipoProducto.nombre+'</option>';
                });
                    
                html += '</select>';

            $('#cont-selectProducto').html(html);
          });
    }

    this.EliminarProducto = function(idProducto){
        //se tiene que eliminar de la bd y del servidor
        var settings = {
            "url": "/eliminarProducto/"+idProducto,
            "method": "POST",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/get-productos";
          });
    }
    this.EliminarCurso = function(idCurso){
        //se tiene que eliminar de la bd y del servidor
        var settings = {
            "url": "/eliminarCurso/"+idCurso,
            "method": "POST",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/cursos-talleres";
          });
    }
    
    this.EliminarPost = function(idPost){
        
        var settings = {
            "url": "/eliminarPost/"+idPost,
            "method": "POST",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/mostrar-posts";
          });

    }
    
    this.EditarTituloPost = function(idPost, tituloPost){
        let urlImagen = 'vacio';
        let html = '';
        html +=
            '<div class="cont-editor1">'+
                '<form>'+
                    '<div class="cont-editorTitulo">'+
                        '<div class="seccion1">'+
                            '<input type="text" value="'+tituloPost+'" name="tituloEditado" id="tituloEditado" />'+
                        '</div>'+
                        '<div class="seccion2">'+
                            '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EditarPostTextoPopUp(`'+tituloPost+'`,`Titulo`,`'+idPost+'`,`null`)">Enviar</div>'+
                            '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarTituloP(`'+idPost+'`,`'+tituloPost+'`)">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
        $('#titulo-posts').html(html);
    }
    this.EditarSubTituloPost = function(idSubPost, subTituloPost,idPost){
        let urlImagen = 'vacio';
        let html = '';
        html +=
            '<div class="cont-editor1">'+
                '<form>'+
                    '<div class="cont-editorTitulo">'+
                        '<div class="seccion1">'+
                            '<input type="text" value="'+subTituloPost+'" name="subTituloEditado" id="subTituloEditado" />'+
                        '</div>'+
                        '<div class="seccion2">'+
                            '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EditarPostTextoPopUp(`'+subTituloPost+'`,`SubTitulo`,`'+idPost+'`,`'+idSubPost+'`)">Enviar</div>'+
                            '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarSubTituloP(`'+idSubPost+'`,`'+subTituloPost+'`,`'+idPost+'`)">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
        $('#cont-subtitulo'+idSubPost).html(html);
    }

    this.CancelarEditarTituloP = function(idPost, idTitulo){
        let html = '';
        html +=
        '<h2 onclick="MagicPlanet.MisScripts.EditarTituloPost(`'+idPost+'`,`'+idTitulo+'`)">'+idTitulo+'</h2>';
        $('#titulo-posts').html(html);
    }
    this.CancelarEditarSubTituloP = function(idSubPost,SubTitulo,idPost){
        let html = '';
        html +=
        // '<h2 onclick="MagicPlanet.MisScripts.EditarTituloPost(`'+idPost+'`,`'+idTitulo+'`)">'+idTitulo+'</h2>';
        '<h2 onclick="MagicPlanet.MisScripts.EditarSubTituloPost(`'+idSubPost+'`,`'+SubTitulo+'`,`'+idPost+'`)">'+SubTitulo+'</h2>';
        $('#cont-subtitulo'+idSubPost).html(html);
    }
    this.EnviarEditableTitulo = function(idPost){
        var tituloEditado = document.getElementById("tituloEditado").value;

        var settings = {
            "url": "/editarPost/"+idPost,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "titulo": tituloEditado
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/editar-posts/"+idPost;
          });
    }
    this.EnviarEditableSubTitulo = function(idSubPost,idPost){
        // alert(idSubPost)
        var subTituloEditado = document.getElementById("subTituloEditado").value;

        var settings = {
            "url": "/editarSubPosts/"+idSubPost,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "subtitulo": subTituloEditado
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/editar-posts/"+idPost;
          });
    }

    this.EnviarEditableParrafo = function(idParrafo, idPost){
        var parrafoEditado = document.getElementById("parrafoEditado").value;
        var settings = {
            "url": "/editarParrafoPost/"+idParrafo,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "parrafo": parrafoEditado
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/editar-posts/"+idPost;
          });
    }
    this.EnviarEditableSubParrafo = function(idParrafoSub, idPost){
        var parrafoEditado = document.getElementById("parrafoEditado").value;
        var settings = {
            "url": "/editarParrafoSubPost/"+idParrafoSub,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "parrafo": parrafoEditado
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/editar-posts/"+idPost;
          });
    }

    this.EditarParrafoPost = function(idParrafo, parrafo, index1, idPost){
        let html = '';
        html +=
            '<div class="cont-editor1">'+
                '<form>'+
                    '<div class="cont-editorTitulo">'+
                        '<div class="seccion1">'+
                            '<input type="text" value="'+parrafo+'" name="parrafoEditado" id="parrafoEditado" />'+
                        '</div>'+
                        '<div class="seccion2">'+
                            '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EditarPostParrafoPopUp(`'+parrafo+'`,`Parrafo`,`'+idParrafo+'`,`'+idPost+'`,`Post`,`'+index1+'`)">Enviar</div>'+
                            '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarParrafoP(`'+idParrafo+'`,`'+parrafo+'`,`'+index1+'`,`'+idPost+'`)">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
        $('#'+index1+'-cajaParrafo').html(html);
    }
    this.EditarParrafoSubPost = function(idParrafo, parrafo, index1, idPost){
        let html = '';
        html +=
            '<div class="cont-editor1">'+
                '<form>'+
                    '<div class="cont-editorTitulo">'+
                        '<div class="seccion1">'+
                            '<input type="text" value="'+parrafo+'" name="parrafoEditado" id="parrafoEditado" />'+
                        '</div>'+
                        '<div class="seccion2">'+
                            '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EditarPostParrafoPopUp(`'+parrafo+'`,`Parrafo`,`'+idParrafo+'`,`'+idPost+'`,`SubPost`,`'+index1+'`)">Enviar</div>'+
                            '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarParrafoSp(`'+idParrafo+'`,`'+parrafo+'`,`'+index1+'`,`'+idPost+'`)">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
        $('#'+index1+'-cajaParrafoSub-'+idParrafo).html(html);
    }
    this.CancelarEditarParrafoP = function(idParrafo, parrafo, index,idPost){
        let html = '';
        html +=
            '<p onclick="MagicPlanet.MisScripts.EditarParrafoPost(`'+idParrafo+'`,`'+parrafo+'`,`'+index+'`,`'+idPost+'`)">'+parrafo+'</p>';
            $('#'+index+'-cajaParrafo').html(html);    
    }
    this.CancelarEditarParrafoSp = function(idParrafo, parrafo, index,idPost){
        let html = '';
        html +=
            '<p onclick="MagicPlanet.MisScripts.EditarParrafoSubPost(`'+idParrafo+'`,`'+parrafo+'`,`'+index+'`,`'+idPost+'`)">'+parrafo+'</p>';
            
            $('#'+index+'-cajaParrafoSub-'+idParrafo).html(html);    
    }


    this.getPrincipal = function(){
        var settings = {
            "url": "/getPrincipal",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);

            let html = '';
            let html1 = '';
            let html2 = '';
            let html3 = '';

            html +=
            '<div>'+response.totalUsuarios+'</div>';

            html1 +=
            '<div>'+response.totalProductos+'</div>';
            html2 +=
            '<div>'+response.totalCursos+'</div>';

            $('#numero-usuarios').html(html);
            $('#numero-productos').html(html1);
            $('#numero-Cursos').html(html2);
          });

          
    }
    this.enviarLogin = function(){
        var settings = {
            "url": "/signin",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "email": document.getElementById("email").value,
              "password": document.getElementById("password").value
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
          });
    }

    this.EnviarDatosRegistroU = function(event){
        
        var password = document.getElementById("password").value;
        var password2 = document.getElementById("password2").value;
        var nombre = document.getElementById("nombres").value;
        var apellidos = document.getElementById("apellidos").value;
        var email = document.getElementById("email").value;
        var IdTipoUsuario = "5f886e5d0ceab12e5444736a";
        // alert(password)
        // alert(password2)
        // alert(nombres)
        // alert(apellidos)
        // alert(email);
        // alert(IdTipoUsuario);
      if(password == password2){
        event.preventDefault();
            var params= {password, nombre, apellidos, email, IdTipoUsuario}
            const form = document.createElement('form');
            form.method = 'post';
            form.action = '/signup';

            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];

                form.appendChild(hiddenField);
                }
            }

            document.body.appendChild(form);
            form.submit();
            event.preventDefault();
      }else{
        event.preventDefault();
        var error1 = '';
        error1 += '<div class="error1">Las contraseñas no coinciden</div>';
        $('#cont-error').html(error1);
        $('#password').addClass('bordeError');
        $('#password2').addClass('bordeError');
      }
    }
    this.EditarImagenPost = function(urlImagenPost,idPosts){

        let html = '';

        html +=
            '<div class="cont-editarImagen">'+
                '<form action="/editarImagenPost" method="POST" enctype="multipart/form-data" id="myPostImageForm">'+
                    '<input type="hidden" name="nombreImg" id="nombreImg" />'+
                    '<input type="hidden" name="idPost" id="idPost" value="'+idPosts+'" />'+
                    '<div class="seccionImagen">'+
                        '<div class="cont-imagen"  id="cont-imagenEditar">'+
                            '<div class="cont-icono" id="cont-icono">'+
                                '<i class="fa fa-image"></i> <span>Agregar Imagen</span>'+
                            '</div>'+
                            '<input type="file" name="imagenSubParrafoEditar" id="imagenSubParrafoEditar" onchange="MagicPlanet.MisScripts.handleChangeEditar()" />'+
                        '</div>'+
                        '<div id="imagePreviewEditar" class="image-preview esconder">'+
                            '<img src="" alt="Image" class="image-preview__img2" />'+
                        '</div>'+
                        '<div class="cont-cambiarImg">'+
                            '<div class="cambiarImagen esconder" id="cambiarImagenEditar" onclick="MagicPlanet.MisScripts.cambiarImagenEditar()"><i class="fa fa-times-circle"></i>Cambiar Imagen</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="seccionInput">'+
                        // '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EnviarImagenPost(`'+urlImagenPost+'`,`'+idPosts+'`)">Enviar</div>'+
                        '<div class="boton-enviar" onclick="MagicPlanet.MisScripts.EnviarImagenPost(`'+urlImagenPost+'`,`'+idPosts+'`)">Enviar</div>'+
                        '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarImagenP(`'+urlImagenPost+'`,`'+idPosts+'`)">Cancelar</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
            $('#cont-imgEditablePost').html(html);

            // var urlImg = urlImagenPost.split("/uploads/");
            // var nombreImg = urlImg[1];

            var urlImg = urlImagenPost.split("/uploads/");
            var nombreImg = urlImg[1];
            
            $('#nombreImg').val(nombreImg)
            const inpFileEditar = document.getElementById("imagenSubParrafoEditar");
            const previewContainerEditar = document.getElementById("imagePreviewEditar");
            const previewImage2 = previewContainerEditar.querySelector(".image-preview__img2");

            inpFileEditar.addEventListener("change", function(){
                const file = this.files[0];
                console.log(file);
                if(file){
                    const reader = new FileReader();
                    previewImage2.style.display = "block";
                    reader.addEventListener("load", function(){
                        console.log(this);
                        previewImage2.setAttribute("src", this.result);
                    });
                    reader.readAsDataURL(file);
                }else{
                    previewImage2.style.display = null;
                }
            });
    }
    this.EditarImagenSubPost = function(urlImagenPost,idSubPosts,idPosts){

        let html = '';

        html +=
            '<div class="cont-editarImagen">'+
                '<form action="/editarImagenSubPost" method="POST" enctype="multipart/form-data" id="myPostImageSubForm">'+
                    '<input type="hidden" name="nombreImg" id="nombreImg" />'+
                    '<input type="hidden" name="idPost" id="idPost" value="'+idPosts+'" />'+
                    '<input type="hidden" name="idSubPost" id="idSubPost" value="'+idSubPosts+'" />'+
                    '<div class="seccionImagen">'+
                        '<div class="cont-imagen"  id="cont-imagenEditar">'+
                            '<div class="cont-icono" id="cont-icono">'+
                                '<i class="fa fa-image"></i> <span>Agregar Imagen</span>'+
                            '</div>'+
                            '<input type="file" name="imagenSubParrafoEditar" id="imagenSubParrafoEditar" onchange="MagicPlanet.MisScripts.handleChangeEditar()" />'+
                        '</div>'+
                        '<div id="imagePreviewEditar" class="image-preview esconder">'+
                            '<img src="" alt="Image" class="image-preview__img2" />'+
                        '</div>'+
                        '<div class="cont-cambiarImg">'+
                            '<div class="cambiarImagen esconder" id="cambiarImagenEditar" onclick="MagicPlanet.MisScripts.cambiarImagenEditar()"><i class="fa fa-times-circle"></i>Cambiar Imagen</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="seccionInput">'+
                        // '<div class="boton-enviar" onclick="MagicPlanet.PopUps.EnviarImagenPost(`'+urlImagenPost+'`,`'+idPosts+'`)">Enviar</div>'+
                        '<div class="boton-enviar" onclick="MagicPlanet.MisScripts.EnviarImagenSubPost(`'+urlImagenPost+'`,`'+idPosts+'`)">Enviar</div>'+
                        '<div class="boton-cancelar" onclick="MagicPlanet.MisScripts.CancelarEditarImagenS(`'+urlImagenPost+'`,`'+idSubPosts+'`,`'+idPosts+'`)">Cancelar</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
            $('#cont-imgEditableSubPost'+idSubPosts).html(html);

            var urlImg = urlImagenPost.split("/uploads/");
            var nombreImg = urlImg[1];
            
            $('#nombreImg').val(nombreImg)
            const inpFileEditar = document.getElementById("imagenSubParrafoEditar");
            const previewContainerEditar = document.getElementById("imagePreviewEditar");
            const previewImage2 = previewContainerEditar.querySelector(".image-preview__img2");

            inpFileEditar.addEventListener("change", function(){
                const file = this.files[0];
                console.log(file);
                if(file){
                    const reader = new FileReader();
                    previewImage2.style.display = "block";
                    reader.addEventListener("load", function(){
                        console.log(this);
                        previewImage2.setAttribute("src", this.result);
                    });
                    reader.readAsDataURL(file);
                }else{
                    previewImage2.style.display = null;
                }
            });
    }

    this.EnviarImagenPost = function(urlImagenPost,idPosts){
        
        document.getElementById("myPostImageForm").submit();
    }
    this.EnviarImagenSubPost = function(urlImagenPost,idPosts){
        
        document.getElementById("myPostImageSubForm").submit();
    }
    this.handleChangeEditar = function(){
        let imagePreview = document.getElementById('imagePreviewEditar');
        let inpFile = document.getElementById('cont-imagenEditar');
        let cambiarImagen = document.getElementById('cambiarImagenEditar');
        
        imagePreview.classList.remove('esconder');
        inpFile.classList.add('esconder');

        cambiarImagen.classList.remove('esconder');
        
    }

    this.cambiarImagenEditar = function(){
        let imagePreview = document.getElementById('imagePreviewEditar');
        let inpFile = document.getElementById('cont-imagenEditar');
        let cambiarImagen = document.getElementById('cambiarImagenEditar');
        let imagenSubParrafo = document.getElementById('imagenSubParrafoEditar');

        imagePreview.classList.add('esconder');
        inpFile.classList.remove('esconder');

        cambiarImagen.classList.add('esconder');
        imagenSubParrafo.value = "";
    }

    this.CancelarEditarImagenP = function(urlImagenPost,idPosts){
        let html = '';
        html +=
        '<img src="'+urlImagenPost+'" onclick="MagicPlanet.MisScripts.EditarImagenPost(`'+urlImagenPost+'`,`'+idPosts+'`)" />';
        $('#cont-imgEditablePost').html(html);
    }
    this.CancelarEditarImagenS = function(urlImagenPost,idSubPosts,idPosts){
        let html = '';
        html +=
        '<img src="'+urlImagenPost+'" onclick="MagicPlanet.MisScripts.EditarImagenSubPost(`'+urlImagenPost+'`,`'+idSubPosts+'`,`'+idPosts+'`)" />';
        $('#cont-imgEditableSubPost'+idSubPosts).html(html);
    }
    this.TraerCurso = function(){
        var url = window.location.pathname;
        var IdCurso = url.substring(url.lastIndexOf('/') + 1);
        console.log(IdCurso)
        var settings = {
            "url": "/getCurso/"+IdCurso,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": ""
          };
          
          $.ajax(settings).done(async function (response) {
            console.log(response);
            let html='';
            let html2='';
            let html3='';
            let html4 = '';
            let html5 = '';
            let html6 = '';
            let html7 = '';
            let html8 = '';
            let html9 = '';
            let html10 = '';
           
            var maestroCurso = await MagicPlanet.MisScripts.getUsuario(response[0].idMaestro);
            console.log(maestroCurso)
                html+= 
                '<img src="'+response[0].rutaImagen+'" onclick="MagicPlanet.MisScripts.editarImagenProducto(`rutaImagen`,`urlImagenPost`,`cont-imagen`,`'+response[0].rutaImagen+'`,`'+IdCurso+'`,`Curso`)" />';
                html2+= 
                '<div class="titulo" onclick="MagicPlanet.MisScripts.editarProducto(`nombre`,`titulo`,`cont-titulo`,`'+response[0].nombre+'`,`'+IdCurso+'`,`Curso`)">'+response[0].nombre+'</div>';
                html3+= 
                '<div class="select" onclick="MagicPlanet.MisScripts.editarProducto(`idMaestro`,`select`,`cont-maestro`,`'+maestroCurso[0].nombres+' '+maestroCurso[0].apellidos+'`,`'+IdCurso+'`,`Curso`)">'+maestroCurso[0].nombres+' '+maestroCurso[0].apellidos+'</div>';
                html4+= 
                '<div class="descripcion" onclick="MagicPlanet.MisScripts.editarProducto(`descripcionCurso`,`descripcion`,`cont-descripcion`,`'+response[0].descripcionCurso+'`,`'+IdCurso+'`,`Curso`)">'+response[0].descripcionCurso+'</div>';
                html5+= 
                '<div class="duracionCurso" onclick="MagicPlanet.MisScripts.editarProducto(`duracionCurso`,`duracionCurso`,`cont-duracionCurso`,`'+response[0].duracionCurso+'`,`'+IdCurso+'`,`Curso`)">'+response[0].duracionCurso+'</div>';
                html6+= 
                '<div class="unidadTiempo" onclick="MagicPlanet.MisScripts.editarProducto(`unidadTiempo`,`unidadTiempo`,`cont-unidadTiempo`,`'+response[0].unidadTiempo+'`,`'+IdCurso+'`,`Curso`)">'+response[0].unidadTiempo+'</div>';

                html7+= 
                '<div class="fechaInicial" onclick="MagicPlanet.MisScripts.editarProducto(`fechaInicial`,`fechaInicial`,`cont-fechaInicial`,`'+response[0].fechaInicial+'`,`'+IdCurso+'`,`Curso`)">'+response[0].fechaInicial+'</div>';
                html8+= 
                '<div class="fechaTerminacion" onclick="MagicPlanet.MisScripts.editarProducto(`fechaTerminacion`,`fechaTerminacion`,`cont-fechaTerminacion`,`'+response[0].fechaTerminacion+'`,`'+IdCurso+'`,`Curso`)">'+response[0].fechaTerminacion+'</div>';
                html9+= 
                '<div class="horarioClaseEntrada" onclick="MagicPlanet.MisScripts.editarProducto(`horarioClaseEntrada`,`horarioClaseEntrada`,`cont-horarioClaseEntrada`,`'+response[0].horarioClaseEntrada+'`,`'+IdCurso+'`,`Curso`)">'+response[0].horarioClaseEntrada+'</div>';
                html10+= 
                '<div class="horarioClaseSalida" onclick="MagicPlanet.MisScripts.editarProducto(`horarioClaseSalida`,`horarioClaseSalida`,`cont-horarioClaseSalida`,`'+response[0].horarioClaseSalida+'`,`'+IdCurso+'`,`Curso`)">'+response[0].horarioClaseSalida+'</div>';

                $('#cont-imagen').html(html);
                $('#cont-titulo').html(html2);
                $('#cont-maestro').html(html3);
                $('#cont-descripcion').html(html4);
                $('#cont-duracionCurso').html(html5);
                $('#cont-unidadTiempo').html(html6);
                $('#cont-fechaInicial').html(html7);
                $('#cont-fechaTerminacion').html(html8);
                $('#cont-horarioClaseEntrada').html(html9);
                $('#cont-horarioClaseSalida').html(html10);
          })
    }
    
    this.TraerProducto = function(){
        var url = window.location.pathname;
        var IdProducto = url.substring(url.lastIndexOf('/') + 1);
        console.log(IdProducto)
        var settings = {
            "url": "/getProducto/"+IdProducto,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": ""
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            let html='';
            let html2='';
            let html3='';
            let html4 = '';
            let html5 = '';
          
                html+= 
                '<img src="'+response[0].urlImagenPost+'" onclick="MagicPlanet.MisScripts.editarImagenProducto(`urlImagenPost`,`urlImagenPost`,`cont-imagen`,`'+response[0].urlImagenPost+'`,`'+IdProducto+'`,`Producto`)" />';
                html2+= 
                '<div class="titulo" onclick="MagicPlanet.MisScripts.editarProducto(`nombreProducto`,`titulo`,`cont-titulo`,`'+response[0].nombreProducto+'`,`'+IdProducto+'`,`Producto`)">'+response[0].nombreProducto+'</div>';
                html3+= 
                '<div class="select" onclick="MagicPlanet.MisScripts.editarProducto(`idTipoProducto`,`select`,`cont-categoria`,`'+response[0].tipoProducto+'`,`'+IdProducto+'`,`Producto`)">'+response[0].tipoProducto+'</div>';
                html4+= 
                '<div class="descripcion" onclick="MagicPlanet.MisScripts.editarProducto(`descripcion`,`descripcion`,`cont-descripcion`,`'+response[0].descripcion+'`,`'+IdProducto+'`,`Producto`)">'+response[0].descripcion+'</div>';
                html5+= 
                '<div class="precio" onclick="MagicPlanet.MisScripts.editarProducto(`precio`,`precio`,`cont-precio`,`'+response[0].precio+'`,`'+IdProducto+'`,`Producto`)">'+response[0].precio+'</div>';

                $('#cont-imagen').html(html);
                $('#cont-titulo').html(html2);
                $('#cont-categoria').html(html3);
                $('#cont-descripcion').html(html4);
                $('#cont-precio').html(html5);
        
          });
        
    }
    this.editarProducto = function(id, clase, contenedor, valorProducto, IdProducto, ProductoOCurso){
        
        let html = '';
        if(id =="duracionCurso"){
            
            var tipoInput = "number"
        }else if(id == "fechaInicial" || id == "fechaTerminacion"){
            var tipoInput = "date"
        }else if(id == "horarioClaseEntrada" || id == "horarioClaseSalida"){
            var tipoInput = "time"
        }else{
            var tipoInput = "text"
        }

        if(clase != "select"){
            if(id != "unidadTiempo"){
                html +=
                '<div class="contenidoForm">'+
                    '<form>'+
                        '<div class="cont-input">'+
                            '<input type="'+tipoInput+'" name="'+id+'" id="'+id+'" value="'+valorProducto+'" />'+
                        '</div>'+
                        '<div class="cont-botones">'+
                            '<div class="editar" onclick="MagicPlanet.MisScripts.enviarEditarProducto(`'+IdProducto+'`,`'+id+'`,`'+ProductoOCurso+'`)">Editar</div>'+
                            '<div class="cancelar" onclick="MagicPlanet.MisScripts.cancelarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">Cancelar</div>'+
                        '</div>'+
                    '</form>'+
                '</div>';
            }else{
                html +=
                    '<div class="contenidoForm">'+
                        '<form>'+
                            '<div class="cont-input">'+
                                '<select name="'+id+'" id="'+id+'">'+
                                    '<option value="Días">Días</option>'+
                                    '<option value="Meses">Meses</option>'+
                                    '<option value="Semestres">Semestres</option>'+
                                    '<option value="Años">Años</option>'+
                                '</select>'+
                            '</div>'+
                            '<div class="cont-botones">'+
                                '<div class="editar" onclick="MagicPlanet.MisScripts.enviarEditarProducto(`'+IdProducto+'`,`'+id+'`,`'+ProductoOCurso+'`)">Editar</div>'+
                                '<div class="cancelar" onclick="MagicPlanet.MisScripts.cancelarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">Cancelar</div>'+
                            '</div>'+
                        '</form>'+
                    '</div>';
            }
            
        }else{
            MagicPlanet.MisScripts.categoriasProducto(id, clase, contenedor, valorProducto, IdProducto, ProductoOCurso)
        }
        
        $('#'+contenedor).html(html);
    }
    this.editarImagenProducto = function(id, clase, contenedor, valorProducto, IdProducto, ProductoOCurso){
       
        let html ='';
        html +=
        '<div class="contenidoForm">';
            if(ProductoOCurso == "Curso"){
                html +=
                '<form action="/editarImagenCurso" method="POST" enctype="multipart/form-data" id="myImagenProducttForm">';
            }else{
                html +=
                '<form action="/editarImagenProducto" method="POST" enctype="multipart/form-data" id="myImagenProducttForm">';
            }
            html +=
                '<input type="hidden" name="nombreImg" id="nombreImg" />'+
                '<input type="hidden" name="idProducto" id="idProducto" value="'+IdProducto+'" />'+
                '<div class="cont-input">'+
                    '<div class="seccionImagen">'+
                        '<div class="cont-imagen2"  id="cont-imagenEditar">'+
                            '<div class="cont-icono" id="cont-icono">'+
                                '<i class="fa fa-image"></i> <span>Agregar Imagen</span>'+
                            '</div>'+
                            '<input type="file" name="imagenSubParrafoEditar" id="imagenSubParrafoEditar" onchange="MagicPlanet.MisScripts.handleChangeEditar()" />'+
                        '</div>'+
                        '<div id="imagePreviewEditar" class="image-preview esconder">'+
                            '<img src="" alt="Image" class="image-preview__img2" />'+
                        '</div>'+
                        '<div class="cont-cambiarImg">'+
                            '<div class="cambiarImagen esconder" id="cambiarImagenEditar" onclick="MagicPlanet.MisScripts.cambiarImagenEditar()"><i class="fa fa-times-circle"></i>Cambiar Imagen</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="cont-botones">'+
                    '<div class="editar" onclick="MagicPlanet.MisScripts.enviarEditarImagenProducto(`'+valorProducto+'`)" >Editar</div>'+
                   ' <div class="cancelar" onclick="MagicPlanet.MisScripts.cancelarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">Cancelar</div>'+
                '</div>'+
            '</form>'+
        '</div>';

        $('#'+contenedor).html(html);

       
            const inpFileEditar = document.getElementById("imagenSubParrafoEditar");
            const previewContainerEditar = document.getElementById("imagePreviewEditar");
            const previewImage2 = previewContainerEditar.querySelector(".image-preview__img2");

            inpFileEditar.addEventListener("change", function(){
                const file = this.files[0];
                console.log(file);
                if(file){
                    const reader = new FileReader();
                    previewImage2.style.display = "block";
                    reader.addEventListener("load", function(){
                        console.log(this);
                        previewImage2.setAttribute("src", this.result);
                    });
                    reader.readAsDataURL(file);
                }else{
                    previewImage2.style.display = null;
                }
            });
    }
    this.cancelarProducto = function(id, clase, contenedor, valorProducto, IdProducto,ProductoOCurso){
        let html = '';
        if(clase != "urlImagenPost"){
            html+= 
                '<div class="'+clase+'" onclick="MagicPlanet.MisScripts.editarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">'+valorProducto+'</div>';
        }else{
            html+= 
            '<img src="'+valorProducto+'" onclick="MagicPlanet.MisScripts.editarImagenProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)" />';
        }
            
                $('#'+contenedor).html(html);
    }
    this.categoriasProducto = function(id, clase, contenedor, valorProducto, IdProducto, ProductoOCurso){
        // alert(ProductoOCurso)
        if(ProductoOCurso == 'Curso'){
            var url = "/getMaestros"
        }else{
            var url = "/getTipoProducto"
        }
        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": ""
          };
          
          $.ajax(settings).done(function (response) {
              console.log("maestrooooos :")
                console.log(response);
                let html = '';
                if(ProductoOCurso == 'Curso'){
                    html +=
                        '<div class="contenidoForm">'+
                            '<form >'+
                                '<div class="cont-input">'+
                                    '<select name="'+id+'" id="'+id+'">';
                                        response.map(function(selectTP){
                                            console.log("selectTP")
                                            console.log(selectTP)
                                            if(selectTP.nombre == valorProducto){
                                                if(ProductoOCurso == "Curso"){
                                                    html +=
                                                    '<option value="'+selectTP.id+'" selected>'+selectTP.nombres+' '+selectTP.apellidos+'</option>';
                                                }else{
                                                    html +=
                                                    '<option value="'+selectTP.id+'" selected>'+selectTP.nombre+'</option>';
                                                }
                                                
                                            }else{
                                                if(ProductoOCurso == "Curso"){
                                                    html +=
                                                    '<option value="'+selectTP.id+'">'+selectTP.nombres+' '+selectTP.apellidos+'</option>';
                                                }else{
                                                    html +=
                                                    '<option value="'+selectTP.id+'">'+selectTP.nombre+'</option>';
                                                }
                                                
                                            }
                                        });
                                        html +=
                                    '</select>'+
                                '</div>'+
                                '<div class="cont-botones">'+
                                    '<div class="editar" onclick="MagicPlanet.MisScripts.enviarEditarProducto(`'+IdProducto+'`,`'+id+'`,`'+ProductoOCurso+'`)">Editar</div>'+
                                    '<div class="cancelar" onclick="MagicPlanet.MisScripts.cancelarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">Cancelar</div>'+
                                '</div>'+
                            '</form>'+
                        '</div>'; 
                }else{
                    html +=
                        '<div class="contenidoForm">'+
                            '<form >'+
                                '<div class="cont-input">'+
                                    '<select name="'+id+'" id="'+id+'">';
                                        response.map(function(selectTP){
                                            if(selectTP.nombre == valorProducto){
                                                html +=
                                                    '<option value="'+selectTP.id+'" selected>'+selectTP.nombre+'</option>';
                                            }else{
                                                html +=
                                                    '<option value="'+selectTP.id+'">'+selectTP.nombre+'</option>';
                                            }
                                            
                                        });
                                        html +=
                                    '</select>'+
                                '</div>'+
                                '<div class="cont-botones">'+
                                    '<div class="editar" onclick="MagicPlanet.MisScripts.enviarEditarProducto(`'+IdProducto+'`,`'+id+'`,`'+ProductoOCurso+'`)">Editar</div>'+
                                    '<div class="cancelar" onclick="MagicPlanet.MisScripts.cancelarProducto(`'+id+'`,`'+clase+'`,`'+contenedor+'`,`'+valorProducto+'`,`'+IdProducto+'`,`'+ProductoOCurso+'`)">Cancelar</div>'+
                                '</div>'+
                            '</form>'+
                        '</div>';              

                        
                }
                $('#'+contenedor).html(html);
          });

    }
    this.enviarEditarProducto = function(IdProducto, nombreModelo, ProductoOCurso){
        if(ProductoOCurso == "Curso"){
            if(nombreModelo == "nombre"){
                var data = {"nombre": document.getElementById("nombre").value}
            }else if(nombreModelo == "horarioClaseEntrada"){
                var data = {"horarioClaseEntrada": document.getElementById("horarioClaseEntrada").value}
            }else if(nombreModelo == "horarioClaseSalida"){
                var data = {"horarioClaseSalida": document.getElementById("horarioClaseSalida").value}
            }else if(nombreModelo == "duracionCurso"){
                var data = {"duracionCurso": document.getElementById("duracionCurso").value}
            }else if(nombreModelo == "unidadTiempo"){
                var data = {"unidadTiempo": document.getElementById("unidadTiempo").value}
            }else if(nombreModelo == "fechaInicial"){
                var data = {"fechaInicial": document.getElementById("fechaInicial").value}
            }else if(nombreModelo == "fechaTerminacion"){
                var data = {"fechaTerminacion": document.getElementById("fechaTerminacion").value}
            }else if(nombreModelo == "descripcionCurso"){
                var data = {"descripcionCurso": document.getElementById("descripcionCurso").value}
            }else if(nombreModelo == "idMaestro"){
                var data = {"idMaestro": document.getElementById("idMaestro").value}
            }else if(nombreModelo == "rutaImagen"){
                var data = {"rutaImagen": document.getElementById("rutaImagen").value}
            }
            var url = "/editarCurso/"+IdProducto;

            var redirect = "/editar-curso/"+IdProducto;
    
        }else{
            if(nombreModelo == "nombreProducto"){
                var data = {"nombreProducto": document.getElementById("nombreProducto").value}
               }else if(nombreModelo == "idTipoProducto"){
                var data = {"idTipoProducto": document.getElementById("idTipoProducto").value}
               }else if(nombreModelo == "descripcion"){
                var data = {"descripcion": document.getElementById("descripcion").value}
               }else if(nombreModelo == "precio"){
                var data = {"precio": document.getElementById("precio").value}
               }
               var url = "/editarProducto/"+IdProducto;

               var redirect = "/editar-productos/"+IdProducto;
        }
       
        var settings = {
            "url": url,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": data
          };
          
          $.ajax(settings).done(function (response) {
              console.log(response);
            window.location.href = redirect;
          })
    }
    this.enviarEditarImagenProducto = function(valorProducto){

        var urlImg = valorProducto.split("/uploads/");
        var nombreImg = urlImg[1];
        
        $('#nombreImg').val(nombreImg)
        document.getElementById("myImagenProducttForm").submit();
     }
    this.enviarCurso = function(){
       let contenedorMaestro = document.getElementById("maestro").value;
        if(contenedorMaestro != "indefinido"){
            document.getElementById("cursoForm").submit();
        }else{
            alert("Escoger un maestro")
        }
       // document.getElementById("cursoForm").submit();
        
    }
    this.traerServicios = async function(){
        // alert("servicioss")
       let getServicios = await MagicPlanet.MisScripts.getServicios();
       let html = '';
            getServicios.map((servicios)=>{
                html +=
                        `<tr>`+
                            `<td>${servicios.nombreServicio}</td>`+
                            `<td>${servicios.descripcionServicio}</td>`+
                            `<td>${servicios.tiempo} ${servicios.medidaTiempo}</td>`+
                            `<td>$${servicios.precioServicio}</td>`+
                            `<td class="contBotones">`+
                                `<a class="botonEditar" href="/servicio/${servicios.id}">Editar</a>`+
                                `<div class="botonEliminar" onclick="MagicPlanet.PopUps.EliminarServicioPopUp('Eliminar Servicio','Servicio','${servicios.id}')">Eliminar</div>`+
                            `</td>`+
                        `</tr>`;
            });
       $('#contenido').html(html)
    //    console.log(getServicios)
    }
    this.traerTipoServicios = async function(){
        let getTipoServicios = await MagicPlanet.MisScripts.getTipoServicios();
        console.log(getTipoServicios)
        let html = '';
        getTipoServicios.map((tipoServicios)=>{
                html +=
                        `<tr>`+
                            `<td>${tipoServicios.nombre}</td>`+
                            `<td>${tipoServicios.descripcion}</td>`+
                            // `<td class="contBotones">`+
                            //     `<a class="botonEditar" href="/servicio/${tipoServicios.id}">Editar</a>`+
                            //     `<div class="botonEliminar" onclick="MagicPlanet.PopUps.EliminarServicioPopUp('Eliminar Servicio','Servicio','${servicios.id}')">Eliminar</div>`+
                            // `</td>`+
                        `</tr>`;
            });
       $('#contenidoTipoServicio').html(html)
    }
    this.traerServicio = async function(IdServicio){
        
        let servicio = await MagicPlanet.MisScripts.getServicio(IdServicio);
        let html1 = '';
        let html2 = '';
        let html3 = '';
        let html4 = '';
        let hidden = '';

        html1 +=
            `<input type="text" name="nombreServicio" id="nombreServicio" value="${servicio[0].nombreServicio}" />`;
        
        html2 +=
        `<div class="contenedor">`+
            `<div class="signoDinero">$</div>`+
            `<input class="tiempo" type="number" name="precioServicio" id="precioServicio" value="${servicio[0].precioServicio}" />`+
        `</div>`;
           

        html3 +=
            `<input type="number" name="tiempo" id="tiempo" value="${servicio[0].tiempo}" />`+
            `<select name="medidaTiempo" id="medidaTiempo">`;
            if(servicio[0].medidaTiempo == "segundos"){
                html3 +=
                `<option value="segundos" selected>Segundos</option>`;
            }else{
                html3 +=
                `<option value="segundos">Segundos</option>`;
            }
            if(servicio[0].medidaTiempo == "minutos"){
                html3 +=
                `<option value="minutos" selected>Minutos</option>`;
            }else{
                html3 +=
                `<option value="minutos">Minutos</option>`;
            }
            if(servicio[0].medidaTiempo == "horas"){
                html3 +=
                `<option value="horas" selected>Horas</option>`;
            }else{
                html3 +=
                `<option value="horas">Horas</option>`;
            }   
            if(servicio[0].medidaTiempo == "dias"){
                html3 +=
                `<option value="dias" selected>Días</option>`;
            }else{
                html3 +=
                `<option value="dias">Días</option>`;
            }   
                
            `</select>`;
                
            html4 +=
                `<input type="text" name="descripcionServicio" id="descripcionServicio" value="${servicio[0].descripcionServicio}" />`;

            hidden +=
                `<input type="hidden" name="IdServicio" id="IdServicio" value="${IdServicio}" />`;

        $('#contNombreServicio').html(html1);
        $('#contPrecio').html(html2);
        $('#contTiempo').html(html3);
        $('#contDescripcion').html(html4);
        $('#contHidden').html(hidden);
        // servicio
        
        
    }
    this.traerSelectTipoServicio = async function(){
        let tipoServicio = await MagicPlanet.MisScripts.getTipoServicios();
        console.log(tipoServicio)
        let html = '';
        html +=
                `<select name="idTipoServicio" id="idTipoServicio">`;
        tipoServicio.map((tS)=>{
            html +=
                    `<option value="${tS.id}">${tS.nombre}</option>`;
                
        });
        html +=
            `</select>`;
        
            $('#contTipoServicio').html(html);
    }
    this.traerShows = async function(){
       var shows = await MagicPlanet.MisScripts.getShows();
        html = '';
        html +=
        `<select name="idPost">`;
       shows.map((show)=>{
            html +=
                `<option value="${show.id}" selected>${show.titulo}</option>`;
       });
        html +=
            `</select>`;
        $('#contSeleccionarShow').html(html);
    }

    this.traerTipoProductos = async function(){
        var tipoP = await MagicPlanet.MisScripts.getTProducto();
        console.log(tipoP)
    }
    this.getTProducto = function(){
        var settings = {
            "url": "/getTipoProducto",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
              console.log(response);
            return response;
          })
    }
    this.getShows = function(){
        var settings = {
            "url": "/getShows",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
              console.log(response);
            return response;
          })
    }
    this.ToogleView = function(index) {         
        $("#list-conten-"+index).toggle(500);    
    }
    
    this.traerFechaCartelera = async function() {
        const fechaCartelera = await MagicPlanet.MisScripts.getFechaCartelera();
        console.log(fechaCartelera)
        let post = '' ; 
        let fecha;
        fechaCartelera.map(async ( value,index) => {          
            let cartelera = await MagicPlanet.MisScripts.getCartelera(value.id);                   
            console.log(cartelera)
            fecha = new Date(value.fechaDia.replace(/-/g, '\/'))                 
            post += `
                    <diV class ="cartelera-list"  onclick ="MagicPlanet.MisScripts.ToogleView(${index})">
                        <div class ="cartelera-title" id="list-${value.id}">
                            <h3 class="inline-title">${fecha.toLocaleDateString("es-MX",{day:'numeric'})} </h3> 
                            <h6 class="inline-title">${fecha.toLocaleDateString("es-MX",{month:'long'})}, ${fecha.toLocaleDateString("es-MX",{weekday:'long'})}</h6>              
                        </div>
                        <div class="cartelera-card" id="list-conten-${index}">`; 
                                cartelera.map((info)=>{
                                    post += `
                                    <div class="cartelera-box">
                                        <img src="${info.post[0].urlImagenPost}" alt="" >
                                        <div class="caretelera-opacity">
                                            <div class="cartelera-text">
                                                SHOW  A LAS <br> ${info.fechaHoraEntrada} - ${info.fechaHoraSalida}
                                            </div>                                       
                                        </div>                                                                       
                                    </div> 
                                `;
                                })
                       post += `                                                                                                
                        </div>         
                   </div>  
                   `;                                                  
            $("#contenido").html(post)        
        })        
    }


    this.traerCartelera = async function(idFechaCartelera){
        var cartelera = await MagicPlanet.MisScripts.getCartelera(idFechaCartelera);        
        var html = '';
        cartelera.map(ca => {          
            html +=
            `<div>${ca.post[0].titulo}</div>`
            $(`#contIndividual${ca.idFechaCartelera}`).html(html);
        });        
        
    }
    this.getCartelera = function(idFechaCartelera){
        var settings = {
            "url": "/getCartelera/"+idFechaCartelera,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
             
            return response;
          })
    }
    this.getFechaCartelera = function(){
        var settings = {
            "url": "/getFechaCartelera",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {       
            return response;
          })
    }
    this.getServicios = function(){
        var settings = {
            "url": "/getServicios",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
              console.log(response);
            return response;
          })
    }
    this.getUsuarios = function(){
        var settings = {
            "url": "/getUsuarios",
            "method": "GET",
            "timeout": 0,
          };
          
          return $.ajax(settings).done(function (response) {
                // console.log(response);
                return response;
                
            })
    }
    this.getUsuario = function(IdUsuario){
        var settings = {
            "url": "/getUsuario/"+IdUsuario,
            "method": "GET",
            "timeout": 0,
          };
          
          return $.ajax(settings).done(function (response) {
                // console.log(response);
                return response;
                
            })
    }
    
    this.getServicio = function(IdServicio){
        var settings = {
            "url": "/getServicio/"+IdServicio,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
              console.log(response);
            return response;
          })
    }
    this.getTipoServicios = function(){
        var settings = {
            "url": "/getTipoServicios",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          };
          
          return $.ajax(settings).done(function (response) {
              console.log(response);
            return response;
          })
    }
    this.EliminarServicio = function(idServicio){
        
        var settings = {
            "url": "/eliminarServicio/"+idServicio,
            "method": "POST",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            window.location.href = "/servicios";
          });

    }
    this.traerBrazaletes = async function(){
        var brazaletes = await MagicPlanet.MisScripts.getBrazaletes();
        console.log(brazaletes)
        let html = '';
        brazaletes.map((brazalete)=>{
            html +=
                `<tr>`+
                    `<td>${brazalete.codigo_brazalete}</td>`+
                    `<td>${brazalete.estado}</td>`+
                    `<td>${brazalete.urlqr}</td>`+
                `</tr>`;

        });

        $('#contBrazalete').html(html)
    }
    this.getBrazaletes = function(){
        var settings = {
            "url": "/getBrazaletes",
            "method": "GET",
            "timeout": 0,
          };
          
          return $.ajax(settings).done(function (response) {
            // console.log(response);
            return response;
          });
    }
        
    this.cambiarNombreImg = async function(ruta){

        if(ruta == "posts"){
            var titulo = document.getElementById('titulo').value;
            let imagen = await MagicPlanet.MisScripts.generarNombreImg(titulo)
            $('#nombreImg').val(imagen);
        }else if(ruta == "tags"){
            var titulo = document.getElementById('nombreTag').value;
            let imagen = await MagicPlanet.MisScripts.generarNombreImg(titulo)
            $('#nombreImg').val(imagen);
        }
        
        // let tituloSinEspacio = titulo.trim();
            
            // var imagen = img2+'.jpg';
            
        
    }
    this.generarNombreImg = function(titulo){
        titulo = titulo.replace(/\s/g, '');
        var img2 = windowGuid2();
        var imagen = titulo+img2+'.png';
        return imagen
    }

    this.getUsuarioVinculacion = function(){
        let email_usuario = document.getElementById('email_usuario').value;
            var settings = {
            "url": "/getUsuarioVinculacion",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": "connect.sid=s%3AhiNRb6KQXPSq-JA3iuQStsnnYE1_7In3.VETClhJyg8WCb1K%2FKGJO20Ip9xUQzOmvwP2g8b1zIuc"
            },
            "data": {
                "email_usuario": email_usuario
            }
            };
    
            $.ajax(settings).done(function (response) {
                console.log(response);
                let html = '';
                let titular = response.nombres + " " + response.apellidos;
                html += 
                `<select name="select">
                    <option value="${response.id}%usuario" selected>${titular}</option>`;
                    response.ninos.map(ninos =>{
                        html += `<option value="${ninos.id_membresia}%membresia" >${ninos.nombreNino}</option>`;
                    })
                    
                html += `</select>`;

                $('#cont-select-persona').html(html);
                // $('#reader').html();
            });
            
    }
    this.registrarUsuario = function(){
        
            var email = document.getElementById("email").value;
            var nombres = document.getElementById("nombres").value;
            // var password = document.getElementById("password").value;
            
            var celular = document.getElementById("celular").value;
            var apellidos = document.getElementById("apellidos").value;
            let error = '';

            
            if(nombres == ""){
                error +=
                `<div class="error">Agrega un nombre</div>`;

                $('#cont-error').html(error);
                return;
            }
            if(apellidos == ""){
                error +=
                `<div class="error">Agrega un apellido</div>`;

                $('#cont-error').html(error);
                return;
            }
            if(email == ""){
                error +=
                `<div class="error">Agrega un correo</div>`;

                $('#cont-error').html(error);
                return;
            }
            if(celular == ""){
                error +=
                `<div class="error">Agrega un celular</div>`;

                $('#cont-error').html(error);
                return;
            }


          var settings = {
            "url": "/signup2",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                'nombres': nombres,
                'celular': celular,
                'email': email,
                'password': "19830704-fa1e-4c21-a018-16f532cc1ac6",
                'idTipoUsuario': "cliente",
                'apellidos': apellidos,
                'registroEntrada': true,
            }
        };
        
        $.ajax(settings).done(function (response) {
           console.log(response)
           let error = '';
            if(response.auth){
                window.location.href = `/compra-cliente?id=${response.idUsuarioPersonalizado}`;
            }else if(response.auth == false){
                console.log("pasa por aqui")
                error +=
                `<div class="error">${response.mensaje}</div>`;
                $('#cont-error').html(error);
            }
        });
        
    }

    this.traerSeccionUsuario = function(id){
        let htmlUsuario = '';
        if(id == "registro"){
            htmlUsuario +=
            `<form>
                <div class="cont-seccion" id="cont-error">
                
                </div>
                <div class="cont-seccion">
                    <h2>Nombres:</h2>
                    <input type="text" autocomplete="off" id="nombres" name="nombres" />
                </div>
                <div class="cont-seccion">
                    <h2>Apellidos:</h2>
                    <input type="text" autocomplete="off" id="apellidos" name="apellidos" />
                </div>
                <div class="cont-seccion">
                    <h2>Email</h2>
                    <input type="text" id="email" name="email" autocomplete="off" />
                </div>
                <div class="cont-seccion">
                    <h2>Celular</h2>
                    <input type="text" id="celular" name="celular" autocomplete="off" />
                </div>
                
                <div class="cont-seccion">
                    <div class="botonEnvio" onclick="MagicPlanet.MisScripts.registrarUsuario()">Enviar</div>
                </div>
            </form>`;
        }else if(id == "busqueda"){
            // htmlUsuario +=
            var datosUsuario = '';
            datosUsuario +=
            `<div class="cont-datosUsuario">
                <div class="cont-input">
                    <div class="input" id="nombres">
                    
                    </div>
                </div>
                <div class="cont-input">
                    <div class="input" id="apellidos">
                    
                    </div>
                </div>
                <div class="cont-input">
                    <div class="input" id="email">
                    
                    </div>
                </div>
                <div class="cont-input">
                    <div class="input" id="celular">
                   
                    </div>
                </div>
                <div class="cont-input">
                    <div class="input" id="idUsuarioPersonalizado">
                   
                    </div>
                </div>
            </div>`;

            htmlUsuario +=
            `<h2>Buscar Usuario</h2>
            <div class="cont-input">
                    <div class="autocomplete">
                    <input id="myInput" type="text" name="usuarioBusqueda" placeholder="Correo">
                    </div>
                    <div class="cont-boton">
                        <button class="botonUsuario" onclick="MagicPlanet.MisScripts.buscarUsuario()">Traer Usuario</button>
                    </div>
                    
            </div>
            
            <div class="contBotonE">
                <input type="hidden" name="idUsuarioPersonalizado1" id="idUsuarioPersonalizado1" />
                <div id="contb" class="cont-boton">
                    
                </div>
            </div>
            `;


            $('#cont-datosUsuario').html(datosUsuario);
        }
        $('#cont-seccionUsuario').html(htmlUsuario);
    }
    this.buscarUsuario = async function(){
        console.log("pusheaste el boton")
        var usuarioBusqueda = document.getElementById('myInput').value;
        // console.log(usuarioBusqueda)
        var usuario = await MagicPlanet.MisScripts.traerUsuario(usuarioBusqueda);
        console.log(usuario.idUsuarioPersonalizado);
        $('#idUsuarioPersonalizado1').val(usuario.idUsuarioPersonalizado);
        MagicPlanet.MisScripts.llenarDatosUsuario(usuario);
    }
    this.traerUsuarios = function(){
        var settings = {
            "url": "/traerUsuarios",
            "method": "POST",
            "timeout": 0,
          };
          
          return $.ajax(settings).done(function (response) {
            //  console.log(response);
             return response;
          });
    }
    this.traerUsuario = function(email){
        var settings = {
            "url": "/traerUsuario",
            "method": "POST",
            "timeout": 0,
            "data": {
                "email": email
            }
          };
          
          return $.ajax(settings).done(function (response) {
            //  console.log(response);
             return response;
          });
    }
    this.llenarDatosUsuario = function(usuario){
        let html = '';
        let html1 = '';
        let html2 = '';
        let html3 = '';
        let html4 = '';

        html +=`<span>${usuario.nombres}<span>`;
        html1 +=`<span>${usuario.apellidos}<span>`;
        html2 +=`<span>${usuario.email}<span>`;
        html3 +=`<span>${usuario.celular}<span>`;
        html4 +=`<span>${usuario.idUsuarioPersonalizado}<span>`;

        $('#nombres').html(html);
        $('#apellidos').html(html1);
        $('#email').html(html2);
        $('#celular').html(html3);
        $('#idUsuarioPersonalizado').html(html4);
        $('#contb').html('<button onclick="MagicPlanet.MisScripts.botonEnviar()">Enviar</button>');
    }
    this.botonEnviar = function(){
        console.log("enviar datos uusuario")
        let idUsuarioPersonalizado1 = document.getElementById('idUsuarioPersonalizado1').value;
        // window.location.href = `/compra-cliente?id=${idUsuarioPersonalizado1}`;
        window.location.href = `/seleccion-datos?id=${idUsuarioPersonalizado1}`;
    }
    this.traerUsuariosPersonas = async function(idUsuarioPersonalizado){
        let html = '';

        let datosUsuarios = await MagicPlanet.MisScripts.getUsuariosPersonas(idUsuarioPersonalizado);
        console.log(datosUsuarios);
        let nombreUserP = datosUsuarios.nombres+" "+datosUsuarios.apellidos;
        html +=
        `<div class="cont-titulos">
            <div class="seccion">
                <h2>Nombres: </h2>
            </div>
            <div class="seccion">
                <h2>Horas Globales: </h2>
            </div>
            <div class="seccion">
                <h2>Status: </h2>
            </div>
            <div class="seccion">
                <h2></h2>
            </div>
        </div>
        <div class="cont-persona">
            <div class="seccion">
                <h2>${nombreUserP}</h2>
            </div>
            <div class="seccion">
                <div class="horasGlobales"></div>
            </div>
            <div class="seccion">
                <div class="horasGlobales"></div>
            </div>
            <div class="seccion">
                <div class="botonSeleccionar" onclick="MagicPlanet.MisScripts.escogerPersona('${nombreUserP}','${datosUsuarios.idUsuarioPersonalizado}','usuario-principal')">Seleccionar</div>
            </div>
        </div>`;
        datosUsuarios.ninoUser.map(ninosUser =>{
            html +=
            `<div class="cont-persona">
                <div class="seccion">
                    <h2>${ninosUser.nombre}</h2>
                </div>
                <div class="seccion">
                    <div class="horasGlobales">${ninosUser.horas_globales}</div>
                </div>
                <div class="seccion">
                    <div class="horasGlobales">${ninosUser.status}</div>
                </div>
                <div class="seccion">
                    <div class="botonSeleccionar" onclick="MagicPlanet.MisScripts.escogerPersona('${ninosUser.nombre}','${ninosUser.sku_membresia}','usuario-nino')">Seleccionar</div>
                </div>
            </div>`;
        });
        datosUsuarios.padresUsuario.map(padresUser =>{
            html +=
            `<div class="cont-persona">
                <div class="seccion">
                    <h2>${padresUser.nombre}</h2>
                </div>
                <div class="seccion">
                    <div class="horasGlobales"></div>
                </div>
                <div class="seccion">
                    <div class="horasGlobales">${padresUser.status}</div>
                </div>
                <div class="seccion">
                    <div class="botonSeleccionar" onclick="MagicPlanet.MisScripts.escogerPersona('${padresUser.nombre}','${padresUser.id}','usuario-padre')">Seleccionar</div>
                </div>
            </div>`;
        });

        $('#cont-personasUsuarios').html(html);
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
    this.escogerPersona = async function(persona,identificadorPersona,tipoBrazalete){
        console.log(persona)
        let html = '';
        let html2 = '';

            html +=
                `<div class="personaS">${persona}</div>`;

            html2 +=
                ` <select name="tipoAdulto" id="tipoAdulto">
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
    this.traerProductosEntrada = async function(idUsuarioPersonalizado){
        let productosEntrada = document.getElementById('productosEntrada').value;
        
        if(productosEntrada != "entrada"){
            let adulto = '';
            adulto +=
                `<h2>Nombre del Niño: </h2>
                <div class="cont-input" id="contSubUsuario">
                    <input type="text" name="nombreNino" id="nombreNino" /> 
                </div>`;

            $('#seccion-persona').html(adulto);
            
            var producto = await MagicPlanet.MisScripts.getCategoriaProducto(productosEntrada);
                $('#cont-horasExtra').html('');
            console.log(producto)
            let html = '';
            let html2 = '';
            // let usuarioExistente = '';

            html +=
            `<div>
                <select name="productoH" id="productoH" onchange="MagicPlanet.MisScripts.cambiarProducto()">`;
                producto.map(p => {
                    html += `<option value="${p.slug}">${p.nombreProducto}</option>`;
                });
                    
                html += `</select>
                </div>`;
                html2 +=
                `<img src="${producto[0].urlImagenPost}" class="" />`;

            // usuarioExistente +=
            //     `<select class="usuarioExistente" id="usuario-existente" name="usuario-existente" onchange="MagicPlanet.MisScripts.existeOno()">
            //         <option value="nuevo-nino" selected>Nuevo Niño</option>
            //         <option value="nino-existente">Niño Existente</option>
            //     </select>`;

                $('#cont-producto').html(html);
                $('#cont-imagenP').html(html2);
                // $('#seccion-existente').html(usuarioExistente);
                if(productosEntrada == "tarjeta-fiesta"){
                    $('#seccion-persona').html('');
                }
                console.log("el productooo :")
        let precio = '';
        let productoSeleccionado = await MagicPlanet.MisScripts.getProducto($('#productoH').val());
        var elprecio = await formatearNumero(productoSeleccionado[0].precio);
        // let precio = formatearNumero(minimoPagar);
        console.log("precio")
        console.log(productoSeleccionado[0].precio)
        precio += `<span>${elprecio}</span>`;
        $('#cont-precio').html(precio);
        $('#precioR').val(productoSeleccionado[0].precio);

        }else{
            let adulto = '';
            let usuarioExistente = '';
            adulto +=
                `<h2>Nombre del Adulto: </h2>
                <div class="cont-input" id="contSubUsuario">
                    <input type="text" name="nombreAdulto" id="nombreAdulto" /> 
                </div>`;

            usuarioExistente +=
                `<select class="usuarioExistente" id="usuario-existente" name="usuario-existente" onchange="MagicPlanet.MisScripts.existeOno()">
                    <option value="nuevo-adulto" selected>Nuevo Adulto</option>
                    <option value="adulto-existente">Adulto Existente</option>
                </select>`;

            $('#seccion-persona').html(adulto);
            $('#cont-producto').html('');
            $('#cont-imagenP').html('');
            $('#seccion-existente').html(usuarioExistente);
            var elprecio = await formatearNumero(40);


            $('#cont-precio').html(`<span>${elprecio}</span>`);
            $('#precioR').val(40);
        }
        
    }
    this.vincularBrazalete = async function(){
        let codigo_brazalete = document.getElementById('codigo_brazalete').value;
        let tipoAdulto = document.getElementById('tipoAdulto');
        let id_usuario_personalizado = document.getElementById('id_usuario_personalizado').value;
        let identificadorPersona = document.getElementById('identificadorPersona').value;
        let tBrazalete = document.getElementById('tBrazalete').value;
        console.log('tBrazalete')
        console.log(tBrazalete)
        if(tipoAdulto == null){
            tipoAdulto = ""
        }else{
            tipoAdulto = tipoAdulto.value
        }
        await MagicPlanet.MisScripts.createVinculacion(codigo_brazalete,tipoAdulto,id_usuario_personalizado,identificadorPersona,tBrazalete);
        // console.log(codigo_brazalete);
        // console.log(tipoBrazalete);
        // console.log(id_usuario_personalizado)
        // console.log(identificadorPersona)
    }
    this.createVinculacion = function(codigo_brazalete,tipoAdulto,id_usuario_personalizado,identificadorPersona,tBrazalete){
        

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
          
          $.ajax(settings).done(function (response) {
            console.log(response);
          });
    }
    this.traerVinculosBrazalete = async function(idUser){
        var vb = await MagicPlanet.MisScripts.getVinculosBrazalete(idUser);
        let html = '';
        console.log(vb)
        vb.map(vinculosP => {
            console.log(vinculosP.usuario.apellidos)
            if(vinculosP.usuario.nombres != null){
                var nombres = vinculosP.usuario.nombres+" "+vinculosP.usuario.apellidos;
            }else{
                var nombres = vinculosP.usuario.nombre;
            }
            html +=
                `<div class="cont-barraPersonas">
                    <div class="cont-seccion">${nombres}</div>
                    <div class="cont-seccion">${vinculosP.codigo_brazalete}</div>
                    <div class="cont-seccion botonE" onclick="MagicPlanet.MisScripts.eliminarVinculo(${vinculosP.id},'${idUser}')">Eliminar</div>
                </div>`;
        });
        

            $('#cont-vinculados').html(html);

    }
    this.getVinculosBrazalete = function(idUser){
        console.log(idUser)
        console.log('idUser')
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
            console.log(response)
            window.location.href = `/seleccion-vincular?id=${idUser}`;
          });
    }
    this.generarEntradaSalida = async function(){
        let codigo_brazalete = document.getElementById("codigo_brazalete").value;
        console.log(codigo_brazalete);
        var respuestaES = await MagicPlanet.MisScripts.sendEntradaSalida(codigo_brazalete)
        console.log(respuestaES)
        var mensajeRespuesta = '';
        $('#cont-principal').html('')
        if(respuestaES.access){
            
                mensajeRespuesta += 
                `<div class="con-mensaje">
                    <div class="centrar">
                        <div class="mensaje verde">Acceso Exitoso, <a href="/checar-entrada">regresar al punto de chequeo</a></div>
                    </div>
                </div>`;
        }else if(respuestaES.access == false){
            
            if(respuestaES.out){
                mensajeRespuesta += 
                    `<div class="con-mensaje">
                        <div class="centrar">
                            <div class="mensaje verde">Salida Exitosa, hasta luego, <a href="/checar-entrada">regresar al punto de chequeo</a></div>
                        </div>
                    </div>`;
            }else{
                mensajeRespuesta += 
                `<div class="con-mensaje">
                    <div class="centrar">
                        <div class="mensaje rojo">${respuestaES.mensaje}, <a href="/checar-entrada">regresar al punto de chequeo</a></div>
                    </div>
                </div>`;
            }
            
                
        }
        
        $('#cont-principal').html(mensajeRespuesta)
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
    this.existeOno = function(){
        var usuarioExistente = document.getElementById("usuario-existente").value;
        console.log(usuarioExistente);
        if(usuarioExistente == "nino-existente" || usuarioExistente == "adulto-existente"){
            MagicPlanet.MisScripts.traerPerfilU(usuarioExistente);

        }

    }
    this.traerPerfilU = async function(usuarioExistente){
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const idUsuarioPersonalizado = search_params.get('id');
        var ninosPadres = await MagicPlanet.MisScripts.traerNinos(idUsuarioPersonalizado);
        console.log(ninosPadres)
    }

    this.agregarCompra = function(){
        
        var productosEntrada = document.getElementById('productosEntrada');
        var productoH = document.getElementById('productoH');
        var usuarioExistente = document.getElementById('usuario-existente'); 
        var nombreNino = document.getElementById('nombreNino'); 
        var nombreAdulto = document.getElementById('nombreAdulto'); 
        var precioR = document.getElementById('precioR');
        var horasExtra = document.getElementById('horasExtra');
        const current_url = new URL(window.location.href);
        const search_params = current_url.searchParams;
        const idUsuarioPersonalizado = search_params.get('id');
        let html = '';
        let html2 = '';

        if(nombreNino != null){
            console.log("hay niño")
            var acompañante = nombreNino.value;
        }else if(nombreAdulto != null){
            console.log("hay adulto")
            var acompañante = nombreAdulto.value;
        }
        if(productoH !=null){
            if(productoH.value == "horas-indefinidas"){
                if(horasExtra.value == ""){
                    $('#error-vacio').html(`<div class="error">Asigna horas a tu compra</div>`)
                    setTimeout(function(){ 
                        $('#error-vacio').html('')
                    }, 5000);
                    
                    return;
                }
            }
        }
        if(acompañante == ""){
            $('#error-vacio').html(`<div class="error">Asigna un nombre</div>`)
            setTimeout(function(){ 
                $('#error-vacio').html('')
             }, 5000);
            
            return;
        }
        if(productoH == null){
            var producto = "entrada-segundo-adulto";
        }else{
            var producto = productoH.value
        }

        console.log("productosEntrada: ",productosEntrada.value)
        // console.log("productoH: ",productoH.value)
        // console.log("usuarioExistente",usuarioExistente.value)
        console.log("acompañante: ",acompañante)

        html +=
        `<div class="carro" id="carro-${contadorCarroCompraP}" >
            <div class="centrador">
                <div class="caja">
                    <h2>Persona: </h2>
                    <div class="cont-producto">
                        <span>${acompañante}</span>
                    </div>
                </div>
                <div class="caja">
                    <h2>Produto: </h2>
                    <div class="cont-producto">
                        <span>${producto}</span>
                    </div>
                </div>
                <div class="removerCompra">
                    <img src="/img/trash1.png" />
                </div>
            </div>
        </div>`;

        

        // <div class="removerCompra" onclick="MagicPlanet.MisScripts.removerCompra(${contadorCarroCompraP})"></div>
        if(horasExtra != null){
            
            horasExtra = horasExtra.value
        }else{
            horasExtra = null
        }
        arrayCarroC.push(
            {
                idUsuarioPersonalizado: idUsuarioPersonalizado,
                productosEntrada: productosEntrada.value,
                productoH: producto,
                precio: precioR.value,
                nombre: acompañante,
                usuarioExistente:  "nuevo-nino",
                horasExtra: horasExtra
            }
        )
        totalDPago = totalDPago +parseInt(precioR.value);
        console.log(arrayCarroC);
        var totalPagoP = totalDPago;
        html2 +=
        `<div class="caja">
            <h2>Total:</h2>
            <div class="dato">
                <span>${totalPagoP}</span>
            </div>
        </div>
        <div class="cont-boton" onclick="MagicPlanet.MisScripts.escogerTipoPago()"><div class="boton">Proceder a Pago</div></div>
        `;

        $('#productosEntrada').val('membresias')
        $('#productoH').val('membresia-tripulante')
        $('#usuario-existente').val('nuevo-nino')
        MagicPlanet.MisScripts.traerProductosEntrada()
        $('#nombreNino').val('')
        $('#datos-carro').append(html);
        $('#cont-total').html(html2);
        contadorCarroCompraP++;
        
        
    }
    this.removerCompra = function(numero){
        
        // console.log(arrayCarroC)
        // console.log(numero)
        // console.log(contadorCarroCompraP)
        console.log(arrayCarroC)
        console.log(contadorCarroCompraP)
        arrayCarroC.splice(numero, 1);
        // console.log(arrayCarroC)
        
        $(`#carro-${numero}`).remove();
        contadorCarroCompraP--;
        console.log(arrayCarroC)
        console.log(contadorCarroCompraP)
    }
    this.escogerTipoPago = async function(){
        let html = '';
       
        // arrayCarroC

        html +=
            `<div class="cont-cajaTipoPago">
                <h2>Tipo de pago</h2>
                <select name="tipoPago" id="tipoPago" onchange="MagicPlanet.MisScripts.elTipoPago()">
                    <option name="efectivo">Efectivo</option>
                    <option name="terminal">Terminal</option>
                </select>
            </div>`;
       

        $('#cont-tipoPago').html(html);
        MagicPlanet.MisScripts.procederPagoTipoEfectivo()
        
        
    }
    this.elTipoPago = function(){
        console.log("ejecutando el tipo xmbio")
        var tipoPago = document.getElementById('tipoPago');
        console.log(tipoPago.value)
        if(tipoPago.value == "Efectivo"){
            MagicPlanet.MisScripts.procederPagoTipoEfectivo()
        }else if(tipoPago.value == "Terminal"){
            MagicPlanet.MisScripts.procederPagoTipoTerminal()
        }
    }
    this.procederPagoTipoTerminal = function(){
        let html2 = '';
        html2 +=
        `<div class="cont-cajaSeccionP">
            <h2>Agrega el codigo de la terminal</h2>
            <div class="contenedorError" id="cont-error"></div>
            <div class="pago-input">
                <input name="codigoClip" id="codigoClip" />
            </div>
            <div class="pago-input">
                <button onclick="MagicPlanet.MisScripts.sendPagoTerminal()">Pagar</button>
            </div>
        </div>`;
        $('#cont-seccionPago').html(html2);
    }
    this.procederPagoTipoEfectivo = function(){
        let html3 = '';
        html3 +=
            `<div class="cont-cajaSeccionP">
                <h2>Inserta la cantidad de efectivo entregada</h2>
                <div class="contenedorError" id="cont-error">
                </div>
                <div class="cont-input">
                    <input type="number" name="cantidadEfectivo" id="cantidadEfectivo" onkeyup="MagicPlanet.MisScripts.calcularCambio()" />
                </div>
                <div class="cont-cambio" id="el-cambio">
                            
                </div>
                <div class="pago-input">
                    <button onclick="MagicPlanet.MisScripts.sendPagoEfectivo()">Pagar</button>
                </div>
            </div>`;
        $('#cont-seccionPago').html(html3);
    }
    this.calcularCambio = function(){
        console.log(arrayCarroC)
        var cantidadEfectivo = document.getElementById('cantidadEfectivo').value;
        // var precioTotal = document.getElementById('precioR').value;
        var mserror = '';
        var elcambio = '';
        if(cantidadEfectivo == ""){
            mserror +=
            `<div class="cont-error">
                <span>Agrega el codigo de Clip</span>
            </div>`;
            $('#cont-error').html(mserror)
            return;
        }
        var cambio = cantidadEfectivo - totalDPago;
        elcambio +=
        `<div>${cambio}</div>`;
        $('#el-cambio').html(elcambio)
        console.log(cambio)
    }
    this.sendPagoTerminal = function(){
        var codigoClip = document.getElementById('codigoClip').value;
        var mserror = '';
        if(codigoClip == ""){
            mserror +=
            `<div class="cont-error">
                <span>Agrega el codigo de Clip</span>
            </div>`;
            $('#cont-error').html(mserror)
            return;
        }else{
            MagicPlanet.MisScripts.sendPago(document.getElementById('codigoClip').value)
        }
        
    }
    this.sendPagoEfectivo = function(){
        var cantidadEfectivo = document.getElementById('cantidadEfectivo').value;
        var mserror = '';
        if(cantidadEfectivo == ""){
            mserror +=
            `<div class="cont-error">
                <span>Agrega la cantidad de efectivo otorgada</span>
            </div>`;
            $('#cont-error').html(mserror)
            return;
        }else{
            MagicPlanet.MisScripts.sendPago("efectivo")
        }
    }
    this.traerUsuarioFromMembresia = async function(){
        let codigo_brazalete = document.getElementById("codigo_brazalete").value;
        console.log(codigo_brazalete);
        var usuario_p = await MagicPlanet.MisScripts.getUsuarioFromMembresia(codigo_brazalete);
        console.log(usuario_p)
        if(usuario_p.status == "success"){
            console.log(usuario_p.message);
            if(window.location.pathname == "/venta-snacks"){
                window.location.href = `/venta-snacks-carro?id=${usuario_p.id_usuario_personalizado}`;
            }else if(window.location.pathname == "/venta-boutique"){
                window.location.href = `/venta-boutique-carro?id=${usuario_p.id_usuario_personalizado}`;
            }else if(window.location.pathname == "/checkout"){
                window.location.href = `/checar-checkout?id=${usuario_p.id_usuario_personalizado}`;
            }
            
        }else{
            console.log(usuario_p.message);
        }
    }
    this.traerProductosSnack = async function(){
        console.log("aqui va el producto snak")
        var snaks = await MagicPlanet.MisScripts.getProductosSnack()
        console.log(snaks);
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
    this.getUsuarioFromMembresia = function(codigo_brazalete){
        var settings = {
            "url": `/getUsuarioFromMembresia/${codigo_brazalete}`,
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
    this.sendPago = function(customerID){
        var settings = {
            "url": "/pago-compra-cliente",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "array": arrayCarroC,
              "codigoClip": customerID
            }
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            // let mensajeFinal = '';
            // mensajeFinal +=
            //     `<div class="cont-mensaje">
            //         <div class="regresar"><a href="/registro-evento">Regresar al Inicio</a></div>
            //     </div>`;
            // $('#cont-principal').html(mensajeFinal)
            
            window.location.href = "/registro-evento";
          });
    }
    this.cambiarProducto = async function(){
        
        
        var productoH = document.getElementById('productoH');
        let html = '';
        let precio = '';
        let htmlHoras = '';
        console.log(productoH)
        $('#cont-horasExtra').html('');
        if(productoH != null){
            productoH = productoH.value;
            let productoSeleccionado = await MagicPlanet.MisScripts.getProducto(productoH);
            var elprecio = await formatearNumero(productoSeleccionado[0].precio);
            console.log("productosSeleccionado")
            console.log(productoSeleccionado);
        

            html += `<img src="${productoSeleccionado[0].urlImagenPost}" />`;
            precio += `<span>${elprecio}</span>`;

            $('#cont-imagenP').html(html);
            $('#cont-precio').html(precio);
            $('#precioR').val(productoSeleccionado[0].precio);
            if(productoH == "horas-indefinidas"){

                htmlHoras +=
                `<h2>Horas Extra</h2>
                <input type="number" name="horasExtra" id="horasExtra" onkeyup="MagicPlanet.MisScripts.agregarhorasExtra()" />`;

                
                $('#cont-horasExtra').html(htmlHoras);
                $('#cont-imagenP').html('');
            }
        }else{
            // htmlHoras +=
            // `<h2>Horas Extra</h2>
            // <input type="number" name="horasExtra" id="horasExtra" />`;

            $('#cont-imagenP').html('');
            // $('#cont-horasExtra').html(htmlHoras);
        }
        
        
    }
    
    this.traerNinos = function(idUsuarioPersonalizado){
        var settings = {
            "url": "/get-ninosPadres",
            "method": "POST",
            "timeout": 0,
            "data": {
                "idUsuarioPersonalizado": idUsuarioPersonalizado,
            }
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.agregarhorasExtra = function(){
        let horasExtra = document.getElementById('horasExtra').value;
        
        let horasT = horasExtra * 130;
        $('#precioR').val(horasT);
        horasT = formatearNumero(horasT);
        console.log(horasT);
        $('#cont-precio').html(`<span>${horasT}</span>`);
        
    }
    this.getCategoriaProducto = function(name){
        var settings = {
            "url": "/getProductosEspecificos",
            "method": "POST",
            "timeout": 0,
            "data": {
                "urltipoProducto": name,
            }
        };
            
        return $.ajax(settings).done(function (response) {              
            return response;
        });
    }
    this.getProducto = function(IdProducto){
        console.log("IdProducto")
        console.log(IdProducto)
        var settings = {
            "url": "/getProducto/"+IdProducto,
            "method": "GET",
            "timeout": 0,
        };
            
        return $.ajax(settings).done(function (response) {
        
            return response;
        });
    }
    this.traerUsuariosEvento = async function(){
        var usuariosEventos = await MagicPlanet.MisScripts.getUsuariosEvento();
        console.log(usuariosEventos)
        var datosUser = '';
        usuariosEventos.map((ue,index) => {
            console.log(index % 2 == 0)
        let newMonto = MagicPlanet.MisScripts.formatearNumero(ue.monto);
            // datosUser +=
            // `<tr>
            //     <td>${ue.nombres}</td>
            //     <td>${ue.apellidos}</td>
            //     <td>${ue.celular}</td>
            //     <td>${ue.email}</td>
            //     <td>${ue.producto}</td>
            //     <td>${newMonto}</td>
            //     <td>${ue.statusTicket}</td>
            // </tr>`;
            datosUser +=
            `<div class="cont-usuario">`;
            if(index % 2 == 0){
                datosUser +=
                `<div class="usurio colorPar">
                    <h2>${index}.- ${ue.nombres} ${ue.apellidos}</h2>
                </div>`;
            }else{
                datosUser +=
                `<div class="usurio colorImPar">
                    <h2>${index}.- ${ue.nombres} ${ue.apellidos}</h2>
                </div>`;
            }
            datosUser +=
                `<div class="cont-data">
                    <div class="datos">
                        <div class="titulo">Celular:</div>
                        <div class="dato">${ue.celular}</div>
                    </div>
                    <div class="datos">
                        <div class="titulo">Email:</div>
                        <div class="dato">${ue.email}</div>
                    </div>
                    <div class="datos">
                        <div class="titulo">Producto:</div>
                        <div class="dato">${ue.producto}</div>
                    </div>
                    <div class="datos">
                        <div class="titulo">Monto:</div>
                        <div class="dato">${ue.monto}</div>
                    </div>
                    <div class="datos">
                        <div class="titulo">Status Ticket:</div>
                        <div class="dato">${ue.statusTicket}</div>
                    </div>
                </div>
            </div>`
        });
        $('#contenido-tabla').html(datosUser)
        

    //    $('#contenido-tabla').html(datosUser)
    }
    this.formatearNumero = function(numero){
        var n = new Number(numero);
        var myObj = {
          style: "currency",
          currency: "MXN"
        }
        return n.toLocaleString("mxn", myObj);
    }
    this.getUsuariosEvento = async function(){
        var settings = {
            "url": "/traer-usuariosEvento",
            "method": "GET",
            "timeout": 0,
        };
            
        return await $.ajax(settings).done(function (response) {
        // console.log(response)
            return response;
        });
    }
    this.loginEvento = async function(){
        var correo = document.getElementById("correo").value;
        var password = document.getElementById("password").value;
        let error = '';
        
        if(correo == ""){
            error += 
                `<div class="error">Inserta el Correo</div>`;
            $('#cont-error').html(error)
            return;
        }
        if(password == ""){
            error += 
            `<div class="error">Inserta la contraseña</div>`;
            $('#cont-error').html(error)
            return;
        }


        var login = await MagicPlanet.MisScripts.sendLogInEvento(correo,password);
        console.log(login)
        if(login.auth == false){
            error += 
            `<div class="error">${login.token}</div>`;
            $('#cont-error').html(error)
        }else if(login.auth == true){
            window.location.href = "/registro-evento";
        }
    }
    this.sendLogInEvento = async function(correo,password){

        var settings = {
            "url": "/signin2",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded",
              
            },
            "data": {
              "email": correo,
              "password": password
            }
          };
          
          return await $.ajax(settings).done(function (response) {
            // console.log(response);
            return response;
          });
    }
    // this.enviarFormulario = function(){
    //     // var editarServicio = document.getElementById("editarServicio")
    //     // $('#editarServicio').attr("action", "/createServicios")
    //     // id="editarServicio" action="" method="POST"
    //     var nombreServicio = document.getElementById("nombreServicio");
    //     var precioServicio = document.getElementById("precioServicio");
    //     var tiempo = document.getElementById("tiempo");
    //     var medidaTiempo = document.getElementById("medidaTiempo");
    //     var descripcionServicio = document.getElementById("descripcionServicio");
    //     var IdServicio = document.getElementById("IdServicio");

    //         // var params= {nombreServicio, precioServicio, tiempo, medidaTiempo, descripcionServicio}
    //         // const form = document.createElement('form');
    //         // form.method = 'POST';
    //         // form.action = '/editarServicio/'+IdServicio;

    //         // for (const key in params) {
    //         //     if (params.hasOwnProperty(key)) {
    //         //     const hiddenField = document.createElement('input');
    //         //     hiddenField.type = 'hidden';
    //         //     hiddenField.name = key;
    //         //     hiddenField.value = params[key];

    //         //     form.appendChild(hiddenField);
    //         //     }
    //         // }

    //         // document.body.appendChild(form);
    //         // form.submit();
    //         var settings = {
    //             "url": "/editarServicio/"+IdServicio,
    //             "method": "POST",
    //             "timeout": 0,
    //             "headers": {
    //               "Content-Type": "application/x-www-form-urlencoded"
    //             },
    //             "data": {
    //                  "nombreServicio": nombreServicio, 
    //                  "precioServicio": precioServicio, 
    //                  "tiempo": tiempo, 
    //                  "medidaTiempo": medidaTiempo, 
    //                  "descripcionServicio": descripcionServicio 
                      
    //             }
    //           };
              
    //            $.ajax(settings).done(function (response) {
    //               console.log(response);
    //               window.location.href = "/servicios";
    //           })
    // }
    
}


function windowGuid2() {
    return '-4xx-yxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
function formatearNumero(numero){
    var n = new Number(numero);
    var myObj = {
        style: "currency",
        currency: "MXN"
    }
    return n.toLocaleString("mxn", myObj);
}