customElements.define('lx-player', class extends HTMLElement{

	/** @type {HTMLButtonElement} */
	play_pause;

	/** @type {HTMLButtonElement} */
	prevSong;

	/** @type {HTMLButtonElement} */
	nextSong;

	constructor(){
		super();
		lx.player = this;
		this.appendChild(document.querySelector('#template-player').content);
		// Get elements
		lx.audioEle = this.querySelector('audio');
		lx.track = lx.audioCtx.createMediaElementSource(lx.audioEle);
		lx.track.connect(lx.audioCtx.destination);
		this.play_pause = this.querySelector('#play-pause');
		this.prevSong = this.querySelector('#prev-song');
		this.nextSong = this.querySelector('#next-song');
		this.goto = lx.Utils.throttle(this.goto, 100);

		// Add Event Listeners
		lx.addEventListener('lx-loaded', (event=>{
			lx.playCtrl.generatePlayingList(event.detail.playList);
			let next = lx.playingList.next();

			// Do not play when first load
			this.loadMusic(next, false);
		}).bind(this));

		this.play_pause.addEventListener('click', this.switchPlayPause.bind(this));
		this.prevSong.addEventListener('click', this.gotoPrev.bind(this));
		this.nextSong.addEventListener('click', this.gotoNext.bind(this));

		lx.audioEle.addEventListener('timeupdate', ()=>{
			lx.dispatchEvent(new CustomEvent('lx-time-update', {
				detail: {
					time: lx.audioEle.currentTime,
					fmtTime: lx.Utils.formatTime(lx.audioEle.currentTime),
					duration: lx.audioEle.duration,
				},
			}));
		});

		lx.audioEle.addEventListener('ended', ()=>{
			// Free the memory of the playing music
			URL.revokeObjectURL(lx.activeMusic.objURL);
			URL.revokeObjectURL(lx.activeMusic.albumCover);
			delete lx.activeMusic.blob;
			delete lx.activeMusic;
			delete lx.activeMusic;

			this.gotoNext();
			lx.dispatchEvent(new CustomEvent('lx-music-ended'));
		});
	}

	/**
	 * 
	 * @param {music} music 
	 */
	async loadMusic(music, play = true){
		// Get blob from cache, if not, get from provider
		let data = await lx.storage.get('music', music.id);

		if(data){
			lx.activeMusic = data.music;
			lx.activeMusic.albumCover = URL.createObjectURL(data.albumCover);
			playMusic(data.music);

			lx.dispatchEvent(new CustomEvent('lx-music-loading'));
		}
		else{
			if(!music.blob){
				await this.getBlob(music);
				// TODO: ??????????????????
				lx.storage.cacheMusic(music);
			}
			lx.activeMusic = music;
			lx.activeMusic.albumCover = music.coverURL;
			playMusic(music);
			lx.dispatchEvent(new CustomEvent('lx-music-loading'));
		}
		async function playMusic(musicWithBlob){
			lx.activeMusic = musicWithBlob;
			musicWithBlob.objURL = URL.createObjectURL(musicWithBlob.blob);
			lx.audioEle.src = musicWithBlob.objURL;
			lx.dispatchEvent(new CustomEvent('lx-music-ready'));
			lx.dispatchEvent(new CustomEvent('lx-meta-data-update', {
				'detail':{
					songName: musicWithBlob.songName,
					artistList: musicWithBlob.artistList,
					coverURL: musicWithBlob.albumCover,
				}}
			));

			if(play){
				lx.player.playAudio();
			}
		}
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

	playAudio(){
		if(lx.audioCtx.state === 'suspended'){
			lx.audioCtx.resume();
		}
		lx.playing = true;
		lx.audioEle.play();
		this.play_pause.setAttribute('playing', true);
		// // requestAnimationFrame(updateCurrentTime);
	}

	pauseAudio(){
		lx.playing = false;
		lx.audioEle.pause();
		this.play_pause.setAttribute('playing', false);
	}

	goto(second){
		lx.audioEle.currentTime = second;
	}

	async gotoNext(){
		this.switchPlayPause();
		let next = lx.playingList.next();

		if (lx.jump2next && next){
			this.loadMusic(next);
		}
	}

	async gotoPrev(){
		let prev = lx.playingList.prev();

		if (prev){
			this.loadMusic(prev);
		}
	}


});