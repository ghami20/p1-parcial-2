const productos = [
  // iPhone
  { id: 1, nombre: "iPhone 15 Pro", descripcion: "Titanio. Superpotente con chip A17 Pro.", precio: 1599999, imagen: "/images/iphone15.png", categoria: "iPhone", stock: 1 },
  { id: 6, nombre: "iPhone 14", descripcion: "Chip A15 Bionic. Doble cámara.", precio: 1199999, imagen: "/images/iphone14.png", categoria: "iPhone", stock: 6 },

  // Mac
  { id: 2, nombre: "MacBook Air M2", descripcion: "Ligera, rápida y silenciosa.", precio: 1249999, imagen: "/images/macairm2.jpg", categoria: "Mac", stock: 7 },
  { id: 7, nombre: "MacBook Pro 14\"", descripcion: "Con chip M3 Pro. Potencia total.", precio: 1899999, imagen: "/images/macbook14.jpeg", categoria: "Mac", stock: 4 },

  // iPad
  { id: 3, nombre: "iPad Pro 12.9\"", descripcion: "Con chip M2 y pantalla Liquid Retina.", precio: 1099999, imagen: "/images/ipadpro.jpg", categoria: "iPad", stock: 4 },
  { id: 8, nombre: "iPad Air", descripcion: "Ligera y poderosa con chip M1.", precio: 849999, imagen:"/images/ipadair.jpg", categoria: "iPad", stock: 5 },

  // Watch
  { id: 4, nombre: "Apple Watch Ultra 2", descripcion: "Para aventuras extremas.", precio: 899999, imagen:"/images/applewatch.jpg", categoria: "Watch", stock: 3 },
  { id: 9, nombre: "Apple Watch Series 9", descripcion: "Nuevo gesto mágico y pantalla brillante.", precio: 699999, imagen: "/images/applewatch2.png", categoria: "Watch", stock: 6 },

  // Audio
  { id: 5, nombre: "AirPods Pro (2da gen)", descripcion: "Audio espacial y cancelación de ruido.", precio: 399999, imagen:"/images/AirPodsPro.jfif", categoria: "Audio", stock: 10 },
  { id: 10, nombre: "AirPods Max", descripcion: "Auriculares premium con audio espacial.", precio: 799999, imagen:"/images/airpodsmax.jfif", categoria: "Audio", stock: 4 }
];

class Carrito {
  constructor() {
    this.productos = JSON.parse(localStorage.getItem("carrito")) || [];
  }

  agregarProducto(prod) {
    const existente = this.productos.find(p => p.id === prod.id);
    if (existente) {
      const prodOriginal = productos.find(p => p.id === prod.id);
      if (existente.cantidad < prodOriginal.stock) {
        existente.cantidad++;
            mostrarToast(`Se añadió otro ${prod.nombre} al carrito`);

      } else {
            mostrarToast("No hay más stock disponible para este producto", "error");
        //alert("No hay más stock disponible para este producto.");
      }
    } else {
      this.productos.push({ ...prod, cantidad: 1 });
        mostrarToast(`Se añadió ${prod.nombre} al carrito`);

    }
    this.guardar();
    renderProductos(productos);
  }

  aumentarCantidad(id) {
    const prod = this.productos.find(p => p.id === id);
    if (prod) {
      const prodOriginal = productos.find(p => p.id === id);
      if (prod.cantidad < prodOriginal.stock) {
        prod.cantidad++;
        this.guardar();
      } else {
        //alert("No hay más stock disponible para este producto.");
        mostrarToast("No hay más stock disponible para este producto", "error");

      }
    }
  }

  disminuirCantidad(id) {
    const prodIndex = this.productos.findIndex(p => p.id === id);
    if (prodIndex > -1) {
      if (this.productos[prodIndex].cantidad > 1) {
        this.productos[prodIndex].cantidad--;
      } else {
         this.productos.splice(prodIndex, 1);
      }
      this.guardar();
    }
  }

  totalItems() {
    return this.productos.reduce((acc, el) => acc + el.cantidad, 0);
  }

  totalPrecio() {
    return this.productos.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  }

  guardar() {
    localStorage.setItem("carrito", JSON.stringify(this.productos));
    renderMiniCarrito();
  }
  vaciarCarrito() {
    this.productos = [];
    this.guardar();
    
  }
}

function mostrarToast(mensaje, tipo = "ok") {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.style.backgroundColor = tipo === "error" ? "#c0392b" : "#27ae60";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
const carrito = new Carrito();

function renderProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  lista.forEach(prod => {
    const card = document.createElement("div");
    card.className = "producto";

    const img = document.createElement("img");
    img.src = prod.imagen;
    img.alt = prod.nombre;

    const nombre = document.createElement("h3");
    nombre.textContent = prod.nombre;

    const desc = document.createElement("p");
    desc.textContent = prod.descripcion;

    const precio = document.createElement("p");
    precio.textContent = `$${prod.precio.toLocaleString()}`;

    const boton = document.createElement("button");

    const cantidadEnCarrito = carrito.productos.find(p => p.id === prod.id)?.cantidad || 0;
const stockRestante = prod.stock - cantidadEnCarrito;

if (stockRestante > 0) {
  boton.textContent = "Agregar al carrito";
  boton.onclick = () => carrito.agregarProducto(prod);
} else {
  boton.textContent = "Sin stock";
  boton.disabled = true;
  boton.style.opacity = 0.6;
  boton.style.cursor = "not-allowed";
}
    card.append(img, nombre, desc, precio, boton);
    contenedor.appendChild(card);
  });
}// finaliza render



