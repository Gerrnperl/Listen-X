class ProgressCtrl extends LxHTMLElement{

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
		this.shadowRoot.appendChild(document.querySelector('#template-progress').content);
		this.progressText = this.shadowRoot.querySelector('#current-time-text');
		this.progressBar = this.shadowRoot.querySelector('#current-time-bar');
		this.durationBar = this.shadowRoot.querySelector('#duration-bar');
		this.durationText = this.shadowRoot.querySelector('#duration-text');
		this.slider = this.shadowRoot.querySelector('#progress-slider');

		lx.addEventListener('lx-time-update', event=>{
			if(!this.isMovingSlider){
				this.updateProgessText(event.detail.fmtTime);
				this.updateProgressBar((~~(event.detail.time / event.detail.duration * 1000)) / 10);
			}
		});
		lx.addEventListener('lx-music-ready', event=>{
			this.renderDurationText(Helper.formatTime(event.detail.music.duration));
			this.duration = event.detail.music.duration;
		});
		lx.addEventListener('lx-music-ended', ()=>{
			this.updateProgessText('00:00');
			this.updateProgressBar(0);
			this.duration = 0;
		});

		this.slider.addEventListener('mousedown', this.activeSlider.bind(this));
		document.body.addEventListener('mouseup', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mouseleave', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mousemove', Helper.throttle(this.moveSlider).bind(this));
		this.progressBar.onclick = this.flashSlider.bind(this);
		this.durationBar.onclick = this.flashSlider.bind(this);
	}

	/**
	 * 
	 * @param {string} time 已播放时间 mm:ss[?.ms]
	 */
	updateProgessText(time){
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
			lx.player.goto(this.sliderGoingto);
			this.isMovingSlider = false;
		}
	}

	activeSlider(){
		this.isMovingSlider = true;
		let durationBarRect = this.durationBar.getBoundingClientRect();

		this.leftExtremumOfSlider = durationBarRect.left;
		this.rightExtremumOfSlider = durationBarRect.right;
		this.rangeOfSlider = durationBarRect.width;
	}

	moveSlider(event){
		if (this.isMovingSlider && this.duration){
			if (event.clientX <= this.leftExtremumOfSlider){
				this.sliderGoingto = 0;
			}
			else if (event.clientX >= this.rightExtremumOfSlider){
				this.sliderGoingto = this.duration;
			}
			else {
				let percentage = (event.clientX - this.leftExtremumOfSlider) / this.rangeOfSlider;

				this.sliderGoingto = percentage * this.duration;
			}
			this.updateProgressBar((~~(this.sliderGoingto / this.duration * 1000)) / 10);
			this.updateProgessText(Helper.formatTime(this.sliderGoingto));
		}
	}

	flashSlider(event){
		// Do nothing when the music is not ready
		if (!this.duration){
			return;
		}
		let durationBarRect = this.durationBar.getBoundingClientRect();

		this.leftExtremumOfSlider = durationBarRect.left;
		this.rangeOfSlider = durationBarRect.width;
		let percentage = (event.clientX - this.leftExtremumOfSlider) / this.rangeOfSlider;

		lx.player.goto(percentage * this.duration);
	}

}
customElements.define('lx-progress-ctrl', ProgressCtrl);