class MusicList extends HTMLElement{

	/** @type {music[]} */
	list = [];

	/** @type {HTMLLIElement[]} */
	listElement = [];

	columns;

	cmdList = {
		play: {
			icon: '\ue768',
			title: '播放',
			eventListener: event => {
				let music = this.list[event.target.getAttribute('index')];

				lx.playingList.addAndPlay(music);
				lx.player.loadMusic(music);
			},
		},
		addToPlayingList: {
			icon: '\ue710',
			title: '添加至播放列表',
			eventListener: event => {
				let music = this.list[event.target.getAttribute('index')];
				// todo:
			},
		},
		addToFavorites: {
			icon: '\ueb51',
			title: '添加至收藏',
			eventListener: event => {
				let music = this.list[event.target.getAttribute('index')];

				lx.playlists.playlists.__favorites__.add(music.id);
			},
		},
		remove: {
			icon: '\ue74d',
			title: '从列表移除',
			eventListener: event => {
				let music = this.list[event.target.getAttribute('index')];

				this.remove(music);
			},
		},
	};

	constructor(
		musics,
		columns = ['songName', 'artistList', 'duration'],
		cmd = ['play', 'addToPlayingList', 'addToFavorites', 'remove'],
		header
	){
		super();
		this.columns = columns;
		if(header){
			this.createHeader(header.name, header.coverURL);
		}
		let template = document.createDocumentFragment();

		musics.forEach((music, index)=>{
			let li = this.createListElement(music, index);

			this.list.push(music);
			template.appendChild(li);
			this.listElement.push(li);
		});

		this.appendChild(template);

		this.cmd = cmd;

		cmd.forEach(cmdName=>{
			if(typeof cmdName === 'string'){
				let cmdItem = this.cmdList[cmdName];

				this.addCmdToAll('click', cmdItem.eventListener.bind(this), cmdItem.icon, cmdItem.title);
			}
			else{
				this.addCmdToAll('click', cmdName.eventListener.bind(this), cmdName.icon, cmdName.title);
			}
		});
	}

	createHeader(name, coverURL){
		let header = document.createElement('div');

		header.classList.add('music-list-header');
		header.innerHTML = `
		<div class='playlist-cover'>
			<img id='playlist-cover-img' src='${coverURL}'/>
			<button id='playlist-cover-edit'></button>
		</div>
		<div class='playlist-data'>
			<div id='playlist-name'>${name}</div>
			<div class='playlist-cmd-buttons'>
				<button id='playlist-play-all'>播放全部</button>
				<button id='playlist-rename'>重命名</button>
				<button id='playlist-delete'>删除</button>
			</div>
		</div>
		`;

		this.coverImgEle = header.querySelector('#playlist-cover-img');
		this.coverEditEle = header.querySelector('#playlist-cover-edit');
		this.nameEle = header.querySelector('#playlist-name');
		this.playAllEle = header.querySelector('#playlist-play-all');
		this.renameEle = header.querySelector('#playlist-rename');
		this.deleteEle = header.querySelector('#playlist-delete');

		this.appendChild(header);
	}

	createListElement(music, index){
		let li = document.createElement('li');

		li.className = 'music-list-item';
		li.setAttribute('index', index);
		// li.setAttribute('odd-even', index % 2 ? 'odd' : 'even');
		li.music = music;
		this.columns.forEach(column=>{
			let span = document.createElement('span');

			span.className = `music-list-item-${column}`;
			if(Array.isArray(music[column])){
				span.innerText = music[column].join(', ');
			}
			else if(column === 'duration'){
				span.innerText = lx.Utils.formatTime(music[column]).split('.')[0];
			}
			else if(column === 'provider'){
				span.innerText = lx.providers[music[column]].displayName;
			}
			else{
				span.innerText = music[column];
			}
			li.appendChild(span);
		});

		return li;
	}

	add(music){
		let li = this.createListElement(music, this.list.length, this.columns);

		this.list.push(music);
		this.listElement.push(li);
		this.appendChild(li);

		this.cmd.forEach(cmdName => {
			if(typeof cmdName === 'string'){
				let cmdItem = this.cmdList[cmdName];

				this.addCmdButton(li, this.list.length - 1, 'click', cmdItem.eventListener.bind(this), cmdItem.icon, cmdItem.title);
			}
			else{
				this.addCmdButton(li, this.list.length - 1, 'click', cmdName.eventListener.bind(this), cmdName.icon, cmdName.title);
			}
		});
	}

	remove(music){
		let index = this.list.indexOf(music);

		if(index === -1){
			return;
		}

		this.list.splice(index, 1);
		this.removeChild(this.listElement[index]);
	}

	swap(id1, id2){
		let index1 = this.list.findIndex(music=>music.id === id1);
		let index2 = this.list.findIndex(music=>music.id === id2);

		if(index1 === -1 || index2 === -1){
			return;
		}

		let temp = this.list[index1];

		this.list[index1] = this.list[index2];
		this.list[index2] = temp;

		let tempElement = this.listElement[index1];

		this.listElement[index1] = this.listElement[index2];
		this.listElement[index2] = tempElement;

		this.listElement[index1].setAttribute('index', index1);
		this.listElement[index2].setAttribute('index', index2);
		// this.listElement[index1].setAttribute('odd-even', index1 % 2 ? 'odd' : 'even');
		// this.listElement[index2].setAttribute('odd-even', index2 % 2 ? 'odd' : 'even');
	}

	sortBy(column, order = 'asc'){
		this.listElement.sort((a, b)=>{
			if(order === 'asc'){
				return a.music[column] > b.music[column] ? 1 : -1;
			}

			return a.music[column] < b.music[column] ? 1 : -1;
		});

		this.listElement.forEach((li, index)=>{
			li.setAttribute('index', index);
		}
		);

		this.replaceChildren(...this.listElement);
		// this.appendChild(this.listElement);
	}


	addCmdToAll(eventType, eventListener, icon, title){
		this.listElement.forEach((li, index)=>{
			this.addCmdButton(li, index, eventType, eventListener, icon, title);
		});
	}

	addCmdButton(li, index, eventType, eventListener, icon, title){
		let button = document.createElement('button');

		button.className = 'music-cmd-button';
		button.addEventListener(eventType, eventListener);
		button.innerHTML = icon;
		button.title = title;
		button.setAttribute('index', index);
		li.querySelector('.music-list-item-songName').appendChild(button);
	}



}

customElements.define('lx-music-list', MusicList);