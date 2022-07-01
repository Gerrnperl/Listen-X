import React from 'react';
import {Icon} from '@fluentui/react/lib/Icon';
import {initializeIcons} from '@fluentui/font-icons-mdl2';
import {getTheme} from '@fluentui/react';
initializeIcons();

let style = await (await fetch('./style.json')).json();

const appTheme = getTheme();
const userTheme = style.theme;

for (const key in userTheme){
	if (Object.hasOwnProperty.call(userTheme, key) && Object.hasOwnProperty.call(appTheme, key)){
		Object.assign(appTheme[key], userTheme[key]);
	}
}

console.log(appTheme);

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
};

export default {
	style,
	LxImage,
	Icons,
	appTheme,
};