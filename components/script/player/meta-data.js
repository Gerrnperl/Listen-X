class MetaData extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
		this.querySelector('.song-name').innerHTML = 'Songname';
	  }
}
customElements.define('cs-meta-data', MetaData);