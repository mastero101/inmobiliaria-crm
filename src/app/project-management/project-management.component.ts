import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


interface Project {
  id: number;
  name: string;
  client: string;
  startDate: Date;
  status: string;
  statusHistory: { status: string; date: Date }[];
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
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent {
  @ViewChild('projectDialog') projectDialog!: TemplateRef<any>;
  @ViewChild('projectDetailDialog') projectDetailDialog!: TemplateRef<any>;
  @ViewChild('editProjectDialog') editProjectDialog!: TemplateRef<any>;
  projects: Project[] = [];
  editingProject: any = {};
  projectName: string = '';
  clientName: string = '';
  projectStatus: string = '';
  startDate: Date | null = null;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.projectDialog);
  }

  addProject() {
  if (this.projectName && this.clientName && this.startDate && this.projectStatus) {
    this.projects.push({
      id: Date.now(),
      name: this.projectName,
      client: this.clientName,
      startDate: this.startDate,
      status: this.projectStatus,
      statusHistory: [{ status: this.projectStatus, date: new Date() }]
    });
      this.projectName = '';
      this.clientName = '';
      this.startDate = null;
      this.projectStatus = '';
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  openProjectDetailDialog(project: Project) {
    this.dialog.open(this.projectDetailDialog, {
      width: '90%',
      maxWidth: '600px',
      data: project
    });
  }

  openEditDialog(project: any) {
    this.editingProject = {...project};
    const dialogRef = this.dialog.open(this.editProjectDialog);
    dialogRef.afterClosed().subscribe(result => {
      // Handle any post-close actions if needed
    });
  }

  saveProject() {
    // Update the project in your data source (e.g., API call or local update)
    const index = this.projects.findIndex(p => p.id === this.editingProject.id);
    if (index !== -1) {
      this.projects[index] = {...this.editingProject};
    }
    this.closeEditDialog();
  }

  deleteProject(id: number) {
    // Remove the project from your data source
    this.projects = this.projects.filter(p => p.id !== id);
    this.closeEditDialog();
  }

  closeEditDialog() {
    this.dialog.closeAll();
  }
}

