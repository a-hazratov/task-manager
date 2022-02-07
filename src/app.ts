
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
   type Listener = (items: Task[]) => void;
  
   class TaskState {
       private listeners: Listener[] = []
       private tasks: Task[] = [];
       private static instance: TaskState;
       private constructor () {
        
       }

       static getInstance () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
       }

       addListener (listenerFunction: Listener) {
           this.listeners.push(listenerFunction)
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
         minLength: 5
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
 class TaskItem {
     
 }

// TaskList class
 class TaskList extends BaseComponent<HTMLDivElement, HTMLElement> {
     definedTasks: Task[];
     constructor(private category: 'active' | 'finished') {
         super('task-list', 'app', false, `${category}-tasks`)
        this.definedTasks = [];
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
        this.renderContent();
     }
     
    displayTasks () {
        const taskList = document.getElementById(`${this.category}-task-list`)! as HTMLUListElement;
        taskList.innerHTML = '';
        for (let taskItem of this.definedTasks) {
            const listItem = document.createElement('li');
            listItem.textContent = taskItem.title;
            taskList.appendChild(listItem)
        }
     }

    renderContent () {
         const listId = `${this.category}-task-list`;
         this.element.querySelector('ul')!.id = listId;
         this.element.querySelector('h2')!.textContent = this.category.toUpperCase() + ' TASKS';
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