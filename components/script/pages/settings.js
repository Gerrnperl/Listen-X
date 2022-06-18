customElements.define('lx-settings', class extends HTMLElement{

	constructor(){
		super();
		lx.settings = this;
		this.appendChild(document.querySelector('#template-settings').content);
		// Get Children

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});
	}

});