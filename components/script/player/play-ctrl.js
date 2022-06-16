class PlayCtrl extends HTMLElement{

	playModeSwitcher;
	playModeContainer;
	playingListPanel;
	playingList;
	playingListTrigger;

	constructor(){
		super();
		lx.playCtrl = this;
		this.appendChild(document.querySelector('#template-play-ctrl').content);
		// Get Children
		this.playModeSwitcher = this.querySelector('#play-mode-switcher');
		this.playModeContainer = this.querySelector('#play-mode-selector-container');
		this.playingList = this.querySelector('#playing-list');
		this.playingListPanel = this.querySelector('#playing-list-panel');
		this.playingListTrigger = this.querySelector('#playing-list-trigger');
		this.volumeTrigger = this.querySelector('#volume');
		this.volumeSlider = this.querySelector('#volume-slider');

		// TODO:This `0.5` should be replaced by user-configued value
		lx.addEventListener('lx-loaded', ()=>{
			this.changeVolume(0.5);
		});

		// Switch play mode
		this.querySelectorAll('#play-mode-selector-container li.play-mode').forEach(li=>{
			li.addEventListener('click', event=>{
				let playMode = event.target.getAttribute('play-mode');

				lx.config.playMode = playMode;
				this.playModeSwitcher.setAttribute('play-mode', playMode);
			});
		});

		// Pop up playModeSwitcher & Hide others
		this.playModeSwitcher.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'true');
			this.playingListPanel.setAttribute('visible', 'false');
			this.volumeSlider.parentElement.setAttribute('visible', 'false');
			lx.player.setAttribute('viewing-playing-list', 'false');
		});

		// Pop up playingList & Hide others
		this.playingListTrigger.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'true');
			this.volumeSlider.parentElement.setAttribute('visible', 'false');
			lx.player.setAttribute('viewing-playing-list', 'true');
		});

		// Hide all
		document.body.addEventListener('click', () => {
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'false');
			this.volumeSlider.parentElement.setAttribute('visible', 'false');
			lx.player.setAttribute('viewing-playing-list', 'false');
		});

		// React to `volume-slider`'s change
		this.volumeSlider.addEventListener('input', event => {
			this.changeVolume(event.target.value / 100);
		});

		// Prevent the volumeSlider's click event from bubbling up to the parent;
		this.volumeSlider.addEventListener('click', event => {
			event.stopPropagation();
		});

		// React to `volume-trigger`'s click
		// Pop up volumeSlider & Hide others when the width of window is less than 768px
		// Otherwise, just change the volume
		this.volumeTrigger.addEventListener('click', event => {
			event.stopPropagation();
			this.volumeSlider.parentElement.setAttribute('visible', 'true');
			if(window.innerWidth > 768){
				lx.audioEle.muted = !lx.audioEle.muted;
				this.volumeTrigger.setAttribute('volume', lx.audioEle.muted ? 'muted' : this.getVolumeLevel(lx.audioEle.volume));
			}
			else{
				this.playModeContainer.setAttribute('visible', 'false');
				this.playingListPanel.setAttribute('visible', 'false');
			}
			lx.player.setAttribute('viewing-playing-list', 'false');
		});
	}

	renderPlayingList(){
		// short-cut
		let pl = lx.playingList;

		pl.list.forEach((music, index)=>{
			let li = document.createElement('li');

			li.className = 'playing-list-item';
			li.id = `playing-list-item-${index}`;
			li.setAttribute('odd-even', index % 2 ? 'odd' : 'even');
			li.innerHTML = `
				<span class="playing-list-item-name">${music.songName}</span>
				<span class="playing-list-item-artists">${music.artistList.join(', ')}</span>
				<span class="playing-list-item-duration">${Helper.formatTime(music.duration).split('.')[0]}</span>
			`;

			// Switch playing music
			li.addEventListener('click', (()=>{
				pl.playingIndex = index;
				this.switchPlayingMusic(pl.playedStack.at(-1), index);
				pl.playedStack.push(index);
				lx.player.loadMusic(music);
			}).bind(this));
			this.playingList.appendChild(li);
		});
		this.querySelector(' #playing-list-panel-head span.plph-summary').innerText = `播放列表 [${pl.list.length}]`;
	}

	switchPlayingMusic(from, to){
		let playingListUI = this.querySelectorAll('#playing-list .playing-list-item');

		playingListUI[from]?.removeAttribute('playing');
		playingListUI[to].setAttribute('playing', '');
	}


	generatePlayingList(musics){
		let playList = {
			list: musics,
			playingIndex: -1,
			shuffledOrder: [],
			playedStack: [],
			next(){
				let toPlayIndex = -1;

				switch (lx.config.playMode){ // repeatAll repeatOne playAll playOne shuffle random
				case 'playAll':
					if(this.playingIndex >= this.list.length - 1){
						lx.jump2next = false;
					}
					// fall through

				case 'repeatAll':
					if(this.playingIndex === this.list.length - 1){
						this.playingIndex = -1;
					}
					toPlayIndex = ++this.playingIndex;
					break;

				case 'playOne':
					lx.jump2next = false;
					// fall through

				case 'repeatOne':
					toPlayIndex = this.playedStack.pop();
					break;

				case 'shuffle':
					if(this.shuffledOrder.length === 0){
						for (let i = 0; i < this.list.length; i++){
							this.shuffledOrder[i] = i;
						}
						Helper.shuffleArray(this.shuffledOrder);
					}
					if(this.playingIndex >= this.list.length - 1){
						this.playingIndex = -1;
						Helper.shuffleArray(this.shuffledOrder);
					}
					toPlayIndex = this.shuffledOrder[++this.playingIndex];
					break;

				case 'random':
					toPlayIndex = Helper.getRandomInt(0, this.list.length - 1);
					break;
				default:
					break;
				}

				toPlayIndex = toPlayIndex <= -1 ? 0 : toPlayIndex;
				toPlayIndex = toPlayIndex >= this.list.length ? this.list.length - 1 : toPlayIndex;

				lx.playCtrl.switchPlayingMusic(this.playedStack.at(-1), toPlayIndex);
				this.playedStack.push(toPlayIndex);
				return this.list[toPlayIndex];
			},
			prev(){
				let lastPlayingIndex = this.playedStack.pop();

				this.playingIndex = this.playedStack.at(-1);
				lastPlayingIndex = !lastPlayingIndex || lastPlayingIndex < 0 ? 0 : lastPlayingIndex;
				this.playingIndex = !this.playingIndex || this.playingIndex < 0 ? 0 : this.playingIndex;
				lx.playCtrl.switchPlayingMusic(lastPlayingIndex, this.playingIndex);
				return this.list[this.playingIndex];
			},
			add(song){
				this.list.push(song);
			},
			remove(song){
				let index = this.list.indexOf(song);

				this.list.splice(index, 1);
			},
			move(from, to){
				if(typeof from !== 'number'){
					from = this.list.indexOf(from);
				}
				this.list.splice(to, 0, ...this.list.splice(from, 1));
			},
		};

		lx.playingList = playList;
		this.renderPlayingList();
		return lx.playingList;
	}

	changeVolume(value){
		lx.audioEle.volume = value;
		let volumeLevel = this.getVolumeLevel(value);

		this.volumeSlider.setAttribute('style', `--present: ${value * 100}%`);
		this.volumeTrigger.setAttribute('volume', volumeLevel);
	}

	getVolumeLevel(value){
		let volumeLevel;

		// The level is assigned to volumeLevel according to the level of the volume
		if(value === 0){
			volumeLevel = 'no';
		}
		else if(value < 0.25){
			volumeLevel = 'low';
		}
		else if(value < 0.75){
			volumeLevel = 'medium';
		}
		else if(value <= 1){
			volumeLevel = 'high';
		}

		return volumeLevel;
	}

}
customElements.define('lx-play-ctrl', PlayCtrl);