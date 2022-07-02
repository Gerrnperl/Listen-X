import React from 'react';
import {Text} from '@fluentui/react/lib/Text';
import Utils from '../utils/utils';

class Metadata extends React.Component{

	constructor(props){
		super(props);
	}

	// componentDidMount(){
	// }

	render(){
		const musicNameStyle = {
			'fontSize': Utils.style.fontSize.medium,
		};
		const singerNameStyle = {
			'fontSize': Utils.style.fontSize.small,
		};

		return (
			<div className='Metadata'>
				<AlbumCover imageSrc={this.props.imageSrc}/>
				<div className='TextData'>
					<Text className="MusicName" style={musicNameStyle} block nowrap>{this.props.musicName}</Text>
					<Text className='SingerName' style={singerNameStyle} block nowrap>{this.props.singerName}</Text>
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