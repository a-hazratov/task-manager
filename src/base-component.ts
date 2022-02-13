
namespace App {

    // Creating BaseComponent Class that can be extended by other classes
export abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
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

}