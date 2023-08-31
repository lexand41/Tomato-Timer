import { Task } from './Task';
import { Tomato } from './Tomato';
import { RenderTomato } from './RenderTomato';

export class ControllerTomato {
  constructor({workTime, breakTime, relaxTime, tasks} = {}) {
    this.todoListElem = document.querySelector('.pomodoro-tasks__quest-tasks');
    this.closeBtns = document.querySelectorAll('.modal-delete__close-button');
    this.modalBoxes = document.querySelectorAll('.modal-box');
    this.modals = document.querySelectorAll('.modal');
    this.pomodoroForm = document.querySelector('.pomodoro-form');
    this.modalDel = document.querySelector('#modal-delete');
    this.modalEdit = document.querySelector('#modal-edit');
    this.editInputForm = document.querySelector('#edit-name');
    this.statusEditForm = document.querySelector('#edit-status');
    this.editForm = document.querySelector('.task__edit-form');
    this.editBtn = this.editForm.querySelector('.button-primary');

    this.newTask = new Task(this.todoListElem, 'todo', tasks);

    this.tomato = new Tomato({
      workTime: workTime,
      breakTime: breakTime,
      relaxTime: relaxTime,
    });

    this.tomato.initTomato();
    this.newTask.setNumbers();
  }

  initControl(){
    const {form, input, btnStatus} = RenderTomato.renderAddForm()

    form.addEventListener('submit', (e) =>  {
      e.preventDefault();
      if (!input.value) return;
      const newNote =
        this.newTask.addTodo(input.value, btnStatus.dataset.status);
      btnStatus.dataset.status = 'default'
      btnStatus.className =
        `button button-importance ${btnStatus.dataset.status}`;

      form.reset();
      this.doDelete(newNote);
      this.doEdit(newNote);
      this.doActive(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doDelete(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doEdit(newNote);
    });

    this.newTask.notes.forEach(newNote => {
      this.doActive(newNote);
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
      this.editBtn.disabled = false;

      this.editInputForm.addEventListener('input', () => {
        if (this.editInputForm.value) {
          this.editBtn.disabled = false;
        } else {
          this.editBtn.disabled = true;
        }
      })

      this.editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newNote.edit(this.editInputForm.value, this.statusEditForm.dataset.status);
        this.modalEdit.classList.remove('open');
      }, { once: true });
    });
  }

  doActive(newNote) {
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
