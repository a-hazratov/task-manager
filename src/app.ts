
class TaskInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    constructor () {
        this.templateElement = <HTMLTemplateElement>document.getElementById('task-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild as HTMLFormElement;
        this.render()
    }

    private render() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const renderedForm = new TaskInput();