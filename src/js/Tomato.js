export class Tomato {
  constructor({workTime=25, breakTime=5, relaxTime=15, tasks=[]} = {}) {
    this.btnStart = document.querySelector('.button-primary');
    this.btnStop = document.querySelector('.button-secondary');
    this.timeWindow = document.querySelector('.window__timer-text');
    this.windowError = document.querySelector('.window__error');
    this.navigationBtns = document.querySelectorAll('.window__state');
    this.panelTitle = document.querySelector('.window__panel-title');
    this.countTomato = document.querySelector('.window__panel-task-text');
    this.audio = document.querySelector('.audio');
    this.state = {
      work: workTime,
      break: breakTime,
      relax: relaxTime,
      status: 'work',
      count: 4,
      timeLeft: workTime * 60,
      isActive: false,
      timerId: 0,
    };
    this.tasksList = tasks;
    this.activeTodo = null;
  }

  initTomato() {
    this.btnStart.addEventListener('click', () => {
      if (!this.activeTodo) {
        this.windowError.classList.add('active')
        return;
      }
      if (this.state.isActive) {
        clearTimeout(this.state.timerId);
        this.state.isActive = false;
        this.btnStart.textContent = 'Старт';
      } else {
        this.state.isActive = true;
        this.btnStart.textContent = 'Пауза';
        this.startTimer();
      }
    });
    this.btnStop.addEventListener('click', () => {
      this.windowError.classList.remove('active')
      this.stop();
    });

    for (let i = 0; i < this.navigationBtns.length; i++) {
      this.navigationBtns[i].addEventListener('click', () => {
        this.changeActiveBtn(this.navigationBtns[i].dataset.use);
        this.stop();
      })
    }
    this.showTime(this.state.timeLeft);
  }

  startTimer() {
    const countdown = new Date().getTime() + this.state.timeLeft * 1000;

    this.state.timerId = setInterval(() => {
      this.state.timeLeft -= 1;
      this.showTime(this.state.timeLeft);

      if (!(this.state.timeLeft % 10)) {
        const now = new Date().getTime();
        this.state.timeLeft = Math.floor((countdown - now) / 1000);
      }

      if (this.state.timeLeft > 0 && this.state.isActive) {
        return;
      }
      clearTimeout(this.state.timerId);

      if (this.state.status === 'work') {
        this.tomatoCounter();

        if (this.activeTodo.tomato % this.state.count) {
          this.state.status = 'break';
        } else {
          this.state.status = 'relax';
        }

      } else {
        this.state.status = 'work';
      }
      this.alarm();
      this.state.timeLeft = this.state[this.state.status] * 60;
      this.changeActiveBtn(this.state.status);
      this.startTimer();
      
    }, 1000);
  }

  addTodo({title}) {
    const todo = {
      title,
      tomato: 0,
      id: Math.random().toString(16).substring(2,8),
      isActive: false,
    };
    this.tasksList.push(todo);
  };

  showTodo(panelTitle, countTomato) {
    this.panelTitle.textContent = panelTitle;
    this.countTomato.textContent = countTomato;
  }

  doActiveTodo(id) {
    for (let i = 0; i < this.tasksList.length; i++) {
      this.tasksList[i].isActive = false;

      if (this.tasksList[i].id === id) {
        this.tasksList[i].isActive = true;
        this.showTodo(this.tasksList[i].title, `Томат ${this.tasksList[i].tomato}`);
      }
    };
  }

  tomatoCounter() {
    this.activeTodo.tomato += 1;
  }

  changeActiveBtn(dataUse) {
    this.state.status = dataUse;
    for (let i = 0; i < this.navigationBtns.length; i++) {
      if (this.navigationBtns[i].dataset.use === dataUse) {
        this.navigationBtns[i].classList.add('active');
      } else {
        this.navigationBtns[i].classList.remove('active');
      }
    };
  }

  showTime(seconds=0) {
    const minutesTime = this.addZero(Math.floor(seconds / 60));
    const secondsTime = this.addZero(seconds % 60);
    this.timeWindow.textContent = `${minutesTime}:${secondsTime}`
  }

  stop() {
    clearTimeout(this.state.timerId);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state.isActive = false;
    this.btnStart.textContent = 'Старт';
    this.state.timeLeft = this.state[this.state.status] * 60;
    this.showTime(this.state.timeLeft);
  }

  alarm() {
    this.audio.play();
  }

  addZero = (n) => n < 10 ? '0' + n : n;
}