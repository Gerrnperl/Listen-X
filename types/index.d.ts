interface AppState {
	providers: providers;
}

interface providers {
	[providerName: string]: provider;
}

interface provider {
	name: string;
	displayName: string;
	search: ()=>music;
}

interface music {
	albumName: string;
	albumArtistList: string[];
	artistList: string[];
	bitRate: number,
	blob: Blob,
	coverURL: string;
	duration: number,
	id: number,
	musicName: string,
	size: number,
	type: string,
	url: string,
	objURL: string,
	provider: string,
}