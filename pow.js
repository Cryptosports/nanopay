const nanocurrency = require('nanocurrency');
const axios = require('axios');

var worknode = process.env.worknode;

async function hybirdwork(blockblock) {
	console.log('work requested : ' + blockblock);

	return axios
		.post(worknode, {
			action: 'work_generate',
			difficulty: 'fffffff800000000',
			hash: blockblock,
		})
		.then(function (response) {
			console.log('gpu work : ' + response.data.work);
			return response.data.work;
		})
		.catch(async function (error) {
			pow = await nanocurrency.computeWork(blockblock, (ComputeWorkParams = { workThreshold: 'fffffff800000000' }));
			console.log('cpu work : ' + pow);
			return pow;
		});
}

(async () => {
	while (true) {
		try {
			await axios.get('work/get').then(async function (resx) {
				blockHash = resx.data.result[0].blockHash;

				if (blockHash) {
					xx = await hybirdwork(blockHash);

					await axios.get('workset/' + blockHash + '/' + xx).then(async function (response2) {
						console.log(response2.data);
					});
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
})();
