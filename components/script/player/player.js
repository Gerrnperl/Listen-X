class Player extends HTMLElement{

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-player').content);
	}

}
customElements.define('lx-player', Player);