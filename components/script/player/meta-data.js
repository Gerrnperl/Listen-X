class MetaData extends HTMLElement{

	/** @type {HTMLElement} */
	songNameEle;

	/** @type {HTMLElement} */
	artistNameEle;

	/** @type {HTMLElement} */
	coverEle;

	constructor(){
		super();
		lx.metaData = this;
		this.appendChild(document.querySelector('#template-meta-data').content);
		// Get Children
		this.songNameEle = this.querySelector('.song-name');
		this.artistNameEle = this.querySelector('.artist-name');
		this.coverEle = this.querySelector('.cover');

		lx.addEventListener('lx-meta-data-update', (event)=>{
			this.update(event.detail);
		});

		// change the lyric-mode of lx-lyric and lx-player
		this.addEventListener('click', ()=>{
			lx.lyricMode = !lx.lyricMode;
			lx.player.setAttribute('lyric-mode', lx.lyricMode);
			lx.lyric.setAttribute('lyric-mode', lx.lyricMode);
		});
	}

	update(detail){
		this.songNameEle.innerText = detail.songName;
		this.artistNameEle.innerText = detail.artistList.join(', ');
		this.artistNameEle.setAttribute('title', detail.artistList.join(', '));
		this.coverEle.style.backgroundImage = `url(${detail.coverURL})`;
	}

}
customElements.define('lx-meta-data', MetaData);