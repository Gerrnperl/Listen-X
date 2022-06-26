/* eslint-disable no-undefined */
/*
 * @Author      : Gerrnperl
 * @Date        : 2022-02-15 11: 08: 45
 * @LastEditTime: 2022-06-02 22:39:52
 * @LastEditors: Gerrnperl
 * @Description : y.qq.com
 * ═══════════😅═══════════
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

class QQ{


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
		let name = item.songname;
		let id = item.songmid;
		let coverImage = item.albummid; // it's not a url todo: 在getDetails时获取url
		let albumName = item.albumname;
		let duration = item.interval;
		let artists = [];
		let albumArtists = [];

		item.singer.forEach(artist => {
			artists.push(artist.name);
		});
		// item.album.artists.forEach(artist => {
		// 	albumArtists.push(artist.name);
		// });
		return {
			id,
			songName: name,
			coverURL: `${coverImage}?param=140y140`,
			albumName,
			artistList: artists,
			albumArtistList: albumArtists,
			duration,
			provider: 'qq',
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
			g_tk:938407465,
			uin:0,
			format:'json',
			inCharset:'utf-8',
			outCharset:'utf-8',
			notice:0,
			platform:'h5',
			needNewCode:1,
			zhidaqu:1,
			catZhida:1,
			t:0,
			flag:1,
			ie:'utf-8',
			sem:1,
			aggr:0,
			n:20,
			remoteplace:'txt.mqq.all',
			_:1459991037831,
			perpage:query.limit || 30,
			p:query.offset / query.limit + 1 || 0,
			w:query.keywords,
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
		let result = (await lx.Utils.fetchWithForm('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', data, 'GET')).data.song;
		let formattedResult = {
			songCount: result.curnum,
			songs: [],
		};

		if(result.curnum > 0){
			result.list.forEach(music => {
				formattedResult.songs.push(this.#formatItem(music));
			});
			return formattedResult;
		}
	}

	/**
	 * 
	 * @param {music} music
	 * @returns {Promise<music>}
	 */


	static async getDetails(music){
		let data = {
			'req_0': {
				'module': 'vkey.GetVkeyServer',
				'method': 'CgiGetVkey',
				'param': {
					'filename':[],
					'guid': '10000',
					'songmid': [music.id],
					'songtype': [0],
					'uin': '0',
					'loginflag': 1,
					'platform': '20',
				},
			},
			'loginUin': '0',
			'comm': {
				'uin': '0',
				'format': 'json',
				'ct': 24,
				'cv': 0,
			},
		};
		let target = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
		let responseData  = (await lx.Utils.fetchWithForm(target, {format: 'json', data: JSON.stringify(data)}, 'GET')).req_0.data;
		// console.log(responseData);
		return Object.assign(music, {
			// bitRate: responseData.br || NaN,
			// type   : responseData.type || undefined,
			url    : responseData.sip[0] + responseData.midurlinfo[0].purl || undefined,
			// size   : responseData.size || NaN,
			// id     : responseData.id || undefined,
		});
	}

	/**
	 * 
	 * @param {music} music 
	 * @returns {Promise<music>}
	 */
	static async getLyric(music){
		let data = {
			_: 1656222815789,
			cv: 4747474,
			ct: 24,
			format: 'json',
			inCharset: 'utf-8',
			outCharset: 'utf-8',
			notice: 0,
			platform: 'yqq.json',
			needNewCode: 1,
			uin: 0,
			g_tk_new_20200303: 5381,
			g_tk: 5381,
			loginUin: 0,
			songmid: music.id,
		};
		let target = 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
		console.log(await lx.Utils.fetchWithForm(target, data, 'GET'));
		let encodedLyric = (await lx.Utils.fetchWithForm(target, data, 'GET')).lyric;
		let lyric = lx.Utils.arrayBufferToStr(lx.Utils.base64ToArrayBuffer(encodedLyric));

		return Object.assign(music, {
			lyric: lyric,
		});
	}

}

lx.registerProvider(QQ, 'qq', 'qq');