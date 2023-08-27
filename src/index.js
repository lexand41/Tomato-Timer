import './index.html';
import './scss/index.scss';
import { main } from './js/main';
import { Tomato } from './js/Tomato';



const init = () => {
  const tomato = new Tomato({
    workTime: 3,
    breakTime: .5,
    relaxTime: 1.5,
  });
  tomato.initTomato();

  main();
};

init();


















