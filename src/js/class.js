export class Tomato {
  #title;
  #count;
  constructor(title, count = 0) {
    this.id = Math.floor(Math.random() * 1e6);
    this.#title = title;
    this.#count = count;
  }

  changeCount() {
    this.#count += 1;
    return this;
  }

  changeTitle(title) {
    this.#title = title;
    return this;
  }

  get count() {
    return this.#count;
  }

  get title() {
    return this.#title;
  }

};

export const tomato_1 = new Tomato('Создать сайт');

