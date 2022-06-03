class ProgressCtrl extends HTMLElement{

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-progress').content);
	}


}
customElements.define('lx-progress-ctrl', ProgressCtrl);