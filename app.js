//Boton buscar
var searchBtn = document.querySelector('.btn-buscar');
var NoEncontrado=false; //variable para saber si el articulo se ha encontrado 

searchBtn.addEventListener('click', function() {
   
  var searchTerm = document.querySelector('.input-buscar').value.toLowerCase();
  var items = document.querySelectorAll('.item');
  
  for (var i = 0; i < items.length; i++) {
    var title = items[i].querySelector('.titulo-item').textContent.toLowerCase();
    if (title.indexOf(searchTerm) > -1 ) {
      items[i].style.display = 'block';
      NoEncontrado=true;
    } 
    else {
      items[i].style.display = 'none';
      NoEncontrado=false;
    }
  }

  if(!NoEncontrado){ 
    panel.innerHTML= 'No se encontraron resultados para la búsqueda: ' + searchTerm;
  }
});
 


// Mostrar todos los items cuando el input de búsqueda está vacío
document.getElementById("input-buscar").addEventListener("keyup", function(event) {
if (event.code === "Backspace" && this.value.length === 0) {
    var items = document.querySelectorAll(".contenedor-items .item");
    for (var i = 0; i < items.length; i++) {
    items[i].style.display = "";
    panel.style.display='none';
    }
}
});

//Menu de navegacion
(
    function(){
        const listElements=document.querySelectorAll('.menu_item--show');/*obtiene todos los elementos, menu desplegable*/
        const list=document.querySelector('.menu_links'); /*obtiene un elemento , menu links*/
        const menu=document.querySelector('.menu_hamburguer');/*obtiene un elemento, menu hamburguer*/

        const addClick=()=>{
            listElements.forEach(element =>{
                element.addEventListener('click', ()=>{
                    let submenu=element.children[1];/*obtiene el elemento hijo posicion 1, que es menu_nesting*/
                    let height=0;
                    element.classList.toggle('menu_item_--active'); /*anula el evento de un menu*/

                    if(submenu.clientHeight===0){/*clientHeight, obtiene la altura, si la altura submenu es cero en la condicional*/
                        height=submenu.scrollHeight;/*varable , tenga la altura minima , para que exista*/
                    }

                    submenu.style.height=`${height}px`; /*se agrega la altura obtenida*/
                })
            })
        }

        const deleteStyleHeight=()=>{
            listElements.forEach(element=>{
                if(element.children[1].getAtribute('style')){
                    element.children[1].removeAtribute('style');/*si tiene el atributo style , que lo elimine*/
                    element.classList.remove('menu_item--active');
                }
            })
        }
       /* addClick();*/

        window.addEventListener('resize', ()=>{ /*si el ancho de la ventana supera los 800px*/
            if(window.innerWidth > 850){
                deleteStyleHeight();
                if(list.contains('menu_links--show')){ /* si contiene es clase , que la remueva*/
                    list.classList.remove('menu_links--show');
                }
            }
            else{
                addClick();
            }
        });

        if(window.innerWidth <= 850){ /*para evitar errores al hacer mas grande*/
            addClick();
        }

        menu.addEventListener('click',()=> list.classList.toggle('menu_links--show')); /*quita la clase menu liks show*/
    }
)();




//Variable que mantiene el estado visible del carrito
var carritoVisible=false;
var carrito=JSON.parse(localStorage.getItem("carrito")) || [];
//Esperamos que todos los elementos de la pagina se carguen para continuar con el scropt
if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
}
else{
    ready();
}

function ready(){
    //Agregamos la funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem=document.getElementsByClassName('btn-eliminar');
    for(var i=0;i<botonesEliminarItem.length;i++){
        var button=botonesEliminarItem[i]; /*acumulo los items en una variable*/
        button.addEventListener('click',eliminarItemCarrito)
    }
    //Agrego funcionalidad al boton sumar cantidad
    var botonesSumarCantidad=document.getElementsByClassName('sumar-cantidad');
    for(var i=0;i<botonesSumarCantidad.length;i++){
        var button=botonesSumarCantidad[i];
        button.addEventListener('click',SumarCantidad);
    }

    //Agrego funcionalidad al boton restar cantidad
    var botonesRestarCantidad=document.getElementsByClassName('restar-cantidad');
    for(var i=0;i<botonesRestarCantidad.length;i++){
        var button=botonesRestarCantidad[i];
        button.addEventListener('click',restarCantidad);
    }

    //Agregamos funcionalidad al boton agregar al carrito
    var botonesAgregarAlCarrito=document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button= botonesAgregarAlCarrito[i];
        button.addEventListener('click',botonesAgregarAlCarritoClicked);
        
    }

    //Agregamos funcionalidad a boton pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClicked);
}

