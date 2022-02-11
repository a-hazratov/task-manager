
// Task type
   enum TaskStatus { 
       Active = 'active', 
       Finished = 'finished'
    }

   class Task {
       constructor (
           public id: string,
           public title: string,
           public description: string, 
           public dueDate: string,
           public status: TaskStatus
           ) {

       }
   }



// Task State management
   type Listener<T> = (items: T[]) => void;

// Base class for TaskState
   class State<T> {
       protected listeners: Listener<T>[] = []
              addListener (listenerFunction: Listener<T>) {
              this.listeners.push(listenerFunction)
       } 
   }


   class TaskState extends State<Task> {
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
          if(task) {
              task.status = newStatus;
              this.updateListeners()
          }
       }

       removeTasks() {
           console.log("Remove-button is clicked")
           console.log(this.tasks)
           const clonedTasks = [...this.tasks];
           const onlyActiveTasks = clonedTasks.filter(item => item.status === TaskStatus.Active);
           this.tasks = onlyActiveTasks;
           this.updateListeners()
       }

       private updateListeners () {
           for ( let listenerFunction of this.listeners) {
               listenerFunction(this.tasks.slice());
           }
       }
   }

   const taskState = TaskState.getInstance();

// an interface for defining the structure of a task. It is used in verifyInput function
interface Verify {
    value: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

//verifyInput is used inside TaskInput class to check whether the task is valid before submitting
function verifyInput (verifyObj: Verify) {
        let isValid = true;
        if(verifyObj.required) {
            isValid = isValid && verifyObj.value.trim().length !== 0
        }
        if(verifyObj.minLength) {
            isValid = isValid && verifyObj.value.trim().length >= verifyObj.minLength
        }
        if(verifyObj.maxLength) {
            isValid = isValid && verifyObj.value.trim().length <= verifyObj.maxLength
        }
        return isValid
 }

// Creating BaseComponent Class that can be extended by other classes
abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor (
        templateId: string, 
        hostElementId: string, 
        insertAtStart: boolean,
        elementId?: string,
        
        ) {
            this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;
    
            const importedTemplate = document.importNode(this.templateElement.content, true);
            this.element = importedTemplate.firstElementChild as U;
            if (elementId) {
                this.element.id = elementId;
            }    
            this.render(insertAtStart)     
       }

       private render(placeToInsert: boolean) {
        this.hostElement.insertAdjacentElement(
            placeToInsert ? 'afterbegin' : 'beforeend', 
            this.element)
        //this.hostElement.appendChild(this.element)
    }

    abstract displayTasks(): void;
    abstract renderContent(): void;
}


 // TaskInput class defines and renders the form for the task input
class TaskInput extends BaseComponent<HTMLDivElement, HTMLFormElement>{
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    dateInput: HTMLInputElement;

    constructor () {
        super('task-input', 'app', false, 'user-input');   
        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
        this.dateInput = this.element.querySelector('#date')! as HTMLInputElement;
        this.attachSubmitFormHandler(); 
    }

    private getTaskInput (): [string, string, string] | void {
       const taskName = this.titleInput.value;
       const taskDesc = this.descriptionInput.value;
       const taskDue = this.dateInput.value;

       const verifyName: Verify = {
         value: taskName,
         required: true,
         minLength: 5,
         maxLength: 50, 
       };
       const verifyDescription: Verify = {
        value: taskDesc,
        required: true,
        minLength: 5,
        maxLength: 120,
       }
       const verifyDate: Verify = {
           value: taskDue,
           required: true
       }
       if (
           !verifyInput(verifyName) ||
           !verifyInput(verifyDescription) ||
           !verifyInput(verifyDate)
        ) {
            alert("Fill in all the fields or make sure min/max characters match the requirement.")
        } else {
            return [taskName, taskDesc, taskDue]
        }
    } 

    private resetInputFields (): void {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
    }

    private submitFormHandler (e: Event) {
       e.preventDefault();
      const taskInput = this.getTaskInput();
      if(Array.isArray(taskInput)) {
          const [title, description, dueDate] = taskInput;
          taskState.addTask(title, description, dueDate)
      }
       this.resetInputFields();
      
    }

