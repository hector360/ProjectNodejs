function PopUps() {
    this.PopUpGeneral = function (titulo,producto,urlImagen,idProducto) {
        
        // var title = op.title ? op.title : 'Información general';
        // var body = op.body ? op.body : 'Sin información';
        // var clase = op.clase ? op.clase : 'btn-primary';
        // var id = op.id ? op.id : ''; 
        // var html = '<div class="modal fade" id="modalinfo" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">'
        //  + '  <div class="modal-dialog" id="'+id+'">'
        //  + '    <div class="modal-content">'
        //  + '         <div class="modal-header '+clase+ '">'
        //  + '         <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ></button>'
        //  + '         <h4 class="modal-title" id="myModalLabel">' + title + '</h4>'
        //  + '         </div>'
        //  + '         <div class="modal-body">' + body
        //  + '         </div>'
        //  + '         <div class="modal-footer">'
        //  + '             <button type="button" class="btn btn-success" onclick="GuardarComentario();" data-dismiss="modal">Guardar</button>'
        //  + '             <a class="btn btn-default" data-dismiss="modal">Cerrar</a>'
        //  + '     </div>'
        //  + '    </div>'
        //  + '   </div>'
        //  + '  </div>';
        // $('.popup-info').html(html);
        // $('#modalinfo').modal({ backdrop: 'static', keyboard: true, show: true });
        let html = '';
        html+=
            '<div class="modalContainer">'+
                '<div class="alertBox">'+
                    '<div class="titulo">'+titulo+'</div>'+
                    '<div class="body">'+
                        '<div class="texto">¿Estas seguro que deseas eliminar el '+producto+' ?</div>'+
                    '</div>'+
                    '<div class="cont-imagen">'+
                        '<div class="centrador">'+
                            '<img src="'+urlImagen+'" />'+
                        '</div>'+
                    '</div>'+
                    '<div class="cont-boton">'+
                        '<div class="centrador">';
                        if(producto == "Producto"){
                            html +=
                            '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EliminarProducto(`'+idProducto+'`)">Eliminar</div>';
                        }else{
                            html +=
                            '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EliminarCurso(`'+idProducto+'`)">Eliminar</div>';
                        }
                            html +=
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUp()">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
         window.scrollTo(0, 0);
        $('.popup-info').html(html);
        $('body').addClass('esconderScroll');
        
    }
    this.EliminarPostPopUp = function(titulo,producto,urlImagen,idPost){
        let html = '';
        html+=
            '<div class="modalContainer">'+
                '<div class="alertBox">'+
                    '<div class="titulo">'+titulo+'</div>'+
                    '<div class="body">'+
                        '<div class="texto">¿Estas seguro que deseas eliminar el '+producto+' ? </div>'+
                    '</div>'+
                    '<div class="cont-imagen">'+
                        '<div class="centrador">'+
                            '<img src="'+urlImagen+'" />'+
                        '</div>'+
                    '</div>'+
                    '<div class="cont-boton">'+
                        '<div class="centrador">'+
                            '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EliminarPost(`'+idPost+'`)">Eliminar</div>'+
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUp()">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
         window.scrollTo(0, 0);
        $('.popup-info').html(html);
        $('body').addClass('esconderScroll');
    }

    this.EditarPostTextoPopUp = function(titulo,producto,idPost,idSubPost){
        if(producto == "Titulo"){
            var tituloEditado = document.getElementById("tituloEditado").value;
        }else{
            var tituloEditado = document.getElementById("subTituloEditado").value;
        }

        
        let html = '';
        html+=
            '<div class="modalContainer">'+
                '<div class="alertBox">'+
                    '<div class="titulo">'+titulo+'</div>'+
                    '<div class="body">'+
                        '<div class="texto">¿Estas seguro que deseas Editar el '+producto+' ?</div>'+
                    '</div>'+
                    '<div class="cont-texto">'+
                        '<div class="centrador">'+
                           '<div class="texto">Nuevo texto: '+tituloEditado+'</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="cont-boton">'+
                        '<div class="centrador">';
                        if(producto == "Titulo"){
                        html += '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EnviarEditableTitulo(`'+idPost+'`)">Si</div>'+
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUpTitulo(`'+idPost+'`,`'+titulo+'`)">Cancelar</div>';
                        }else{
                         html += '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EnviarEditableSubTitulo(`'+idSubPost+'`,`'+idPost+'`)">Si</div>'+
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUpSubTitulo(`'+idSubPost+'`,`'+titulo+'`,`'+idPost+'`)">Cancelar</div>';
                        }
                         html +=   
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
         window.scrollTo(0, 0);
        $('.popup-info').html(html);
        $('body').addClass('esconderScroll');
    }

    this.EditarPostParrafoPopUp = function(parrafo,producto,idParrafo, idPost,tipoParrafo, index){
        var parrafoEditado = document.getElementById("parrafoEditado").value;
        let html = '';
        html+=
            '<div class="modalContainer">'+
                '<div class="alertBox">'+
                    '<div class="titulo">'+parrafo+'</div>'+
                    '<div class="body">'+
                        '<div class="texto">¿Estas seguro que deseas Editar el '+producto+' ?</div>'+
                    '</div>'+
                    '<div class="cont-texto">'+
                        '<div class="centrador">'+
                           '<div class="texto">Nuevo texto: '+parrafoEditado+'</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="cont-boton">'+
                        '<div class="centrador">';
                        if(tipoParrafo=="Post"){
                          html += '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EnviarEditableParrafo(`'+idParrafo+'`,`'+idPost+'`)">Si</div>';
                        }else{
                        html += '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EnviarEditableSubParrafo(`'+idParrafo+'`,`'+idPost+'`)">Si</div>';
                        }
                            
                        html += 
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUp(`'+idParrafo+'`,`'+parrafo+'`,`'+index+'`,`'+idPost+'`)">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
         window.scrollTo(0, 0);
        $('.popup-info').html(html);
        $('body').addClass('esconderScroll');
    }
    this.EliminarServicioPopUp = function(titulo,producto,idServicio){
        let html = '';
        html+=
            '<div class="modalContainer">'+
                '<div class="alertBox">'+
                    '<div class="titulo">'+titulo+'</div>'+
                    '<div class="body">'+
                        '<div class="texto">¿Estas seguro que deseas eliminar el '+producto+' ? </div>'+
                    '</div>'+
                    '<div class="cont-boton">'+
                        '<div class="centrador">'+
                            '<div class="botonAceptar" onclick="MagicPlanet.MisScripts.EliminarServicio(`'+idServicio+'`)">Eliminar</div>'+
                            '<div class="botonCancelar" onclick="MagicPlanet.PopUps.removerPopUp()">Cancelar</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
         window.scrollTo(0, 0);
        $('.popup-info').html(html);
        $('body').addClass('esconderScroll');
    }
    this.removerPopUp = function(idParrafo,parrafo,index,idPost){
        $('.popup-info').html('');
        $('body').removeClass('esconderScroll');
        MagicPlanet.MisScripts.CancelarEditarParrafoSp(idParrafo,parrafo,index,idPost)
        CancelarEditarTituloP(`'+idPost+'`,`'+tituloPost+'`)
    }
    this.removerPopUpTitulo = function(idPost,tituloPost){
        $('.popup-info').html('');
        $('body').removeClass('esconderScroll');
        MagicPlanet.MisScripts.CancelarEditarTituloP(idPost,tituloPost)
    }
    this.removerPopUpSubTitulo = function(idSubPost,tituloPost,idPost){
        $('.popup-info').html('');
        $('body').removeClass('esconderScroll');
        MagicPlanet.MisScripts.CancelarEditarSubTituloP(idSubPost,tituloPost,idPost)
    }
   
}

  