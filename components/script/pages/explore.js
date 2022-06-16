customElements.define('lx-explore', class extends HTMLElement{

	constructor(){
		super();
		lx.myMusic = this;
		this.appendChild(document.querySelector('#template-explore').content);
		// Get Children
	}

});