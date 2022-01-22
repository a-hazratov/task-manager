var TaskInput = /** @class */ (function () {
    function TaskInput() {
        this.templateElement = document.getElementById('task-input');
        this.hostElement = document.getElementById('app');
        var importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild;
        this.render();
    }
    TaskInput.prototype.render = function () {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    };
    return TaskInput;
}());
var renderedForm = new TaskInput();
