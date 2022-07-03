export default class Helper{

	/**
	 * 
	 * @param {string} url
	 * @param {object} form
	 * @param {'GET'|'POST'} method
	 * @param {HeaderInit} headers
	 * @returns {object|string}
	 */
	static async fetchWithForm(url, form, method = 'POST', headers = {
		'accept': 'application/json, text/plain, */*',
		'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
	}){
		let body = new URLSearchParams(Object.entries(form)).toString();

		try {
			let response;

			if (method === 'GET'){
				response = await fetch(`${url}?${body}`, {
					method,
					headers,
				});
			}
			else {
				response = await fetch(url, {
					method,
					headers,
					body,
				});
			}
			let content = await response.text();

			try {
				return JSON.parse(content);
			}
			catch {
				return content;
			}
		}
		catch (error){
			console.error('Failed to fetch data', {
				fetching: url,
				payload: body,
			});
			throw (error);
		}
	}

	/**
	 * @param {string} str 
	 * @returns {string}
	 */
	static str2hex(str){
		let result = '';

		for (let i = 0; i < str.length; i++){
			result += str.charCodeAt(i).toString(16);
		}
		return result;
	}

	/**
	 * @param {string} hex 
	 * @returns {string}
	 */
	static hex2str(hex){
		let result = '';

		for (let i = 0; i < hex.length; i += 2){
			result += String.fromCharCode(parseInt(hex[i] + hex[i + 1], 16));
		}
		return result;
	}

	/**
	 * 
	 * @param {string} base64 
	 * @returns {ArrayBuffer}
	 */
	static base64ToArrayBuffer(base64){
		let binary_string = window.atob(base64);
		let len = binary_string.length;
		let bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++){
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	/**
	 * 
	 * @param {ArrayBuffer} buffer 
	 * @returns {string}
	 */
	static arrayBufferToHex(buffer){
		return [...new Uint8Array(buffer)]
			.map(x => x.toString(16).padStart(2, '0'))
			.join('');
	}

	/**
	 * 
	 * @param {ArrayBuffer} buffer 
	 * @returns {string}
	 */
	static arrayBufferToBase64(buffer){
		let binary = '';
		let bytes = new Uint8Array(buffer);
		let len = bytes.byteLength;

		for (let i = 0; i < len; i++){
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}

	/**
	 * 
	 * @param {ArrayBuffer} buffer 
	 * @returns {string}
	 */
	// https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
	static arrayBufferToStr(buffer){
		let bytes = new Uint8Array(buffer);
		let out, i, len, c;
		let char2, char3;

		out = '';
		len = bytes.length;
		i = 0;
		while (i < len){
			c = bytes[i++];
			switch (c >> 4){
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				// 0xxxxxxx
				out += String.fromCharCode(c);
				break;
			case 12: case 13:
				// 110x xxxx   10xx xxxx
				char2 = bytes[i++];
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = bytes[i++];
				char3 = bytes[i++];
				out += String.fromCharCode(((c & 0x0F) << 12)
						| ((char2 & 0x3F) << 6)
						| ((char3 & 0x3F) << 0));
				break;
			}
		}
		return out;
	}

	/**
	 * 
	 * @param {number} from 
	 * @param {number} to 
	 * @returns {number}
	 */
	static getRandomInt(from, to){
		return ~~(Math.random() * (to - from + 1)) + from;
	}

	static shuffleArray(arr){
		for (let i = 0; i < arr.length; i++){
			let rnd = this.getRandomInt(i, arr.length - 1);
			let tmp = arr[rnd];

			arr[rnd] = arr[i];
			arr[i] = tmp;
		}
		return arr;
	}

	/**
	 * 
	 * @param {number} len 
	 * @returns {string}
	 */
	static getRandomString(len){
		let s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';

		for (let i = 0; len > i; i += 1){
			let index = Math.floor(Math.random() * s.length);

			result += s.charAt(index);
		}
		return result;
	}

	/**
	 * 
	 * @param {number} s the count of second
	 * @returns {string} 'mm:ss.ms'
	 */
	static formatTime(s){
		if(!s){
			return '--:--';
		}
		let minute = (~~(s.toFixed(3) / 60)).toString().padStart(2, '0');
		let second = (~~(s % 60)).toString().padStart(2, '0');
		let millisecond = ((s % 1).toFixed(3) * 1000).toString().padStart(3, '0');

		return `${minute}:${second}.${millisecond}`;
	}

	/**
	 * 
	 * @param {Function} func 
	 * @param {number} coolDown 
	 * @returns {Function}
	 */
	static throttle(func, coolDown = 100){
		let isThrottled = false;
		let args = null;
		let self = null;

		function wrapper(){
			if (isThrottled){
				args = arguments;
				self = this;
				return;
			}
			isThrottled = true;

			func.apply(this, arguments);

			setTimeout(() => {
				isThrottled = false;
				if (args){
					wrapper.apply(self, args);
					args = null;
					self = null;
				}
			}, coolDown);
		}

		return wrapper;
	}

	/**
	 * 
	 * @param {Function} func 
	 * @param {number} coolDown 
	 * @returns {Function}
	 */
	static debounce(func, coolDown = 100){
		let timeout;

		return function(){
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, arguments), coolDown);
		};
	}

}