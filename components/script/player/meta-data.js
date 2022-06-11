class MetaData extends LxHTMLElement{

	/** @type {HTMLElement} */
	songNameEle;

	/** @type {HTMLElement} */
	artistNameEle;

	/** @type {HTMLElement} */
	coverEle;

	constructor(){
		super();
		this.shadowRoot.appendChild(document.querySelector('#template-meta-data').content);
		// Get Children
		this.songNameEle = this.shadowRoot.querySelector('.song-name');
		this.artistNameEle = this.shadowRoot.querySelector('.artist-name');
		this.coverEle = this.shadowRoot.querySelector('.cover');

		lx.addEventListener('lx-meta-data-update', (event)=>{
			this.update(event.detail);
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