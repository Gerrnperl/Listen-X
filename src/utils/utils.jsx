import React from 'react';

let LxStyle = await (await fetch('./style.json')).json();

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

export default {
	LxStyle,
	LxImage,
};