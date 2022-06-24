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
		this.switchPageContent();

		this.querySelector('button.searchTrigger').addEventListener('click', event=>{
			event.preventDefault();
			this.search();
		});
	}

	initProviders(){
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
				delete pageContent.musicList;
				pageContent.innerHTML = '';
				let result = await lx.providers[providerName].search({
					keywords: keywords,
					type    : 1,
					limit   : limit,
					offset  : offset,
				});

				this.renderSearchResult(pageContent, result);
			});

			lx.explore.addEventListener('scroll', lx.Utils.debounce(async()=>{
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
		this.navItems[0].click();
	}

	renderSearchResult(pageContent, result){
		// let fragment = document.createDocumentFragment();

		if(!result){
			return;
		}
		if(pageContent.musicList){
			result.songs.forEach(music=>{
				pageContent.musicList.add(music);
			});
		}
		else{
			pageContent.musicList = new MusicList(result.songs, ['songName', 'artistList', 'albumName', 'duration']);
			pageContent.appendChild(pageContent.musicList);
		}
		// result.songs.forEach(musicSummary => {
		// 	let li = document.createElement('li');

		// 	li.className = 'music-list-item';
		// 	li.music = musicSummary;

		// 	li.innerHTML = `
		// 		<span class="music-list-item-songName">${musicSummary.songName}</span>
		// 		<span class="music-list-item-artistList">${musicSummary.artistList.join(', ')}</span>
		// 		<span class="music-list-item-albumName">${musicSummary.albumName}</span>
		// 		<span class="music-list-item-duration">${lx.Utils.formatTime(musicSummary.duration).split('.')[0]}</span>
		// 	`;
		// 	pageContent.appendChild(li);
		// });
	}



});