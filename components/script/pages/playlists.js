customElements.define('lx-playlists', class extends HTMLElement{

	navItems = [];

	pageContents = [];

	constructor(){
		super();
		lx.playLists = this;
		this.appendChild(document.querySelector('#template-playlists').content);
		// Get Children
		this.pageContentsUI = this.querySelector('.page-contents');

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});

		// For switching the default two page contents
		this.navItems.push(this.querySelector('.nav-item.favorite'), this.querySelector('.nav-item.add'));
		this.pageContents.push(this.querySelector('.playlist-favorite'), this.querySelector('.action-add'));

		for (let i = 0; i < this.navItems.length; i++){
			this.addEventListenerToNavItemForSwitch(this.navItems[i], this.pageContents[i]);
		}

		// Render user playlist and add Event listeners
		this.getAllPlaylists().then(playlists=>{
			let nav = lx.playLists.querySelector('nav');
			let referenceNode = lx.playLists.querySelector('.nav-item.add');

			playlists.forEach(playlist=>{
				let navItem = document.createElement('div');

				navItem.classList.add('nav-item');
				navItem.innerHTML = playlist.name;
				nav.insertBefore(navItem, referenceNode);
				playlist.render().then(playlistUI=>{
					this.navItems.push(navItem);
					this.pageContents.push(playlistUI);

					navItem.addEventListener('click', ()=>{
						this.addEventListenerToNavItemForSwitch(navItem, playlistUI);
					});
				});
			});
		});
	}

	addEventListenerToNavItemForSwitch(navItem, pageContent){
		navItem.addEventListener('click', ()=>{
			this.navItems.forEach(ele => {
				ele.removeAttribute('focus');
			});
			navItem.setAttribute('focus', 'focus');
			lx.playLists.setAttribute('style', `--focus-offset:${navItem.offsetLeft}px;--focus-width:${navItem.offsetWidth}px;`);

			this.pageContents.forEach(ele => {
				ele.removeAttribute('visible');
			});
			pageContent.setAttribute('visible', 'visible');
		});
	}

	async getAllPlaylists(){
		let playlists = await lx.storage.getAll('playlists');

		console.log(playlists);
		playlists.forEach(playlist => {
			playlist.add = function(music){
				this.list.push(music);
			};

			playlist.delete = function(music){
				this.list.splice(this.list.indexOf(music), 1);
			};

			playlist.render = async function(){
				let pageContent = document.createElement('div');

				pageContent.classList.add('page-content');

				let musicData = await lx.storage.getSpecificCachedMusicMetadata(this.list);
				let musicList = new MusicList(musicData, ['provider', 'songName', 'albumName', 'artistList', 'duration']);

				pageContent.appendChild(musicList);
				lx.playLists.pageContentsUI.appendChild(pageContent);
				return pageContent;
			};
		});
		return playlists;
	}

	/**
	 * 
	 * @param {string[]} list 
	 * @param {string} name 
	 * @param {Blob} cover 
	 */
	generatePlaylist(list, name, cover){
		let playlist = {
			name: name,
			list: list,
			cover: cover,
		};

		lx.storage.add('playlists', playlist);
	}

});