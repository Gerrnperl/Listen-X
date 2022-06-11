class Player extends LxHTMLElement{

	/** @type {HTMLButtonElement} */
	play_pause;

	constructor(){
		super();
		this.shadowRoot.appendChild(document.querySelector('#template-player').content);
		lx.audioEle = this.shadowRoot.querySelector('audio');
		lx.track = lx.audioCtx.createMediaElementSource(lx.audioEle);
		lx.track.connect(lx.audioCtx.destination);
		this.goto = Helper.throttle(this.goto, 100);

		lx.addEventListener('lx-loaded', event=>{
			this.loadMusic(event.detail.playList[0]);
			// todo: init playing list
		});
		this.play_pause = this.shadowRoot.querySelector('#play-pause');
		this.play_pause.addEventListener('click', ()=>{
			this.switchPlayPause();
		});
		lx.audioEle.addEventListener('timeupdate', ()=>{
			lx.dispatchEvent(new CustomEvent('lx-time-update', {
				detail: {
					time: lx.audioEle.currentTime,
					fmtTime: Helper.formatTime(lx.audioEle.currentTime),
					duration: lx.audioEle.duration,
				},
			}));
		});
	}

	/**
	 * 
	 * @param {music} music 
	 */
	async loadMusic(music){
		if(!music.blob){
			await this.getBlob(music);
		}
		let audioURL = URL.createObjectURL(music.blob);

		lx.audioEle.src = audioURL;
		lx.dispatchEvent(new CustomEvent('lx-music-ready', {
			'detail':{
				music,
			}}
		));
		console.log(music);
		lx.dispatchEvent(new CustomEvent('lx-meta-data-update', {
			'detail':{
				songName: music.songName,
				artistList: music.artistList,
				coverURL: music.coverURL,
			}}
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

	switchPlayPause(){
		lx.playing ? this.pauseAudio() : this.playAudio();
	}

	/**
	 * 播放
	 */
	playAudio(){
		if(lx.audioCtx.state === 'suspended'){
			lx.audioCtx.resume();
		}
		lx.playing = true;
		lx.audioEle.play();
		this.play_pause.setAttribute('playing', true);
		// // requestAnimationFrame(updateCurrentTime);
	}

	/**
	 * 暂停
	 */
	pauseAudio(){
		lx.playing = false;
		lx.audioEle.pause();
		this.play_pause.setAttribute('playing', false);
	}

	/**
	 * 跳转进度
	 */
	goto(second){
		lx.audioEle.currentTime = second;
	}

}
customElements.define('lx-player', Player);