const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function (htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

HTMLElement.prototype.findElementWithClass = function (className) {
  className = className.replace('.', '');
  let element = this;
  while (element.parentElement) {
    for (const child of [...element.childNodes]) {
      if (child.classList && child.classList.contains(className)) {
        return child;
      }
    }
    element = element.parentElement;
    if (element.classList.contains(className)) {
      return element;
    }
  }
};
