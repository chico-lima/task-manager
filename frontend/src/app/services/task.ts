import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task } from '../models/tasks';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = '/api/tasks/';

    tasks = signal<Task[]>([]);

    constructor(private http: HttpClient) { }

    loadTasks(): void {
        this.http.get<Task[]>(this.apiUrl).subscribe({
            next: (data) => this.tasks.set(data),
            error: (err) => console.error('Erro ao buscar tasks:', err)
        });
    }

    createTask(task: Partial<Task>): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task).pipe(
            tap((newTask) => {
                this.tasks.update(current => [...current, newTask]);
            })
        );
    }

    updateTask(id: number, task: Partial<Task>): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}${id}/`, task).pipe(
            tap((updatedTask) => {
                this.tasks.update(current =>
                    current.map(t => t.id === updatedTask.id ? updatedTask : t)
                );
            })
        );
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
            tap(() => {
                this.tasks.update(current => current.filter(t => t.id !== id));
            })
        );
    }
}