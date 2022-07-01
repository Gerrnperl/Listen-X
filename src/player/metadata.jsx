import React from 'react';

import Utils from '../utils/utils';

class Metadata extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			imageSrc: 'https://cn.bing.com/th?id=OHR.CoteSauvage_ZH-CN9967984163_1920x1080.jpg&rf=LaDigue_1920x1080.jpg',
			musicName: 'Hello World',
			singerName: 'Bernhard',
		};
	}

	// componentDidMount(){
	// }

	render(){
		const musicNameStyle = {
			'font-size': Utils.LxStyle.style.fontSize.large,
		};

		return (
			<div className='Metadata'>
				<AlbumCover imageSrc={this.state.imageSrc}/>
				<div className='TextData'>
					<div className="MusicName" style={musicNameStyle}>{this.state.musicName}</div>
					<div className='SingerName'>{this.state.singerName}</div>
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
		return (
			<Utils.LxImage
				imageSrc={this.props.imageSrc}
				imageAlt='Metadata: Album Cover'
				imageWidth='60px'
				imageHeight='60px'
			/>
		);
	}

}


export default Metadata;