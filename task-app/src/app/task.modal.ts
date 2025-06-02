export interface Task {
  id: number;
  date: string;
  entityName: string;
  taskType: string;
  time: string;
  contactPerson: string;
  phoneNumber?: string;
  note?: string;
  status: string;
}