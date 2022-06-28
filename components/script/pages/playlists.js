customElements.define('lx-playlists', class extends HTMLElement{

	navItems = [];

	pageContents = [];

	playlists = {};

	coverImgEle;

	coverEditEle;

	nameEle;

	playAllEle;

	renameEle;

	deleteEle;

	constructor(){
		super();
		lx.playlists = this;
		this.appendChild(document.querySelector('#template-playlists').content);
		this.pageContentsUI = this.querySelector('.page-contents');

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});

		// Render user playlist and add Event listeners
		this.getAllPlaylists().then(playlists=>{
			let nav = lx.playlists.querySelector('nav');
			let referenceNode = lx.playlists.querySelector('.nav-item.add');

			playlists.forEach(playlist=>{
				let navItem = document.createElement('div');

				navItem.classList.add('nav-item');
				if(playlist.name === '__favorites__'){
					navItem.innerHTML = '收藏';
					nav.insertBefore(navItem, nav.firstChild);
				}
				else{
					navItem.innerHTML = playlist.name;
					nav.insertBefore(navItem, referenceNode);
				}
				playlist.render().then(playlistUI=>{
					this.navItems.push(navItem);
					this.pageContents.push(playlistUI);

					navItem.addEventListener('click', async()=>{
						this.navItems.forEach(ele => {
							ele.removeAttribute('focus');
						});
						this.pageContents.forEach(ele => {
							ele.removeAttribute('visible');
						});
						navItem.setAttribute('focus', 'focus');
						playlistUI.setAttribute('visible', 'visible');

						lx.playlists.setAttribute('style',
							`--focus-offset:${navItem.offsetLeft}px;--focus-width:${navItem.offsetWidth}px;`);
					});
				});
			});
		});
	}

	async getFirstCover(playlist){
		let id = playlist.list[0];

		return URL.createObjectURL((await lx.storage.getCachedMusic(id)).albumCover);
	}

	async getAllPlaylists(){
		let playlists = await lx.storage.getAll('playlists');

		if(playlists.length === 0){
			let favoritePlaylist = this.generatePlaylist([], '__favorites__');

			this.playlists.__favorites__ = favoritePlaylist;
		}

		// Add methods
		playlists.forEach(playlist => {
			playlist.add = function(music){
				this.list.push(music);
				lx.storage.update('playlists', JSON.parse(JSON.stringify(playlist)));
			};

			playlist.delete = function(music){
				this.list.splice(this.list.indexOf(music), 1);
				lx.storage.update('playlists', JSON.parse(JSON.stringify(playlist)));
			};

			playlist.render = async function(){
				let pageContent = document.createElement('div');

				pageContent.classList.add('page-content');

				let musicData = await lx.storage.getSpecificCachedMusicMetadata(this.list);
				let musicList = new MusicList(
					musicData,
					['provider', 'songName', 'albumName', 'artistList', 'duration'],
					// eslint-disable-next-line no-undefined
					playlist.name === '__favorites__' ? ['play', 'addToPlayingList', 'remove'] : undefined,
					{
						name:playlist.name === '__favorites__' ? '收藏' : playlist.name,
						coverURL:playlist.cover || await lx.playlists.getFirstCover(playlist),
					}
				);

				pageContent.appendChild(musicList);

				if(this.name === '__favorites__'){
					lx.playlists.pageContentsUI.insertBefore(pageContent, lx.playlists.pageContentsUI.firstChild);
					pageContent.setAttribute('visible', 'visible');
				}
				else{
					lx.playlists.pageContentsUI.appendChild(pageContent);
				}
				return pageContent;
			};

			this.playlists[playlist.name] = playlist;
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
		return playlist;
	}

});