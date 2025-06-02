import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './task.modal';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(tasks: Task[], property: keyof Task): string[] {
    if (!tasks || !property) {
      return [];
    }
    return [...new Set(tasks.map(task => task[property] as string))];
  }
}