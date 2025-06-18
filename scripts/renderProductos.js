let productosData = [];

fetch('productos.json')
    .then(res => res.json())
    .then(data => {
        productosData = data.map(p => new Producto(p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.categoría, p.stock));
        renderProductos(productosData);
        renderFiltros(productosData);
    });

function renderProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = ''; // limpiamos si hay
    productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "producto";

        const img = document.createElement("img");
        img.src = prod.imagen;
        img.alt = prod.nombre;

        const nombre = document.createElement("h3");
        nombre.textContent = prod.nombre;

        const precio = document.createElement("p");
        precio.textContent = `$${prod.precio}`;

        const btn = document.createElement("button");
        btn.textContent = "Agregar al carrito";
        btn.onclick = () => {
            carrito.agregarProducto(prod);
        };

        card.append(img, nombre, precio, btn);
        contenedor.appendChild(card);
    });
}
