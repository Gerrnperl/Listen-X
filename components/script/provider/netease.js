/*
 * @Author      : Gerrnperl
 * @Date        : 2022-02-15 11: 08: 45
 * @LastEditTime: 2022-05-28 23:43:37
 * @LastEditors: Gerrnperl
 * @Description : music.163.com
 * ═══════════😅═══════════
 */

/**
 * @typedef {{
 * 	blurPicUrl : string,
 * 	briefDesc  : string,
 * 	description: string,
 * 	id         : number,
 * 	name       : string,
 * 	picUrl     : string,
 * }} albumInfo
 * @typedef {{
 * 	briefDesc: string,
 * 	id       : number,
 * 	name     : string,
 * 	picUrl   : string,
 * }} artistInfo
 * 
 */

/**
 * @typedef {{
 * 	albumName: string;
 * 	artists: string[];
 * 	bitRate: number,
 * 	blob   : Blob,
 * 	coverImage: string;
 * 	duration: number,
 * 	id     : number,
 * 	name   : string,
 * 	size   : number,
 * 	type   : string,
 * 	url    : string,
 * }}music
 */

class Netease{

	/************************
	 * 🄱🄴🄶🄸🄽 Netease api encryption functions
	 * Refer to https: //github.com/Binaryify/NeteaseCloudMusicApi/blob/master/util/crypto.js
	 ***********************/

	static IV = '0102030405060708';
	static PRESET_KEY = '0CoJUm6Qyw8W8jud';
	static EAPI_KEY = 'e82ckenh8dichen8';
	static PUB_KEY = '010001';
	static MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab'
	+ '17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c938'
	+ '70114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b9'
	+ '7ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';

	static #aesEncrypt(message, mode, key, iv){
		return CryptoJS.AES.encrypt(message, key, {
			iv  : iv,
			pad : CryptoJS.pad.NoPadding,
			mode: mode,
		});
	}

	static #rsaEncrypt(text, pubKey, modulus){
		text = text.split('').reverse().join('');
		let n = BigInt('0x' + modulus);
		let e = BigInt('0x' + pubKey);
		let b = BigInt('0x' + Helper.str2hex(text));

		return (b ** e % n).toString(16).padStart(256, '0');
	}

	static async #weapi(object){
		let text = JSON.stringify(object);
		let secretKey = Helper.getRandomString(16);

		return {
			params: CryptoJS.enc.Base64.stringify(
			// AES加密2 密钥: `secretKey` 模式: CBC
				this.#aesEncrypt(
					CryptoJS.enc.Base64.stringify(
					// AES加密1 密钥: `presetKey` 模式: CBC
						this.#aesEncrypt(
							text,
							CryptoJS.mode.CBC,
							CryptoJS.enc.Utf8.parse(PRESET_KEY),
							CryptoJS.enc.Utf8.parse(IV)
						).ciphertext
					),
					CryptoJS.mode.CBC,
					CryptoJS.enc.Utf8.parse(secretKey),
					CryptoJS.enc.Utf8.parse(IV),
				).ciphertext
			),
			encSecKey: this.#rsaEncrypt(secretKey, PUB_KEY, MODULUS),
		};
	}

	static #eapi(url, object){
		let text = typeof object === 'object' ? JSON.stringify(object) : object;
		let message = `nobody${url}use${text}md5forencrypt`;
		let digest = CryptoJS.enc.Hex.stringify(CryptoJS.MD5(message));
		let data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;

		return {
			params: CryptoJS.enc.Hex.stringify(this.#aesEncrypt(data, CryptoJS.mode.ECB, CryptoJS.enc.Utf8.parse(EAPI_KEY), '').ciphertext)
				.toUpperCase(),
		};
	}

	/************************
	 * 🄴🄽🄳
	 ***********************/

	/**
	 * 处理单个歌曲元素
	 * 统一歌曲数据格式
	 * 
	 * @param {{
	 * 	album      : albumInfo,
	 * 	artists    : artistInfo[],
	 * 	id         : number,
	 * 	name       : string,
	 * 	popularity : number,
	 * 	copyright  : number,
	 * 	copyrightId: number,
	 * 	duration   : number,
	 * }} item 查询到的歌曲数组的一个元素
	 * @returns {music}
	 */
	static #formatItem(item){
		let name = item.name;
		let id = item.id;
		let coverImage = item.album.picUrl;
		let albumName = item.album.name;
		let duration = item.duration / 1000;
		let artists = [];

		item.artists.forEach(artist => {
			artists.push(artist.name);
		});
		return {
			id,
			name,
			coverImage,
			albumName,
			artists,
			duration,
		};
	}

	/**
	 * 
	 * @param {{
	 * 	keywords: string,
	 * 	type    : number,
	 * 	limit   : number,
	 * 	offset  : number
	 * }} query 
	 * @returns {Promise<music[]
	 * }>}
	 */
	static async search(query){
		let data = {
			s     : query.keywords,
			type  : query.type || 1,     // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
			limit : query.limit || 30,
			offset: query.offset || 0,
		};

		/**
		 * @type {{
		 * songCount: number;
		 * songs    : {
		 * 	album      : albumInfo,
		 * 	artists    : artistInfo[],
		 * 	id         : number,
		 * 	name       : string,
		 * 	popularity : number,
		 * 	copyright  : number,
		 * 	copyrightId: number,
		 * 	duration   : number,
		 * }[]
		 * }}
		*/
		let result = (await Helper.fetchWithForm('https://music.163.com/api/search/pc', data)).result;
		let formattedResult = {
			songCount: result.songCount,
			songs: [],
		};

		result.songs.forEach(music => {
			formattedResult.songs.push(this.#formatItem(music));
		});
		return formattedResult;
	}

	/**
	 * 
	 * @param {music} music
	 * @returns {Promise<music>}
	 */
	static async getDetails(music){
		let data = {
			ids: '[' + music.id + ']',
			br : 999000,
		};
		let encryptedData = this.#eapi('/api/song/enhance/player/url', data);
		let responseData  = (await Helper.fetchWithForm('https://interface3.music.163.com/eapi/song/enhance/player/url', encryptedData, 'POST')).data[0];

		return Object.assign(music, {
			bitRate: responseData.br || NaN,
			type   : responseData.type || '<Unknown>',
			url    : responseData.url || '<Unknown>',
			size   : responseData.size || NaN,
			id     : responseData.id || '<Unknown>',
		});
	}

	/**
	 * 
	 * @param {music} music 
	 * @returns {Promise<music>}
	 */
	static async getLyric(music){
		let data = {
			csrf_token: '',
			id: music.id,
			lv: -1,
			tv: -1,
		};
		let encryptedData = await this.#weapi(data);
		let responseData = (await Helper.fetchWithForm('https://music.163.com/weapi/song/lyric?csrf_token=', encryptedData, 'POST'));

		return Object.assign(music, {
			lyric: responseData.lrc.lyric,
		});
	}

}

registerProvider(Netease, 'netease');