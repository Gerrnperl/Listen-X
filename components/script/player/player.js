class Player extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
		this.appendChild(document.createElement('div'));
	  }
}
customElements.define('cs-player', Player);