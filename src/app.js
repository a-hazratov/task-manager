var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Task type
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Active"] = "active";
    TaskStatus["Finished"] = "finished";
})(TaskStatus || (TaskStatus = {}));
var Task = /** @class */ (function () {
    function Task(id, title, description, dueDate, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    }
    return Task;
}());
// Base class for TaskState
var State = /** @class */ (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listenerFunction) {
        this.listeners.push(listenerFunction);
    };
    return State;
}());
var TaskState = /** @class */ (function (_super) {
    __extends(TaskState, _super);
    function TaskState() {
        var _this = _super.call(this) || this;
        _this.tasks = [];
        return _this;
    }
    TaskState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    };
    TaskState.prototype.addTask = function (title, description, dueDate) {
        var singleTask = new Task(new Date().getTime().toString(), title, description, dueDate, TaskStatus.Active);
        this.tasks.push(singleTask);
        console.log(this.tasks);
        this.updateListeners();
    };
    TaskState.prototype.moveTask = function (taskId, newStatus) {
        var task = this.tasks.find(function (eachTask) { return eachTask.id === taskId; });
        console.log(this.tasks);
        if (task) {
            task.status = newStatus;
            this.updateListeners();
        }
    };
    TaskState.prototype.removeTasks = function () {
        console.log("Remove-button is clicked");
        console.log(this.tasks);
        var clonedTasks = __spreadArray([], this.tasks, true);
        var onlyActiveTasks = clonedTasks.filter(function (item) { return item.status === TaskStatus.Active; });
        this.tasks = onlyActiveTasks;
        this.updateListeners();
    };
    TaskState.prototype.updateListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFunction = _a[_i];
            listenerFunction(this.tasks.slice());
        }
    };
    return TaskState;
}(State));
var taskState = TaskState.getInstance();
//verifyInput is used inside TaskInput class to check whether the task is valid before submitting
function verifyInput(verifyObj) {
    var isValid = true;
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
// Creating BaseComponent Class that can be extended by other classes
var BaseComponent = /** @class */ (function () {
    function BaseComponent(templateId, hostElementId, insertAtStart, elementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        var importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild;
        if (elementId) {
            this.element.id = elementId;
        }
        this.render(insertAtStart);
    }
    BaseComponent.prototype.render = function (placeToInsert) {
        this.hostElement.insertAdjacentElement(placeToInsert ? 'afterbegin' : 'beforeend', this.element);
        //this.hostElement.appendChild(this.element)
    };
    return BaseComponent;
}());
// TaskInput class defines and renders the form for the task input
var TaskInput = /** @class */ (function (_super) {
    __extends(TaskInput, _super);
    function TaskInput() {
        var _this = _super.call(this, 'task-input', 'app', false, 'user-input') || this;
        _this.titleInput = _this.element.querySelector('#title');
        _this.descriptionInput = _this.element.querySelector('#description');
        _this.dateInput = _this.element.querySelector('#date');
        _this.attachSubmitFormHandler();
        return _this;
    }
    TaskInput.prototype.getTaskInput = function () {
        var taskName = this.titleInput.value;
        var taskDesc = this.descriptionInput.value;
        var taskDue = this.dateInput.value;
        var verifyName = {
            value: taskName,
            required: true,
            minLength: 5,
            maxLength: 50
        };
        var verifyDescription = {
            value: taskDesc,
            required: true,
            minLength: 5,
            maxLength: 120
        };
        var verifyDate = {
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
    };
    TaskInput.prototype.resetInputFields = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
    };
    TaskInput.prototype.submitFormHandler = function (e) {
        e.preventDefault();
        var taskInput = this.getTaskInput();
        if (Array.isArray(taskInput)) {
            var title = taskInput[0], description = taskInput[1], dueDate = taskInput[2];
            taskState.addTask(title, description, dueDate);
        }
        this.resetInputFields();
    };
    TaskInput.prototype.attachSubmitFormHandler = function () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this));
    };
    TaskInput.prototype.displayTasks = function () {
    };
    TaskInput.prototype.renderContent = function () {
    };
    return TaskInput;
}(BaseComponent));
// TaskItem class
var TaskItem = /** @class */ (function (_super) {
    __extends(TaskItem, _super);
    function TaskItem(hostId, task) {
        var _this = _super.call(this, 'single-task', hostId, false, task.id) || this;
        _this.task = task;
        _this.renderContent();
        _this.addListeners();
        return _this;
    }
    TaskItem.prototype.dragStart = function (event) {
        event.dataTransfer.setData('text/plain', this.task.id);
        event.dataTransfer.effectAllowed = 'move';
    };
    TaskItem.prototype.dragEnd = function (_) {
    };
    TaskItem.prototype.addListeners = function () {
        this.element.addEventListener('dragstart', this.dragStart.bind(this));
        this.element.addEventListener('dragend', this.dragEnd.bind(this));
    };
    TaskItem.prototype.displayTasks = function () { };
    TaskItem.prototype.renderContent = function () {
        this.element.querySelector('h3').textContent = this.task.title;
        this.element.querySelector('h5').textContent = this.task.dueDate;
        this.element.querySelector('p').textContent = this.task.description;
    };
    return TaskItem;
}(BaseComponent));
// TaskList class
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    function TaskList(category) {
        var _this = _super.call(this, 'task-list', 'app', false, category + "-tasks") || this;
        _this.category = category;
        _this.definedTasks = [];
        _this.renderContent();
        _this.addListeners();
        return _this;
    }
    TaskList.prototype.displayTasks = function () {
        var taskList = document.getElementById(this.category + "-task-list");
        taskList.innerHTML = '';
        for (var _i = 0, _a = this.definedTasks; _i < _a.length; _i++) {
            var taskItem = _a[_i];
            new TaskItem(this.element.querySelector('ul').id, taskItem);
        }
    };
    TaskList.prototype.renderContent = function () {
        var listId = this.category + "-task-list";
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.category.toUpperCase() + ' TASKS';
        if (listId === 'finished-task-list') {
            var button = document.createElement('button');
            button.classList.add('remove-button');
            button.innerHTML = "Remove tasks";
            var header = this.element.getElementsByTagName('header');
            header[0].appendChild(button);
        }
    };
    TaskList.prototype.dragOver = function (event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
        }
    };
    TaskList.prototype.dragDrop = function (event) {
        var taskId = event.dataTransfer.getData('text/plain'); // getting the task id from dataTransfer
        taskState.moveTask(taskId, this.category === 'active' ? TaskStatus.Active : TaskStatus.Finished);
    };
    TaskList.prototype.dragLeave = function (_) {
    };
    TaskList.prototype.removeFinished = function () {
        taskState.removeTasks();
    };
    TaskList.prototype.addListeners = function () {
        var _this = this;
        taskState.addListener(function (tasks) {
            var filteredTasks = tasks.filter(function (item) {
                if (_this.category === 'active') {
                    return item.status === TaskStatus.Active;
                }
                return item.status === TaskStatus.Finished;
            });
            _this.definedTasks = filteredTasks;
            _this.displayTasks();
        });
        this.element.addEventListener('dragover', this.dragOver.bind(this));
        this.element.addEventListener('drop', this.dragDrop.bind(this));
        this.element.addEventListener('dragleave', this.dragLeave.bind(this));
        var removeButton = this.element.querySelector('.remove-button');
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener('click', this.removeFinished.bind(this));
    };
    return TaskList;
}(BaseComponent));
// Initializing the classes
var taskInput = new TaskInput();
var activeTasksList = new TaskList('active');
var finishedTasksList = new TaskList('finished');
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
