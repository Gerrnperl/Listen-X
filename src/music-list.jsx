import React from 'react';

class MusicList extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			list: props.list,
		};
	}

	render(){
		let listItem = this.state.list.map(musicId=>
			<li key={musicId}>
				{musicId}
			</li>
		);

		return (
			<ul className="musicList">
				{listItem}
			</ul>
		);
	}

}

export default {MusicList};