function filtrarPorRango() {
  const min = parseInt(document.getElementById("minPrecio").value) || 0;
  const max = parseInt(document.getElementById("maxPrecio").value) || Infinity;
  const filtrados = productos.filter(p => p.precio >= min && p.precio <= max);
  renderProductos(filtrados);
}

function renderFiltros() {
  const contenedor = document.querySelector(".filtros");
  contenedor.innerHTML = "";
  const categorias = [...new Set(productos.map(p => p.categoria))];
const ordenarAsc = document.createElement("button");
ordenarAsc.textContent = "Más barato";
ordenarAsc.onclick = () => ordenarPorPrecio(true);

const ordenarDesc = document.createElement("button");
ordenarDesc.textContent = "Más caro";
ordenarDesc.onclick = () => ordenarPorPrecio(false);

contenedor.append(ordenarAsc, ordenarDesc);
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => renderProductos(productos.filter(p => p.categoria === cat));
    contenedor.appendChild(btn);
  });
}

function renderMiniCarrito() {
  const spans = document.querySelectorAll("#carrito span");
  spans[0].textContent = carrito.totalItems();
  spans[1].textContent = carrito.totalPrecio().toLocaleString();
}

function verCarrito() {
  document.body.style.overflow = "hidden"; 
  const modal = document.getElementById("modalCarrito");
  const contenedor = document.getElementById("contenidoCarrito");
  const total = document.querySelector(".totalCarrito");
  if (contenedor.contains(total)) {
    contenedor.removeChild(total);
  }

  if (carrito.productos.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    total.textContent = "";
  } else {
   carrito.productos.forEach(p => {
  contenedor.innerHTML += `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color:black;">
      <img src="${p.imagen}" alt="${p.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" />
      <div style="flex-grow: 1;">
        <p style="margin: 0; font-weight: bold;">${p.nombre}</p>
        <p style="margin: 0.2rem 0; color: black;">
          Cantidad: 
          <button style="margin-right:5px;" onclick="carrito.disminuirCantidad(${p.id}); verCarrito();">-</button>
          ${p.cantidad}
          <button style="margin-left:5px;" onclick="carrito.aumentarCantidad(${p.id}); verCarrito();">+</button>
        </p>
        <p style="margin: 0; font-size: 0.9rem;">Subtotal:  $${(p.precio * p.cantidad).toLocaleString()}</p>
      </div>
    </div>
  `;
});
    const btnComprarTodo = document.createElement("button");
    btnComprarTodo.setAttribute("aria-label", "Confirmar compra de todos los productos del carrito");
    btnComprarTodo.title = "Confirmar compra de todos los productos del carrito";
    btnComprarTodo.textContent = "Comprar todo";
    btnComprarTodo.style = "padding: 0.7rem 1.2rem; background: #2ecc71; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 1rem;";
    btnComprarTodo.onclick = comprarTodo;

    contenedor.appendChild(btnComprarTodo);
    total.textContent = `Total: $${carrito.totalPrecio().toLocaleString()}`;
  }

  modal.style.display = "flex";
} //termina ver carrito

function comprarTodo() {
  if (carrito.productos.length === 0) {
    //alert("Tu carrito está vacío.");
    mostrarToast("Tu carrito está vacío", "error");

    return;
  }

  // Verificamos si hay stock suficiente para todos los productos
  for (const prodCarrito of carrito.productos) {
    const prodOriginal = productos.find(p => p.id === prodCarrito.id);
    if (prodCarrito.cantidad > prodOriginal.stock) {
      //alert(`No hay suficiente stock para ${prodOriginal.nombre}.`);
      mostrarToast(`No hay suficiente stock para ${prodOriginal.nombre}`, "error");

      return;
    }
  }

  // Descontamos el stock
  for (const prodCarrito of carrito.productos) {
    const prodOriginal = productos.find(p => p.id === prodCarrito.id);
    prodOriginal.stock -= prodCarrito.cantidad;
  }

  // Mensaje resumen
  const total = carrito.totalPrecio().toLocaleString();
  mostrarToast(`Compra realizada por $${total}`, "ok");

  // Vaciamos el carrito y actualizamos vistas
  carrito.vaciarCarrito();
  renderProductos(productos);
  verCarrito();
}


function cerrarModalCarrito() {
  document.body.style.overflow = "auto";
  document.getElementById("modalCarrito").style.display = "none";
}
function ordenarPorPrecio(asc = true) {
  const lista = [...productos].sort((a, b) => asc ? a.precio - b.precio : b.precio - a.precio);
  renderProductos(lista);
}


window.addEventListener("DOMContentLoaded", () => {
  renderProductos(productos);
  renderFiltros();
  renderMiniCarrito();
});
