import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Propiedad {
  id: number;
  titulo: string;
  precio: number;
  imagen: string;
  ubicacion: string;
  habitaciones: number;
  banos: number;
  superficie: number;
  tipo: string;
  vendedor: string;
  fechaPublicacion: string;
  destacado: boolean;
  vendida: boolean;
  mapaUrl: string;
  safeMapaUrl: SafeResourceUrl;
  estacionamientos?: number;
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss']
})
export class PropiedadesComponent implements OnInit {
  propiedades: Propiedad[] = [];
  propiedadesFiltradas: Propiedad[] = [];
  propiedadesPaginadas: Propiedad[] = [];
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 1;
  filtroTipo: string = '';
  filtroPrecio: number | null = null;
  filtroUbicacion: string = '';
  tipos: string[] = ['RESIDENCIAL', 'APARTAMENTO', 'MULTI FAMILIAR', 'COMERCIAL'];
  mostrarFiltros: boolean = false; // Estado inicial de los filtros

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.propiedades = this.generarPropiedadesAleatorias(50);
    this.propiedadesFiltradas = this.propiedades;
    this.actualizarPaginacion();
  }

  buscarPropiedades() {
    this.propiedadesFiltradas = this.propiedades.filter(propiedad =>
      propiedad.titulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      propiedad.ubicacion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.propiedadesFiltradas.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.propiedadesPaginadas = this.propiedadesFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  generarPropiedadesAleatorias(cantidad: number): Propiedad[] {
    const propiedades: Propiedad[] = [];
    const tipos = ['RESIDENCIAL', 'APARTAMENTO', 'MULTI FAMILIAR', 'COMERCIAL'];
    const ciudades = ['Mérida', 'Cancún', 'Carmen', 'Campeche'];
    const vendedores = ['Marcos Lara', 'Clara Suarez', 'Daniel Lara', 'Ana Gómez', 'Roberto Sánchez'];

    // Coordenadas aproximadas de la Península de Yucatán
    const centroLatitud = 20.0;
    const centroLongitud = -89.0;
    const radioGrados = 1.5;

    for (let i = 0; i < cantidad; i++) {
      const ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
      const latitud = centroLatitud + (Math.random() - 0.5) * 2 * radioGrados;
      const longitud = centroLongitud + (Math.random() - 0.5) * 2 * radioGrados;
      
      const mapaUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud-0.05},${latitud-0.05},${longitud+0.05},${latitud+0.05}&layer=mapnik`;
      
      const propiedad: Propiedad = {
        id: i + 1,
        titulo: `Propiedad ${i + 1} en ${ciudad}`,
        precio: Math.floor(Math.random() * 1000000) + 500000,
        imagen: `https://picsum.photos/300/200?random=${i}`,
        ubicacion: `${ciudad}, ${ciudad}, México`,
        latitud: latitud,
        longitud: longitud,
        habitaciones: Math.floor(Math.random() * 4) + 1,
        banos: Math.floor(Math.random() * 3) + 1,
        superficie: Math.floor(Math.random() * 150) + 50,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        vendedor: vendedores[Math.floor(Math.random() * vendedores.length)],
        fechaPublicacion: `${Math.floor(Math.random() * 12) + 1} meses hace`,
        destacado: Math.random() < 0.5,
        vendida: Math.random() < 0.5,
        mapaUrl: mapaUrl,
        safeMapaUrl: this.sanitizer.bypassSecurityTrustResourceUrl(mapaUrl),
        estacionamientos: Math.floor(Math.random() * 3)
      };
      propiedades.push(propiedad);
    }
    return propiedades;
  }

  filtrarPropiedades() {
    this.propiedadesFiltradas = this.propiedades.filter(propiedad => {
      const cumpleTipo = this.filtroTipo ? propiedad.tipo === this.filtroTipo : true;
      const cumplePrecio = this.filtroPrecio ? propiedad.precio <= this.filtroPrecio : true;
      const cumpleUbicacion = this.filtroUbicacion ? propiedad.ubicacion.toLowerCase().includes(this.filtroUbicacion.toLowerCase()) : true;

      return cumpleTipo && cumplePrecio && cumpleUbicacion;
    });
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros; // Cambia el estado de los filtros
  }
}
