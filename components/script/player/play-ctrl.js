class playCtrl extends HTMLElement{

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-play-ctrl').content);
	}

}
customElements.define('lx-play-ctrl', playCtrl);