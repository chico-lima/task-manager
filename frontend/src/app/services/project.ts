import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project } from '../models/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://127.0.0.1:8000/api/projects/';

  projects = signal<Project[]>([]);

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap((data) => {
        this.projects.set(data);
      })
    );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(
      tap((newProject) => {
        this.projects.update(current => [...current, newProject]);
      })
    );
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}${id}/`, project).pipe(
      tap((updatedProject) => {
        this.projects.update(current =>
          current.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          )
        );
      })
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => {
        this.projects.update(current =>
          current.filter(p => p.id !== id)
        );
      })
    );
  }
}