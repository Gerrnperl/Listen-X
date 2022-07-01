import React from 'react';
import {Text} from '@fluentui/react/lib/Text';
import Utils from '../utils/utils';

class Metadata extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			imageSrc: '', // 'https://cn.bing.com/th?id=OHR.CoteSauvage_ZH-CN9967984163_1920x1080.jpg&rf=LaDigue_1920x1080.jpg',
			musicName: 'Hello World',
			singerName: 'Bernhard',
		};
	}

	// componentDidMount(){
	// }

	render(){
		const musicNameStyle = {
			'fontSize': Utils.style.fontSize.large,
		};
		const singerNameStyle = {
			'fontSize': Utils.style.fontSize.medium,
		};

		return (
			<div className='Metadata'>
				<AlbumCover imageSrc={this.state.imageSrc}/>
				<div className='TextData'>
					<Text className="MusicName" style={musicNameStyle} block nowrap>{this.state.musicName}</Text>
					<Text className='SingerName' style={singerNameStyle} block nowrap>{this.state.singerName}</Text>
				</div>
			</div>
		);
	}

}

class AlbumCover extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		if(this.props.imageSrc){
			return (
				<Utils.LxImage
					imageSrc={this.props.imageSrc}
					imageAlt='Metadata: Album Cover'
					imageWidth={Utils.style.player['panel-height']}
					imageHeight={Utils.style.player['panel-height']}
				/>
			);
		}

		// return a album icon when the image of the album is missing
		const panelHeight = Utils.style.player['panel-height'];
		const Style = {
			height: panelHeight,
			width: panelHeight,
			lineHeight: panelHeight,
			backgroundColor: Utils.appTheme.palette.neutralLight,
		};

		return (
			<div className='LxImage Album-Missing' style={Style}>
				<Utils.Icons.AlbumIcon />
			</div>
		);
	}

}


export default Metadata;