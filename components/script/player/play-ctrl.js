class playCtrl extends LxHTMLElement{

	constructor(){
		super();
		this.shadowRoot.appendChild(document.querySelector('#template-play-ctrl').content);
	}

}
customElements.define('lx-play-ctrl', playCtrl);