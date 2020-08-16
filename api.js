const nanocurrency = require('nanocurrency');
const axios = require('axios');
const BigNumber = require('bignumber.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// db init
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).then((result) => {
	console.log('MONGODB CONNECTED');
});

var main = mongoose.model(
	'main',
	new mongoose.Schema({
		blockHash: { type: String, unique: true, required: true },
		pow: { type: String },
		expireAt: {
			type: Date,
			default: Date.now,
			index: { expires: '1d' },
		},
	})
);

const app = express();

// use remote node ( SET nanonode= your node url ) or
// run localnode
// docker run --restart=unless-stopped -d -p 7075:7075/udp -p 7075:7075 -p [::1]:7076:7076 -p [::1]:7078:7078 nanocurrency/nano:latest

const node = process.env.nanonode || 'http://127.0.0.1:7076';
app.listen(process.env.PORT || 5000, '0.0.0.0');

app.use(cors());

app.all('/blockinfo/:block', (request, reply) => {
	axios.post(node, { action: 'blocks_info', hashes: [request.params.block] }).then(function (response) {
		reply.json(response.data);
	});
});

app.all('/nanoinfo/:addr', (request, reply) => {
	axios
		.post(node, {
			action: 'account_history',
			account: request.params.addr,
			count: 100,
		})
		.then(function (response) {
			axios
				.post(node, {
					action: 'account_info',
					account: request.params.addr,
				})
				.then(function (response2) {
					axios
						.post(node, {
							action: 'pending',
							account: request.params.addr,
						})
						.then(function (response3) {
							reply.json({
								info: response2.data,
								pendingblocks: response3.data.blocks,
								history: response.data.history,
							});
						});
				});
		});
});

app.all('/workset/:blockhash/:pow', (request, reply) => {
	var blockHash = request.params.blockhash;
	var pow = request.params.pow;

	var doc = {
		blockHash: blockHash,
		pow: pow,
		expireAt: Date.now(),
	};

	if (nanocurrency.validateWork({ blockHash, work: pow })) {
		main.findOneAndUpdate({ blockHash: blockHash }, doc, { upsert: true, new: true, runValidators: true }, function (err, doc) {
			if (err) {
				reply.json({ result: 0 });
			} else {
				reply.json({ result: 1 });
			}
		});
	} else {
		reply.json({ result: 0 });
	}
});

app.all('/workget/:blockhash/', (request, reply) => {
	var blockHash = request.params.blockhash;

	main.find({ blockHash: blockHash }, function (err, result) {
		reply.json({ result });
	});
});

app.all('/work/get', (request, reply) => {
	main.find({ pow: null }, function (err, result) {
		reply.json({ result });
	});
});

app.all('/powcache/', async (request, reply) => {
	var secretKey = nanocurrency.deriveSecretKey(request.headers.seed, parseInt(request.headers.index));

	var bing = await recentblockcache(secretKey);
	reply.json(bing);
});

app.all('/pow/:block', async (request, reply) => {
	var blockx = request.headers.block;
	var xxx = await hybirdwork(blockx);
	reply.json(xxx);
});

app.all('/fetch/', async (request, reply) => {
	var secretKey = nanocurrency.deriveSecretKey(request.headers.seed, parseInt(request.headers.index));

	var bing = await fetchpending(secretKey);
	reply.json(bing);
});

app.all('/send/:sendto/:amount', async (request, reply) => {
	var secretKey = nanocurrency.deriveSecretKey(request.headers.seed, parseInt(request.headers.index));
	var sendto = request.params.sendto;
	var amount = request.params.amount;

	var bing = await send(secretKey, sendto, amount);
	reply.json(bing);
});

app.all('/sendpercent/:sendto/:percentage', async (request, reply) => {
	var secretKey = nanocurrency.deriveSecretKey(request.headers.seed, parseInt(request.headers.index));
	var sendto = request.params.sendto;
	var per2 = request.params.percentage;

	var bing = await sendpercent(secretKey, sendto, per2);
	reply.json(bing);
});

app.all('*', function (req, res) {
	res.redirect('/');
});

