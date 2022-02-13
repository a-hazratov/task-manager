
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
    private taskStorage: string ='taskStorage'
    private constructor () {
       super()
       this.createLocalStorage()
       setTimeout(()=> {
           this.updateListeners()
       },0)
    }
    
    createLocalStorage () {
        if(!localStorage[this.taskStorage]) {
            localStorage[this.taskStorage] = JSON.stringify([])
        } else if (localStorage[this.taskStorage]) {
           console.log("Create local storage runs")
           this.tasks = JSON.parse(localStorage.getItem(this.taskStorage)!)
        
        }
    } 

    static getInstance () {
       if (this.instance) {
           this.instance.createLocalStorage()
         return this.instance;  
       }
         this.instance = new TaskState();
         this.instance.createLocalStorage()
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
       localStorage[this.taskStorage] = JSON.stringify(this.tasks)
       this.updateListeners();
    }

    moveTask (taskId: string, newStatus: TaskStatus) {
       const task = this.tasks.find(eachTask => eachTask.id === taskId);
       console.log(this.tasks)
       if(task && task.status !== newStatus) {
           task.status = newStatus;
           localStorage[this.taskStorage] = JSON.stringify(this.tasks)
           this.updateListeners()
       }
    }

    removeTasks() {
        const clonedTasks = [...this.tasks];
        const onlyActiveTasks = clonedTasks.filter(item => item.status === TaskStatus.Active);
        this.tasks = onlyActiveTasks;
        localStorage[this.taskStorage] = JSON.stringify(this.tasks)
        this.updateListeners()
    }

    removeActiveTask(id: string) {
     const clonedTasks = [...this.tasks];
     const onlyActiveTasks = clonedTasks.filter(item => item.id !== id);
     this.tasks = onlyActiveTasks;
     localStorage[this.taskStorage] = JSON.stringify(this.tasks)
     this.updateListeners()
    }

    private updateListeners () {
        console.log("Update listeners runs")
        for ( let listenerFunction of this.listeners) {
            listenerFunction(this.tasks.slice());
        }
    }
}

export const taskState = TaskState.getInstance();
}
