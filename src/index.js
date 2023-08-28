import './index.html';
import './scss/index.scss';
import { main } from './js/main';
import { ControllerTomato } from './js/ControllerTomato';


const init = () => {
  const control = new ControllerTomato({
    workTime: 1,
    breakTime: .5,
    relaxTime: 1.5,
    tasks: [
      {name: 'Купить слона'},
      {name: 'Помыть слона'},
    ]
  });
  control.initControl()
  main();
}

init();


















