customElements.define('lx-play-ctrl', class extends HTMLElement{

	playModeSwitcher;
	playModeContainer;
	playingListPanel;
	playingListUI;
	playingListTrigger;

	constructor(){
		super();
		lx.playCtrl = this;
		this.appendChild(document.querySelector('#template-play-ctrl').content);
		// Get Children
		this.playModeSwitcher = this.querySelector('#play-mode-switcher');
		this.playModeContainer = this.querySelector('#play-mode-selector-container');
		// this.playingListUI = this.querySelector('#playing-list');
		this.playingListPanel = lx.player.querySelector('#playing-list-panel');
		this.playingListTrigger = this.querySelector('#playing-list-trigger');
		this.volumeTrigger = this.querySelector('#volume');
		this.volumeSlider = this.querySelector('#volume-slider');

		// TODO:This `0.5` should be replaced by user-configured value
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
		this.playingListUI = new MusicList(lx.playingList.list);
		this.playingListPanel.appendChild(this.playingListUI);
		this.playingListUI.listElement.forEach((ele, index)=>{
			ele.addEventListener('click', (()=>{
				lx.playingList.playingIndex = index;
				this.switchPlayingMusic(lx.playingList.playedStack.at(-1), index);
				lx.playingList.playedStack.push(index);
				lx.player.loadMusic(this.playingListUI.list[index]);
			}).bind(this));
		});
		this.playingListUI.id = 'playing-list';
		lx.player.querySelector(' #playing-list-panel-head span.plph-summary').innerText = `播放列表 [${lx.playingList.list.length}]`;
	}

	switchPlayingMusic(from, to){
		this.playingListUI.listElement[from]?.removeAttribute('playing');
		this.playingListUI.listElement[to].setAttribute('playing', '');
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
						lx.Utils.shuffleArray(this.shuffledOrder);
					}
					if(this.playingIndex >= this.list.length - 1){
						this.playingIndex = -1;
						lx.Utils.shuffleArray(this.shuffledOrder);
					}
					toPlayIndex = this.shuffledOrder[++this.playingIndex];
					break;

				case 'random':
					toPlayIndex = lx.Utils.getRandomInt(0, this.list.length - 1);
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

});