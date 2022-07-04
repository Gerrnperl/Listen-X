import React from 'react';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons} from '@fluentui/font-icons-mdl2';
import {getTheme} from '@fluentui/react';
initializeIcons('../fonts/');

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
};

export default {
	style,
	LxImage,
	Icons,
	appTheme,
};