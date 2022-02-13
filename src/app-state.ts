
namespace App {
  // Base class for TaskState
class State<T> {
    protected listeners: Listener<T>[] = []
           addListener (listenerFunction: Listener<T>) {
           this.listeners.push(listenerFunction)
    } 
}

// Task State management
type Listener<T> = (items: T[]) => void;


export class TaskState extends State<Task> {
    private tasks: Task[] = [];
    private static instance: TaskState;
    private constructor () {
       super()
    }

    static getInstance () {
     if (this.instance) {
         return this.instance;
     }
     this.instance = new TaskState();
     return this.instance;
    }

    addTask (title: string, description: string, dueDate: string) {
       const singleTask = new Task(
           new Date().getTime().toString(),
           title,
           description,
           dueDate,
           TaskStatus.Active
       )
       this.tasks.push(singleTask);
       console.log(this.tasks)
       this.updateListeners();

    }

    moveTask (taskId: string, newStatus: TaskStatus) {
       const task = this.tasks.find(eachTask => eachTask.id === taskId);
       console.log(this.tasks)
       if(task && task.status !== newStatus) {
           task.status = newStatus;
           this.updateListeners()
       }
    }

    removeTasks() {
        const clonedTasks = [...this.tasks];
        const onlyActiveTasks = clonedTasks.filter(item => item.status === TaskStatus.Active);
        this.tasks = onlyActiveTasks;
        this.updateListeners()
    }

    removeActiveTask(id: string) {
     const clonedTasks = [...this.tasks];
     const onlyActiveTasks = clonedTasks.filter(item => item.id !== id);
     this.tasks = onlyActiveTasks;
     this.updateListeners()
    }

    private updateListeners () {
        for ( let listenerFunction of this.listeners) {
            listenerFunction(this.tasks.slice());
        }
    }
}

export const taskState = TaskState.getInstance();
}
