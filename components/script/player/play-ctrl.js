class PlayCtrl extends LxHTMLElement{

	playModeSwitcher;
	playModeContainer;
	playingListPanel;
	playingList;
	playingListTrigger;

	constructor(){
		super();
		lx.playCtrl = this;
		this.shadowRoot.appendChild(document.querySelector('#template-play-ctrl').content);
		// Get Children
		this.playModeSwitcher = this.shadowRoot.querySelector('#play-mode-switcher');
		this.playModeContainer = this.shadowRoot.querySelector('#play-mode-selector-container');
		this.playingList = this.shadowRoot.querySelector('#playing-list');
		this.playingListPanel = this.shadowRoot.querySelector('#playing-list-panel');
		this.playingListTrigger = this.shadowRoot.querySelector('#playing-list-trigger');

		// Switch play mode
		this.shadowRoot.querySelectorAll('#play-mode-selector-container li.play-mode').forEach(li=>{
			li.addEventListener('click', event=>{
				let playMode = event.target.getAttribute('play-mode');

				lx.config.playMode = playMode;
				this.playModeSwitcher.setAttribute('play-mode', playMode);
			});
		});

		// Pop up playModeSwitcher & Hide playingList
		this.playModeSwitcher.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'true');
			this.playingListPanel.setAttribute('visible', 'false');
		});

		// Pop up playingList & Hide playModeSwitcher
		this.playingListTrigger.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'true');
		});

		// Hide playingList & playModeSwitcher
		document.body.addEventListener('click', () => {
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'false');
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
				if(pl.playingIndex === pl.list.length){
					pl.playingIndex = 0;
				}
				pl.playingIndex = index + 1;
				this.switchPlayingMusic(pl.playedStack.at(-1), index);
				pl.playedStack.push(index);
				lx.layer.loadMusic(music);
			}).bind(this));
			this.playingList.appendChild(li);
		});
		this.shadowRoot.querySelector(' #playing-list-panel-head span.plph-summary').innerText = `播放列表 [${pl.list.length}]`;
	}

	switchPlayingMusic(from, to){
		let playingListUI = this.shadowRoot.querySelectorAll('#playing-list .playing-list-item');

		playingListUI[from]?.removeAttribute('playing');
		playingListUI[to].setAttribute('playing', '');
	}


	genratePlayingList(musics){
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
					if(this.playingIndex >= this.list.length){
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

}
customElements.define('lx-play-ctrl', PlayCtrl);