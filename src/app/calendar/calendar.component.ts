import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  description: string;
  time: string;
  date: number;
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
export class CalendarComponent {
  currentWeekStart: Date;
  currentMonth: number;
  currentYear: number;
  currentView: 'month' | 'week' | 'day' = 'month';
  daysInMonth: number[];
  selectedDay: { date: number; dayName: string } | null = null;
  isModalOpen: boolean = false;
  selectedTasks: Task[] = []; // Cambia el tipo para incluir 'date'
  newTask: Task = { description: '', time: '', date: 0 }; // Incluye 'date' en la inicialización

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentWeekStart = this.getStartOfWeek(today);
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.loadTasks(); // Cargar tareas desde localStorage
  }

  loadTasks() {
    if (typeof window !== 'undefined') { // Verificar si estamos en el navegador
      const tasks = localStorage.getItem('tasks');
      if (tasks) {
        const allTasks: Task[] = JSON.parse(tasks); // Asegurarse de que sea un arreglo de Task
        this.selectedTasks = allTasks.filter(task => task.date === this.selectedDay?.date); // Filtrar tareas por fecha
        console.log('Tareas cargadas desde localStorage:', this.selectedTasks); // Verificar que se carguen
      }
    }
  }

  saveTasks() {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Filtrar las tareas que corresponden al día seleccionado
    const updatedTasks = tasks.filter(task => task.date !== this.selectedDay?.date);
    
    // Agregar las tareas actuales
    updatedTasks.push(...this.selectedTasks);
    
    // Guardar las tareas actualizadas en localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  getDayName(date: Date): string {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[date.getDay()];
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

  openModal(day: { date: number, dayName: string }) {
    this.selectedDay = day; // Guardar el día seleccionado
    this.loadTasks(); // Cargar tareas para el día
    this.isModalOpen = true; // Abrir el modal
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

  addTask() {
    if (this.newTask.description) {
      const taskWithDate: Task = {
        ...this.newTask,
        date: this.selectedDay?.date ?? 0 // Asocia la tarea con el día seleccionado, usando 0 si es undefined
      };
      this.selectedTasks.push(taskWithDate); // Agregar la nueva tarea
      this.saveTasks(); // Guardar tareas en localStorage
      this.newTask = { description: '', time: '', date: 0 }; // Limpiar el campo de entrada
    }
  }

  editTask(index: number) {
    const taskToEdit = this.selectedTasks[index];
    this.newTask = { ...taskToEdit }; // Cargar la tarea en el campo de entrada
    this.selectedTasks.splice(index, 1); // Eliminar la tarea de la lista
    this.saveTasks(); // Guardar cambios en localStorage
  }

  deleteTask(index: number) {
    if (index > -1) {
      this.selectedTasks.splice(index, 1); // Eliminar la tarea del array
      this.saveTasks(); // Guardar cambios en localStorage
    }
  }
}
