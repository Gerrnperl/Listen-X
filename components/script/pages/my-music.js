class MyMusic extends HTMLElement{

	songsList;

	constructor(){
		super();
		lx.myMusic = this;
		this.appendChild(document.querySelector('#template-my-music').content);
		// Get Children
		this.renderMySongs();

		this.addEventListener('mouseover', event=>{
			event.stopPropagation();
		});

		this.querySelectorAll('span.content-header-item').forEach(header=>{
			header.addEventListener('click', event=>{
				let column = event.target.id.split('-').at(-1);

				console.log(this.songsList);
				this.songsList.sortBy(column);
				// this.renderMySongs();
			});
		});

		// fix the position of .page-content-header when scrolling
		this.addEventListener('scroll', ()=>{
			let header = this.querySelector('.page-content-header');
			let scrollTop = this.scrollTop;
			let headerTop = header.offsetTop;
			let headerTransform = `translateY(${scrollTop - headerTop + 33}px)`;

			if(scrollTop > 64){
				header.style.transform = headerTransform;
			}
			else{
				header.style.transform = 'none';
			}
		});
	}

	renderMySongs(){
		let mySongsUI = document.querySelector('#page-content-songs');

		lx.storage.getAll('music', successEvent=>{
			let datas = successEvent.target.result;
			let usrSongs = [];

			datas.forEach(data => {
				usrSongs.push(data.music);
			});

			this.songsList = new MusicList(usrSongs,['provider', 'songName','albumName','artistList', 'duration']);
			mySongsUI.appendChild(this.songsList);
		});
	}

}
customElements.define('lx-my-music', MyMusic);