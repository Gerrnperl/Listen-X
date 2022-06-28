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
			(await lx.providers.netease.search({keywords: '红日', type: 1, limit: 30, offset: 0})).songs[1]),
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
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '春泥', type: 1, limit: 30, offset: 0})).songs[5]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '追光者', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: 'The Sun Also Rises', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '一百万个可能', type: 1, limit: 30, offset: 0})).songs[0]),
		await lx.providers.netease.getDetails(
			(await lx.providers.netease.search({keywords: '光辉岁月', type: 1, limit: 30, offset: 0})).songs[0]),
	];
}


lx.addEventListener('lx-loaded', ()=>{
	new Popup('info', 'TEST: It\'s a test');
	setTimeout(()=>{
		new Popup('warning', 'TEST: It\'s a test');
		setTimeout(()=>{
			new Popup('info', 'TEST: Asperiores enim vel repellat earum.');
			setTimeout(()=>{
				new Popup('info', 'TEST: Voluptas hic sunt tempore odio in et inventore. Amet quia aliquid rerum praesentium voluptatem expedita illo sequi vero. Voluptas officiis ab at a vel consequuntur saepe maxime. Voluptas perferendis libero velit quo aliquid maiores.');
			}, 3000);
		}, 1500);
	}, 1500);
	new Popup('error', 'TEST: Ipsum quo sed tempore voluptates praesentium. Provident non officia. Nihil et qui saepe nisi ut. Et beatae nihil. Quis expedita in. Quibusdam numquam quia quia iste eius.');
})