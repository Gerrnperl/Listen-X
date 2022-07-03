import React from 'react';
import {Slider, IStackTokens, Stack, IStackStyles} from '@fluentui/react';
import Utils from '../utils/utils';
import Helper from '../utils/helper';

class ProgressController extends React.Component{

	/** @type {ProgressControllerProps} */
	props;

	state = {
		current: 0,
		duration: 0,
	};

	constructor(props){
		super(props);
	}

	componentDidMount(){
		// TODO: remove this
		setTimeout(() => {
			this.props.handlePlay();
		}, 2000);
	}

	updateProgressBar(current){
		this.isMovingSlider = true;
		this.setState({
			current: current,
		});
	}

	render(){
		return (
			<div className="progress">
				<ProgressBar
					current={
						this.isMovingSlider
							? this.state.current * 2
							: this.props.current
					}
					duration={this.props.duration}
					updateProgressBar={this.updateProgressBar.bind(this)}
					jumpTo={(second) => {
						this.props.handleProgress(second);
						this.isMovingSlider = false;
					}}
				/>
			</div>
		);
	}

}

class ProgressBar extends React.Component{

	/** @type {ProgressBarProps} */
	props;

	constructor(props){
		super(props);

		/** @type {React.RefObject<HTMLDivElement>} */
		this.ProgressBarElement = React.createRef();
	}

	componentDidMount(){
		this.ProgressBarElement.current?.addEventListener('click', this.flashSlider.bind(this));
	}

	/**
	 * Get the rect of the progress bar, 
	 * including its left side, right side & width
	 * @example const [left, right, width] = getBarRect();
	 * @returns {[left:number, right: number, width: number]}
	 */
	getBarRect(){
		let durationBarRect = this.ProgressBarElement.current?.getBoundingClientRect();

		return [durationBarRect?.left, durationBarRect?.right, durationBarRect?.width];
	}


	flashSlider(event){
		// Do nothing when the music is not ready
		if (!this.props.duration){
			return;
		}

		const [leftMax, rightMax, range] = this.getBarRect();

		let percentage = (event.clientX - leftMax) / range;

		this.props.jumpTo(percentage * this.props.duration);
	}

	render(){
		let colorRef = Utils.appTheme.semanticColors.LxProgressBarColor;
		let color = colorRef;
		let bgColorRef = Utils.appTheme.semanticColors.LxProgressBarBackground;
		let bgColor = bgColorRef;

		if (colorRef.startsWith('--')){
			color = Utils.appTheme.palette[colorRef.slice(2)];
		}
		if (bgColorRef.startsWith('--')){
			bgColor = Utils.appTheme.palette[bgColorRef.slice(2)];
		}
		const currentTimeBarStyle = {
			backgroundColor: `${color}`,
			width: `${this.props.current / this.props.duration * 100}%`,
		};
		const durationBarStyle = {
			backgroundColor: `${bgColor}`,
		};

		const [leftMax, rightMax, range] = this.getBarRect();

		return (
			<>
				<div className='progressText currentTimeText'>{Helper.formatTime(this.props.current).split('.')[0]}</div>
				<div className='ProgressBar' ref={this.ProgressBarElement}>
					<div
						className='currentTimeBar'
						style={currentTimeBarStyle}
					></div>
					<div
						className='durationBar'
						style={durationBarStyle}
					></div>
					<ProgressSlider
						color={color}
						current={this.props.current}
						duration={this.props.duration}
						leftMax={leftMax}
						rightMax={rightMax}
						range={range}
						updateProgressBar={this.props.updateProgressBar}
						jumpTo={this.props.jumpTo} />
				</div>
				<div className='progressText durationText'>{Helper.formatTime(this.props.duration).split('.')[0]}</div>
			</>
		);
	}

}

class ProgressSlider extends React.Component{

	/** @type {ProgressBarProps} */
	props;

	/** @type {boolean} */
	isMovingSlider = false;

	constructor(props){
		super(props);
		document.body.addEventListener('mouseup', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mouseleave', this.stopMoveSlider.bind(this));
		document.body.addEventListener('mousemove', Helper.throttle(this.moveSlider).bind(this));
	}

	/**
	 * @this ProgressSlider
	 */
	activeSlider(){
		this.isMovingSlider = true;
	}

	/**
	 * @this ProgressSlider
	 * @param {MouseEvent} event 
	 */
	moveSlider(event){
		if (this.isMovingSlider && this.props.duration){
			if (event.clientX <= this.props.leftMax){
				this.sliderGoingTo = 0;
			}
			else if (event.clientX >= this.rightMax){
				this.sliderGoingTo = this.props.duration;
			}
			else {
				let percentage = (event.clientX - this.props.leftMax) / this.props.range;

				this.sliderGoingTo = percentage * this.props.duration;
			}
			this.props.updateProgressBar((~~(this.sliderGoingTo / this.props.duration * 1000)) / 10);
			// this.updateProgressBar((~~(this.sliderGoingTo / this.props.duration * 1000)) / 10);
			// this.updateProgressText(lx.Utils.formatTime(this.sliderGoingTo));
		}
	}

	stopMoveSlider(){
		if (this.isMovingSlider){
			this.props.jumpTo(this.sliderGoingTo);
			this.isMovingSlider = false;
		}
	}


	render(){
		return (
			<div
				style={{
					left: `${(this.isMovingSlider ? this.sliderGoingTo : this.props.current) / this.props.duration * 100}%`,
					backgroundColor: Utils.appTheme.palette.white,
					borderColor: this.props.color,
				}}
				className='progressSlider'
				onMouseDown={this.activeSlider.bind(this)}
			></div>
		);
	}

}

class PlayController extends React.Component{

}

export {ProgressController};

