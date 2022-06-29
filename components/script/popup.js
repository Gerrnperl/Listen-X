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
		case 'confirm':
		case 'form':
			this.result = new Promise((resolve, reject) =>{
				this.createDialog(title, type, content).then(result => {
					resolve(result);
				});
			})
			document.querySelector('#popup-container').appendChild(this.element);
			break;
		}
	}


	close(){
		this.element.style.opacity = '0';
		setTimeout(() =>{
			document.querySelector('#popup-container').removeChild(this.element);
		}, 300);
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
			this.close();
		}, 3000);
	}

	/**
	 * if `type` is `confirm`, `content` should be string
	 * @param {string} title 
	 * @param {'confirm' | 'form'} type 
	 * @param {string | {}} content 
	 */
	createDialog(title, type, content){
		this.element.className = `popup dialog ${type}`;
		let dialogContent;

		if(typeof content === 'string'){
			dialogContent = content;
		}
		else {
			// dialogContent
		}

		this.element.innerHTML = `
			<div class='dialog-title'>${title}</div>
			<div class='dialog-content'>${dialogContent}</div>
			<div class='dialog-buttons'>	
				<button class='dialog-button button-confirm'>确定</button>
				<button class='dialog-button button-cancel'>取消</button>
			</div>
		`;
		return new Promise((resolve, reject) => {
			if(type === 'confirm'){
				this.element.querySelector('.dialog-button.button-confirm').addEventListener('click', ()=>{
					resolve(true);
					this.close();
				});
				this.element.querySelector('.dialog-button.button-cancel').addEventListener('click', ()=>{
					resolve(false);
					this.close();
				});
			}
		});
	}

}
