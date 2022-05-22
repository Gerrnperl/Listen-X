class MetaData extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-meta-data').content);
	  }
}
customElements.define('cs-meta-data', MetaData);