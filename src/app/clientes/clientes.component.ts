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
  editando?: boolean;
}

@Component({
  selector: 'app-clientes',
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
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  dataSource = new MatTableDataSource<Cliente>();
  displayedColumns: string[] = ['id', 'nombre', 'email', 'telefono', 'acciones'];
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    if (this.isBrowser) {
      const clientesGuardados = localStorage.getItem('clientes');
      if (clientesGuardados) {
        this.dataSource.data = JSON.parse(clientesGuardados);
      } else {
        // Clientes de ejemplo si no hay nada en localStorage
        this.dataSource.data = [
          { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '123-456-7890' },
          { id: 2, nombre: 'María García', email: 'maria@example.com', telefono: '098-765-4321' }
        ];
        this.guardarClientes();
      }
    } else {
      // Si no estamos en el navegador, usamos los clientes de ejemplo
      this.dataSource.data = [
        { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '123-456-7890' },
        { id: 2, nombre: 'María García', email: 'maria@example.com', telefono: '098-765-4321' }
      ];
    }
  }

  guardarClientes(): void {
    if (this.isBrowser) {
      localStorage.setItem('clientes', JSON.stringify(this.dataSource.data));
    }
  }

  agregarCliente(): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '250px',
      data: { titulo: 'Agregar Cliente', cliente: {} }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoId = this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(c => c.id)) + 1 : 1;
        const nuevoCliente: Cliente = {
          id: nuevoId,
          ...result
        };
        this.dataSource.data = [...this.dataSource.data, nuevoCliente];
        this.guardarClientes();
      }
    });
  }

  editarCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '250px',
      data: { titulo: 'Editar Cliente', cliente: {...cliente} }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
          this.dataSource.data[index] = { ...cliente, ...result };
          this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
          this.guardarClientes();
        }
      }
    });
  }

  finalizarEdicion(cliente: Cliente): void {
    cliente.editando = false;
    this.guardarClientes();
  }

  confirmarEliminar(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { nombre: cliente.nombre }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarCliente(cliente);
      }
    });
  }

  eliminarCliente(cliente: Cliente): void {
    this.dataSource.data = this.dataSource.data.filter(c => c.id !== cliente.id);
    this.guardarClientes();
  }
}

@Component({
  selector: 'app-cliente-dialog',
  template: `
    <h2 mat-dialog-title>{{data.titulo}}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="data.cliente.nombre" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.cliente.email" required type="email">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Teléfono</mat-label>
        <input matInput [(ngModel)]="data.cliente.telefono" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="null">Cancelar</button>
      <button mat-button [mat-dialog-close]="data.cliente" [disabled]="!data.cliente.nombre || !data.cliente.email || !data.cliente.telefono">Guardar</button>
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
export class ClienteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string, cliente: Partial<Cliente> }) {}
}

@Component({
  selector: 'app-confirm-dialog',
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
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { nombre: string }) {}
}