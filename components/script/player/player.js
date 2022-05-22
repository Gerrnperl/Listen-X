class Player extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
		this.attachShadow({mode: 'open'}).appendChild(
			document.createElement('cs-meta-data')
		  );
	  }
}
customElements.define('cs-player', Player);