    private attachSubmitFormHandler () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this))
    }
    displayTasks(): void {
    }
    renderContent(): void {
    }
}


// TaskItem class
 class TaskItem extends BaseComponent<HTMLUListElement, HTMLLIElement> {
     private task: Task;
     constructor(hostId: string, task: Task ) {
         super('single-task', hostId, false, task.id)
         this.task = task;
         this.renderContent();
         this.addListeners()
     }
     
     dragStart(event: DragEvent) {
         event.dataTransfer!.setData('text/plain', this.task.id);
         event.dataTransfer!.effectAllowed = 'move';
     }

     dragEnd(_: DragEvent) {
     }

     addListeners() {
         this.element.addEventListener('dragstart', this.dragStart.bind(this))
         this.element.addEventListener('dragend', this.dragEnd.bind(this))
     }

     displayTasks(): void { }
     renderContent(): void {
         this.element.querySelector('h3')!.textContent = this.task.title;
         this.element.querySelector('h5')!.textContent = this.task.dueDate;
         this.element.querySelector('p')!.textContent = this.task.description;
     }
 }

// TaskList class
 class TaskList extends BaseComponent<HTMLDivElement, HTMLElement> {
     definedTasks: Task[];
     constructor(private category: 'active' | 'finished') {
         super('task-list', 'app', false, `${category}-tasks`)
        this.definedTasks = [];
        this.renderContent();
        this.addListeners();
     }
     
    displayTasks () {
        const taskList = document.getElementById(`${this.category}-task-list`)! as HTMLUListElement;
        taskList.innerHTML = '';
        for (let taskItem of this.definedTasks) {
            new TaskItem(this.element.querySelector('ul')!.id, taskItem)
        }
     }

    renderContent () {
         const listId = `${this.category}-task-list`;
         this.element.querySelector('ul')!.id = listId;
         this.element.querySelector('h2')!.textContent = this.category.toUpperCase() + ' TASKS';
         if(listId === 'finished-task-list') {
             const button = document.createElement('button');
             button.classList.add('remove-button');
             button.innerHTML = "Remove tasks";
             const header = this.element.getElementsByTagName('header');
             header[0].appendChild(button)
         }
     }

     dragOver(event: DragEvent) {
         if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
             event.preventDefault();
           

         }
     }

     dragDrop(event: DragEvent) {
        const taskId = event.dataTransfer!.getData('text/plain') // getting the task id from dataTransfer
        taskState.moveTask(taskId, this.category === 'active' ? TaskStatus.Active : TaskStatus.Finished);
     }

     dragLeave(_: DragEvent) {
        
     }

     removeFinished() {
         taskState.removeTasks()
     }

     addListeners() {
        taskState.addListener((tasks: Task[])=> {
            const filteredTasks = tasks.filter(item => {
                if(this.category === 'active') {
                    return item.status === TaskStatus.Active
                }
                return item.status === TaskStatus.Finished
            })
           this.definedTasks = filteredTasks; 
           this.displayTasks()
        })
        this.element.addEventListener('dragover', this.dragOver.bind(this));
        this.element.addEventListener('drop', this.dragDrop.bind(this));
        this.element.addEventListener('dragleave', this.dragLeave.bind(this));
        const removeButton = this.element.querySelector('.remove-button');
        removeButton?.addEventListener('click', this.removeFinished.bind(this))
     }

 }

// Initializing the classes
const taskInput = new TaskInput();
const activeTasksList = new TaskList('active');
const finishedTasksList = new TaskList('finished');



//Supplimentary code

/**
 *  let date = new Date();
        function getCurrentMonth() {
            if(+(date.getMonth() + 1) < 10) {
                return `0${date.getMonth() + 1}`
            } else {
                return `${date.getMonth() + 1}`
            }
        }
        const currentDate = `${date.getFullYear()}-${getCurrentMonth()}-${date.getDate()}`
        this.dateInput.min = currentDate;
 */