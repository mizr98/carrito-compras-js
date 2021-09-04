// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    // cUANDO AGREGAS UN CURSO PRESIONADO
    listaCursos.addEventListener('click', agregarCurso);

    //ELIMINA CURSOS DEL CARRITO
    carrito.addEventListener('click', eliminarCurso);

    // Muestra los cursos del local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();

    })

    //Vaciar Carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
    });
};


//FUNCIONES
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Eliminar curso del carrito
function eliminarCurso(e) {

    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //Elimina del arreglo por data-id
        articulosCarrito = articulosCarrito.filter(curso => {
            if (curso.id === cursoId) {
                if (curso.cantidad > 1) {
                    curso.cantidad--;
                    return curso;
                }
                else {
                    delete curso;
                }
            } else {
                return curso;
            }
        });

        carritoHTML(); //Iterar sobre el carrito y mostrar su HTML
    }
}

function leerDatosCurso(curso) {

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //Actualizar cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna objeto actualizado
            } else {
                return curso; // retorna no duplicados
            }
        });
        articulosCarrito = [...cursos]
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //Agrega elementos al arreglo de carrito
    console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el carrito de compra en el HTML
function carritoHTML() {
    //Limpiar HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        const { imagen, id, titulo, precio, cantidad } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100" />
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a> </a>
            </td>
        `;

        //Agrega al html de carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agregar el carrito al local Storage
    sincronizarSotrage();
}

function sincronizarSotrage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Eliminar cursos de TBODY
function limpiarHTML() {
    contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}