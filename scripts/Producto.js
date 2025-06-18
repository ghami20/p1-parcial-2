class Producto {
    constructor(id, nombre, descripcion, precio, imagen, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
        this.stock = stock || 0;
    }
}

class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    agregarProducto(producto) {
        const existente = this.productos.find(p => p.id === producto.id);
        if (existente) {
            existente.cantidad++;
        } else {
            this.productos.push({...producto, cantidad: 1});
        }
        this.guardar();
    }

    quitarProducto(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardar();
    }

    vaciar() {
        this.productos = [];
        this.guardar();
    }

    guardar() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
        renderMiniCarrito();
    }

    totalItems() {
        return this.productos.reduce((sum, p) => sum + p.cantidad, 0);
    }

    totalPrecio() {
        return this.productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    }
}

const carrito = new Carrito();
