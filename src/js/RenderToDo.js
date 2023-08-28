export class RenderToDo {
  constructor(container) {
    this.container = container;
    this.todoListElem = document.querySelector('.pomodoro-tasks__quest-tasks');

    this.form = document.createElement('form');
    this.form.classList.add('task-form');
    this.form.action = 'submit';

    this.input = document.createElement('input');
    this.input.classList.add('task-name', 'input-primary');
    this.input.type = 'text';
    this.input.name = 'task-name';
    this.input.id = 'task-name';
    this.input.placeholder = 'Введите название задачи';

    this.btnStatus = document.createElement('button');
    this.btnStatus.classList.add('button', 'button-importance', 'default');
    this.btnStatus.type = 'button';
    this.btnStatus.setAttribute('data-status', 'default');
    this.btnStatus.id = 'task-status';
    this.btnStatus.ariaLabel = 'Указать важность';

    this.btnAdd = document.createElement('button');
    this.btnAdd.classList.add('button', 'button-primary', 'task-form__add-button');
    this.btnAdd.type = 'submit';
    this.btnAdd.textContent = 'Добавить';

    this.form.append(this.input, this.btnStatus, this.btnAdd);
    this.container.append(this.form);

    this.notes = [];
  }

  formSubmit(todoList) {
    if (!this.input.value) return;
    const newNote = todoList.addTodo(
      this.input.value, this.btnStatus.dataset.status);
    this.btnStatus.dataset.status = 'default'
    this.btnStatus.className =
      `button button-importance ${this.btnStatus.dataset.status}`;

    this.form.reset();
    return newNote;
  }
}



