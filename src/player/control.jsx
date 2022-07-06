import React from 'react';
import {Callout, DirectionalHint} from '@fluentui/react';
import Utils from '../utils/utils';
import Helper from '../utils/helper';
import {MusicList} from '../music-list';


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
		let color = Utils.appTheme.semanticColors.LxSliderColor;
		let hoverColor = Utils.appTheme.semanticColors.LxSliderHoverColor;
		let activeColor = Utils.appTheme.semanticColors.LxSliderActiveColor;
		let bgColor = Utils.appTheme.semanticColors.LxSliderBackground;

		const currentTimeBarStyle = {
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
				<style>{`
					.currentTimeBar {
						background-color: ${color};
					}
					.progressSlider {
						border-color: ${color};
					}
					.progressSlider:hover {
						border-color: ${hoverColor};
					}
					.progressSlider:active {
						border-color: ${activeColor};
					}
					.
				`}</style>
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
			else if (event.clientX >= this.props.rightMax){
				this.sliderGoingTo = this.props.duration;
			}
			else {
				let percentage = (event.clientX - this.props.leftMax) / this.props.range;

				this.sliderGoingTo = percentage * this.props.duration;
			}
			this.props.updateProgressBar((~~(this.sliderGoingTo / this.props.duration * 1000)) / 10);
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
					backgroundColor: Utils.appTheme.semanticColors.inputBackground,
				}}
				className='progressSlider'
				onMouseDown={this.activeSlider.bind(this)}
			></div>
		);
	}

}

class PlayController extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className='playController'>
				<PlayMode switchPlayMode={this.props.switchPlayMode}/>
				<PlaySwitcher direction='-1'/>
				<PlayTrigger
					playing={this.props.playing}
					handlePlay={this.props.handlePlay}
				/>
				<PlaySwitcher direction='1'/>
				<PlayingList playingList={this.props.playingList}/>
			</div>
		);
	}

}

class PlayTrigger extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		let style = {
			fontSize: Utils.style.fontSize.xLarge,
			lineHeight: Utils.style.fontSize.xLarge,
		};

		return (
			<div
				className='PlayTrigger'
				onClick={this.props.handlePlay}
				style={style}
			>
				{this.props.playing ? <Utils.Icons.Pause/> : <Utils.Icons.Play />}
			</div>
		);
	}

}

class PlaySwitcher extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		let forward = this.props.direction === '1';
		let style = {
			fontSize: Utils.style.fontSize.large,
		};

		return (
			<div
				className={`PlaySwitcher ${forward ? 'next' : 'prev'}`}
				style={style}
			>
				{forward ? <Utils.Icons.Next /> : <Utils.Icons.Prev />}
			</div>
		);
	}

}

class PlayMode extends React.Component{

	modes = ['RepeatAll', 'RepeatOne', 'Shuffle'];
	state = {
		modeIndex: 0,
	};

	constructor(props){
		super(props);
	}

	switchPlayMode(){
		this.setState(prevState=>({
			modeIndex: (prevState.modeIndex + 1) % 3,
		}), ()=>{
			this.props.switchPlayMode(this.modes[this.state.modeIndex]);
		});
	}

	render(){
		let currentMode;

		switch(this.modes[this.state.modeIndex]){
		case 'RepeatAll':
			currentMode = <Utils.Icons.RepeatAll />;
			break;
		case 'RepeatOne':
			currentMode = <Utils.Icons.RepeatOne />;
			break;
		case 'Shuffle':
			currentMode = <Utils.Icons.Shuffle />;
			break;
		default:
			currentMode = <Utils.Icons.RepeatAll />;
		}
		return (
			<div
				className='PlayModeSwitcher'
				onClick={this.switchPlayMode.bind(this)}
			>
				{currentMode}
			</div>
		);
	}

}


