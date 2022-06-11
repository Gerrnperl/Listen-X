class playCtrl extends LxHTMLElement{

	playModeSwitcher;
	playModeContainer;
	playingListPanel;
	playingList;
	playingListTrigger;

	constructor(){
		super();
		this.shadowRoot.appendChild(document.querySelector('#template-play-ctrl').content);
		this.playModeSwitcher = this.shadowRoot.querySelector('#play-mode-switcher');
		this.playModeContainer = this.shadowRoot.querySelector('#play-mode-selector-container');
		this.playingList = this.shadowRoot.querySelector('#playing-list');
		this.playingListPanel = this.shadowRoot.querySelector('#playing-list-panel');
		this.playingListTrigger = this.shadowRoot.querySelector('#playing-list-trigger');

		this.shadowRoot.querySelectorAll('#play-mode-selector-container li.play-mode').forEach(li=>{
			li.addEventListener('click', event=>{
				let playMode = event.target.getAttribute('play-mode');

				lx.config.playMode = playMode;
				this.playModeSwitcher.setAttribute('play-mode', playMode);
			});
		});
		this.playModeSwitcher.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'true');
			this.playingListPanel.setAttribute('visible', 'false');
		});

		this.playingListTrigger.addEventListener('click', event => {
			event.stopPropagation();
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'true');
		});
		document.body.addEventListener('click', () => {
			this.playModeContainer.setAttribute('visible', 'false');
			this.playingListPanel.setAttribute('visible', 'false');
		});
	}

	renderPlayingList(){
		let pl = lx.playingList;
		let player = document.querySelector('lx-player');

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

			li.addEventListener('click', (()=>{
				if(pl.playingIndex === pl.list.length){
					pl.playingIndex = 0;
				}
				pl.playingIndex = index + 1;
				this.switchPlaying(pl.playedStack.at(-1), index);
				pl.playedStack.push(index);
				player.loadMusic(music);
			}).bind(this));
			this.playingList.appendChild(li);
		});
		this.shadowRoot.querySelector(' #playing-list-panel-head span.plph-summary').innerText = `播放列表 [${pl.list.length}]`;
	}

	switchPlaying(from, to){
		let playingListUI = this.shadowRoot.querySelectorAll('#playing-list .playing-list-item');

		playingListUI[from]?.removeAttribute('playing');
		playingListUI[to].setAttribute('playing', '');
	}


	genratePlayingList(musics){
		let playList = {
			list: musics,
			playingIndex: 0,
			shuffledOrder: [],
			playedStack: [],
			next(){
				let toPlayIndex = 0;

				switch (lx.config.playMode){ // repeatAll repeatOne playAll playOne shuffle random
				case 'playAll':
					if(this.playingIndex >= this.list.length){
						lx.jump2next = false;
					}
					// fall through

				case 'repeatAll':
					if(this.playingIndex === this.list.length){
						this.playingIndex = 0;
					}
					toPlayIndex = this.playingIndex++;
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
						this.playingIndex = 0;
						Helper.shuffleArray(this.shuffledOrder);
					}
					toPlayIndex = this.shuffledOrder[this.playingIndex++];
					break;

				case 'random':
					toPlayIndex = Helper.getRandomInt(0, this.list.length - 1);
					break;
				default:
					break;
				}
				switchPlaying(this.playedStack.at(-1), toPlayIndex);
				this.playedStack.push(toPlayIndex);
				return this.list[toPlayIndex];
			},
			prev(){
				return this.list[this.playedStack.pop() || 0];
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
customElements.define('lx-play-ctrl', playCtrl);