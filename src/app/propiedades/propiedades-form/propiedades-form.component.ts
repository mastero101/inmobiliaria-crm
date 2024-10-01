import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-propiedades-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './propiedades-form.component.html',
  styleUrl: './propiedades-form.component.scss'
})
export class PropiedadesFormComponent implements OnInit {
  propiedades: any[] = []; 
  propiedadesFiltradas: any[] = []; 
  propiedadForm: FormGroup;
  editIndex: number | null = null; 
  isEditing: boolean = false; 
  showFilters: boolean = false; 
  tipos: string[] = ['RESIDENCIAL', 'APARTAMENTO', 'MULTI FAMILIAR', 'COMERCIAL'];

  constructor(private fb: FormBuilder) {
    this.propiedadForm = this.fb.group({
      titulo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      ubicacion: ['', Validators.required],
      habitaciones: ['', [Validators.required, Validators.min(0)]],
      banos: ['', [Validators.required, Validators.min(0)]],
      superficie: ['', [Validators.required, Validators.min(0)]],
      tipo: ['', Validators.required],
      vendedor: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
    });

    // Inicializar propiedades filtradas
    this.propiedadesFiltradas = this.propiedades;
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesario
  }

  // Método para filtrar propiedades
  filtrarPropiedades(event: Event) {
    const input = event.target as HTMLInputElement; // Casting a HTMLInputElement
    const busqueda = input.value; // Obtener el valor del input
    this.propiedadesFiltradas = this.propiedades.filter(propiedad =>
      propiedad.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // Método para mostrar/ocultar filtros
  mostrarFiltros() {
    this.showFilters = !this.showFilters;
  }

  // Método para crear o editar una propiedad
  guardarPropiedad() {
    if (this.propiedadForm.valid) {
      const propiedadData = this.propiedadForm.value;
      // Lógica para enviar propiedadData al backend
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  // Método para eliminar una propiedad
  eliminarPropiedad(index: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      this.propiedades.splice(index, 1);
      this.propiedadesFiltradas = this.propiedades; // Actualizar lista filtrada
    }
  }

  // Método para editar una propiedad
  editarPropiedad(index: number) {
    this.editIndex = index;
    this.isEditing = true; // Cambiar a modo edición
    this.propiedadForm.patchValue(this.propiedades[index]);
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.propiedadForm.reset();
    this.editIndex = null;
    this.isEditing = true; // Volver a modo agregar
  }
}
