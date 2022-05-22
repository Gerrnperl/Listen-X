class Player extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
		this.attachShadow({mode: 'open'})
		this.shadowRoot.innerHTML = document.querySelector('#template-player').content;
	  }
}
customElements.define('cs-player', Player);