customElements.define('lx-plugins', class extends HTMLElement{

	constructor(){
		super();
		lx.plugins = this;
		this.appendChild(document.querySelector('#template-plugins').content);
		// Get Children
	}

});