customElements.define('lx-explore', class extends HTMLElement{

	/** @type {HTMLElement[]} */
	navItems = [];

	/** @type {HTMLElement[]} */
	pageContents = [];
	constructor(){
		super();
		lx.explore = this;
		this.appendChild(document.querySelector('#template-explore').content);
		// Get Children

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});
		this.initProviders();

		this.querySelector('button.searchTrigger').addEventListener('click', event=>{
			event.preventDefault();
			this.initProviders();
			this.switchPageContent();
			this.search();
			this.navItems[0].click();
		});
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

	search(){
		let keywords = lx.explore.querySelector('input.searchText').value;

		this.navItems.forEach((navItem, index) =>{
			let providerName = navItem.id.split('-').at(-1);
			let offset = 0;
			let limit = 30;
			let pageContent = this.pageContents[index];

			navItem.addEventListener('click', async() =>{
				keywords = lx.explore.querySelector('input.searchText').value;
				if(pageContent.musicList){
					pageContent.musicList.listElement = [];
					pageContent.musicList.list = [];
					pageContent.musicList = null;
					delete pageContent.musicList;
				}
				pageContent.innerHTML = '';
				let result = await lx.providers[providerName].search({
					keywords: keywords,
					type    : 1,
					limit   : limit,
					offset  : offset,
				});

				this.renderSearchResult(pageContent, result);
				result = [];
			});

			lx.explore.addEventListener('scroll', lx.Utils.debounce(async()=>{
				keywords = lx.explore.querySelector('input.searchText').value;
				if(lx.explore.scrollTop + lx.explore.offsetHeight - lx.explore.scrollHeight > -1){
					offset += limit;
					let result = await lx.providers[providerName].search({
						keywords: keywords,
						type    : 1,
						limit   : limit,
						offset  : offset,
					});

					this.renderSearchResult(pageContent, result);
				}
			}), 4000);
		});
	}

	renderSearchResult(pageContent, result){
		// let fragment = document.createDocumentFragment();

		if(!result){
			return;
		}
		if(pageContent.musicList){
			result.songs.forEach(music=>{
				pageContent.musicList.add(music);
				pageContent.musicList.listElement.at(-1).addEventListener('click', async()=>{
					await lx.providers[music.provider].getDetails(music);
					lx.playingList.addAndPlay(music);
					lx.player.loadMusic(music);
				});
			});
		}
		else{
			pageContent.musicList = new MusicList(result.songs, ['songName', 'artistList', 'albumName', 'duration']);
			pageContent.appendChild(pageContent.musicList);
			pageContent.musicList.listElement.forEach(musicItem => {
				musicItem.addEventListener('click', async()=>{
					let music = musicItem.music;

					await lx.providers[music.provider].getDetails(music);
					lx.playingList.addAndPlay(music);
					lx.player.loadMusic(music);
				});
			});
		}
	}



});