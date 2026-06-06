import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {

  mensajeToast = '';
  modoEdicion = false;
  productoEditandoId: number | null = null;
  modalInstancia: any = null;

  formulario = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: ''
  };

  errores = {
    nombre: false,
    descripcion: false,
    precio: false,
    stock: false,
    categoria: false
  };

  productos: Producto[] = [
    { id: 1, nombre: 'Laptop', descripcion: 'HP Ryzen 5', precio: 15000, stock: 10, categoria: 'Computación' },
    { id: 2, nombre: 'Mouse', descripcion: 'Mouse inalámbrico', precio: 250, stock: 50, categoria: 'Accesorios' }
  ];

  abrirModalAgregar() {
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.resetFormulario();
    this.abrirModal();
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;
    this.formulario = { ...producto };
    this.resetErrores();
    this.abrirModal();
  }

  abrirModal() {
    const el = document.getElementById('productoModal');
    if (el) {
      this.modalInstancia = new (window as any).bootstrap.Modal(el);
      this.modalInstancia.show();
    }
  }

  cerrarModal() {
    this.modalInstancia?.hide();
  }

  validar(): boolean {
    this.errores = {
      nombre: !this.formulario.nombre.trim(),
      descripcion: !this.formulario.descripcion.trim(),
      precio: this.formulario.precio <= 0,
      stock: this.formulario.stock <= 0,
      categoria: !this.formulario.categoria.trim()
    };
    return !Object.values(this.errores).some(e => e);
  }

  guardar() {
    if (!this.validar()) return;

    if (this.modoEdicion && this.productoEditandoId !== null) {
      const index = this.productos.findIndex(p => p.id === this.productoEditandoId);
      if (index !== -1) {
        this.productos[index] = { id: this.productoEditandoId, ...this.formulario };
        this.mostrarToast('Producto guardado correctamente');
      }
    } else {
      const nuevoId = this.productos.length
        ? Math.max(...this.productos.map(p => p.id)) + 1
        : 1;
      this.productos.push({ id: nuevoId, ...this.formulario });
      this.mostrarToast('Producto agregado correctamente');
    }

    this.cerrarModal();
    this.resetFormulario();
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.mostrarToast('Producto eliminado exitosamente');
  }

  resetFormulario() {
    this.formulario = { nombre: '', descripcion: '', precio: 0, stock: 0, categoria: '' };
    this.resetErrores();
  }

  resetErrores() {
    this.errores = { nombre: false, descripcion: false, precio: false, stock: false, categoria: false };
  }

  mostrarToast(mensaje: string) {
    this.mensajeToast = mensaje;

    setTimeout(() => {
      const toastElement = document.getElementById('miToast');
      if (toastElement) {
        const toastExistente = (window as any).bootstrap.Toast.getInstance(toastElement);
        if (toastExistente) {
          toastExistente.dispose();
        }
        const toast = new (window as any).bootstrap.Toast(toastElement, {
          delay: 3000
        });
        toast.show();
      }
    }, 100);
  }
}
