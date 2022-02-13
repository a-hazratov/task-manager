
namespace App {
    // TaskItem class
export class TaskItem extends BaseComponent<HTMLUListElement, HTMLLIElement> {
    private task: Task;
    hostId: string;
    constructor(hostId: string, task: Task ) {
        super('single-task', hostId, false, task.id)
        this.hostId = hostId;
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
        if(this.hostId === 'active-task-list') {
            const spanElement = document.createElement('span');
            spanElement.innerHTML = "X";
            spanElement.classList.add('remove-active')
            this.element.appendChild(spanElement)
        }
    }
}
}