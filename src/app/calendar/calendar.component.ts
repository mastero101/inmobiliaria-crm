import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../services/eventos.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

interface Task {
  id?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  ubicacion: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentWeekStart: Date;
  currentMonth: number;
  currentYear: number;
  currentView: 'month' | 'week' | 'day' = 'month';
  daysInMonth: { date: number; dayName: string }[];
  selectedDay: { date: number; dayName: string } | null = null;
  isModalOpen: boolean = false;
  selectedTasks: Task[] = []; 
  newTask: Task = { titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '' }; 
  selectedTaskIndex: number | null = null;

  constructor(private eventosService: EventosService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentWeekStart = this.getStartOfWeek(today);
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.loadTasks(); // Cargar tareas desde el backend
  }

  ngOnInit() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    
    this.selectedDay = {
      date: today.getTime(),
      dayName: this.getDayName(today)
    };
    console.log('selectedDay inicializado:', this.selectedDay);
  }

  selectDay(day: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.selectedDay = {
        date: selectedDate.getTime(),
        dayName: this.getDayName(selectedDate)
    };
    
    this.loadTasks();  // Cargar las tareas específicas para el día seleccionado
}

  loadTasks() {
    if (this.selectedDay) {
        const selectedDate = new Date(this.selectedDay.date);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);

        this.eventosService.getEventos().then(tasks => {
            this.selectedTasks = tasks.filter((task: Task) => {
                const taskStart = new Date(task.fechaInicio);
                return taskStart >= startOfDay && taskStart <= endOfDay;
            }).map((task: Task) => ({
                ...task,
                fechaInicio: new Date(task.fechaInicio),
                fechaFin: new Date(task.fechaFin)
            }));
        }).catch(error => console.error('Error al cargar tareas:', error));
    } else {
        this.selectedTasks = [];
    }
  }

  saveTasks() {
  }

  addTask() {
    if (this.newTask.titulo && this.selectedDay) {
      const selectedDate = new Date(this.selectedDay.date);
      
      const fechaInicio = new Date(selectedDate);
      const fechaFin = new Date(selectedDate);
      
      if (typeof this.newTask.fechaInicio === 'string') {
        const [horasInicio, minutosInicio] = this.newTask.fechaInicio.split(':');
        fechaInicio.setHours(parseInt(horasInicio), parseInt(minutosInicio));
      }
      
      if (typeof this.newTask.fechaFin === 'string') {
        const [horasFin, minutosFin] = this.newTask.fechaFin.split(':');
        fechaFin.setHours(parseInt(horasFin), parseInt(minutosFin));
      }
      
      console.log('Fecha de inicio:', fechaInicio);
      console.log('Fecha de fin:', fechaFin);
      
      const evento: Task = {
        ...this.newTask,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString()
      };
      
      if (this.selectedTaskIndex !== null && this.selectedTasks[this.selectedTaskIndex].id !== undefined) {
        // Actualizar tarea existente
        this.eventosService.updateEvento(this.selectedTasks[this.selectedTaskIndex].id!, evento).then(updatedTask => {
          this.selectedTasks[this.selectedTaskIndex!] = updatedTask;
          this.selectedTaskIndex = null;
          this.loadTasks();
        }).catch(error => console.error('Error al actualizar tarea:', error));
      } else {
        // Crear nueva tarea
        this.eventosService.createEvento(evento).then(task => {
          this.selectedTasks.push(task);
          this.loadTasks();
        }).catch(error => console.error('Error al agregar tarea:', error));
      }
      
      this.newTask = { titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '' };
      this.closeModal();
    }
  }

  editTask(task: Task, index: number) {
    // Cargar los datos de la tarea seleccionada en el formulario
    this.newTask = { 
      ...task
    };

    // Guardar el índice de la tarea seleccionada para actualizarla después
    this.selectedTaskIndex = index;

    // Abrir el modal para editar
    this.isModalOpen = true;
  }

  deleteTask(task: Task, index: number) {
    if (task.id !== undefined) {
      this.eventosService.deleteEvento(task.id).then(() => {
        this.selectedTasks.splice(index, 1);
      }).catch(error => {
        console.error('Error al eliminar tarea:', error);
      });
    } else {
      console.error('No se puede eliminar la tarea: ID no válido.');
    }
  }

  getDayName(day: Date | number): string {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    if (day instanceof Date) {
      return dayNames[day.getDay()];
    } else if (typeof day === 'number' && day >= 0 && day < 7) {
      return dayNames[day];
    } else {
      throw new Error('Invalid input for getDayName');
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  getDaysInMonth(month: number, year: number): { date: number; dayName: string }[] {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push({
        date: date.getDate(),
        dayName: this.getDayName(date)
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getDaysInMonthWithNames(month: number, year: number): { date: number, dayName: string }[] {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push({
        date: date.getDate(),
        dayName: this.getDayName(date)
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getDaysInWeek(startDate: Date): number[] {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(startDate).getDate());
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  }
  
  getCurrentWeek(): number[] {
    const today = new Date(this.currentYear, this.currentMonth, 1);
    const startOfWeek = today.getDate() - today.getDay();
    return this.getDaysInWeek(new Date(this.currentYear, this.currentMonth, startOfWeek));
  }

  getCurrentWeekNumber(): number {
    const startOfYear = new Date(this.currentYear, 0, 1);
    const days = Math.floor((new Date(this.currentWeekStart).getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }
  
  getCurrentDay(): number {
    return new Date().getDate();
  }

  getCurrentDayWithName(): { date: number, dayName: string } {
    const today = new Date();
    return {
      date: today.getDate(),
      dayName: this.getDayName(today)
    };
  }

  getDaysInCurrentWeek(): { date: number, dayName: string }[] {
    const days = [];
    const start = new Date(this.currentWeekStart);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    for (let i = 0; i < 7; i++) {
      days.push({
        date: new Date(start).getDate(),
        dayName: dayNames[start.getDay()]
      });
      start.setDate(start.getDate() + 1);
    }
    return days;
  }

  changeMonth(offset: number) {
    this.currentMonth += offset;
    if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
    } else if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
    }
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.updateSelectedDay();
    this.loadTasks();
  }

  updateSelectedDay() {
    if (this.selectedDay) {
      const updatedDate = new Date(this.currentYear, this.currentMonth, 1);
      this.selectedDay = {
        date: updatedDate.getTime(),
        dayName: this.getDayName(updatedDate)
      };
    }
  }

  changeView(offset: number) {
    if (this.currentView === 'month') {
      this.changeMonth(offset);
    } else if (this.currentView === 'week') {
      this.changeWeek(offset);
    } else if (this.currentView === 'day') {
      this.changeDay(offset);
    }
  }
  
  changeWeek(offset: number) {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (offset * 7));
    this.currentMonth = this.currentWeekStart.getMonth();
    this.currentYear = this.currentWeekStart.getFullYear();
  }
  
  changeDay(offset: number) {
    const today = new Date(this.currentYear, this.currentMonth, 1);
    today.setDate(today.getDate() + offset);
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  setView(view: 'month' | 'week' | 'day') {
    this.currentView = view;
  }

  openModal(day: number | { date: number; dayName: string }) {
    let selectedDate: Date;

    if (typeof day === 'number') {
        // Si day es un número, asumimos que es el día del mes actual
        selectedDate = new Date(this.currentYear, this.currentMonth, day);
    } else {
        // Si day es un objeto, creamos una nueva fecha con el año, mes y día actuales
        selectedDate = new Date(this.currentYear, this.currentMonth, day.date);
    }

    this.selectedDay = {
        date: selectedDate.getTime(),
        dayName: this.getDayName(selectedDate)
    };

    this.loadTasks();  // Cargar las tareas del día seleccionado
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false; // Cerrar el modal
    this.selectedDay = null; // Reiniciar el día seleccionado
  }

  formatSelectedDate(): string {
    if (this.selectedDay) {
      const date = new Date(this.selectedDay.date);
      return `${this.selectedDay.dayName} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    return '';
  }

  formatTime(date: string | Date): string {
    if (typeof date === 'string') {
      // Si es una cadena ISO, conviértala a Date
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}