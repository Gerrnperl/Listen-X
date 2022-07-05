import React from 'react';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons, initializeCusIcons} from '../fabric-icons.ts';
import {getTheme} from '@fluentui/react';

initializeIcons('../fonts/');
initializeCusIcons('../fonts/');



let style = await (await fetch('./style.json')).json();

const appTheme = getTheme();
const userTheme = style.theme;

for (const key in userTheme){
	if (Object.hasOwnProperty.call(userTheme, key) && Object.hasOwnProperty.call(appTheme, key)){
		Object.assign(appTheme[key], userTheme[key]);
	}
}

for (const key in userTheme.semanticColors){
	if (Object.hasOwnProperty.call(userTheme.semanticColors, key)){
		const color = userTheme.semanticColors[key];

		if(color.startsWith('--')){
			appTheme.semanticColors[key] = appTheme.palette[color.slice(2)];
		}
	}
}

class LxImage extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		const Style = {
			height: this.props.imageHeight,
			width: this.props.imageWidth,
		};

		return (
			<div className='LxImage'>
				<img
					src={this.props.imageSrc}
					alt={this.props.imageAlt}
					style={Style}
				/>
			</div>
		);
	}

}

let Icons = {
	AlbumIcon: ()=><Icon iconName="Album" />,
	Play: ()=><Icon iconName="Play" />,
	Pause: ()=><Icon iconName="Pause" />,
	Next: ()=><Icon iconName="Next" />,
	Prev: ()=><Icon iconName="Previous" />,
	PlaylistMusic: ()=><Icon iconName="PlaylistMusic" />,
	RepeatOne: ()=><Icon iconName="RepeatOne" />,
	RepeatAll: ()=><Icon iconName="RepeatAll" />,
	Shuffle: ()=><Icon iconName="Shuffle" />,
	VolumeDisabled: ()=><Icon iconName="VolumeDisabled" style={{position: 'relative',	left: '-4px'}}/>,
	Volume0: ()=><Icon iconName="Volume0" />,
	Volume1: ()=><Icon iconName="Volume1" />,
	Volume2: ()=><Icon iconName="Volume2" />,
	Volume3: ()=><Icon iconName="Volume3" />,
};

export default {
	style,
	LxImage,
	Icons,
	appTheme,
};