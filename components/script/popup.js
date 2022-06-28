class Popup{

	/**
	 * 
	 * @param {'info' | 'warning' | 'error' | 'success' | 'confirm' | 'form'} type 
	 * @param {string | {}} content 
	 * @param {string} title 
	 */
	constructor(type, content, title){
		this.element = document.createElement('div');
		switch(type){
		case 'info':
		case 'warning':
		case 'error':
		case 'success':
			this.createToast(type, content);
			document.querySelector('#popup-container').appendChild(this.element);
			break;
		}
	}

	/**
	 * 
	 * @param {'info' | 'warning' | 'error' | 'success'} type 
	 * @param {string} content 
	 */
	createToast(type, content){
		this.element.className = `popup toast ${type}`;
		this.element.innerHTML = content;
		setTimeout(() =>{
			this.element.style.opacity = '1';
		}, 0); // asynchronous execution
		setTimeout(() =>{
			this.element.style.opacity = '0';
			setTimeout(() =>{
				document.querySelector('#popup-container').removeChild(this.element);
			}, 300);
		}, 3000);
	}

	/**
	 * 
	 * @param {string} title 
	 * @param {'confirm' | 'form'} type 
	 * @param {string | {}} content 
	 */
	createDialog(title, type, content){

	}

}