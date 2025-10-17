const TODOStorage = new TODOStorageClass();
let currentRootId = null;
let isEditTaskMode = false;
let taskDescriptionEditView = null;
let taskNameEditView = null;
const DEBUG_SHOW_ID_INFO = false;

class TODOTaskParams {
    static NAME = "text";
    static IS_COMPLETED = "isCompleted";
    static DESCRIPTION = "description";
};

function updateView() {
    const task = TODOStorage.getTaskById(currentRootId);
    updatePathView();
    updateCurrentTaskNameView(task);
    updateDescriptionView(task);
    updateControlView(task);
    updateSubtaskView(task.todos);
}

function updateCurrentTaskNameView(task) {
    const taskNameView = document.getElementById('todoListCurrentTaskName');
    taskNameView.innerHTML = '';
    const text = currentRootId ? task[TODOTaskParams.NAME] : 'Список задач';
    taskNameEditView = null;
    if (isEditTaskMode) {
        taskNameEditView = document.createElement('input');
        taskNameEditView.className = "todo-description-edit-class";
        taskNameEditView.setAttribute("value", text);
        taskNameView.appendChild(taskNameEditView);
    }
    else {
        const taskNameElement = document.createElement('h3');
        taskNameElement.innerText = text;
        taskNameView.appendChild(taskNameElement);
    }
}

function updateControlView() {
    const controlView = document.getElementById('todoListControlsView');
    controlView.innerHTML = '';
    if (currentRootId) {
        controlView.appendChild(buildButtonEditTask(null));
        if (isEditTaskMode)
            controlView.appendChild(buildButtonEditCancel());
    }
    if (!isEditTaskMode)
        controlView.appendChild(buildButtonCreateTask());
}

function updateDescriptionView(task) {
    taskDescriptionEditView = null;
    function buidDescriptionView(text) {
        const element = document.createElement('pre');
        element.textContent = text;
        return element;
    }
    function buidDescriptionEditView(text) {
        taskDescriptionEditView = document.createElement('textarea');
        taskDescriptionEditView.className = "todo-description-edit-class";
        taskDescriptionEditView.textContent = text;
        return taskDescriptionEditView;
    }
    let text = task[TODOTaskParams.DESCRIPTION];
    const pathView = document.getElementById('todoListDescriptionView');
    pathView.innerHTML = '';
    pathView.appendChild(isEditTaskMode ? buidDescriptionEditView(text) : buidDescriptionView(text));
}

function updatePathView() {
    const pathView = document.getElementById('todoListPathView');

    function appendElementToPath(id, name) {
        let taskName = document.createElement('div');
        taskName.textContent = name;
        taskName.className = "todo-path-task-name-class";
        if (DEBUG_SHOW_ID_INFO)
            taskName.textContent = id + " " + taskName.textContent;
        pathView.appendChild(taskName);

        taskName.addEventListener('click', () => {
            currentRootId = id;
            isEditTaskMode = false;
            updateView();
        });
    }

    const path = TODOStorage.getTaskParentsById(currentRootId);
    pathView.innerHTML = '';
    if (currentRootId)
        appendElementToPath(null, "Список задач");

    if (Array.isArray(path) && path.length > 0) {
        for (let i = 0; i < path.length - 1; i++)
            appendElementToPath(path[i].id, path[i].text);
    }
}

function buildButtonCreateTask() {
    const buttonCreateTask = document.createElement('button');
    buttonCreateTask.textContent = "Добавить";
    buttonCreateTask.className = "todo-control-button-class";
    buttonCreateTask.addEventListener('click', () => {
        let newTaskName = prompt("Название задачи:");
        if (newTaskName) {
            const newTask = {};
            newTask[TODOTaskParams.NAME] = newTaskName;
            TODOStorage.createNewTask(currentRootId, newTask);
            isEditTaskMode = false;
            updateView();
        }
    });
    return buttonCreateTask;
}

function buildButtonEditTask(taskNameView) {
    const buttonEditTask = document.createElement('button');
    buttonEditTask.textContent = isEditTaskMode ? "Сохранить" : "Редактировать";
    buttonEditTask.className = "todo-control-button-class";
    buttonEditTask.addEventListener('click', () => {
        if (isEditTaskMode) {
            if(taskNameEditView) {
                TODOStorage.setTaskAttributeValue(currentRootId,
                    TODOTaskParams.NAME, taskNameEditView.value);
            }
            if (taskDescriptionEditView) {
                TODOStorage.setTaskAttributeValue(currentRootId,
                    TODOTaskParams.DESCRIPTION, taskDescriptionEditView.value);
            }
        }
        isEditTaskMode = !isEditTaskMode;
        updateView();
    });
    return buttonEditTask;
}

function buildButtonEditCancel() {
    const buttonEditTask = document.createElement('button');
    buttonEditTask.textContent = "Отмена";
    buttonEditTask.className = "todo-control-button-class";
    buttonEditTask.addEventListener('click', () => {
        isEditTaskMode = false;
        updateView();
    });
    return buttonEditTask;
}

function updateSubtaskView(taskArray) {
    const todoListList = document.getElementById('todoListList');
    todoListList.innerHTML = '';
    if (!Array.isArray(taskArray) || taskArray.length == 0) {
        todoListList.innerHTML = 'Нет задач';
        return;
    }
    taskArray.forEach(element => {
        textToInsert = element.text;
        isCompleted = element[TODOTaskParams.IS_COMPLETED];
        childrenQtty = "todos" in element ? element.todos.length : 0;
        todoListList.appendChild(buildTaskPreview(textToInsert, element.id, isCompleted, childrenQtty));
    });
}

function buildTaskPreview(name, id, isCompleted, childrenQtty) {
    const container = document.createElement('div');
    container.className = 'todo-row-container';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-row-text';
    textSpan.textContent = childrenQtty > 0 ? name + ` (${childrenQtty})` : name;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'todo-delete-btn';
    deleteButton.textContent = 'Удалить';
    deleteButton.id = id;

    const completeButton = document.createElement('button');
    completeButton.className = isCompleted ? 'todo-delete-btn' : 'todo-complete-btn';
    completeButton.textContent = isCompleted ? 'Развыполнить' : 'Выполнить';
    completeButton.id = id;

    deleteButton.addEventListener('click', function () {
        removeElementById(id);
    });

    completeButton.addEventListener('click', function () {
        setCompleteStateByTaskId(id, !isCompleted);
    });

    textSpan.addEventListener('click', function () {
        currentRootId = id;
        isEditTaskMode = false;
        updateView();
    });

    if (DEBUG_SHOW_ID_INFO) {
        const textSpanId = document.createElement('span');
        textSpanId.className = 'todo-row-text';
        textSpanId.textContent = id;
        container.appendChild(textSpanId);
    }

    container.appendChild(textSpan);
    container.appendChild(completeButton);
    container.appendChild(deleteButton);

    return container;
}

function removeElementById(id) {
    const element = TODOStorage.getTaskById(id);
    if (confirm(`Удалить: ${element.text}`)) {
        TODOStorage.deleteTaskById(id);
        isEditTaskMode = false;
        updateView();
    }
}

function setCompleteStateByTaskId(id, state) {
    const element = TODOStorage.getTaskById(id);
    if (confirm(`${state ? "Выполнить" : "Отменить выполнение"}: ${element.text}`)) {
        TODOStorage.setTaskAttributeValue(id, TODOTaskParams.IS_COMPLETED, state);
        isEditTaskMode = false;
        updateView();
    }
}

updateView();