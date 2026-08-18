import { Component, OnChanges, SimpleChanges, signal, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { Project } from '../../models/projects';
import { Task } from '../../models/tasks';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnChanges {
  private taskService = inject(TaskService);
  projectService = inject(ProjectService);

  @Input() taskToEdit: Task | null = null;
  @Output() formSubmitted = new EventEmitter<void>();

  title = '';
  description = '';
  selectedProjectId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit']) {
      if (this.taskToEdit) {
        this.title = this.taskToEdit.title;
        this.description = this.taskToEdit.description;
        this.selectedProjectId = this.taskToEdit.project;
      } else {
        this.resetForm();
      }
    }
  }

  onSubmit(): void {
    if (this.selectedProjectId === null) {
      return;
    }

    const taskData: Partial<Task> = {
      title: this.title,
      description: this.description,
      project: this.selectedProjectId
    };

    const request$ = this.taskToEdit
      ? this.taskService.updateTask(this.taskToEdit.id, taskData)
      : this.taskService.createTask(taskData);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.formSubmitted.emit();
      },
      error: (err) => console.error('Erro ao salvar task:', err)
    });
  }

  onCancel(): void {
    this.resetForm();
    this.formSubmitted.emit();
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.selectedProjectId = null;
  }
}