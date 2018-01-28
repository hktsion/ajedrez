//FUNCIONAMIENTO GENERAL DEL SCRIPT
/*Se añade un listener al documento que ejecuta el script cuando el DOM está cargado. A partir de aquí, se declaran una serie de constantes que se detallan a continuación:
	· ELEMENTOS :: es un objeto clave, el nombre de la ficha y el valor es la pieza en sí.
	· FICHAS :: array con los nombres de las figuras del juego.
	· ATTR_ID :: son los distintos id's que tienen los nodos div's en el documento.

El desarrollo de la aplicacaión tiene 2 partes diferenciadas, por un lado la creación e indexación de nodos en el DOM y por otro lado la funcionalidad del juego (creación del movimiento de las piezas).


-------------------------------------------------
# FASE 1 :: MODULO  OBJETOS
-------------------------------------------------
Primeramente creamos 2 constructores de objetos: Pieza y Prop.
⚆ Pieza: permite instanciar piezas del ajedrez. Contiene los métodos get y set y recibe 3 parámetros:
	 · clave: es la pieza que queremos construir (peón, torre, reina, ... ).
	 · x: es la posición actual de la ficha en el eje de coordenadas X (horizonatal) del tablero.
	 · y: es la posición actual de la ficha en el eje de coordenadas Y (vertical) del tablero.
a partir de la clave y mediante la constante ELEMENTOS recogemos la pieza a construir (♟, ♜, ♛, ...).
El objeto pieza se utiliza en distintas fases (lo vamos viendo :) )

⚆ Prop: permite instanciar objetos prop que contengan 3 propiedades:
	 · _id: será el id de nuestro objeto
	 · _classe: será la clase que contendrá nuestro objeto
	 · _bg: el color de fondo que se aplicará.
El objeto prop se usará a lo largo del script, por ejemplo, para añadir las clases y colores de fondo a nuestra cuadrícula tablero.


-------------------------------------------------
# FASE 2 :: MODULO  DOM
-------------------------------------------------
En una primera fase se añaden los elementos del DOM y se añaden los listeners necesarios para inicializar la tercera fase (Modulo juego). Las funciones que participan en esta segunda fase son: 

⚆ init() => es la función que inicializa el script:
	· pone una imagen de fondo al body (chess.jpg).
	· agrega al DOM el primer div (div_wrapper) que contiene el mensaje, el tablero y las piezas y mediante la función indexar_al_DOM(). 
	  Las clases, id's y colores de fondo a aplicar en estos contenedores viene definido por el objeto-parámetro que recibe: Prop, así por ejemplo, en: "let div_mensaje = indexar_al_DOM(tagBody + '>' + tagDiv, tagDiv, new Prop('mensaje', null, null));" el contenedor 'mensaje' generado será: "<div id="mensaje"></div>", tendrá un id = mensaje, y no tendrá ninguna clase ni color de fondo (null, null);
	· genera el tablero (generar_tablero()) y añade los listeners para meter y sacar una ficha al tablero.

⚆ indexar_al_DOM() => añade elementos al DOM y tiene capacidad de generarlos con un 'id', una 'class' y un 'background-color'. Recibe 3 parámetros:
	· elemento padre: es un elemento que ya existe en el DOM y que seleccionamos mediante un querySelector(prop_css).
	· elemento hijo: es el elemento que creamos y que va a colgar del elemento padre.
	. objeto Prop: para darle un id, class o estilo (background-color) al elemeto hijo dependiendo de si viene o no a null la propiedad _id, _classe y _bg.
	La función indexar_al_DOM(), retorna el elemento hijo por si hubiese que usarlo en un futuro. Se usa bastantes veces a lo largo del script, la función es altamente reutilizable.

⚆ generar_tablero() => genera nuestro tablero de juego. 
	Mediante insertAdjacentHTML hacemos que de él cuelgue el div#tablero y mediante 2 ciclos for crea una cuadrícula de 8x8 (8 filas x 8 columnas) a través de la función indexar_al_DOM(). Cada una de las casillas (celdas) contendrá una clase y un background que recoge a partir del objeto Prop que se le pasa como parámetro, resultando así el tablero de ajedrez. 
	
	!IMPORTANT :: A cada una de las casillas se le añade un id, del tipo '4-6' que equivale a decir que esa celda se encuentra en las coordenadas (x=4, y=6) dentro del tablero. Ésto nos permitirá más adelante saber si la pieza movida se encuentra fuera o dentro del tablero, ya que nuestras coordenadas van del (0,0) al (8,8).

⚆ generar_piezas() => genera el div#piezas donde están alojadas las piezas en reserva. 
	Las piezas se generan a partir del objeto Pieza y con un bucle for que recorre el array FICHAS. Da un color de fondo transparente a las piezas (originalmente #ffffff) y un width de 40px para que tengan el mismo tamaño que las celdas del tablero.

⚆ Se añaden unos listeners-onclick a las piezas y al tablero para poder inicializar el juego. 
	Los listeners interactúan entre sí para poder encadenar el DOM con JUGABILIDAD.
	
	· listener_seleccionar_pieza_parajugar(event) => cada una de las piezas en reserva recibe un listener-onclick para pasar de la reserva al tablero. Sobre ese click ejecuta: mover_ficha_al_tablero() yseleccionar_casilla_ocupada() (se explican más adelante). Además implementa el keypress para mover la ficha dentro del tablero y elmina el evento-click sobre las piezas de reserva para no permitir que haya más de una pieza en el tablero.

Veremos cómo los listeners son los que casan el DOM con la parte del juego. La funcionalidad de los listenres se explican en la siguiente sección;



-------------------------------------------------
# FASE 3 :: MODULO JUEGO
-------------------------------------------------
⚆ listener_seleccionar_pieza_parajugar(event) => La función-listener (que contiene el evento click) evalúa la pieza de reserva que hemos pinchado
	y genera (mediante el switch) un objeto de ese tipo, es decir, si en el div#piezas se hace click sobre '♜', se genera una nueva (new) Pieza 'torre', que como coordenadas (x,y) tendrá la posición inicial en el tablero de esa figura. La posición inicial de la torre al empezar una partida es la (1,1), primera fila y primera columna del tablero, la del caballo, la (2,1), la del alfil, la (3,1) y así con cada pieza.
	
	Este listener coloca la pieza en la posición (x,y) indicada dentro del tablero y borra esa pieza (con display none) en el div#piezas. Implementa además un listener para poder mover la pieza dentro del teclado y otro (removeEbenListener) para no permitir meter otra pieza en el tablero cuando ya existe una dentro.

⚆ listener_devolver_pieza_acasa(event) => permite devolver al div#piezas la pieza actual que está en el tablero haciendo click en ella. 
	El listener evalúa todo el tablero y encuentra la casilla que no contiene '' (es decir, que no está vacía) mediane la función seleccionar_casilla_ocupada() (la funcón es altamente reutilzable). Se borra todo el div#figuras y se vuelve  a generar, así el tablero queda libre para poder meter otra ficha haciendo click sobre una pieza en el div#figuras.

⚆ listener_mover_pieza => crea los movimientos de las figuras. 
	Para ello, mediante seleccionar_casilla_ocupada() se selecciona la casilla que contiene la pieza (si esa casilla existe, es decir, es !=null) se procede a hacer el movimiento por teclado de la ficha. Si la casilla no existe, quiere decir que la ficha estará fuera del tablero con lo que no se nos permitirá hacer el movimiento de la pieza. 

	En el caso de que la casilla seleccionada exista, creamos una copia de la pieza que se encuentra actualmente en el tablero (aún no la mostramos) y mediante los keyCodes calculamos donde iría la pieza (en el caso de que la casilla de destino existiese => si no existe, ya sabemos que no se podría hacer el movimiento, estaríamos en el caso de seleccionar_casilla_ocupada == null). 

	El cálculo de la posición de destino de la pieza se calcula mediante el array MOV_FICHA que nos indica los movimientos permitidos por cada una de las piezas, es decir, la 'torre' puede moverse 1 posición en X (positivo o negativo) y 1 posición en el eje Y (positivo o negativo), siempre que la casilla de destino exista.

⚆ Las funciones: mover_arriba(), mover_abajo(), mover_derecha(), mover_izquierda() evalúan la pieza que se quieres mover y el resto son meros 
	cálculos de dónde tendría que ir la ficha que está en el tablero actualmente. 
	
	Todas ellas acaban con:
 	· div_actual.innerHTML = '';    => limpia la casilla actual donde se encuentra la pieza;
	· sig_div.innerHTML = f.ficha;	=> pinta el símbolo que corresponda en la siguiente casilla donde se mueve la pieza usando la propiedad del 								   objeto f.ficha (que se corresponde con la figura del objeto, por ejemplo: '♞')).
*/


