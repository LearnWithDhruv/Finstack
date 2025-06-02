import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './task.modal';

@Pipe({
  name: 'filterByDate'
})
export class FilterByDatePipe implements PipeTransform {
  transform(tasks: Task[], date: string): Task[] {
    return tasks.filter(task => task.date === date);
  }
}