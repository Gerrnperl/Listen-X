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
		this.coverImgEle = this.querySelector('#playlist-cover-img');
		this.coverEditEle = this.querySelector('#playlist-cover-edit');
		this.nameEle = this.querySelector('#playlist-name');
		this.playAllEle = this.querySelector('#playlist-play-all');
		this.renameEle = this.querySelector('#playlist-rename');
		this.deleteEle = this.querySelector('#playlist-delete');

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

					navItem.addEventListener('click', ()=>{
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

						this.coverImgEle.setAttribute('src', playlist.cover);
						this.nameEle.innerHTML = playlist.name === '__favorites__' ? '收藏' : playlist.name ;
					});
				});
			});
		});
	}

	async getAllPlaylists(){
		let playlists = await lx.storage.getAll('playlists');

		if(playlists.length === 0){
			this.generatePlaylist([], '__favorites__');
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
				let musicList = new MusicList(musicData,
					['provider', 'songName', 'albumName', 'artistList', 'duration']);

				pageContent.appendChild(musicList);
				lx.playlists.pageContentsUI.appendChild(pageContent);
				if(this.name === '__favorites__'){
					pageContent.setAttribute('visible', 'visible');
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

		this.playlists.__favorites__ = playlist;
		lx.storage.add('playlists', playlist);
	}

});