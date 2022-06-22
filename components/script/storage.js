lx.storage = new (class LxStorage{

	/** @type {IDBDatabase} */
	db;

	dbSchemas = [
		{
			name: 'music',
			options: {keyPath: 'id', autoIncrement: false},
			fields: [
				{name: 'music', keyPath: 'music', options:{unique: true}},
				{name: 'songName', keyPath: 'songName', options:{unique: true}},
				{name: 'artistList', keyPath: 'artistList', options:{unique: false}},
				{name: 'albumName', keyPath: 'albumName', options:{unique: false}},
				{name: 'provider', keyPath: 'provider', options:{unique: false}},
				{name: 'duration', keyPath: 'duration', options:{unique: false}},
				{name: 'blob', keyPath: 'blob', options:{unique: false}},
				{name: 'albumCover', keyPath: 'albumCover', options:{unique: false}},
			],
		},
		{
			name: 'playlists',
			options: {keyPath: 'name', autoIncrement: true},
			fields: [
				{name: 'list', keyPath: 'list', options:{unique: true}},
				{name: 'cover', keyPath: 'cover', options:{unique: false}},
			],
		},
		{
			name: 'plugins',
			options: {keyPath: 'id', autoIncrement: false},
			fields: [
				{name: 'name', keyPath: 'name', options:{unique: false}},
				{name: 'author', keyPath: 'author', options:{unique: false}},
				{name: 'script', keyPath: 'script', options:{unique: false}},
				{name: 'type', keyPath: 'type', options:{unique: false}},
				{name: 'description', keyPath: 'description', options:{unique: false}},
				{name: 'cover', keyPath: 'cover', options:{unique: false}},
			],
		},
		{
			name: 'settings',
			options: {keyPath: 'name', autoIncrement: false},
			fields: [
				{name: 'value', keyPath: 'value', options:{unique: false}},
				{name: 'type', keyPath: 'type', options:{unique: false}},
				{name: 'default', keyPath: 'default', options:{unique: false}},
				{name: 'label', keyPath: 'label', options:{unique: false}},
				{name: 'class', keyPath: 'class', options:{unique: false}},
			],
		},
	];

	/** @type {Object.<string, IDBObjectStore>} */
	objectStores = {};

	constructor(){
		this.createDatabase('lx', 1, this.dbSchemas).then(
			result=>{
				this.db = result;
			},
			error => {
				console.error(error);
			}
		);
	}


	/**
	 * 
	 * @param {string} name Name of database
	 * @param {number} version 
	 * @param {{
	 * 	name: string;
	 * 	options: {};
	 *  fields: {}[];
	 * }[]} schemas 
	 * @returns Promise<IDBDatabase>
	 */
	createDatabase(name, version, schemas){
		return new Promise((resolve, reject) => {
			let request = indexedDB.open(name, version);

			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = () => {
				reject(request.error);
			};
			request.onupgradeneeded = () => {
				let db = request.result;

				schemas.forEach(schema => {
					let objectStore = db.createObjectStore(schema.name, schema.options);

					schema.fields.forEach(filed=>{
						objectStore.createIndex(filed.name, filed.keyPath, filed.options);
					});

					objectStore.transaction.oncomplete = function(){
						resolve(db);
					};
				});
			};
		});
	}

	getTransaction(
		storeNames,
		mode = 'readwrite',
		oncomplete = null,
		onerror = this.defaultOnerror,
		onabort = null,
	){
		if(!this.db){
			console.error(`Get objectStore "${storeNames}" failed, database does not exist`);
			return;
		}
		let transaction = this.db.transaction(storeNames, mode);

		transaction.oncomplete = oncomplete;
		transaction.onerror = onerror;
		transaction.onabort = onabort;

		return transaction;
	}

	getObjectStore(storeNames, name, mode = 'readwrite'){
		let transaction = this.getTransaction(storeNames, mode);
		let objectStore = transaction.objectStore(name);

		return objectStore;
	}

	add(storeName, record){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);

			let request = objectStore.add(record);

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	delete(storeName, key){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);

			let request = objectStore.delete(key);

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	update(storeName, record){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);

			let request = objectStore.put(record);

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	get(storeName, key){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);

			let request = objectStore.get(key);

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	getAll(storeName){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);

			let request = objectStore.getAll();

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	getByField(storeName, fieldName, filedValue){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);
			let index = objectStore.index(fieldName);

			let request = index.get(filedValue);

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	getAllByField(storeName, fieldName, filedValue){
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(storeName, storeName);
			let index = objectStore.index(fieldName);

			let request = index.getAll(IDBKeyRange.only(filedValue));

			request.onsuccess = event=>{
				resolve(event.target.result);
			};
			request.onerror = event=>{
				reject(event);
			};
		});
	}

	async getSpaceUsage(){
		function formatByte(byte){
			if(byte < 1024){
				return `${byte} bytes`;
			}
			else if(byte < 1024 * 1024){
				return `${(byte / 1024).toFixed(2)} KB`;
			}
			else if(byte < 1024 * 1024 * 1024){
				return `${(byte / 1024 / 1024).toFixed(2)} MB`;
			}

			return `${(byte / 1024 / 1024 / 1024).toFixed(2)} GB`;
		}

		let estimate = await navigator.storage.estimate();
		let total = estimate.quota;
		let usage = estimate.usage;

		return {
			total: total,
			usage: usage,
			free: total - usage,
			percent: (usage / total * 100).toFixed(2),
			formattedTotal: formatByte(total),
			formattedUsage: formatByte(usage),
			formattedFree: formatByte(total - usage),
		};
	}

	async clearAll(){
		let check = confirm('This will erase all data (including settings), are you sure?');

		if(check){
			const dbs = await window.indexedDB.databases();

			dbs.forEach(db => {
				window.indexedDB.deleteDatabase(db.name);
			});
			alert('All data has been cleared, please refresh page');
		}
	}

	async cacheMusic(music){
		let response = await fetch(music.coverURL, {
			method: 'GET',
		});
		let albumCover = await response.blob();

		this.update('music', {
			id			: `${music.provider}-${music.id}`,
			music		: music,
			songName	: music.songName,
			artistList	: music.artistList,
			albumName	: music.albumName,
			provider	: music.provider,
			duration	: music.duration,
			blob		: music.blob,
			albumCover  : albumCover,
		});
	}

	async getCachedMusic(id){
		try{
			let result = await this.get('music', id);

			if(result){
				return result;
			}

			throw new Error('Music not found');
		}
		catch(error){
			throw new Error('Music not found');
		}
	}

	async getAllCachedMusicMetadata(){
		try {
			let results = await this.getAll('music');

			if(results){
				results.forEach(result => {
					delete result.music;
					delete result.blob;
					delete result.albumCover;
				});
				return results;
			}
			throw new Error('Get cached music metadata failed');
		}
		catch (error){
			throw new Error('Get cached music metadata failed');
		}
	}

})();