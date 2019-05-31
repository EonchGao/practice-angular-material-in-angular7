export interface TaskList {
    id?: string;
    name: string;
    order: number;
    tasksIds: string[];
    projectId: string;
}
