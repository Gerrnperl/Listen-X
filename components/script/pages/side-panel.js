customElements.define('lx-side-panel', class extends HTMLElement{

	constructor(){
		super();
		lx.sidePanel = this;
		this.appendChild(document.querySelector('#template-side-panel').content);
		// Get Children
		let items = this.querySelectorAll('li.side-panel-item');

		// Set Events
		items.forEach(item => {
			item.addEventListener('click', ()=>{
				items.forEach(ele => {
					ele.removeAttribute('focus');
				});
				item.setAttribute('focus', 'focus');
			});
		});
	}

});