class PlayingList extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			listVisible: false,
		};
	}

	componentDidMount(){
		window.addEventListener('click', ()=>{
			this.setState({
				listVisible: false,
			});
		});
	}

	handleTriggerClick(event){
		event.stopPropagation();
		this.setState(prevState=>({
			listVisible: !prevState.listVisible,
		}));
	}

	render(){
		return (
			<div
				className='PlayingList'
			>
				<div
					className='PlayingListTrigger'
					onClick={this.handleTriggerClick.bind(this)}
				>
					<Utils.Icons.PlaylistMusic />
				</div>
				{this.state.listVisible && (
					<Callout
						role="dialog"
						gapSpace={15}
						target={'.Player'}
						isBeakVisible={false}
						// beakWidth={beakWidth}
						// onDismiss={toggleIsCalloutVisible}
						directionalHint={DirectionalHint.topCenter}
					>
						<div
							className='playingListPanel'
							style={{
								minHeight: '250px',
							}}
						>
							<div
								className='playingListPanelHeader'
								style={{
									height: '2.25rem',
									borderBottom: `1px solid ${Utils.appTheme.palette.themeTertiary}`,
								}}
							>
								<span
									className='headerSummary'
									style={{
										fontSize: Utils.style.fontSize.medium,
									}}
								>
									{`正在播放 [${this.props.playingList.length}]`}
								</span>
							</div>
							<MusicList
								list={this.props.playingList}
								compact={true}
								columns={['provider', 'musicName', 'artistList', 'duration']}
							/>
						</div>
					</Callout>
				)}
			</div>

		);
	}

}

class VolumeRegulator extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			muted: false,
			volume: this.props.volume || 50,
			volumeCalloutAvailable: false,
			volumeCalloutVisible: false,
		};
	}

	componentDidMount(){
		window.addEventListener('resize', (event) => {
			try{
				if(event.target.innerWidth < 600){
					this.setState({
						volumeCalloutAvailable: true,
					});
				}
				else{
					this.setState({
						volumeCalloutAvailable: false,
					});
				}
			}
			catch{
				// pass
			}
		});
		window.addEventListener('click', ()=>{
			this.setState({
				volumeCalloutVisible: false,
			});
		});
	}

	getVolumeLabel(){
		let volume = this.state.volume;

		if(this.state.muted){
			return (
				<Utils.Icons.VolumeDisabled />);
		}

		if(volume === 0){
			return <Utils.Icons.Volume0 />;
		}
		if(volume < 25){
			return <Utils.Icons.Volume1 />;
		}
		if(volume < 75){
			return <Utils.Icons.Volume2 />;
		}
		if(volume <= 100){
			return <Utils.Icons.Volume3 />;
		}

		return <Utils.Icons.VolumeDisabled />;
	}

	changeVolume(event){
		this.setState({
			volume: +event.target.value,
		});
		this.props.changeVolume(+event.target.value / 100);
		this.changeMuteState(false);
	}

	/**
	 * 
	 * @param {boolean} muteState 
	 */
	changeMuteState(muteState = void (0)){
		this.setState(prevState=>({
			muted: muteState ?? !prevState.muted,
		}), ()=>{
			this.props.changeMuteState(this.state.muted);
		});
	}

	/**
	 * 
	 * @param {Event} event 
	 */
	handleTriggerClick(event){
		event.stopPropagation();
		if(this.state.volumeCalloutAvailable){
			this.setState(prevState=>({
				volumeCalloutVisible: !prevState.volumeCalloutVisible,
			}));
			return;
		}
		this.changeMuteState();
	}

	render(){
		let semanticColors = Utils.appTheme.semanticColors;
		let style = {
			'--color': semanticColors.LxSliderColor,
			'--hoverColor': semanticColors.LxSliderHoverColor,
			'--activeColor': semanticColors.LxSliderActiveColor,
			'--backgroundColor': semanticColors.LxSliderBackground,
			'--thumbBackground': semanticColors.LxSliderThumbBackground,
			'--thumbColor': semanticColors.LxSliderThumbColor,
			'--present': this.state.volume + '%',
		};

		let VolumeInput
			= <input
				name="volumeSlider"
				className="volumeSlider"
				type="range"
				min="0"
				max="100"
				step="1"
				value={this.state.volume || 0}
				onChange={this.changeVolume.bind(this)}
				style={style}
			/>;

		let VolumeSlider;

		if(!this.state.volumeCalloutAvailable){
			VolumeSlider = VolumeInput;
		}

		if(this.state.volumeCalloutAvailable && this.state.volumeCalloutVisible){
			style.margin = '14px 0 10px 5px';
			VolumeSlider
			= <Callout
					className="volumeCallout visible"
					role="alert"
					gapSpace={10}
					target={'#volumeTrigger'}
					directionalHint={DirectionalHint.leftBottomEdge}
				>
					{VolumeInput}
				</Callout>;
		}

		return (
			<div className='VolumeRegulator'>
				<label
					htmlFor=""
					id="volumeTrigger"
					onClick={this.handleTriggerClick.bind(this)}
				>
					{this.getVolumeLabel()}
				</label>
				{VolumeSlider}
			</div>
		);
	}

}

export {ProgressController, PlayController, VolumeRegulator};

