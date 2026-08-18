import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { ProjectForm } from '../project-form/project-form';
import { Project } from '../../models/projects';
import { Task } from '../../models/tasks';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ProjectForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  private taskService = inject(TaskService);
  projectService = inject(ProjectService);

  tasks = this.taskService.tasks;

  editingTask = signal<Task | null>(null);
  editingProject = signal<Project | null>(null);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  selectedProject = signal<number | null>(null);

  setProject(projectId: number | null): void {
    this.selectedProject.set(projectId);
  }

  filteredTasks = computed(() => {
    const projectId = this.selectedProject();
    const currentFilter = this.filter();

    let tasks = this.tasks();

    if (projectId !== null) {
      tasks = tasks.filter(task => task.project === projectId);
    }

    if (currentFilter === 'pending') {
      tasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === 'completed') {
      tasks = tasks.filter(task => task.completed);
    }

    return tasks;
  });

  ngOnInit(): void {
    this.taskService.loadTasks();

    this.projectService.getProjects().subscribe({
      error: (err) => console.error('Erro ao buscar projects:', err)
    });
  }

  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe({
      error: (err) => console.error('Erro ao atualizar task:', err)
    });
  }

  startEdit(task: Task): void {
    this.editingTask.set(task);
  }

  onFormSubmitted(): void {
    this.editingTask.set(null);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  deleteTask(task: Task): void {
    const confirmed = confirm(`Excluir a tarefa "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        if (this.editingTask()?.id === task.id) {
          this.editingTask.set(null);
        }
      },
      error: (err) => console.error('Erro ao excluir task:', err)
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.filter.set(filter);
  }

  startProjectEdit(project: Project): void {
    this.editingProject.set(project);
  }

  newProject(): void {
    this.editingProject.set(null);
  }

  onProjectFormSubmitted(): void {
    this.editingProject.set(null);
  }

  deleteProject(project: Project): void {
    const confirmed = confirm(
      `Excluir o projeto "${project.name}"? Todas as tarefas desse projeto também serão excluídas.`
    );

    if (!confirmed) {
      return;
    }

    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.taskService.tasks.update(current =>
          current.filter(task => task.project !== project.id)
        );

        if (this.selectedProject() === project.id) {
          this.selectedProject.set(null);
        }

        if (this.editingProject()?.id === project.id) {
          this.editingProject.set(null);
        }
      },
      error: (err) => console.error('Erro ao excluir projeto:', err)
    });
  }
}