class Button {
  constructor(text, wide, shiftText, code) {
    this.node = null;
    this.wide = wide;
    this.text = text;
    this.code = code;
    this.shiftText = shiftText;
  }

  init(lang) {
    this.node = document.createElement('button');
    this.node.classList.add('keyboard__key');
    this.node.innerText = this.text[lang];
    switch (this.wide) {
      case 'short': {
        this.node.classList.add('keyboard__key--short');
        break;
      }
      case 'wide': {
        this.node.classList.add('keyboard__key--wide');
        break;
      }
      case 'extra-wide': {
        this.node.classList.add('keyboard__key--extra-wide');
        break;
      }
      default: break;
    }
    return this.lang;
  }
}

export default Button;
