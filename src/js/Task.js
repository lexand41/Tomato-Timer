import { RenderTomato } from "./RenderTomato";

export class Task {
  constructor(container = document.createElement('div'), key = null, newArray = []) {
    this.container = container;
    this.panelTitle = document.querySelector('.window__panel-title');
    this.countTomato = document.querySelector('.window__panel-task-text');
    this.list = document.createElement('div');
    // this.list.classList.add('list-group');
    this.newArray = newArray;
    this.key = key;
    this.notes = [];
    // this.max = 0;
    this.id = 'default'
    this.initTodo();

    container.innerHTML = '';
    container.append(this.list);
  };

  setNumbers() {
    const elems = document.querySelectorAll('.count-number');
    elems.forEach((elem, i) => {
      elem.innerHTML = i + 1;
    });
  };

  showTodo(panelTitle, countTomato) {
    this.panelTitle.textContent = panelTitle;
    this.countTomato.textContent = countTomato;
  }

  updateTodo(todo) {
    const todoList = this.getTodo();
    if (!todoList.length) {
      return;
    }
    const todoItem = todoList.find((item) => item.id === todo.id);
    const note = this.notes.find((item) => item.id === todo.id);
    todoItem.name = todo.name;
    todoItem.isActive = todo.isActive
    note.tomato = todoItem.tomato
    localStorage.setItem('todo', JSON.stringify(todoList));
  }

  updateTomatoTodo(todo) {
    const todoList = this.getTodo();
    if (!todoList.length) {
      return;
    }
    const todoItem = todoList.find((item) => item.id === todo.id);
    todoItem.tomato = todo.tomato;
    localStorage.setItem('todo', JSON.stringify(todoList));
  }

  // getNewId() {
  //   for (const note of this.notes) {
  //     if (note.id > this.max) this.max = note.id;
  //   };
  //   return this.max + 1;
  // };

  getNewId() {
    return Math.floor(Math.random() * 1e14);
  };

  addTodo(name, status = 'default') {
    let newNote = new RenderTomato(this, name, status);
    newNote.tomato = 0;
    newNote.isActive = false;
    newNote.id = this.getNewId();
    this.notes.push(newNote);
    this.saveTodo();
    
    return newNote;
  };

  removeTodo(todo) {
    if (todo instanceof RenderTomato) this.id = todo.id;
    for (let i = 0; i < this.notes.length; i++) {
      this.updateTodo(this.notes[i])
      if (this.notes[i].id === this.id) {
        if (this.notes[i].isActive) {
          this.panelTitle.textContent = 'Активировать задачу';
          this.countTomato.textContent = 'Томат 0';
        }
        this.notes.splice(i, 1);
      }
    };
    this.saveTodo();
  };

  editTodo(todo, name, status) {
    if (todo instanceof RenderTomato) this.id = todo.id;
    for (let i = 0; i < this.notes.length; i++) {
      this.updateTodo(this.notes[i]);
      if (this.notes[i].id === this.id) {
        this.notes[i].name = name;
        this.notes[i].status = status;
        if (this.notes[i].isActive) this.panelTitle.textContent = name;
      }
    };
    this.saveTodo();
  };

  doActiveTodo(todo) {
    if (todo instanceof RenderTomato) this.id = todo.id;
    for (let i = 0; i < this.notes.length; i++) {
      this.notes[i].btnTask.classList.remove('pomodoro-tasks__task-text_active');
      this.notes[i].isActive = false;

      if (this.notes[i].id === this.id) {
        this.notes[i].btnTask.classList.add('pomodoro-tasks__task-text_active');
        this.notes[i].isActive = true;
        this.showTodo(this.notes[i].name, `Томат ${this.notes[i].tomato}`);
      }
      this.updateTodo(this.notes[i]);
    };
  };

  saveTodo() {
    if (this.key) {
      const saveList = [];
      for (const note of this.notes) {
        saveList.push({
          tomato: note.tomato,
          id: note.id,
          name: note.name,
          status: note.status,
          isActive: note.isActive,
        });
      };
      localStorage.setItem(this.key, JSON.stringify(saveList));
      this.setNumbers();
    }
  };

  getTodo() {
    const todoList = JSON.parse(localStorage.getItem('todo') || '[]');
    return todoList;
  }

  initTodo() {
    let startList = this.newArray;
    this.notes = [];
    this.list.innerHTML = '';

    if (this.key) {
      let dataLS = localStorage.getItem(this.key);
      if (dataLS !== '' && dataLS !== null) startList = JSON.parse(dataLS);
    }

    if (startList.length > 0) {
      for (const obj of startList) {

        const newNote = new RenderTomato(this, obj.name, obj.status);
        if (obj.isActive) {
          this.showTodo(obj.name, `Томат ${obj.tomato}`);
          newNote.btnTask.classList.add('pomodoro-tasks__task-text_active');
        }
        newNote.name = obj.name;
        newNote.tomato = obj.tomato ?? 0;
        newNote.status = obj.status ?? 'default';
        newNote.isActive = obj.isActive ?? false;

        if (obj.id) {
          newNote.id = obj.id;
        } else {
          newNote.id = this.getNewId();
        }
        this.notes.push(newNote);
      };
    }
    this.saveTodo()
  };
};