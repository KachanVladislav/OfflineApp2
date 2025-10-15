class TODOStorageClass 
{
    /**
     * Create new task under idRoot task
     * @param {string} text - New task name
     * @param {string} idRoot - Id of root task, null for new 1st level root task
     */
    createNewTask(text, idRoot){
        let stored = this.#getStoredDB();
        let root = stored;
        if(idRoot) {
            root = this.#findById(stored, idRoot);
            if(!root)
                return;
            if(!root.todos)
                root.todos = [];
        }
        
        const item = {id : this.#generateId(), text : text};
        root.todos.push(item);
        this.#saveDB(stored);
    }
    /**
     * Get task by id
     * @param {string} id - Task id, null for root task
     * @returns {id, text, todos[]}
     */
    getTaskById(id) {
        if(id)
            return this.#findById(this.#getStoredDB(), id);
        return this.#getStoredDB();
    }
    /**
     * Get array of {id, text} that represent path to task including task
     * @param {string} id - Task id
     * @returns {[{id, text}]}
     */
    getTaskParentsById(id) {
        let result = [];
        function findNestedPath(obj, path = []) {
            const newPath = [...path];
            if("id" in obj)
                newPath.push({id : obj.id, text : obj.text});
            if (obj.id == id) {
                result = newPath;
                return;
            }
            if ("todos" in obj && obj.todos.length > 0) {
                obj.todos.forEach(element => {
                    findNestedPath(element, newPath);
                });
            } 
        }
        let stored = this.#getStoredDB();
        findNestedPath(stored);
        return result;       
    }
    /**
     * Delete task by id
     * @param {string} id - Task id 
     */
    deleteTaskById(id) {
        function deleteElementIfIdSameNested(obj, parent, id, indexOfObjectInParent) {
            if ("id" in obj && obj.id === id) {
                parent.splice(indexOfObjectInParent, 1);
                return;
            }
            if ("todos" in obj && obj.todos.length > 0) {
                for (let i = 0; i < obj.todos.length; i++) {
                    deleteElementIfIdSameNested(obj.todos[i], obj.todos, id, i);
                }
            } 
        }
        let stored = this.#getStoredDB();
        deleteElementIfIdSameNested(stored, null, id, null);       
        this.#saveDB(stored);
    }
    /**
     * Set tasks complete state by id
     * @param {string} id - Task id
     * @param {boolean} state - Complete state
     */
    setTaskCopleteStateById(id, state) {
        function setTuskCompleteNested(obj) {
            if ("id" in obj && obj.id === id) {
                obj.isCompleted = state;
            }
            if ("todos" in obj && obj.todos.length > 0) {
                obj.todos.forEach(element => {
                    setTuskCompleteNested(element);
                });
            } 
        }
        let stored = this.#getStoredDB();
        setTuskCompleteNested(stored, null, id, null);       
        this.#saveDB(stored);
    }
    /**
     * Return current DB
     * {todos: [
     *  {id, text, todos: [
     *      ]},
     *  {id, tex}
     * ]}
     */
    #getStoredDB() {
        let stored = localStorage.getItem('TODO_LIST_DATA_JSON');
        if(!stored) 
            stored = `{"todos" :[]}`;
        stored = JSON.parse(stored);
        if(!stored.todos)
            stored = JSON.parse(`{"todos" :[]}`);
        return stored;
    }
    /**
     * Save db as current database
     * @param {*} db - DB data to save
     */
    #saveDB(db)
    {
        localStorage.setItem('TODO_LIST_DATA_JSON', JSON.stringify(db));
    }
    /**
     * Return new unique id (thx Grok)
     * @returns {string} Unique id
     */
    #generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    /**
     * Return task from rootTask by id (recursive)
     * @param {Task} rootTask - Root task
     * @param {string} id - Task id
     * @returns {Task} - undefined if not found
     */
    #findById(json, id) {
        function iter(a) {
            if (a.id === id) {
                result = a;
                return true;
            }
            return a.todos && Array.isArray(a.todos) && a.todos.some(iter);
        }

        let result;
        json.todos.some(iter);
        return result
    }
};