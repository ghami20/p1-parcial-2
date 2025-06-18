const productos = [
  // iPhone
  { id: 1, nombre: "iPhone 15 Pro", descripcion: "Titanio. Superpotente con chip A17 Pro.", precio: 1599999, imagen: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha&.v=1692923782190", categoría: "iPhone", stock: 5 },
  { id: 6, nombre: "iPhone 14", descripcion: "Chip A15 Bionic. Doble cámara.", precio: 1199999, imagen: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=940&hei=1112&fmt=png-alpha&.v=1661027992020", categoría: "iPhone", stock: 6 },

  // Mac
  { id: 2, nombre: "MacBook Air M2", descripcion: "Ligera, rápida y silenciosa.", precio: 1249999, imagen: "https://www.ventasrosario.com.ar/wp-content/uploads/2023/06/design-hero_endframe__olurqzgtbh6e_large.jpg", categoría: "Mac", stock: 7 },
  { id: 7, nombre: "MacBook Pro 14\"", descripcion: "Con chip M3 Pro. Potencia total.", precio: 1899999, imagen: "https://static.nb.com.ar/i/nb_APPLE-MACBOOK-PRO-14-M1-PRO-CHIP-16GB-512GB-SSD-SILVER_ver_a1f627781115284cebfa693795adc22b.jpeg", categoría: "Mac", stock: 4 },

  // iPad
  { id: 3, nombre: "iPad Pro 12.9\"", descripcion: "Con chip M2 y pantalla Liquid Retina.", precio: 1099999, imagen: "https://m.media-amazon.com/images/I/81c+9BOQNWL.jpg", categoría: "iPad", stock: 4 },
  { id: 8, nombre: "iPad Air", descripcion: "Ligera y poderosa con chip M1.", precio: 849999, imagen: "https://m.media-amazon.com/images/I/81sxRBhe2sS._AC_SL1500_.jpg", categoría: "iPad", stock: 5 },

  // Watch
  { id: 4, nombre: "Apple Watch Ultra 2", descripcion: "Para aventuras extremas.", precio: 899999, imagen: "https://www.sagitariodigital.com.ar/wp-content/uploads/2023/10/ultra-21-2.jpg", categoría: "Watch", stock: 3 },
  { id: 9, nombre: "Apple Watch Series 9", descripcion: "Nuevo gesto mágico y pantalla brillante.", precio: 699999, imagen: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/apple-watch-series-9.png", categoría: "Watch", stock: 6 },

  // Audio
  { id: 5, nombre: "AirPods Pro (2da gen)", descripcion: "Audio espacial y cancelación de ruido.", precio: 399999, imagen: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=532&hei=582&fmt=jpeg&qlt=95&.v=1660803972361", categoría: "Audio", stock: 10 },
  { id: 10, nombre: "AirPods Max", descripcion: "Auriculares premium con audio espacial.", precio: 799999, imagen: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-skyblue-202011?wid=532&hei=582&fmt=jpeg&qlt=95&.v=1604022365000", categoría: "Audio", stock: 4 }
];

class Carrito {
  constructor() {
    this.productos = JSON.parse(localStorage.getItem("carrito")) || [];
  }

  agregarProducto(prod) {
    const existente = this.productos.find(p => p.id === prod.id);
    if (existente) {
      // Verifica stock antes de aumentar
      const prodOriginal = productos.find(p => p.id === prod.id);
      if (existente.cantidad < prodOriginal.stock) {
        existente.cantidad++;
      } else {
        alert("No hay más stock disponible para este producto.");
      }
    } else {
      this.productos.push({ ...prod, cantidad: 1 });
    }
    this.guardar();
  }

  aumentarCantidad(id) {
    const prod = this.productos.find(p => p.id === id);
    if (prod) {
      const prodOriginal = productos.find(p => p.id === id);
      if (prod.cantidad < prodOriginal.stock) {
        prod.cantidad++;
        this.guardar();
      } else {
        alert("No hay más stock disponible para este producto.");
      }
    }
  }

  disminuirCantidad(id) {
    const prodIndex = this.productos.findIndex(p => p.id === id);
    if (prodIndex > -1) {
      if (this.productos[prodIndex].cantidad > 1) {
        this.productos[prodIndex].cantidad--;
      } else {
        // Si queda 0, eliminar del carrito
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
    boton.textContent = "Agregar al carrito";
    boton.onclick = () => carrito.agregarProducto(prod);

    card.append(img, nombre, desc, precio, boton);
    contenedor.appendChild(card);
  });
}

function renderFiltros() {
  const contenedor = document.querySelector(".filtros");
  contenedor.innerHTML = ""; // Limpia para no repetir botones
  const categorias = [...new Set(productos.map(p => p.categoría))];

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => renderProductos(productos.filter(p => p.categoría === cat));
    contenedor.appendChild(btn);
  });
}

function renderMiniCarrito() {
  const spans = document.querySelectorAll("#carrito span");
  spans[0].textContent = carrito.totalItems();
  spans[1].textContent = carrito.totalPrecio().toLocaleString();
}

function verCarrito() {
  const modal = document.getElementById("modalCarrito");
  const contenedor = document.getElementById("contenidoCarrito");
  const total = document.querySelector(".totalCarrito");

  contenedor.innerHTML = "";

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

    total.textContent = `Total: $${carrito.totalPrecio().toLocaleString()}`;
  }

  modal.style.display = "flex";
}

function cerrarModalCarrito() {
  document.getElementById("modalCarrito").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  renderProductos(productos);
  renderFiltros();
  renderMiniCarrito();
});
