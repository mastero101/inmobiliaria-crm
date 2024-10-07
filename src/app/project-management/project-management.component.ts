import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Project {
  id: number;
  name: string;
  client: string;
}

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent {
  @ViewChild('projectDialog') projectDialog!: TemplateRef<any>;
  projects: Project[] = [];
  projectName: string = '';
  clientName: string = '';

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.projectDialog);
  }

  addProject() {
    if (this.projectName && this.clientName) {
      this.projects.push({ id: Date.now(), name: this.projectName, client: this.clientName });
      this.projectName = '';
      this.clientName = '';
    }
  }

  removeProject(id: number) {
    this.projects = this.projects.filter(project => project.id !== id);
  }
}
