class Player extends HTMLElement{

	/** @type {HTMLAudioElement} */
	audioEle;

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(document.querySelector('#template-player').content);
		this.audioEle = this.shadowRoot.querySelector('audio');
		lx.addEventListener('lx-loaded', event=>{
			this.loadMusic(event.detail.playList[0]);
			// todo: init playing list
		});
	}

	async loadMusic(music){
		if(!music.blob){
			await this.getBlob(music);
		}
		let audioURL = URL.createObjectURL(music.blob);

		this.audioEle.src = audioURL;
		lx.dispatchEvent(new CustomEvent('lx-music-ready',
			{
				'detail':{
					playList: await lx.getStoregedPlayingList(),
				},
			}
		));
	}

	async getBlob(music){
		let response = await fetch(music.url, {
			method: 'GET',
		});
		let blob = await response.blob();

		// ! assdd
		// TODO: cache blob
		music.blob = blob;
		return music;
	}


}
customElements.define('lx-player', Player);