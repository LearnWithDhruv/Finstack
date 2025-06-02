import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Task } from './task.modal';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  // No need to map from snake_case since backend already returns camelCase
  private mapTaskFromApi(task: any): Task {
    return {
      id: task.id,
      date: task.date,
      entityName: task.entityName,
      taskType: task.taskType,
      time: task.time,
      phoneNumber: task.phoneNumber || '',
      contactPerson: task.contactPerson,
      note: task.note || '',
      status: task.status
    };
  }

  // Map frontend camelCase to backend (backend can handle both camelCase and snake_case)
  private mapTaskToApi(task: Task): any {
    return {
      id: task.id,
      date: task.date,
      entityName: task.entityName,
      taskType: task.taskType,
      time: task.time,
      phoneNumber: task.phoneNumber,
      contactPerson: task.contactPerson,
      note: task.note,
      status: task.status
    };
  }

  getTasks(filters?: { taskType?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.taskType) {
      params = params.set('task_type', filters.taskType);
    }
    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map(tasks => tasks.map(task => this.mapTaskFromApi(task))),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Failed to fetch tasks'));
      })
    );
  }

  addTask(task: Task): Observable<Task> {
    const taskPayload = this.mapTaskToApi(task);
    return this.http.post<Task>(this.apiUrl, taskPayload).pipe(
      map(response => this.mapTaskFromApi(response)),
      catchError(error => {
        console.error('Error creating task:', error);
        return throwError(() => new Error('Failed to create task'));
      })
    );
  }

  updateTask(task: Task): Observable<void> {
    const taskPayload = this.mapTaskToApi(task);
    return this.http.put<void>(`${this.apiUrl}/${task.id}`, taskPayload).pipe(
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Failed to update task'));
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting task:', error);
        return throwError(() => new Error('Failed to delete task'));
      })
    );
  }
}