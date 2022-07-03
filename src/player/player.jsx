import React from 'react';
import {Depths} from '@fluentui/theme';
import {PrimaryButton} from '@fluentui/react/lib/Button';
import {getTheme} from '@fluentui/react';

import './player.css';
import Metadata from './metadata';
import Utils from '../utils/utils';
import {ProgressController} from './progress';


class Player extends React.Component{

	/** @type {PlayerState} */
	state = {
		playing: false,
		playingList: null,
		activeMusic: null,
		current: 0,
	};

	constructor(props){
		super(props);

		/** @type {React.RefObject<HTMLAudioElement>} */
		this.audioElement = React.createRef();
	}

	async componentDidMount(){
		let playingList = await this.loadPlayingList();

		this.setState({
			playingList: playingList,
			activeMusic: playingList[0],
		});
	}

	/**
	 * load the last playingList
	 * todo: remove the preset music data, load music form storage.
	 * @returns {Promise<music[]>}
	 */
	async loadPlayingList(){
		let PlayingList = [
			// todo: remove it
			{
				'id': 1808492017,
				'musicName': '错位时空',
				'albumCover': 'https://p1.music.126.net/8C0lwLE88j9ZwLyPQ9a4FA==/109951165595770076.jpg?param=140y140',
				'albumName': '错位时空',
				'artistList': [
					'艾辰',
				],
				'albumArtistList': [
					'艾辰',
				],
				'duration': 203.93,
				'provider': 'netease',
				'bitRate': 128000,
				'type': 'mp3',
				'url': 'http://127.0.0.1:8080/cwsk.m4a',
				'size': 3264045,
			},
			// todo: remove it
			{
				'id': 449818741,
				'musicName': '光年之外',
				'albumCover': 'https://p2.music.126.net/fkqFqMaEt0CzxYS-0NpCog==/18587244069235039.jpg?param=140y140',
				'albumName': '光年之外',
				'artistList': [
					'G.E.M.邓紫棋',
				],
				'albumArtistList': [
					'G.E.M.邓紫棋',
				],
				'duration': 235.505,
				'provider': 'netease',
				'bitRate': 128000,
				'type': 'mp3',
				'url': 'http://m701.music.126.net/20220701163058/c8227c0f13e35334c37237d2edeff5b1/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096482726/be1f/9c3c/7cba/29ca72fe7379e2096af6f5107af3136c.mp3',
				'size': 3769199,
			},
		];

		return PlayingList;
	}

	/**
	 * @this Player
	 */
	handlePlay(){
		this.setState(prevState => ({
			playing: !prevState.playing,
		}),
		// then
		()=>{
			this.state.playing ? this.audioElement.current.play() : this.audioElement.current.pause();
		});
	}

	/**
	 * @param {number} second 
	 * @this Player
	 */
	handleProgress(second){
		this.audioElement.current.currentTime = second;
	}


	render(){
		return (
			<div className="Player" style={{
				boxShadow: Depths.depth64,
				height: Utils.style.player['panel-height'],
				backgroundColor: Utils.appTheme.palette.white,
			}}>
				<audio
					ref={this.audioElement}
					src={this.state.activeMusic?.url}
					onTimeUpdate={event => {
						this.setState({current: event.target.currentTime});
					}}
					controls // todo: remove `controls`
				/>
				<Metadata
					imageSrc={this.state.activeMusic?.albumCover}
					musicName={this.state.activeMusic?.musicName}
					singerName={this.state.activeMusic?.artistList.join(', ')}
				/>
				<div className="center-area">
					<ProgressController
						handlePlay={this.handlePlay.bind(this)}
						handleProgress={this.handleProgress.bind(this)}
						duration={this.state.activeMusic?.duration}
						current={this.state.current}
					/>
				</div>
			</div>
		);
	}

}

export default Player;