import { Task } from "./Task";

export class RenderTomato {
  #name = '';
  #status = 'default';
  constructor(container, name='New task', status = 'default') {
    this.renderTasks(container)
    this.name = name;
    this.status = status;
    this.container = container;
  }

  renderTasks(container) {
    this.container = container;
    this.item = document.createElement('li');
    this.item.classList.add('pomodoro-tasks__list-task');

    this.number = document.createElement('span');
    this.number.classList.add('count-number');
    this.number.textContent = `1`;

    this.btnTask = document.createElement('button');
    this.btnTask.classList.add('pomodoro-tasks__task-text');

    this.popupMenu = document.createElement('button');
    this.popupMenu.classList.add('pomodoro-tasks__task-button', 'tuch-aria');

    this.wrapBtns = document.createElement('div');
    this.wrapBtns.classList.add('burger-popup');

    this.editBtn = document.createElement('button');
    this.editBtn.classList.add('popup-button', 'burger-popup__edit-button');
    this.editBtn.textContent ='Редактировать';

    this.delBtn = document.createElement('button');
    this.delBtn.classList.add('popup-button', 'burger-popup__delete-button');
    this.delBtn.textContent ='Удалить';

    this.wrapBtns.append(this.editBtn, this.delBtn);
    this.item.append(this.number, this.btnTask, this.popupMenu, this.wrapBtns);
    
    if (container instanceof Task) {
      container.list.append(this.item);
    } else {
      container.append(this.item);
    }

    this.popupMenu.addEventListener('click', () => {
      this.wrapBtns.classList.toggle('burger-popup_active');
    });

    document.addEventListener('click', ({target}) => {
      if (target.closest('.pomodoro-tasks__task-button')) return;
      this.wrapBtns.classList.remove('burger-popup_active');
    });
  }

  static renderAddForm() {
    const pomodoroForm = document.querySelector('.pomodoro-form');

    const form = document.createElement('form');
    form.classList.add('task-form');
    form.action = 'submit';

    const input = document.createElement('input');
    input.classList.add('task-name', 'input-primary');
    input.type = 'text';
    input.name = 'task-name';
    input.id = 'task-name';
    input.placeholder = 'Введите название задачи';

    const btnStatus = document.createElement('button');
    btnStatus.classList.add('button', 'button-importance', 'default');
    btnStatus.type = 'button';
    btnStatus.setAttribute('data-status', 'default');
    btnStatus.id = 'task-status';
    btnStatus.ariaLabel = 'Указать важность';

    const btnAdd = document.createElement('button');
    btnAdd.classList.add('button', 'button-primary', 'task-form__add-button');
    btnAdd.type = 'submit';
    btnAdd.textContent = 'Добавить';

    form.append(input, btnStatus, btnAdd);
    pomodoroForm.append(form);

    return {form, input, btnStatus}
  }

  set name(value) {
    this.#name = value;
    this.btnTask.textContent = value;
  }

  get name() {
    return this.#name;
  }

  set status(value) {
    this.#status = value;
    this.item.classList.add(value);
    if (this.container instanceof Task) {
      this.container.saveTodo();
    }
  }

  get status() {
    return this.#status;
  }

  delete() {
    this.item.remove();
    if (this.container instanceof Task) {
      this.container.removeTodo(this);
    }
  }

  edit(value, status) {
    this.item.className = `pomodoro-tasks__list-task ${status}`;
    this.btnTask.textContent = value;
    if (this.container instanceof Task) {
      this.container.editTodo(this, value, status);
    }
  }

  active() {
    if (this.container instanceof Task) {
      this.container.doActiveTodo(this);
    }
  }
};