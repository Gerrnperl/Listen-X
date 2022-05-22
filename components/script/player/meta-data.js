class MetaData extends HTMLElement {

	/**@type {HTMLElement} */
	songName = undefined;
	/**@type {HTMLElement} */
	artistName = undefined;
	/**@type {HTMLElement} */
	cover = undefined;

	constructor() {
		// Always call super first in constructor
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-meta-data').content);
		this.songName = this.shadowRoot.querySelector('.song-name');
		this.artistName = this.shadowRoot.querySelector('.artist-name');
		this.cover = this.shadowRoot.querySelector('.cover');
	}

	update(songName, artistList, coverURL) {
		this.songName.innerText = songName;
		this.artistName.innerText = artistList.join(', ');
		this.artistName.setAttribute('title', artistList.join(', '));
		this.cover.style.backgroundImage = `url(${coverURL})`;
	}
}
customElements.define('cs-meta-data', MetaData);