
/**
 * @Events [lx-loaded, lx-meta-data-update]
 */
let lx = {
	/** @type {Class[]} */
	providers,
};

document.addEventListener('load', ()=>{
	lx.dispatchEvent(new CustomEvent('lx-loaded',
		{
			'detail':{
				playList: getStoregedPlayingList(),
			},
		}
	));
});

/**
 * todo: 封装此函数 --> plugins component
 * @param {Class} provider A class that contains related methods. All methods should be STATIC
 * @param {string} name 
 */
function registerProvider(provider, name){
	lx.providers[name] = provider;
}

/**
 * todo: 封装此函数 --> cache/storage component
 * todo: 重写为 getter/setter
 * todo: 将临时生成的musics换为从cache/storage获取
 */
function getStoregedPlayingList(){
	return [
		await lx.providers['netease'].getDetails(
			(await lx.providers['netease'].search({keywords: '最初的梦想', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers['netease'].getDetails(
			(await lx.providers['netease'].search({keywords: '错位时空', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers['netease'].getDetails(
			(await lx.providers['netease'].search({keywords: '七里香', type: 1, limit: 30, offset: 0})).songs[1]),
	]
}