import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

interface Vendedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  clientes: Cliente[];
  mostrarClientes?: boolean;
  editando?: boolean;
}

@Component({
  selector: 'app-vendedores',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss']
})
export class VendedoresComponent implements OnInit {
  dataSource = new MatTableDataSource<Vendedor>();
  displayedColumns: string[] = ['id', 'nombre', 'email', 'telefono', 'acciones'];
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarVendedores();
  }

  cargarVendedores(): void {
    if (this.isBrowser) {
      const vendedoresGuardados = localStorage.getItem('vendedores');
      if (vendedoresGuardados) {
        this.dataSource.data = JSON.parse(vendedoresGuardados);
      } else {
        // Vendedores de ejemplo si no hay nada en localStorage
        this.dataSource.data = [
          { 
            id: 1, 
            nombre: 'Carlos López', 
            email: 'carlos@example.com', 
            telefono: '123-456-7890', 
            clientes: [
              { id: 1, nombre: 'Cliente 1', email: 'cliente1@example.com', telefono: '111-111-1111' },
              { id: 2, nombre: 'Cliente 2', email: 'cliente2@example.com', telefono: '222-222-2222' }
            ] 
          },
          { 
            id: 2, 
            nombre: 'Ana Martínez', 
            email: 'ana@example.com', 
            telefono: '098-765-4321', 
            clientes: [
              { id: 3, nombre: 'Cliente 3', email: 'cliente3@example.com', telefono: '333-333-3333' },
              { id: 4, nombre: 'Cliente 4', email: 'cliente4@example.com', telefono: '444-444-4444' }
            ] 
          }
        ];
        this.guardarVendedores();
      }
    } else {
      // Si no estamos en el navegador, usamos los vendedores de ejemplo
      this.dataSource.data = [
        { 
          id: 1, 
          nombre: 'Carlos López', 
          email: 'carlos@example.com', 
          telefono: '123-456-7890', 
          clientes: [
            { id: 1, nombre: 'Cliente 1', email: 'cliente1@example.com', telefono: '111-111-1111' },
            { id: 2, nombre: 'Cliente 2', email: 'cliente2@example.com', telefono: '222-222-2222' }
          ] 
        },
        { 
          id: 2, 
          nombre: 'Ana Martínez', 
          email: 'ana@example.com', 
          telefono: '098-765-4321', 
          clientes: [
            { id: 3, nombre: 'Cliente 3', email: 'cliente3@example.com', telefono: '333-333-3333' },
            { id: 4, nombre: 'Cliente 4', email: 'cliente4@example.com', telefono: '444-444-4444' }
          ] 
        }
      ];
    }
  }

  guardarVendedores(): void {
    if (this.isBrowser) {
      localStorage.setItem('vendedores', JSON.stringify(this.dataSource.data));
    }
  }

  agregarVendedor(): void {
    const dialogRef = this.dialog.open(VendedorDialogComponent, {
      width: '250px',
      data: { titulo: 'Agregar Vendedor', vendedor: { clientes: [] } }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoId = this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(c => c.id)) + 1 : 1;
        const nuevoVendedor: Vendedor = {
          id: nuevoId,
          ...result
        };
        this.dataSource.data = [...this.dataSource.data, nuevoVendedor];
        this.guardarVendedores();
      }
    });
  }

  editarVendedor(vendedor: Vendedor): void {
    const dialogRef = this.dialog.open(VendedorDialogComponent, {
      width: '250px',
      data: { titulo: 'Editar Vendedor', vendedor: {...vendedor} }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(c => c.id === vendedor.id);
        if (index !== -1) {
          this.dataSource.data[index] = { ...vendedor, ...result };
          this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
          this.guardarVendedores();
        }
      }
    });
  }

  confirmarEliminar(vendedor: Vendedor): void {
    const dialogRef = this.dialog.open(VendedorConfirmDialogComponent, {
      width: '250px',
      data: { nombre: vendedor.nombre }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarVendedor(vendedor);
      }
    });
  }

  eliminarVendedor(vendedor: Vendedor): void {
    this.dataSource.data = this.dataSource.data.filter(c => c.id !== vendedor.id);
    this.guardarVendedores();
  }

  toggleClientes(vendedor: Vendedor): void {
    vendedor.mostrarClientes = !vendedor.mostrarClientes;
  }
}

@Component({
  selector: 'app-vendedor-dialog',
  template: `
    <h2 mat-dialog-title>{{data.titulo}}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="data.vendedor.nombre" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.vendedor.email" required type="email">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Teléfono</mat-label>
        <input matInput [(ngModel)]="data.vendedor.telefono" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="null">Cancelar</button>
      <button mat-button [mat-dialog-close]="data.vendedor" [disabled]="!data.vendedor.nombre || !data.vendedor.email || !data.vendedor.telefono">Guardar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class VendedorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string, vendedor: Partial<Vendedor> }) {}
}

@Component({
  selector: 'app-vendedor-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>
      ¿Estás seguro de que quieres eliminar a {{data.nombre}}?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Eliminar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class VendedorConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { nombre: string }) {}
}
