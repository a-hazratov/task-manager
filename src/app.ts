
// Task State management
   class TaskState {
       private listeners: any[] = []
       private tasks: any[] = [];
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

       addListener (listenerFunc: Function) {
           this.listeners.push(listenerFunc)
       }

       addTask (title: string, description: string, dueDate: string) {
          const singleTask = {
              id: new Date().getTime(),
              title: title,
              description: description,
              dueDate: dueDate
          }
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

 // TaskInput class defines and renders the form for the task input
class TaskInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    dateInput: HTMLInputElement;
  

    constructor () {
      
        this.templateElement = <HTMLTemplateElement>document.getElementById('task-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
        
        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
        this.dateInput = this.element.querySelector('#date')! as HTMLInputElement;
         this.render()
        this.attachListeners();
       
        
    }


     render() {
        let date = new Date();
        function getCurrentMonth() {
            if(+(date.getMonth() + 1) < 10) {
                return `0${date.getMonth() + 1}`
            } else {
                return `${date.getMonth() + 1}`
            }
        }
        const currentDate = `${date.getFullYear()}-${getCurrentMonth()}-${date.getDate()}`
        this.dateInput.min = currentDate;
        this.hostElement.insertAdjacentElement('beforeend', this.element)
        //this.hostElement.appendChild(this.element)
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
    private attachListeners () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this))
    }
}


// TaskList class
 class TaskList {
     templateElement: HTMLTemplateElement;
     hostElement: HTMLDivElement;
     element: HTMLElement;
     definedTasks: any[];
     constructor(private category: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('task-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;
        const importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild as HTMLElement;
        this.element.id = `${this.category}-tasks`;
        this.definedTasks = [];
        taskState.addListener((tasks: any[])=> {
           this.definedTasks = tasks; 
           this.displayTasks()
        })
        this.render();
        this.renderContent();
     }
     
     private displayTasks () {
        const taskList = document.getElementById(`${this.category}-task-list`)! as HTMLUListElement;
        for (let taskItem of this.definedTasks) {
            const listItem = document.createElement('li');
            listItem.textContent = taskItem.title;
            taskList.appendChild(listItem)
        }
     }

     private renderContent () {
         const listId = `${this.category}-task-list`;
         this.element.querySelector('ul')!.id = listId;
         this.element.querySelector('h2')!.textContent = this.category.toUpperCase() + ' TASKS';
     }

     private render () {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
     }
 }

// Initializing the TaskInput class
const taskInput = new TaskInput();
const activeTasksList = new TaskList('active');
const finishedTasksList = new TaskList('finished');

