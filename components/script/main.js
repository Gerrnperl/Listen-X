/**
 * @typedef {{
 * 	albumName: string;
 *  albumArtistList: string[];
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

	/** @type {music} */
	activeMusic;

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
	registerProvider(provider, name, displayName){
		// TODO: Reconstitute it. providers should be an array contains objs {lib:class, name, id_name...}
		lx.providers[name] = provider;
		provider.displayName = displayName;
	}

	/**
	 * todo: 封装此函数 --> cache/storage component
	 * todo: 重写为 getter/setter
	 * todo: 将临时生成的musics换为从cache/storage获取
	 */
	async getStoredPlayingList(){
		return getTESTStoredPlaylist();
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

document.addEventListener('DOMContentLoaded', async() => {
	let results = await lx.storage.getAllCachedMusicMetadata('music');

	lx.dispatchEvent(new CustomEvent('lx-loaded', {
		'detail': {
			playList: results, // lx.getStoredPlayingList(),// music,
		},
	}));
});

lx.addEventListener('lx-meta-data-update', (event) => {
	document.querySelector('#player-background').style.backgroundImage = `url(${event.detail.coverURL})`;
});


// Some requests of y.qq.com set anti-leech link 
// The following bypasses anti-leech by modifying the referer
// todo: 重构
let urls = ['https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'];

urls.forEach((domain, index) => {
	let id = index + 1;

	chrome.declarativeNetRequest.updateDynamicRules(
		{
			addRules: [{
				'id': id,
				'priority': 1,
				'action': {
					'type': 'modifyHeaders',
					'requestHeaders': [{'header': 'referer', 'operation': 'set', 'value': domain}],
				},
				'condition': {
					'urlFilter': domain,
					'domains': [chrome.runtime.getURL('').split('/')[2]],
					'resourceTypes': ["xmlhttprequest"],
				},
			}],
			removeRuleIds: [id],
		},
	);
});