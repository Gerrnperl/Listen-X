customElements.define('lx-recommend', class extends HTMLElement{

	constructor(){
		super();
		lx.recommend = this;
		this.appendChild(document.querySelector('#template-recommend').content);
		// Get Children
	}

});