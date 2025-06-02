import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { Task } from '../../task.modal';

@Component({
  selector: 'app-sales-log',
  templateUrl: './sales-log.component.html',
  styleUrls: ['./sales-log.component.css']
})
export class SalesLogComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTaskType: string | null = null;
  taskTypes = ['Meeting', 'Call', 'Video Call'];
  showModal = false;
  errorMessage: string | null = null;
  taskToEdit: Task | null = null; // Store the task being edited

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const filters = this.selectedTaskType ? { taskType: this.selectedTaskType } : undefined;
    this.taskService.getTasks(filters).subscribe({
      next: (tasks) => {
        console.log('Loaded tasks:', tasks);
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tasks. Please try again.';
        console.error(err);
      }
    });
  }

  filterTasks(): void {
    this.loadTasks();
  }

  openModal(task?: Task): void {
    this.taskToEdit = task || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.taskToEdit = null;
  }

  addTask(task: Task): void {
    if (this.taskToEdit) {
      // Update existing task
      const updatedTask = { ...this.taskToEdit, ...task };
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
          this.errorMessage = null;
          console.log('Task updated successfully:', updatedTask);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.errorMessage = 'Failed to update task. Please try again.';
        }
      });
    } else {
      // Add new task
      this.taskService.addTask(task).subscribe({
        next: (savedTask) => {
          this.tasks = [...this.tasks, savedTask];
          this.filteredTasks = [...this.tasks];
          this.closeModal();
          console.log('Task saved successfully:', savedTask);
        },
        error: (err) => {
          console.error('Error saving task:', err);
          this.errorMessage = 'Failed to save task. Please try again.';
        }
      });
    }
  }

  changeStatus(task: Task, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const action = selectElement.value;

    selectElement.value = '';

    if (!action) {
      return;
    }

    if (action === 'Edit') {
      this.openModal(task);
      return;
    }

    if (action === 'Delete') {
      this.deleteTask(task);
      return;
    }

    task.status = action as 'Open' | 'Closed';
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.loadTasks();
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Failed to update task status. Please try again.';
        console.error(err);
      }
    });
  }

  addNote(task: Task): void {
    const note = prompt('Enter a note for this task:');
    if (note) {
      task.note = note;
      this.taskService.updateTask(task).subscribe({
        next: () => {
          this.loadTasks();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = 'Failed to add note. Please try again.';
          console.error(err);
        }
      });
    }
  }

  viewNote(task: Task): void {
    if (task.note) {
      alert(`Note: ${task.note}`);
    }
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete task. Please try again.';
          console.error(err);
        }
      });
    }
  }

  getTaskIconClass(taskType: string): string {
    switch (taskType) {
      case 'Call':
        return 'fas fa-phone';
      case 'Meeting':
        return 'fas fa-users';
      case 'Video Call':
        return 'fas fa-video';
      default:
        return '';
    }
  }

  getOpenTaskCount(date: string): number {
    return this.filteredTasks
      .filter(task => task.date === date && task.status === 'Open')
      .length;
  }
}