import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';

interface ModuleStatus {
  name: string;
  status: 'Activo' | 'Inactivo';
}

interface RecentClient {
  name: string;
  date: string;
}

interface UrgentProperty {
  address: string;
  dueDate: string;
}

interface InternalNotice {
  id: number;
  message: string;
  date: string;
  priority: 'alta' | 'media' | 'baja';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ScrollPanelModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  barChartData: any;
  pieChartData: any;
  moduleStatuses: ModuleStatus[];
  recentClients: RecentClient[];
  urgentProperties: UrgentProperty[];
  internalNotices: InternalNotice[];
  chartOptions: any;

  constructor() {
    this.barChartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Ventas 2023',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            '#FF6384', // Enero
            '#36A2EB', // Febrero
            '#FFCE56', // Marzo
            '#4BC0C0', // Abril
            '#9966FF', // Mayo
            '#FF9F40', // Junio
            '#FF6384'  // Julio
          ],
          borderColor: '#fff', // Color del borde
          borderWidth: 1
        }
      ]
    };

    this.pieChartData = {
      labels: ['Residencial', 'Comercial', 'Industrial'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };

    this.moduleStatuses = [
      { name: 'Clientes', status: 'Activo' },
      { name: 'Propiedades', status: 'Activo' },
      { name: 'Ventas', status: 'Activo' },
      { name: 'Reportes', status: 'Inactivo' },
    ];

    this.recentClients = [
      { name: 'Juan Pérez', date: '2023-11-15' },
      { name: 'María García', date: '2023-11-14' },
      { name: 'Carlos López', date: '2023-11-13' },
    ];

    this.urgentProperties = [
      { address: 'Calle Principal 123', dueDate: '2023-11-20' },
      { address: 'Avenida Central 456', dueDate: '2023-11-22' },
      { address: 'Plaza Mayor 789', dueDate: '2023-11-25' },
    ];

    this.internalNotices = [
      { id: 1, message: 'Reunión de equipo mañana a las 10:00 AM', date: '2023-11-16', priority: 'alta' },
      { id: 2, message: 'Nuevo sistema de gestión de propiedades disponible', date: '2023-11-15', priority: 'media' },
      { id: 3, message: 'Recordatorio: Actualizar perfiles de clientes', date: '2023-11-14', priority: 'baja' },
      { id: 4, message: 'Mantenimiento programado del sistema este fin de semana', date: '2023-11-13', priority: 'alta' },
    ];
  }

  ngOnInit() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10
          }
        }
      }
    };
  }
}
