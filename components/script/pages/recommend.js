customElements.define('lx-recommend', class extends HTMLElement{

	/** @type {HTMLElement[]} */
	navItems = [];

	/** @type {HTMLElement[]} */
	pageContents = [];
	constructor(){
		super();
		lx.recommend = this;
		this.appendChild(document.querySelector('#template-recommend').content);
		// Get Children

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});


		this.initProviders();
		this.switchPageContent();
	}

	initProviders(){
		this.querySelector('nav').innerHTML = '';
		this.querySelector('.page-contents').innerHTML = '';
		this.navItems = [];
		this.pageContents = [];
		for (const name in lx.providers){
			if (Object.hasOwnProperty.call(lx.providers, name)){
				const provider = lx.providers[name];
				let navItem = document.createElement('div');

				navItem.classList.add('nav-item');
				navItem.id = `nav-item-${name}`;
				navItem.innerHTML = provider.displayName;

				let pageContent = document.createElement('div');

				pageContent.classList.add('page-content');

				this.navItems.push(navItem);
				this.pageContents.push(pageContent);

				this.querySelector('nav').appendChild(navItem);
				this.querySelector('.page-contents').appendChild(pageContent);
			}
		}
	}

	switchPageContent(){
		this.navItems.forEach((navItem, index) =>{
			navItem.addEventListener('click', async()=>{
				this.navItems.forEach(ele => {
					ele.removeAttribute('focus');
				});
				this.pageContents.forEach(ele => {
					ele.removeAttribute('visible');
				});
				navItem.setAttribute('focus', 'focus');
				this.pageContents[index].setAttribute('visible', 'visible');

				lx.explore.setAttribute('style',
					`--focus-offset:${navItem.offsetLeft}px;--focus-width:${navItem.offsetWidth}px;`);
			});
		});
	}

});