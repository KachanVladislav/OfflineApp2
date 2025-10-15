const TODOStorage = new TODOStorageClass();
let currentRootId = null;
const DEBUG_SHOW_ID_INFO = false;

function updateView()
{
    setTaskView(TODOStorage.getTaskById(currentRootId).todos);
    setPathViewAccordingToTaskId(currentRootId);
}

function removeElementById(id)
{
    const element = TODOStorage.getTaskById(id);
    if(confirm(`Удалить: ${element.text}`)) {
        TODOStorage.deleteTaskById(id);
        updateView();
    }
}

function setCompleteStateByTaskId(id, state)
{
    const element = TODOStorage.getTaskById(id);
    if(confirm(`${state ? "Выполнить" : "Отменить выполнение"}: ${element.text}`)) {
        TODOStorage.setTaskCopleteStateById(id, state);
        updateView();
    }
}

function setPathViewAccordingToTaskId(id)
{
    const pathView = document.getElementById('todoListPathView');
    
    function appendElementToPath(id, name) {
        const element = document.createElement('h2');
        if(DEBUG_SHOW_ID_INFO)
            element.textContent = id + " " + name;    
        else
            element.textContent = name;
        pathView.appendChild(element);
        element.addEventListener('click', ()=> {
            currentRootId = id;
            updateView();
        });
    }
    
    pathView.innerHTML = '';
    appendElementToPath(null, "Все задачи");
    
    const path = TODOStorage.getTaskParentsById(id);
    if(Array.isArray(path))
        path.forEach(item => {
            appendElementToPath(item.id, item.text);
    });
}

function setTaskView(taskArray)
{
    const todoListList = document.getElementById('todoListList');
    todoListList.innerHTML = '';
    if(!Array.isArray(taskArray) || taskArray.length == 0)
    {
        todoListList.innerHTML = 'Нет задач';
        return;
    }
    taskArray.forEach(element => {
        textToInsert = element.text;
        isCompleted = element.isCompleted;
        childrenQtty = "todos" in element ? element.todos.length : 0;
        todoListList.appendChild(buildTaskPreview(textToInsert, element.id, isCompleted, childrenQtty));
    });
}

function buildTaskPreview(name, id, isCompleted, childrenQtty)
{    
    const container = document.createElement('div');
    container.className = 'todo-row-container';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-row-text';
    textSpan.textContent = childrenQtty > 0 ? name + ` (${childrenQtty})` : name;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'todo-delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.id = id;

    const completeButton = document.createElement('button');
    completeButton.className = isCompleted ? 'todo-delete-btn' : 'todo-complete-btn';
    completeButton.textContent = isCompleted ? 'Uncomplete' : 'Complete';
    completeButton.id = id;
    
    deleteButton.addEventListener('click', function () {
        removeElementById(id);
    });

    completeButton.addEventListener('click', function () {
        setCompleteStateByTaskId(id, !isCompleted);
    });

    textSpan.addEventListener('click', function () {
        currentRootId = id;
        updateView();
    });

    if(DEBUG_SHOW_ID_INFO){
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

document.getElementById('todoListButtonAdd').addEventListener('click', ()=> {
    const todoListInputToAdd = document.getElementById('todoListInputToAdd');
    TODOStorage.createNewTask(todoListInputToAdd.value, currentRootId);
    updateView();
});

document.getElementById('todoListButtonCopyDB').addEventListener('click', ()=>
{
    navigator.clipboard
      .writeText(JSON.stringify(TODOStorage.getTaskById(null)))
      .then(() => {
        alert("successfully copied");
      })
      .catch(() => {
        alert("something went wrong");
      });
});

updateView();