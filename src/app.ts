interface Verify {
    value: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
}

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
// Create the TaskInput class
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

        this.attachListeners();
        this.render();
    }


    private render() {
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
       if(
           !verifyInput(verifyName) ||
           !verifyInput(verifyDescription) ||
           !verifyInput(verifyDate)
        ) {
            alert("Fill in all the fields or make sure min/max characters match the requirement.")
        } else {
            console.log([taskName, taskDesc, taskDue])
        }
    } 

    private resetInputFields (): void {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
    }
    private submitFormHandler (e: Event) {
       e.preventDefault();
       this.getTaskInput();
       this.resetInputFields();
      
    }
    private attachListeners () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this))
    }
}

const renderedForm = new TaskInput();