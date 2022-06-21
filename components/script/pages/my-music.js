class MyMusic extends HTMLElement{

	songsList;

	usrSongs = [];

	/** @type {HTMLElement} */
	tags = [];

	constructor(){
		super();
		lx.myMusic = this;
		this.appendChild(document.querySelector('#template-my-music').content);

		this.getTags();

		lx.addEventListener('lx-loaded', this.render.bind(this));

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});

		this.querySelectorAll('.nav-item').forEach((nav, index)=>{
			nav.addEventListener('click', ()=>{
				this.tags.forEach(tag=>{
					tag.removeAttribute('visible');
				});
				this.tags[index].setAttribute('visible', 'visible');
			});
		});

		this.querySelectorAll('span.content-header-item').forEach(header=>{
			header.addEventListener('click', event=>{
				let column = event.target.id.split('-').at(-1);

				// // console.log(this.songsList);
				this.songsList.sortBy(column);
			});
		});

		this.fixHeader();
	}

	// fix the position of .page-content-header when scrolling
	fixHeader(){
		this.addEventListener('scroll', ()=>{
			let header = this.querySelector('.page-content-header');
			let scrollTop = this.scrollTop;
			let headerTop = header.offsetTop;
			let headerTransform = `translateY(${scrollTop - headerTop - 48}px)`;

			if(scrollTop > 64){
				header.style.transform = headerTransform;
			}
			else{
				header.style.transform = 'none';
			}
		});
	}

	getTags(){
		this.tags.push(this.querySelector('#page-content-songs'));
		this.tags.push(this.querySelector('#page-content-albums'));
		this.tags.push(this.querySelector('#page-content-artists'));
	}

	render(){
		lx.storage.getAll('music', successEvent=>{
			let musicArr = successEvent.target.result;

			musicArr.forEach(data => {
				delete data.music.blob;
				this.usrSongs.push(data.music);
			});

			this.renderMySongs();
			this.renderAlbums();
		});
	}

	renderMySongs(){
		let mySongsUI = document.querySelector('#page-content-songs');

		this.songsList = new MusicList(this.usrSongs, ['provider', 'songName', 'albumName', 'artistList', 'duration']);
		mySongsUI.appendChild(this.songsList);
	}

	renderAlbums(){
		let albumsUI = document.querySelector('#page-content-albums');
		let fragment = document.createDocumentFragment();

		this.usrSongs.forEach(music => {
			let albumUI = document.createElement('div');

			albumUI.classList.add('album');
			albumUI.innerHTML = `
				<img src="${music.coverURL}" alt="album">
				<div class="album-name">${music.albumName}</div>`;
			fragment.appendChild(albumUI);
		});

		albumsUI.appendChild(fragment);
	}

}
customElements.define('lx-my-music', MyMusic);