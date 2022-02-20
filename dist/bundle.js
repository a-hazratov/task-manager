"use strict";
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFunction) {
            this.listeners.push(listenerFunction);
        }
    }
    class TaskState extends State {
        constructor() {
            super();
            this.tasks = [];
            this.taskStorage = 'taskStorage';
            this.createLocalStorage();
            setTimeout(() => {
                this.updateListeners();
            }, 0);
        }
        createLocalStorage() {
            if (!localStorage[this.taskStorage]) {
                localStorage[this.taskStorage] = JSON.stringify([]);
            }
            else if (localStorage[this.taskStorage]) {
                this.tasks = JSON.parse(localStorage.getItem(this.taskStorage));
            }
        }
        static getInstance() {
            if (this.instance) {
                this.instance.createLocalStorage();
                return this.instance;
            }
            this.instance = new TaskState();
            this.instance.createLocalStorage();
            return this.instance;
        }
        addTask(title, description, dueDate) {
            const singleTask = new App.Task(new Date().getTime().toString(), title, description, dueDate, App.TaskStatus.Active);
            this.tasks.push(singleTask);
            localStorage[this.taskStorage] = JSON.stringify(this.tasks);
            this.updateListeners();
        }
        moveTask(taskId, newStatus) {
            const task = this.tasks.find(eachTask => eachTask.id === taskId);
            console.log(this.tasks);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                localStorage[this.taskStorage] = JSON.stringify(this.tasks);
                this.updateListeners();
            }
        }
        removeTasks() {
            const clonedTasks = [...this.tasks];
            const onlyActiveTasks = clonedTasks.filter(item => item.status === App.TaskStatus.Active);
            this.tasks = onlyActiveTasks;
            localStorage[this.taskStorage] = JSON.stringify(this.tasks);
            this.updateListeners();
        }
        removeActiveTask(id) {
            const clonedTasks = [...this.tasks];
            const onlyActiveTasks = clonedTasks.filter(item => item.id !== id);
            this.tasks = onlyActiveTasks;
            localStorage[this.taskStorage] = JSON.stringify(this.tasks);
            this.updateListeners();
        }
        updateListeners() {
            for (let listenerFunction of this.listeners) {
                listenerFunction(this.tasks.slice());
            }
        }
    }
    App.TaskState = TaskState;
    App.taskState = TaskState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    class BaseComponent {
        constructor(templateId, hostElementId, insertAtStart, elementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedTemplate = document.importNode(this.templateElement.content, true);
            this.element = importedTemplate.firstElementChild;
            if (elementId) {
                this.element.id = elementId;
            }
            this.render(insertAtStart);
        }
        render(placeToInsert) {
            this.hostElement.insertAdjacentElement(placeToInsert ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    App.BaseComponent = BaseComponent;
})(App || (App = {}));
var App;
(function (App) {
    class TaskItem extends App.BaseComponent {
        constructor(hostId, task) {
            super('single-task', hostId, false, task.id);
            this.hostId = hostId;
            this.task = task;
            this.renderContent();
            this.addListeners();
        }
        dragStart(event) {
            event.dataTransfer.setData('text/plain', this.task.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEnd(_) {
        }
        addListeners() {
            this.element.addEventListener('dragstart', this.dragStart.bind(this));
            this.element.addEventListener('dragend', this.dragEnd.bind(this));
        }
        displayTasks() { }
        renderContent() {
            this.element.querySelector('h3').textContent = this.task.title;
            this.element.querySelector('h5').textContent = this.task.dueDate;
            this.element.querySelector('p').textContent = this.task.description;
            if (this.hostId === 'active-task-list') {
                const spanElement = document.createElement('span');
                spanElement.innerHTML = "X";
                spanElement.classList.add('remove-active');
                this.element.appendChild(spanElement);
            }
        }
    }
    App.TaskItem = TaskItem;
})(App || (App = {}));
var App;
(function (App) {
    class TaskList extends App.BaseComponent {
        constructor(category) {
            super('task-list', 'app', false, `${category}-tasks`);
            this.category = category;
            this.definedTasks = [];
            this.renderContent();
            this.addListeners();
        }
        displayTasks() {
            const taskList = document.getElementById(`${this.category}-task-list`);
            taskList.innerHTML = '';
            for (let taskItem of this.definedTasks) {
                new App.TaskItem(this.element.querySelector('ul').id, taskItem);
            }
        }
        renderContent() {
            const listId = `${this.category}-task-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = this.category.toUpperCase() + ' TASKS';
            if (listId === 'finished-task-list') {
                const button = document.createElement('button');
                button.classList.add('remove-button');
                button.innerHTML = "Remove tasks";
                const header = this.element.getElementsByTagName('header');
                header[0].appendChild(button);
            }
        }
        dragOver(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
            }
        }
        dragDrop(event) {
            const taskId = event.dataTransfer.getData('text/plain');
            App.taskState.moveTask(taskId, this.category === 'active' ? App.TaskStatus.Active : App.TaskStatus.Finished);
        }
        dragLeave(_) {
        }
        removeFinished() {
            App.taskState.removeTasks();
        }
        removeActiveFromList(e) {
            if (e.target.className === 'remove-active') {
                const setId = e.target.parentNode.id;
                App.taskState.removeActiveTask(setId);
            }
        }
        addListeners() {
            App.taskState.addListener((tasks) => {
                const filteredTasks = tasks.filter(item => {
                    if (this.category === 'active') {
                        return item.status === App.TaskStatus.Active;
                    }
                    return item.status === App.TaskStatus.Finished;
                });
                this.definedTasks = filteredTasks;
                this.displayTasks();
            });
            this.element.addEventListener('dragover', this.dragOver.bind(this));
            this.element.addEventListener('drop', this.dragDrop.bind(this));
            this.element.addEventListener('dragleave', this.dragLeave.bind(this));
            const removeButton = this.element.querySelector('.remove-button');
            this.element.getElementsByTagName('ul')[0].addEventListener('click', this.removeActiveFromList.bind(this));
            removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener('click', this.removeFinished.bind(this));
        }
    }
    App.TaskList = TaskList;
})(App || (App = {}));
var App;
(function (App) {
    function verifyInput(verifyObj) {
        let isValid = true;
        if (verifyObj.required) {
            isValid = isValid && verifyObj.value.trim().length !== 0;
        }
        if (verifyObj.minLength) {
            isValid = isValid && verifyObj.value.trim().length >= verifyObj.minLength;
        }
        if (verifyObj.maxLength) {
            isValid = isValid && verifyObj.value.trim().length <= verifyObj.maxLength;
        }
        return isValid;
    }
    class TaskInput extends App.BaseComponent {
        constructor() {
            super('task-input', 'app', false, 'user-input');
            this.titleInput = this.element.querySelector('#title');
            this.descriptionInput = this.element.querySelector('#description');
            this.dateInput = this.element.querySelector('#date');
            this.attachSubmitFormHandler();
        }
        getTaskInput() {
            const taskName = this.titleInput.value;
            const taskDesc = this.descriptionInput.value;
            const taskDue = this.dateInput.value;
            const verifyName = {
                value: taskName,
                required: true,
                minLength: 5,
                maxLength: 50,
            };
            const verifyDescription = {
                value: taskDesc,
                required: true,
                minLength: 5,
                maxLength: 120,
            };
            const verifyDate = {
                value: taskDue,
                required: true
            };
            if (!verifyInput(verifyName) ||
                !verifyInput(verifyDescription) ||
                !verifyInput(verifyDate)) {
                alert("Fill in all the fields or make sure min/max characters match the requirement.");
            }
            else {
                return [taskName, taskDesc, taskDue];
            }
        }
        resetInputFields() {
            this.titleInput.value = '';
            this.descriptionInput.value = '';
            this.dateInput.value = '';
        }
        submitFormHandler(e) {
            e.preventDefault();
            const taskInput = this.getTaskInput();
            if (Array.isArray(taskInput)) {
                const [title, description, dueDate] = taskInput;
                App.taskState.addTask(title, description, dueDate);
            }
            this.resetInputFields();
        }
        attachSubmitFormHandler() {
            console.log(this.hostElement);
            console.log(this.element);
            this.element.addEventListener('submit', this.submitFormHandler.bind(this));
        }
        displayTasks() {
        }
        renderContent() {
        }
    }
    new TaskInput();
    new App.TaskList('active');
    new App.TaskList('finished');
})(App || (App = {}));
var App;
(function (App) {
    let TaskStatus;
    (function (TaskStatus) {
        TaskStatus["Active"] = "active";
        TaskStatus["Finished"] = "finished";
    })(TaskStatus = App.TaskStatus || (App.TaskStatus = {}));
    class Task {
        constructor(id, title, description, dueDate, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.status = status;
        }
    }
    App.Task = Task;
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map