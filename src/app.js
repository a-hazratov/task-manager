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
// Create the TaskInput class
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
        this.attachListeners();
        this.render();
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
            console.log([taskName, taskDesc, taskDue]);
        }
    };
    TaskInput.prototype.resetInputFields = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
    };
    TaskInput.prototype.submitFormHandler = function (e) {
        e.preventDefault();
        this.getTaskInput();
        this.resetInputFields();
    };
    TaskInput.prototype.attachListeners = function () {
        this.hostElement.addEventListener('submit', this.submitFormHandler.bind(this));
    };
    return TaskInput;
}());
var renderedForm = new TaskInput();
