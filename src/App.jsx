import React from 'react';
import {ThemeProvider, PartialTheme} from '@fluentui/react';
import {getTheme} from '@fluentui/react';

import './App.css';
import Player from './player/player';
import Utils from './utils/utils';


// const theme = getTheme();
// const userTheme = Utils.style.theme;

// for (const key in theme){
// 	if (Object.hasOwnProperty.call(theme, key) && Object.hasOwnProperty.call(userTheme, key)){
// 		Object.assign(theme[key], userTheme[key]);
// 	}
// }

// const ThemeContext = React.createContext(theme);

class App extends React.Component{

	render(){
		return (
			<ThemeProvider theme={Utils.appTheme}>
				<Player/>
			</ThemeProvider>
		);
	}

}

export default App;
