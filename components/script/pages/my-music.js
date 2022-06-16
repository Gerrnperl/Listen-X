class MyMusic extends HTMLElement{

	constructor(){
		super();
		lx.myMusic = this;
		this.appendChild(document.querySelector('#template-my-music').content);
		// Get Children
	}

}
customElements.define('lx-my-music', MyMusic);