customElements.define('lx-progress-ctrl', class extends HTMLElement{

	/** @type {HTMLParagraphElement} */
	progressText;

	/** @type {HTMLElement} */
	progressBar;

	/** @type {HTMLParagraphElement} */
	durationText;

	/** @type {HTMLElement} */
	slider;

	constructor(){
		super();
		lx.progressCtrl = this;
		this.appendChild(document.querySelector('#template-progress').content);
		this.progressText = this.querySelector('#current-time-text');
		this.progressBar = this.querySelector('#current-time-bar');
		this.durationBar = this.querySelector('#duration-bar');
		this.durationText = this.querySelector('#duration-text');
		this.slider = this.querySelector('#progress-slider');

		lx.addEventListener('lx-time-update', event=>{
			if(!this.isMovingSlider){
				this.updateProgressText(event.detail.fmtTime);
				this.updateProgressBar((~~(event.detail.time / event.detail.duration * 1000)) / 10);
			}
		});
		lx.addEventListener('lx-music-ready', event=>{
			console.log(event.detail.music);
			this.renderDurationText(lx.Utils.formatTime(event.detail.music.duration));
			this.duration = event.detail.music.duration;
		});
		lx.addEventListener('lx-music-ended', ()=>{
			this.updateProgressText('00:00');
			this.updateProgressBar(0);
			this.duration = 0;
		});

		this.slider.addEventListener('mousedown', this.activeSlider.bind(this));
		document.body.addEventListener('mouseup', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mouseleave', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mousemove', lx.Utils.throttle(this.moveSlider).bind(this));
		this.progressBar.onclick = this.flashSlider.bind(this);
		this.durationBar.onclick = this.flashSlider.bind(this);
	}

	/**
	 * 
	 * @param {string} time 已播放时间 mm:ss[?.ms]
	 */
	updateProgressText(time){
		// discard milliseconds
		time = time.split('.')[0];
		this.progressText.innerText = time;
	}

	/**
	 * 
	 * @param {string} duration 总时间 mm:ss[?.ms]
	 */
	renderDurationText(duration){
		// discard milliseconds
		duration = duration.split('.')[0];
		this.durationText.innerText = duration;
	}

	async updateProgressBar(percentage){
		this.progressBar.style.width = `${percentage}%`;
		this.slider.style.left = `${percentage}%`;
	}

	stopMoveSlider(){
		if (this.isMovingSlider){
			lx.player.goto(this.sliderGoingTo);
			this.isMovingSlider = false;
		}
	}

	activeSlider(){
		this.isMovingSlider = true;
		let durationBarRect = this.durationBar.getBoundingClientRect();

		this.leftMax = durationBarRect.left;
		this.rightMax = durationBarRect.right;
		this.rangeOfSlider = durationBarRect.width;
	}

	moveSlider(event){
		if (this.isMovingSlider && this.duration){
			if (event.clientX <= this.leftMax){
				this.sliderGoingTo = 0;
			}
			else if (event.clientX >= this.rightMax){
				this.sliderGoingTo = this.duration;
			}
			else {
				let percentage = (event.clientX - this.leftMax) / this.rangeOfSlider;

				this.sliderGoingTo = percentage * this.duration;
			}
			this.updateProgressBar((~~(this.sliderGoingTo / this.duration * 1000)) / 10);
			this.updateProgressText(lx.Utils.formatTime(this.sliderGoingTo));
		}
	}

	flashSlider(event){
		// Do nothing when the music is not ready
		if (!this.duration){
			return;
		}
		let durationBarRect = this.durationBar.getBoundingClientRect();

		this.leftMax = durationBarRect.left;
		this.rangeOfSlider = durationBarRect.width;
		let percentage = (event.clientX - this.leftMax) / this.rangeOfSlider;

		lx.player.goto(percentage * this.duration);
	}

});