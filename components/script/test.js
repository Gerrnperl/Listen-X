// lx.dispatchEvent(new CustomEvent('lx-meta-data-update',
// 	{
// 		'detail':{
// 			songName: 'Blues', artistList: ['Cordie', 'Shaniya'], coverURL: 'https://random.imagecdn.app/100/100',
// 		},
// 	}
// ));
// eslint-disable-next-line no-unused-vars
async function getTESTStoredPlaylist(){
	return [
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '浮夸', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '红日', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '错位时空', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '七里香', type: 1, limit: 30, offset: 0})).songs[1]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '爱不会绝迹', type: 1, limit: 30, offset: 0})).songs[1]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '裂缝中的阳光', type: 1, limit: 30, offset: 0})).songs[1]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '光年之外', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '入海', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '枕边童话', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '微微', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: 'Lemon', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: 'We Are The World', type: 1, limit: 30, offset: 0})).songs[2]),
	];
}