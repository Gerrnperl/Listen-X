customElements.define('lx-side-panel', class extends HTMLElement{

	constructor(){
		super();
		lx.sidePanel = this;
		this.appendChild(document.querySelector('#template-side-panel').content);
		// Get Children
		let items = this.querySelectorAll('li.side-panel-item');
		let pages = this.querySelectorAll('.spi-page');

		// Set Events
		items.forEach(item => {
			item.addEventListener('click', ()=>{
				items.forEach(ele => {
					ele.removeAttribute('focus');
				});
				item.setAttribute('focus', 'focus');
			});
		});

		pages.forEach(page => {
			let navItems = page.querySelectorAll('.nav-item');

			navItems.forEach(navItem => {
				// change the viewing tab when click
				navItem.addEventListener('click', ()=>{
					navItems.forEach(ele => {
						ele.removeAttribute('focus');
					});
					navItem.setAttribute('focus', 'focus');
					page.setAttribute('style', `--focus-offset:${navItem.offsetLeft}px;--focus-width:${navItem.offsetWidth}px;`);
				});
			});
		});

		// fix the position of nav when scrolling
		pages.forEach(page => {
			page.addEventListener('scroll', ()=>{
				let nav = page.querySelector('nav');
				let scrollTop = page.scrollTop;

				if(scrollTop > 64){
					let header = this.querySelector('nav');
					let headerTop = header.offsetTop;

					nav.style.transform = `translateY(${scrollTop - headerTop }px)`;
				}
				else{
					nav.style.transform = 'none';
				}
			});
		});

		this.addEventListener('mouseover', ()=>{
			this.setAttribute('open', 'true');
		});
		this.addEventListener('mouseout', ()=>{
			this.setAttribute('open', 'false');
		});
	}

});