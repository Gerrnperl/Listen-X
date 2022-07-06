import React from 'react';
import {ThemeProvider} from '@fluentui/react';
import './App.css';
import Player from './player/player';
import Utils from './utils/utils';

let ProviderContext = React.createContext([]);

class App extends React.Component{

	/** @type {AppState} */
	state = {
		providers: null,
	};

	constructor(props){
		super(props);
	}

	async componentDidMount(){
		let providers = await this.loadProviders();

		this.setState({providers: providers});
	}


	/**
	 * Load music providers, using import.
	 * @returns {Promise<providers>}
	 */
	loadProviders(){
		return new Promise((resolve) => {
			let providers = {};

			import('./provider/netease.js').then(provider =>{
				providers[provider.default.name] = provider.default;
				// eslint-disable-next-line no-shadow
				import('./provider/qq.js').then(provider =>{
					providers[provider.default.name] = provider.default;
					resolve(providers);
				});
			});
		});
	}

	render(){
		return (
			<ThemeProvider theme={Utils.appTheme}>
				<ProviderContext.Provider value={this.state.providers}>
					<Player/>
				</ProviderContext.Provider>
			</ThemeProvider>
		);
	}

}
console.log(ProviderContext);
export default App;
export {App, ProviderContext};
