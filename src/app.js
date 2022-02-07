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
var TaskState = /** @class */ (function () {
    function TaskState() {
        this.listeners = [];
        this.tasks = [];
    }
    TaskState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    };
    TaskState.prototype.addListener = function (listenerFunction) {
        this.listeners.push(listenerFunction);
    };
    TaskState.prototype.addTask = function (title, description, dueDate) {
        var singleTask = new Task(new Date().getTime().toString(), title, description, dueDate, TaskStatus.Active);
        this.tasks.push(singleTask);
        console.log(this.tasks);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFunction = _a[_i];
            listenerFunction(this.tasks.slice());
        }
    };
    return TaskState;
}());
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
            minLength: 5
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
var TaskItem = /** @class */ (function () {
    function TaskItem() {
    }
    return TaskItem;
}());
// TaskList class
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    function TaskList(category) {
        var _this = _super.call(this, 'task-list', 'app', false, category + "-tasks") || this;
        _this.category = category;
        _this.definedTasks = [];
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
        _this.renderContent();
        return _this;
    }
    TaskList.prototype.displayTasks = function () {
        var taskList = document.getElementById(this.category + "-task-list");
        taskList.innerHTML = '';
        for (var _i = 0, _a = this.definedTasks; _i < _a.length; _i++) {
            var taskItem = _a[_i];
            var listItem = document.createElement('li');
            listItem.textContent = taskItem.title;
            taskList.appendChild(listItem);
        }
    };
    TaskList.prototype.renderContent = function () {
        var listId = this.category + "-task-list";
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.category.toUpperCase() + ' TASKS';
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
