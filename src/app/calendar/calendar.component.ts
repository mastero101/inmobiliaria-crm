import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../services/eventos.service'; // Importa el servicio

interface Task {
  id?: number; // Asegúrate de incluir el ID para las operaciones de actualización y eliminación
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
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentWeekStart: Date;
  currentMonth: number;
  currentYear: number;
  currentView: 'month' | 'week' | 'day' = 'month';
  daysInMonth: number[];
  selectedDay: { date: number; dayName: string } | null = null;
  isModalOpen: boolean = false;
  selectedTasks: Task[] = []; // Cambia el tipo para incluir 'date'
  newTask: Task = { titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '' }; // Incluye 'date' en la inicialización

  constructor(private eventosService: EventosService) { // Inyecta el servicio
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentWeekStart = this.getStartOfWeek(today);
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.loadTasks(); // Cargar tareas desde el backend
  }

  ngOnInit() {
    const today = new Date();
    this.selectedDay = {
      date: today.getTime(),
      dayName: this.getDayName(today)
    };
    console.log('selectedDay inicializado:', this.selectedDay);
    // ... otro código de inicialización
  }

  selectDay(day: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const selectedDay = {
      date: selectedDate.getTime(), // Esto es un timestamp válido
      dayName: this.getDayName(selectedDate)
    };
    this.openModal(selectedDay);
  }

  loadTasks() {
    if (!this.selectedDay) {
      console.error('No hay un día seleccionado');
      return;
    }

    const selectedDate = new Date(this.selectedDay.date);
  
    this.eventosService.getEventos().then((tasks: Task[]) => {
      this.selectedTasks = tasks.filter((task: Task) => {
        if (task.fechaInicio) {
          const taskDate = new Date(task.fechaInicio);
          return taskDate.toDateString() === selectedDate.toDateString();
        }
        return false;
      });
      console.log('Tareas cargadas desde el backend:', this.selectedTasks);
    }).catch(error => {
      console.error('Error al cargar tareas:', error);
    });
  }

  saveTasks() {
    // Este método ya no es necesario si estamos usando el backend para todas las operaciones
  }

  addTask() {
    if (this.newTask.descripcion && this.selectedDay) {
      const eventDate = new Date(this.selectedDay.date);

      const evento = {
        titulo: this.newTask.titulo,
        descripcion: this.newTask.descripcion,
        fechaInicio: eventDate.toISOString(),
        fechaFin: eventDate.toISOString(),
        ubicacion: this.newTask.ubicacion
      };

      this.eventosService.createEvento(evento).then(task => {
        this.selectedTasks.push(task);
        this.newTask = { titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '' };
        this.loadTasks();
      }).catch(error => {
        console.error('Error al agregar tarea:', error);
      });
    } else {
      console.error('No se puede agregar la tarea: descripción o día seleccionado no válidos.');
    }
  }

  editTask(task: Task, index: number) {
    console.log('Editando tarea:', task);
    // Implementa aquí la lógica para editar la tarea
    // Por ejemplo, podrías abrir un modal de edición o navegar a una página de edición
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

  getDaysInMonth(month: number, year: number): number[] {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(date.getDate());
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

  openModal(day: { date: number; dayName: string }) {
    // Asegúrate de que day.date sea un timestamp válido
    const currentDate = new Date();
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
    this.selectedDay = {
      date: selectedDate.getTime(),
      dayName: this.getDayName(selectedDate)
    };
    console.log('Día seleccionado en openModal:', this.selectedDay);
    this.loadTasks();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false; // Cerrar el modal
    this.selectedDay = null; // Reiniciar el día seleccionado
  }

  getTasksForDay(date: number): { description: string; time: string }[] {
    // Aquí deberías implementar la lógica para obtener las tareas del día
    // Ejemplo de tareas
    return [
      { description: 'Tarea 1', time: '10:00' },
      { description: 'Tarea 2', time: '14:00' }
    ];
  }

  formatSelectedDate(): string {
    if (this.selectedDay) {
      const date = new Date(this.selectedDay.date);
      return `${this.selectedDay.dayName} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return '';
  }
}