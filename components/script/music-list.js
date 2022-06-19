class MusicList extends HTMLElement{

	/** @type {music[]} */
	list = [];

	listElement = [];

	columns;

	constructor(musics, columns = ['songName', 'artistList', 'duration']){
		super();
		this.columns = columns;
		let template = document.createDocumentFragment();

		musics.forEach((music, index)=>{
			let li = this.createListElement(music, index);

			this.list.push(music);
			template.appendChild(li);
			this.listElement.push(li);
		});

		this.appendChild(template);
	}

	createListElement(music, index){
		let li = document.createElement('li');

		li.className = 'music-list-item';
		li.setAttribute('index', index);
		li.setAttribute('odd-even', index % 2 ? 'odd' : 'even');
		this.columns.forEach(column=>{
			let span = document.createElement('span');

			span.className = `music-list-item-${column}`;
			if(Array.isArray(music[column])){
				span.innerText = music[column].join(', ');
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
	}

	delete(music){
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
		this.listElement[index1].setAttribute('odd-even', index1 % 2 ? 'odd' : 'even');
		this.listElement[index2].setAttribute('odd-even', index2 % 2 ? 'odd' : 'even');
	}

	sortBy(column, order = 'asc'){
		this.list.sort((a, b)=>{
			if(order === 'asc'){
				return a[column] > b[column] ? 1 : -1;
			}

			return a[column] < b[column] ? 1 : -1;
		});

		this.listElement.forEach((li, index)=>{
			li.setAttribute('index', index);
			li.setAttribute('odd-even', index % 2 ? 'odd' : 'even');
		}
		);

		this.appendChild(this.listElement);
	}

}

customElements.define('lx-music-list', MusicList);