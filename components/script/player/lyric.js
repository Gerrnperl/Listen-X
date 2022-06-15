/* eslint-disable require-unicode-regexp */
class Lyric extends LxHTMLElement{

	fmtLyric;

	lyricIndex;

	constructor(){
		super();
		lx.lyric = this;
		this.shadowRoot.appendChild(document.querySelector('#template-lyric').content);
		this.lyricList = this.shadowRoot.querySelector('#lyric-list');
		lx.addEventListener('lx-music-loading', (event)=>{
			this.loadLyric(event.detail.music);
		});
		lx.addEventListener('lx-time-update', (event)=>{
			this.updateLyric(event.detail.time);
		});
		// todo: remove this event listener
		lx.addEventListener('lx-lyric-update', (event)=>{
			console.log(`${event.detail.prevLyric} -> ${event.detail.lyric} -> ${event.detail.nextLyric}`);
		});
	}

	/**
	 * @param {string} lyric
	 * @returns {{stamp: number, text: string}[]}
	 * @example
	 * Given lyric:
	 * 	[00:00.000] I am a lyric
	 * 	[00:01.024] I am another lyric
	 * 	[00:02.048] I am a third lyric
	 * 	...
	 * 
	 * Returned object:
	 * 	[
	 * 		{ stamp: 0;    text: 'I am a lyric' },
	 * 		{ stamp: 1024; text: 'I am another lyric' },
	 * 		{ stamp: 2048; text: 'I am a third lyric' },
	 * 		...
	 * 	]
	 */
	formatLyric(lyric){
		let lines = lyric.split('\n');
		let results = [];

		lines.forEach(line=>{
			let time = line.match(/\[\d*?:\d*?\.\d*?\]/);

			if(!time){
				return;
			}
			time = time[0];
			let text = line.slice(time.length);

			time = time.slice(1, -1);
			let minute = +time.match(/^\d*(?=:)/);
			let second = +time.match(/(?<=:)\d*(?=\.)/);
			let ms = +time.match(/(?<=\.)\d*$/);
			let stamp = minute * 60 * 1000 + second * 1000 + ms;

			results.push({
				stamp,
				text,
			});
		});
		return results;
	}

	async loadLyric(music){
		let lyric = (await lx.providers[music.provider].getLyric(music)).lyric;

		this.fmtLyric = this.formatLyric(lyric);
		this.lyricIndex = 0;
	}

	updateLyric(time){
		let oldIndex = this.lyricIndex;

		// Change the lyricIndex so that 
		// fmtLyric[lyricIndex].stamp < time < fmtLyric[lyricIndex+1].stamp
		while(this.fmtLyric[this.lyricIndex + 1]?.stamp <= time * 1000){
			this.lyricIndex++;
		}
		while(this.fmtLyric[this.lyricIndex - 1]?.stamp >= time * 1000){
			this.lyricIndex--;
		}

		if(oldIndex !== this.lyricIndex){
			if(this.lyricIndex >= this.fmtLyric.length){
				throw new Error('Lyric index out of range');
			}
			lx.dispatchEvent(new CustomEvent('lx-lyric-update', {
				detail: {
					stamp: this.fmtLyric[this.lyricIndex].stamp,
					lyric: this.fmtLyric[this.lyricIndex].text,
					prevLyric: this.fmtLyric[this.lyricIndex - 1]?.text || '',
					nextLyric: this.fmtLyric[this.lyricIndex + 1]?.text || '',
				},
			}));
		}
	}

}

customElements.define('lx-lyric', Lyric);