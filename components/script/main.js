/**
 * @typedef {{
 * 	albumName: string;
 * 	artistList: string[];
 * 	bitRate: number,
 * 	blob   : Blob,
 * 	coverURL: string;
 * 	duration: number,
 * 	id     : number,
 * 	songName   : string,
 * 	size   : number,
 * 	type   : string,
 * 	url    : string,
 * 	objURL : string,
 * 	provider: string,
 * }}music
 */

/**
 * ##### As A Custom Event Target
 * These events will be dispatched to **`lx`**
 * - `lx-loaded`
		```js
		CustomEvent<{
			playList: any[];
		}>
		```
 * - `lx-meta-data-update`
		```js
		CustomEvent<{
			songName: string;
			artistList: string[];
			coverURL: string;
		}>
		```
 * - `lx-music-loading`
		the blob and objURL fields of `music` and may not be available
		```js
		CustomEvent<{
			music: music;
		}>
		```
 * - `lx-music-ready`
		```js
		CustomEvent<{
			music: music;
		}>
		```
 * - `lx-time-update`
		```js
		CustomEvent<{
			time: number;
			fmtTime: string;
			durtion: number;
		}>
		```
 * - `lx-music-ended`
 * - `lx-lyric-update`
		```js
		CustomEvent<{
			stamp: number;
			lyric: string;
			prevLyric: string;
			nextLyric: string;
		}>
		```

 * ---
 * ##### As A Namespace
 */
let lx = new (class LX extends EventTarget{

	config = {
		playMode: 'repeatAll',
	};

	jump2next = true;

	providers = {};

	playing = false;

	playingList;

	lyricMode = false;

	/** @type {HTMLAudioElement} */
	audioEle;

	audioCtx = new AudioContext();

	track;

	constructor(){
		super();
	}

	/**
	 * @param {Class|Object} provider 
	 * A class or a set of function that contains related methods. 
	 * This class would not be instantiated and all methods should be **static**
	 * @param {string} name 
	 * The identification name of the provider.
	 */
	registerProvider(provider, name){
		// TODO: Reconstitute it. providers should be an array contains objs {lib:class, name, id_name...}
		lx.providers[name] = provider;
	}

	/**
	 * todo: 封装此函数 --> cache/storage component
	 * todo: 重写为 getter/setter
	 * todo: 将临时生成的musics换为从cache/storage获取
	 */
	async getStoregedPlayingList(){
		return [
			await lx.providers.netease.getDetails(
				(await lx.providers.netease.search({keywords: '浮夸', type: 1, limit: 30, offset: 0})).songs[0]),
			await lx.providers.netease.getDetails(
				(await lx.providers.netease.search({keywords: '红日', type: 1, limit: 30, offset: 0})).songs[0]),
			await lx.providers.netease.getDetails(
				(await lx.providers.netease.search({keywords: '错位时空', type: 1, limit: 30, offset: 0})).songs[0]),
			await lx.providers.netease.getDetails(
				(await lx.providers.netease.search({keywords: '七里香', type: 1, limit: 30, offset: 0})).songs[1]),
		];
	}

})();

// /** 
//  * All lx-element constructors will inherit from this class
//  * To provide style inheritance etc.
//  */
// // eslint-disable-next-line no-unused-vars
// class LxHTMLElement extends HTMLElement{

// 	constructor(){
// 		super();
// 		this.attachShadow({mode: 'open'});
// 		let style = document.createElement('style');

// 		// Attach the common style to the element
// 		style.innerText = '@import url(components/style/css/main.css)';
// 		this.appendChild(style);
// 		// todo: In planning, custom styles should be set here
// 	}

// }

document.addEventListener('DOMContentLoaded', async()=>{
	lx.dispatchEvent(new CustomEvent('lx-loaded',
		{
			'detail':{
				playList: await lx.getStoregedPlayingList(),
			},
		}
	));
});


