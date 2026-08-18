import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project';
import { Project } from '../../models/projects';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnChanges {
  private projectService = inject(ProjectService);

  @Input() projectToEdit: Project | null = null;
  @Output() formSubmitted = new EventEmitter<void>();

  name = '';
  description = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectToEdit']) {
      if (this.projectToEdit) {
        this.name = this.projectToEdit.name;
        this.description = this.projectToEdit.description;
      } else {
        this.resetForm();
      }
    }
  }

  onSubmit(): void {
    if (!this.name.trim()) {
      return;
    }

    const projectData: Partial<Project> = {
      name: this.name,
      description: this.description
    };

    const request$ = this.projectToEdit
      ? this.projectService.updateProject(this.projectToEdit.id, projectData)
      : this.projectService.createProject(projectData);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.formSubmitted.emit();
      },
      error: (err) => console.error('Erro ao salvar projeto:', err)
    });
  }

  onCancel(): void {
    this.resetForm();
    this.formSubmitted.emit();
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
  }
}