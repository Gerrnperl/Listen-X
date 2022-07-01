import React from 'react';
import {Depths} from '@fluentui/theme';
import {PrimaryButton} from '@fluentui/react/lib/Button';
import {getTheme} from '@fluentui/react';

import './player.css';
import Metadata from './metadata';
import Utils from '../utils/utils';


class Player extends React.Component{

	constructor(props){
		super(props);
	}
	render(){
		const disabled = false;
		const checked = false;
		console.log(this);

		return (
			<div className="Player" style={{
				boxShadow: Depths.depth64,
				height: Utils.style.player['panel-height'],
				backgroundColor: Utils.appTheme.palette.white,
			}}>
				<Metadata />
			</div>
		);
	}

}

function _alertClicked(){
	alert('Clicked');
}

export default Player;