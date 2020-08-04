const nanocurrency = require('nanocurrency');
const axios = require('axios');
const configvar = require('./app.json');

// set worknode to remote pow solver (if needed)
var worknode = process.env.worknode || configvar.worknode;

async function hybirdwork(blockblock) {
	console.log('work requested : ' + blockblock);

	return axios
		.post(worknode, {
			action: 'work_generate',
			hash: blockblock,
		})
		.then(function (response) {
			console.log('gpu work : ' + response.data.work);
			return response.data.work;
		})
		.catch(async function (error) {
			pow = await nanocurrency.computeWork(blockblock);
			console.log('cpu work : ' + pow);
			return pow;
		});
}

(async () => {
	while (true) {
		try {
			await axios.get('https://nanopay.besoeasy.com/work/get').then(async function (resx) {
				blockHash = resx.data.result[0].blockHash;

				if (blockHash) {
					xx = await hybirdwork(blockHash);

					await axios.get('https://nanopay.besoeasy.com/workset/' + blockHash + '/' + xx).then(async function (response2) {
						console.log(response2.data);
					});
				}
			});
		} catch (e) {
			console.log('no more work');
		}
	}
})();