//Elinimo el item selecionado del carrito
function eliminarItemCarrito(event){
    var buttonClicked=event.target;
    buttonClicked.parentElement.parentElement.remove();

    //Actualizamos el total del carrito una vez hemos elimiado el item
    actualizarTotalCarrito();

    //La siguiente fucnion controla si hay elementos en el carrtio una vez que se elimino
    //si no hay debe ocultarse
    ocultarCarrito();
}

//actulizamos el total del carrito
function actualizarTotalCarrito(){
    //seleccionasmo el contenedor carrito
    var carritoContenedor=document.getElementsByClassName('carrito')[0];
    var carritoItems=document.getElementsByClassName('carrito-item');
    var total=0;

    //recorremos cada elemento del carrito para actualizar el total
    for(var i=0;i<carritoItems.length;i++){
        var item=carritoItems[i];
        var precioElemento=item.getElementsByClassName('carrito-item-precio')[0];
         //quitamos el simbolo de dolar y el punto de milesimas
         var precio=parseFloat(precioElemento.innerText.replace('$',''));
         var cantidadItem=item.getElementsByClassName('carrito-item-cantidad')[0];
         var cantidad=cantidadItem.value;
         console.log(cantidad);
         total=total+(precio*cantidad);
    }
    //total=Math.round(total*100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText='$'+total //.toLocaleString("es");
}

function ocultarCarrito(){
    var carritoItems=document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount==0){
        var carrito=document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight='-100%';
        carrito.style.opacity='0';
        carritoVisible=false;

        //Ahora maximizo el contenedor de los elementos
        var items=document.getElementsByClassName('contenedor-items')[0];
        items.style.width='100%';
    }
}

//Aumento en uno la cantidad del elemento seleccionado
function SumarCantidad(event){
    var buttonClicked=event.target;
    var selector=buttonClicked.parentElement;
    var cantidadActual=selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value=cantidadActual;
    //Actualizamo el total
    actualizarTotalCarrito();
}

function restarCantidad(event){
    var buttonClicked=event.target;
    var selector=buttonClicked.parentElement;
    var cantidadActual=selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;

    //controlamos que no sea menor que 1
    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value=cantidadActual;
        //Actualizamo el total
        actualizarTotalCarrito();
    }
}

function botonesAgregarAlCarritoClicked(event){
    var button=event.target;
    var item=button.parentElement;
    var titulo=item.getElementsByClassName('titulo-item')[0].innerText;
    var precio=item.getElementsByClassName('precio-item')[0].innerText;
    var imagenScr=item.getElementsByClassName('img-item')[0].src;
    console.log(imagenScr);
    //la siguiente funcion agregar el elemento al carrito por parametros los valores
    AgregarItemAlCarrito(titulo,precio,imagenScr);

    //hacemos visible el carrito cuando agrega por primera vez
    hacerVisibleCarrito();
}

function AgregarItemAlCarrito(titulo,precio,imagenScr){
    carrito.push({
        imagenScr:imagenScr,
        titulo: titulo,
        precio: precio
    });
    localStorage.setItem("carrtio", JSON.stringify(carrito));
    var item=document.createElement('div');
    item.classList.add='item';
    var itemsCarrito=document.getElementsByClassName('carrito-items')[0];

    //vamos a controlar qeu el item que esta ingresando no se encuentra en el carrito
    var nombresItemsCarrito=itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("El item ya se encuentra en el carrito");
            carrito.pop();
            return;
        }
        
    }

    var itemCarritoContenido=`
    <div class="carrito-item">
        <img src="${imagenScr}" alt="" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad" ></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </span>
    </div>
    `

    item.innerHTML=itemCarritoContenido;
    itemsCarrito.append(item);
    //Agregamos la funcionalidad eliminar del nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click',eliminarItemCarrito);

    //Agregamos la funcionalidad de sumar del nuevo item
    var botonesSumarCantidad=item.getElementsByClassName('sumar-cantidad')[0];
    botonesSumarCantidad.addEventListener('click',SumarCantidad);

     //Agregamos la funcionalidad de restar del nuevo item
     var botonesRestarCantidad=item.getElementsByClassName('restar-cantidad')[0];
     botonesRestarCantidad.addEventListener('click',restarCantidad);

    actualizarTotalCarrito();
    
}

function pagarClicked(event){
    alert("Gracias por su compra");
    //Elimino todos los elementos del carrito
    var carritoItems=document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    //funcion que oculta el carrito
    ocultarCarrito();
}

function hacerVisibleCarrito(){
    carritoVisible=true;
    var carrito=document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight='0';
    carrito.style.opacity='1';

    var items=document.getElementsByClassName('contedor-items')[0];
    items.style.width='60%';
}