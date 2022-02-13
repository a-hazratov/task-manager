///<reference path = "taskitem-component.ts"/>
///<reference path = "app-state.ts"/>
///<reference path = "base-component.ts"/>

namespace App {

    // TaskList class
 export class TaskList extends BaseComponent<HTMLDivElement, HTMLElement> {
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

    removeActiveFromList(e:any) {
        if (e.target.className === 'remove-active') {
            const setId = e.target.parentNode.id;
            taskState.removeActiveTask(setId)
        }
        
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
       this.element.getElementsByTagName('ul')[0].addEventListener('click', this.removeActiveFromList.bind(this))
       removeButton?.addEventListener('click', this.removeFinished.bind(this))
    }

 }

}