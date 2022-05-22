class MetaData extends HTMLElement{

	/** @type {HTMLElement} */
	songName;

	/** @type {HTMLElement} */
	artistName;

	/** @type {HTMLElement} */
	cover;

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-meta-data').content);
		this.songName = this.shadowRoot.querySelector('.song-name');
		this.artistName = this.shadowRoot.querySelector('.artist-name');
		this.cover = this.shadowRoot.querySelector('.cover');

		document.addEventListener('lx-meta-data-update', (event)=>{
			this.update(event.detail);
		});
	}

	update(detail){
		this.songName.innerText = detail.songName;
		this.artistName.innerText = detail.artistList.join(', ');
		this.artistName.setAttribute('title', detail.artistList.join(', '));
		this.cover.style.backgroundImage = `url(${detail.coverURL})`;
	}

}
customElements.define('lx-meta-data', MetaData);