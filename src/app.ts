///<reference path = "app-state.ts"/>
///<reference path = "base-component.ts"/>
///<reference path = "tasklist-component.ts"/>



namespace App {
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





// Initializing the classes
 new TaskInput();
 new TaskList('active');
 new TaskList('finished');

}

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