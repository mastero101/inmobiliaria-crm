import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Renta {
  id: number;
  titulo: string;
  precioMensual: number;
  imagen: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  habitaciones: number;
  banos: number;
  superficie: number;
  tipo: string;
  propietario: string;
  fechaDisponibilidad: string;
  amueblado: boolean;
  mascotasPermitidas: boolean;
  mapaUrl: string;
  safeMapaUrl: SafeResourceUrl;
  ocupado: boolean;
}

@Component({
  selector: 'app-rentas',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './rentas.component.html',
  styleUrls: ['./rentas.component.scss']
})
export class RentasComponent implements OnInit {
  rentas: Renta[] = [];
  rentasFiltradas: Renta[] = [];
  rentasPaginadas: Renta[] = [];
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 1;
  mostrarFiltros: boolean = false;
  filtroTipo: string = '';
  filtroPrecio: number | null = null;
  filtroUbicacion: string = '';
  tipos: string[] = ['CASA'];
  filtroEstado: string = '';
  selectedRenta!: Renta;
  isModalOpen = false;
  isEditing = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.rentas = this.generarRentasAleatorias(50);
    this.rentasFiltradas = this.rentas;
    this.actualizarPaginacion();
  }

  generarRentasAleatorias(cantidad: number): Renta[] {
    const rentas: Renta[] = [];
    const tipos = ['CASA'];
    const ciudades = ['Culiacán', 'Mérida', 'Cancún', 'Carmen', 'Progreso'];
    const propietarios = ['Juan Pérez', 'María González', 'Carlos Rodríguez', 'Laura Martínez', 'Pedro Sánchez'];

    const coordenadasBase = { lat: 20.0, lng: -89.0 };
    const radioGrados = 1.5;

    for (let i = 0; i < cantidad; i++) {
      const ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
      const latitud = coordenadasBase.lat + (Math.random() - 0.5) * 2 * radioGrados;
      const longitud = coordenadasBase.lng + (Math.random() - 0.5) * 2 * radioGrados;
      
      const mapaUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud-0.05},${latitud-0.05},${longitud+0.05},${latitud+0.05}&layer=mapnik&city=${ciudad}`;
      
      const renta: Renta = {
        id: i + 1,
        titulo: `Renta ${i + 1} en ${ciudad}`,
        precioMensual: Math.floor(Math.random() * 15000) + 5000,
        imagen: `https://picsum.photos/300/200?random=${i}&city`,
        ubicacion: `${ciudad}, ${ciudad}, México`,
        latitud: latitud,
        longitud: longitud,
        habitaciones: Math.floor(Math.random() * 3) + 1,
        banos: Math.floor(Math.random() * 2) + 1,
        superficie: Math.floor(Math.random() * 100) + 30,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        propietario: propietarios[Math.floor(Math.random() * propietarios.length)],
        fechaDisponibilidad: this.generarFechaAleatoria(),
        amueblado: Math.random() < 0.5,
        mascotasPermitidas: Math.random() < 0.3,
        mapaUrl: mapaUrl,
        safeMapaUrl: this.sanitizer.bypassSecurityTrustResourceUrl(mapaUrl),
        ocupado: Math.random() < 0.3
      };
      rentas.push(renta);
    }
    return rentas;
  }

  generarFechaAleatoria(): string {
    const hoy = new Date();
    const diasAleatorios = Math.floor(Math.random() * 60);
    const fechaDisponibilidad = new Date(hoy.getTime() + diasAleatorios * 24 * 60 * 60 * 1000);
    return fechaDisponibilidad.toLocaleDateString();
  }

  buscarRentas() {
    this.rentasFiltradas = this.rentas.filter(renta =>
      renta.titulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      renta.ubicacion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.rentasFiltradas.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.rentasPaginadas = this.rentasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  filtrarRentas() {
    this.rentasFiltradas = this.rentas.filter(renta => {
      const cumpleTipo = this.filtroTipo ? renta.tipo === this.filtroTipo : true;
      const cumplePrecio = this.filtroPrecio ? renta.precioMensual <= this.filtroPrecio : true;
      const cumpleUbicacion = this.filtroUbicacion ? renta.ubicacion.toLowerCase().includes(this.filtroUbicacion.toLowerCase()) : true;
      const cumpleEstado = this.filtroEstado ? (this.filtroEstado === 'disponible' ? !renta.ocupado : renta.ocupado) : true;

      return cumpleTipo && cumplePrecio && cumpleUbicacion && cumpleEstado;
    });
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  abrirModal(renta: Renta): void {
    this.selectedRenta = renta;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  abrirEdicion(renta: Renta): void {
    this.selectedRenta = { ...renta };
    this.isEditing = true;
  }

  guardarCambios(): void {
    const index = this.rentas.findIndex(r => r.id === this.selectedRenta.id);
    if (index !== -1) {
      this.rentas[index] = this.selectedRenta;
    }
    this.isEditing = false;
  }

  cancelarEdicion(): void {
    this.isEditing = false;
  }
}
