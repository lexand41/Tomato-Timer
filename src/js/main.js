export const main = () =>{
  let count = 0;
  const imp = ['default', 'important', 'so-so'];

  document.querySelectorAll('.button-importance').forEach(item => {
    item.addEventListener('click', ({target}) => {
      count += 1;
      if (count >= imp.length) {
        count = 0;
      }
      for (let i = 0; i < imp.length; i++) {
        if (count === i) {
          target.classList.add(imp[i]);
          target.dataset.status = imp[i];
        } else {
          target.classList.remove(imp[i]);
        }
      };
    });
  });
};

