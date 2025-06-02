import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Task } from '../../task.modal';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.css']
})
export class NewTaskModalComponent {
  @Input() task: Task | null = null; // Input to receive task for editing
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();

  newTask: Task = {
    id: 0,
    date: new Date().toISOString().split('T')[0],
    entityName: '',
    taskType: 'Call',
    time: '',
    phoneNumber: '',
    contactPerson: '',
    note: '',
    status: 'Open'
  };

  ngOnInit(): void {
    if (this.task) {
      // Pre-fill form with task data if editing
      this.newTask = { ...this.task };
    }
  }

  onSave(): void {
    if (!this.newTask.entityName?.trim()) {
      alert('Entity name is required');
      return;
    }
    if (!this.newTask.date) {
      alert('Date is required');
      return;
    }
    if (!this.newTask.time) {
      alert('Time is required');
      return;
    }
    if (!this.newTask.contactPerson?.trim()) {
      alert('Contact person is required');
      return;
    }

    this.save.emit(this.newTask);
  }

  onCancel(): void {
    this.close.emit();
  }
}