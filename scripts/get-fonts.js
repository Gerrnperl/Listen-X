const fs = require('fs');

fs.readFile('./src/fabric-icons.ts', 'utf8', (err, data) => {
	if (err){
		console.error(err);
		return;
	}
	let lines = data.split('\n');
	let result = '';

	lines.forEach(line =>{
		let unicode = line.match(/(?<=\\u).*?(?=\',$)/gm)?.at(0);

		if(unicode){
			result += unicode + '\n';
		}
	});
	console.log(result);
});