document.addEventListener('DOMContentLoaded', function(){
	'use strict';

	let tagBody = 'body'; let tagDiv = 'div';
	const ELEMENTOS = {'torre': '♜', 'caballo': '♞', 'alfil': '♝', 'reina': '♛', 'rey':'♚', 'peon':'♟'};
	const MOV_FICHA = { 'torre': [1,1], 'caballo': [2,1],  'alfil': [1,1], 'reina': [1,1], 'peon': [1,0], 'rey': [1,1] }
	const FICHAS = ['torre', 'caballo', 'alfil', 'reina', 'rey', 'peon'];
	const ATTR_ID = ['mensaje', 'tablero', 'piezas'];
	let hijosde_piezas, hijosde_tablero, div_actual, sig_div;

	function init(){
		let body = document.querySelector(tagBody);
		body.style.backgroundImage = "url('img/chess.jpg')";

		let div_wrapper = indexar_al_DOM(tagBody, tagDiv, null);
		let div_mensaje = indexar_al_DOM(tagBody + '>' + tagDiv, tagDiv, new Prop('mensaje', null, null));
		let div_piezas  = indexar_al_DOM(tagBody + '>' + tagDiv, tagDiv, new Prop('piezas', null, null));

		div_mensaje.innerText = 'Elige pieza...';
		
		generar_tablero();
		hijosde_piezas = generar_piezas();
		
		div_piezas.addEventListener('click', listener_seleccionar_pieza_parajugar, true);
		let div_tablero = document.getElementById('tablero');
		div_tablero.addEventListener('click', listener_devolver_pieza_acasa, true);
	}

	function listener_devolver_pieza_acasa(e){
		if(e.target.innerText != ''){
			e.target.innerText = '';

			borrar_piezas();
			generar_piezas();

			let divmensaje = document.getElementById('mensaje');
			let divpiezas = document.getElementById('piezas');
			let divtablero = document.getElementById('tablero');

			divpiezas.addEventListener('click', listener_seleccionar_pieza_parajugar, true);
			divmensaje.innerText = 'Elige pieza...';
			document.removeEventListener('keypress', listener_mover_pieza, true);
		}
	}

	function listener_seleccionar_pieza_parajugar(e){

		let f = null || {};
		let x = 0;
		let y = 0;
		switch (e.target.innerText) {
			case '♜': x = 1; y= 1; break;
			case '♞': x = 2; y= 1; break;
			case '♝': x = 3; y= 1; break;
			case '♚': x = 4; y= 1; break;
			case '♛': x = 5; y= 1; break;
			case '♟': x = 1; y= 2; break;
			default: break;
		};

		let ficha_pulsada = new Pieza(e.target.id,x,y);
		mover_ficha_al_tablero(ficha_pulsada, mensaje);

		let divpiezas = document.getElementById('piezas');
		seleccionar_casilla_ocupada();

		document.addEventListener('keypress', listener_mover_pieza, true);
		divpiezas.removeEventListener('click', listener_seleccionar_pieza_parajugar, true);

	}

	function listener_mover_pieza(e){
		let div_ocupada = seleccionar_casilla_ocupada();

		if(div_ocupada != null){
			let xy = div_ocupada.getAttribute('id');
			let nb_ficha = document.querySelector('#mensaje').textContent.substring(7).toLowerCase();
			let ficha_para_mover = new Pieza(nb_ficha,xy.substring(0,1),xy.substring(2,3));

			if(e.keyCode == 65 || e.keyCode == 52 || e.keyCode == 97){
				switch(ficha_para_mover.getFicha()){
					case '♜': case '♚':  case '♛':
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) - MOV_FICHA[ficha_para_mover.nombre][0]; break;
					case '♟': break;
					case '♞': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) - MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) - MOV_FICHA[ficha_para_mover.nombre][1]; break;
					case '♝': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) - MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) + MOV_FICHA[ficha_para_mover.nombre][1]; break;

				}
				mover_izquierda(ficha_para_mover);
			}

			if(e.keyCode == 39 || e.keyCode == 54 ||  e.keyCode == 68 || e.keyCode == 100){
				switch(ficha_para_mover.getFicha()){
					case '♜': case '♚': case '♛':
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) + MOV_FICHA[ficha_para_mover.nombre][0]; break;
					case '♟': break;
					case '♞': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) + MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) + MOV_FICHA[ficha_para_mover.nombre][1]; break;
					case '♝': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) + MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) - MOV_FICHA[ficha_para_mover.nombre][1]; break;
				}
				mover_derecha(ficha_para_mover);
			}

			if(e.keyCode == 50 || e.keyCode == 83 || e.keyCode == 98 || e.keyCode == 115){
				switch(ficha_para_mover.getFicha()){
					case '♜': case '♚': case '♛':
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) - MOV_FICHA[ficha_para_mover.nombre][1];;;;;;; break;
					case '♟': break;
					case '♞': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) - MOV_FICHA[ficha_para_mover.nombre][1]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) - MOV_FICHA[ficha_para_mover.nombre][0]; break;
					case '♝': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) - MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) - MOV_FICHA[ficha_para_mover.nombre][1]; break;
				}
				mover_abajo(ficha_para_mover);
			}

			if(e.keyCode == 56 || e.keyCode == 87 || e.keyCode == 104 || e.keyCode == 119){
				switch(ficha_para_mover.getFicha()){
					case '♜': case '♚': case '♟': case '♛':
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) + MOV_FICHA[ficha_para_mover.nombre][0]; break;
					case '♟': break;
					case '♞': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) + MOV_FICHA[ficha_para_mover.nombre][1]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) + MOV_FICHA[ficha_para_mover.nombre][0]; break;
					case '♝': 
					ficha_para_mover.posX = parseInt(ficha_para_mover.posX) + MOV_FICHA[ficha_para_mover.nombre][0]; 
					ficha_para_mover.posY = parseInt(ficha_para_mover.posY) + MOV_FICHA[ficha_para_mover.nombre][1]; break;
				}
				mover_arriba(ficha_para_mover);
			}
		}
	}

	function mover_arriba(f){
		if(f instanceof Pieza && (f.nombre == 'torre' || f.nombre == 'rey' || f.nombre == 'reina') || f.nombre == 'peon'){
			div_actual = document.getElementById( f.posX + '-' + (parseInt(f.posY-1 )));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'caballo')){
			div_actual = document.getElementById( (parseInt(f.posX-1)) + '-' + (parseInt(f.posY-2 )));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'alfil')){
			div_actual = document.getElementById( (parseInt(f.posX-1)) + '-' + (parseInt(f.posY-1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}

		if(sig_div != null && div_actual!=null){
			div_actual.innerHTML = '';
			sig_div.innerHTML = f.ficha;
		};
	}

	function mover_abajo(f){
		if(f instanceof Pieza && (f.nombre == 'torre' || f.nombre == 'rey' || f.nombre == 'reina')){
			div_actual = document.getElementById( f.posX + '-' + (parseInt(f.posY + 1 )));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'caballo')){
			div_actual = document.getElementById( (parseInt(f.posX+1)) + '-' + (parseInt(f.posY +2)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}		
		if(f instanceof Pieza && (f.nombre == 'alfil')){
			div_actual = document.getElementById( (parseInt(f.posX+1)) + '-' + (parseInt(f.posY+1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}

		if(sig_div != null && div_actual!=null){
			div_actual.innerHTML = '';
			sig_div.innerHTML = f.ficha;
		};
	}

	function mover_derecha(f){
		if(f instanceof Pieza && (f.nombre == 'torre' || f.nombre == 'rey' || f.nombre == 'reina')){
			div_actual = document.getElementById( (parseInt(f.posX - 1 )) + '-' + f.posY);
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'caballo')){
			div_actual = document.getElementById( (parseInt(f.posX-2)) + '-' + (parseInt(f.posY-1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'alfil')){
			div_actual = document.getElementById( (parseInt(f.posX-1)) + '-' + (parseInt(f.posY+1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(sig_div != null && div_actual!=null){
			div_actual.innerHTML = '';
			sig_div.innerHTML = f.ficha;
		};
	}

	function mover_izquierda(f){
		if(f instanceof Pieza && (f.nombre == 'torre' || f.nombre == 'rey' || f.nombre == 'reina')){
			div_actual = document.getElementById( (parseInt(f.posX + 1 )) + '-' + f.posY);
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'caballo')){
			div_actual = document.getElementById( (parseInt(f.posX+2)) + '-' + (parseInt(f.posY+1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(f instanceof Pieza && (f.nombre == 'alfil')){
			div_actual = document.getElementById( (parseInt(f.posX+1)) + '-' + (parseInt(f.posY-1)));
			sig_div = document.getElementById(f.posX + '-' + f.posY);
		}
		if(sig_div != null && div_actual!=null){
			div_actual.innerHTML = '';
			sig_div.innerHTML = f.ficha;
		};
	}

	function seleccionar_casilla_ocupada(){
		let tb = document.getElementById('tablero');
		for(let i = 0; i < tb.childNodes.length; i++){
			if(tb.childNodes[i].textContent != ''){
				return tb.childNodes[i];
			}
		}
		return null;
	}

	function mover_ficha_al_tablero(f_p, mnsj){
		let contenedor__fichaPulsada_posActual = document.getElementById(f_p.nombre);
		let contenedor__fichaPulsada_target = document.getElementById(f_p.getPosX() + '-' + f_p.getPosY());
		contenedor__fichaPulsada_target.innerText = f_p.ficha;
		mnsj.innerText = 'Ficha: ' + f_p.nombre.toUpperCase();
		contenedor__fichaPulsada_posActual.style.display = 'none';	
	}

	function indexar_al_DOM(elemPadre, elemHijo, obj){
		let padre = document.querySelector(elemPadre);
		let hijo = document.createElement(elemHijo);

		if(obj instanceof Prop && obj['_id'] != null){
			hijo.setAttribute('id', obj['_id']);
		}

		if(obj instanceof Prop && obj['_classe'] != null){
			hijo.classList.add(obj['_classe']);
			if(obj['_bg'] != null){
				hijo.style.backgroundColor = obj['_bg'];
			}
		}

		padre.append(hijo);
		return hijo;
	}

	function Pieza(clave, x, y){
		this.posX = x;
		this.posY = y;
		this.nombre = clave;
		this.ficha = ELEMENTOS[clave];

		this.getFicha = function(){ return this.ficha; },
		this.getPosX  = function(){ return this.posX; },
		this.getPosY  = function(){ return this.posY; },
		this.setPosX  = function(posicionX){ this.posX = posicionX; },
		this.setPosY  = function(posicionY){ this.posY = posicionY; }
	};

	function Prop(_id, _classe, _bg){
		this._id = _id;
		this._classe = _classe;
		this._bg = _bg;

		this.getId = function(){ return this._id; },
		this.getClasse = function(){ return this._classe; },
		this.getBg = function(){ return this._bg; } 
	};

	function generar_piezas(){
		let todos_misdivs = null || [];

		for(let i = 0; i < FICHAS.length; i++){
			let f = new Pieza(FICHAS[i], null, null);
			let p = new Prop(FICHAS[i]);
			let div_generado = indexar_al_DOM('#piezas', tagDiv, p);

			div_generado.innerText = f.getFicha();
			div_generado.style.width = '40px';
			div_generado.style.backgroundColor = 'transparent';

			todos_misdivs.push(div_generado);
		}
		return todos_misdivs;
	}

	function generar_tablero(){
		var mensaje = document.getElementById('mensaje');
		mensaje.insertAdjacentHTML('afterend', '<div id="tablero"></div>'); 
		let casilla; 
		for (let i = 8; i > 0; i--) {
			for (let j = 0; j < 8; j++) {
				if((i+j)%2 != 0) {
					casilla = indexar_al_DOM('#tablero', tagDiv, new Prop(null, 'negra', '#1793d1'));
				}else{
					casilla = indexar_al_DOM('#tablero', tagDiv, new Prop(null, 'blanca', '#fff9ea'));
				}

				casilla.setAttribute('id', (j+1) + '-' + i);
				casilla.style.width  = '40px';
				casilla.style.height = '40px';
			};
		};
	}

	function borrar_tablero(){ document.querySelector('#tablero').remove(); }
	function borrar_piezas(){ 
		hijosde_piezas = document.querySelectorAll('#piezas > div'); 
		hijosde_piezas.forEach( function(element, index) {
			element.remove();
		}); 
	}

	init();
}, false);