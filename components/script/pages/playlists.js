customElements.define('lx-playlists', class extends HTMLElement{

	constructor(){
		super();
		lx.playLists = this;
		this.appendChild(document.querySelector('#template-playlists').content);
		// Get Children
	}

});