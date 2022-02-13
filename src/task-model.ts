
namespace  App {
    // Task type
   export enum TaskStatus { 
    Active = 'active', 
    Finished = 'finished'
 }

export class Task {
    constructor (
        public id: string,
        public title: string,
        public description: string, 
        public dueDate: string,
        public status: TaskStatus
        ) {

    }
}

}