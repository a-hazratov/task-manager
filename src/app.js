// Task State management
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
    TaskState.prototype.addListener = function (listenerFunc) {
        this.listeners.push(listenerFunc);
    };
    TaskState.prototype.addTask = function (title, description, dueDate) {
        var singleTask = {
            id: new Date().getTime(),
            title: title,
            description: description,
            dueDate: dueDate
        };
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
// TaskInput class defines and renders the form for the task input
var TaskInput = /** @class */ (function () {
    function TaskInput() {
        this.templateElement = document.getElementById('task-input');
        this.hostElement = document.getElementById('app');
        var importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild;
        this.element.id = 'user-input';
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.dateInput = this.element.querySelector('#date');
        this.render();
        this.attachListeners();
    }
    TaskInput.prototype.render = function () {
        var date = new Date();
        function getCurrentMonth() {
            if (+(date.getMonth() + 1) < 10) {
                return "0" + (date.getMonth() + 1);
            }
            else {
                return "" + (date.getMonth() + 1);
            }
        }
        var currentDate = date.getFullYear() + "-" + getCurrentMonth() + "-" + date.getDate();
        this.dateInput.min = currentDate;
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        //this.hostElement.appendChild(this.element)
    };
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
    TaskInput.prototype.attachListeners = function () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this));
    };
    return TaskInput;
}());
// TaskList class
var TaskList = /** @class */ (function () {
    function TaskList(category) {
        var _this = this;
        this.category = category;
        this.templateElement = document.getElementById('task-list');
        this.hostElement = document.getElementById('app');
        var importedTemplate = document.importNode(this.templateElement.content, true);
        this.element = importedTemplate.firstElementChild;
        this.element.id = this.category + "-tasks";
        this.definedTasks = [];
        taskState.addListener(function (tasks) {
            _this.definedTasks = tasks;
            _this.displayTasks();
        });
        this.render();
        this.renderContent();
    }
    TaskList.prototype.displayTasks = function () {
        var taskList = document.getElementById(this.category + "-task-list");
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
    TaskList.prototype.render = function () {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    };
    return TaskList;
}());
// Initializing the TaskInput class
var taskInput = new TaskInput();
var activeTasksList = new TaskList('active');
var finishedTasksList = new TaskList('finished');
