import { Task } from './Task';
import { RenderToDo } from './RenderToDo';
import { Tomato } from './Tomato';

export class ControllerTomato {
  constructor({workTime, breakTime, relaxTime, tasks} = {}) {
    this.activTasks = document.querySelectorAll('.pomodoro-tasks__task-text_active');
    this.closeBtns = document.querySelectorAll('.modal-delete__close-button');
    this.modalBoxes = document.querySelectorAll('.modal-box');
    this.modals = document.querySelectorAll('.modal');
    this.pomodoroForm = document.querySelector('.pomodoro-form');
    this.modalDel = document.querySelector('#modal-delete');
    this.modalEdit = document.querySelector('#modal-edit');
    this.editInputForm = document.querySelector('#edit-name');
    this.statusEditForm = document.querySelector('#edit-status');
    this.editForm = document.querySelector('.task__edit-form');

    this.newTodo = new RenderToDo(this.pomodoroForm);
    this.newTask = new Task(this.newTodo.todoListElem, 'todo', tasks);
    this.tomato = new Tomato({
      workTime: workTime,
      breakTime: breakTime,
      relaxTime: relaxTime,
    });
    this.tomato.initTomato();
    this.newTask.setNumbers();
  }

  initControl(){
    this.newTodo.form.addEventListener('submit', (e) =>  {
      e.preventDefault();

      const newNote = this.newTodo.formSubmit(this.newTask)
      this.doDelete(newNote);
      this.doEdit(newNote);
      this.doActiv(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doDelete(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doEdit(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doActiv(newNote);
    });

    this.closeBtns.forEach(item => {
      item.addEventListener('click', () => {
        this.modals.forEach(elem => {
          elem.classList.remove('open');
        });
      });
    });

    this.modalBoxes.forEach(elem => {
      elem.addEventListener('click', (e) => {
        e._isClickWithInModal = true;
      });
    });

    this.modals.forEach(elem => {
      elem.addEventListener('click', (e) => {
        if (e._isClickWithInModal) return;
        e.currentTarget.classList.remove('open');
      });
    });
  }

  doDelete(newNote) {
    newNote.delBtn.addEventListener('click', () => {
      newNote.wrapBtns.classList.toggle('burger-popup_active');
      this.modalDel.classList.add('open');

      this.modalDel.addEventListener('click', ({target}) => {
        if (target.closest('.modal-delete__cancel-button')) {
          this.modalDel.classList.remove('open');
        } 
        if (target.closest('.modal-delete__delete-button')) {
          this.modalDel.classList.remove('open');
          newNote.delete();
        }
      }, { once: true });
    });
  }

  doEdit(newNote) {
    newNote.editBtn.addEventListener('click', () => {
      newNote.wrapBtns.classList.toggle('burger-popup_active');
      this.modalEdit.classList.add('open');

      this.statusEditForm.className = `button button-importance ${newNote.status}`;
      this.editInputForm.value = newNote.name;
      this.statusEditForm.dataset.status = newNote.status;

      this.editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newNote.edit(this.editInputForm.value, this.statusEditForm.dataset.status);
        this.modalEdit.classList.remove('open');
      }, { once: true });
    });
  }

  doActiv(newNote) {
    newNote.btnTask.addEventListener('click', () => {
      this.tomato.windowError.classList.remove('active');
      newNote.active();
      this.tomato.changeActiveBtn('work');
      this.tomato.stop();
      this.tomato.audio.pause();
      this.tomato.audio.currentTime = 0;
    });
  }
}