async function publish(blockjson) {
	return axios
		.post(node, {
			action: 'process',
			json_block: 'true',
			block: blockjson,
		})
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function accountdig(account) {
	return axios
		.post(node, {
			account: account,
			action: 'account_info',
		})
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function pendingblock(account) {
	return axios
		.post(node, {
			account: account,
			action: 'pending',
		})
		.then(function (response) {
			return response.data.blocks[0];
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function pendingblockcount(account) {
	return axios
		.post(node, {
			account: account,
			action: 'pending',
		})
		.then(function (response) {
			x = response.data.blocks;

			return x.length;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function block_info(blockid) {
	return axios
		.post(node, {
			hashes: [blockid],
			json_block: 'true',
			action: 'blocks_info',
			pending: 'true',
		})
		.then(function (response) {
			return response.data.blocks[blockid].amount;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function recentblockcache(secretKey) {
	var publicKey = nanocurrency.derivePublicKey(secretKey);
	var address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });

	var peniong = await pendingblock(address);
	var sddsf_address = await accountdig(address);

	if (sddsf_address.error) {
		var cbal = '0';
		var previous = null;
		var pow = await hybirdwork(publicKey);
		var xx = publicKey;
	} else {
		var cbal = sddsf_address.balance;
		var previous = sddsf_address.frontier;
		var pow = await hybirdwork(previous);
		var xx = previous;
	}

	return xx;
}

async function fetchpending(secretKey) {
	var publicKey = nanocurrency.derivePublicKey(secretKey);
	var address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });

	if ((await pendingblockcount(address)) > 0) {
		var peniong = await pendingblock(address);
		var peniongbal = await block_info(peniong);
		var sddsf_address = await accountdig(address);

		if (sddsf_address.error) {
			var cbal = '0';
			var previous = null;
			var pow = await hybirdwork(publicKey);
		} else {
			var cbal = sddsf_address.balance;
			var previous = sddsf_address.frontier;
			var pow = await hybirdwork(previous);
		}

		var puki = new BigNumber(cbal);
		var balance = puki.plus(peniongbal);
		var balancex = balance.toFixed();

		dd = {
			balance: balancex,
			link: peniong,
			previous: previous,
			representative: address,
			work: pow,
		};

		var xxx = await nanocurrency.createBlock(secretKey, dd);
		var retr = await publish(xxx.block);

		return retr;
	} else {
		return '{ "hash" : 0 }';
	}
}

async function send(secretKey, sendto, nano) {
	var publicKey = nanocurrency.derivePublicKey(secretKey);
	var address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });

	var sddsf_address = await accountdig(address);
	var cbal = sddsf_address.balance;
	var previous = sddsf_address.frontier;
	var pow = await hybirdwork(previous);

	var x = new BigNumber('1000000000000000000000000000000');
	var xx = x.multipliedBy(nano).toFixed();
	var puki = new BigNumber(cbal);
	var balance = puki.minus(xx);

	var balancex = balance.toFixed(0);

	if (balancex >= 0) {
		dd = {
			balance: balancex,
			link: sendto,
			previous: previous,
			representative: address,
			work: pow,
		};
		var xxx = await nanocurrency.createBlock(secretKey, dd);
		var retr = await publish(xxx.block);
	} else {
		var retr = { error: 'no_balance' };
	}

	return retr;
}

async function sendpercent(secretKey, sendto, per) {
	var publicKey = nanocurrency.derivePublicKey(secretKey);
	var address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
	var percentage = (100 - per) / 100;

	var sddsf_address = await accountdig(address);
	var cbal = sddsf_address.balance;
	var previous = sddsf_address.frontier;
	var pow = await hybirdwork(previous);

	var puki = new BigNumber(cbal);
	var balance = puki.multipliedBy(percentage);
	var balancex = balance.toFixed(0);

	if (balancex >= 0) {
		dd = {
			balance: balancex,
			link: sendto,
			previous: previous,
			representative: address,
			work: pow,
		};
		var xxx = await nanocurrency.createBlock(secretKey, dd);
		var retr = await publish(xxx.block);
	} else {
		var retr = { error: 'no_balance' };
	}

	return retr;
}

async function hybirdwork(blockHash) {
	return main.findOne({ blockHash: blockHash }).then((result) => {
		if (result) {
			return result.pow;
		} else {
			kitty = new main({ blockHash: blockHash, pow: null });
			kitty.save().then(() => console.log('added ' + blockHash));
			return 0;
		}
	});
}
