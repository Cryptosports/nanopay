### **NANOPAY** - Simple NANO Payment API

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![dependencies](https://david-dm.org/besoeasy/nano-payment.svg)](https://github.com/besoeasy/nano-payment)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/besoeasy/nano-payment/issues)

## Supports GPU, CPU, WEBGL, POW Generation

NANOPAY API takes out hassle of generating work for NANO. Your Clients/Users generate work for you. Backend Just Compiles Transactions. Process Unlimited Transactions without wait.

# Features

|                            | NANOPAY  | SNAPY    |
| -------------------------- | -------- | -------- |
| Stores Data/Keys Database  | NO       | YES      |
| Centralized                | NO       | YES      |
| Open Source                | YES      | NO       |
| Stuck Funds                | NO       | MAYBE    |
| Atomic Transaction         | YES      | NO       |
| Send Balance               | YES      | YES      |
| Receive NANO               | YES      | NO       |
| Send Percentage of Balance | YES      | NO       |
| DPOW                       | YES      | NO       |
| Allows Using Seed          | YES      | NO       |
| Allows Using Private Key   | YES      | NO       |
| Allows Using Public Key    | YES      | NO       |
| Allows Wallet Export       | YES      | NO       |
| Custom Derivation          | YES      | NO       |
| Minimum Send               | No Limit | 0.000001 |

## RUN

**Everything**

```sh
node app.js
```

**Just API**

```sh
node api.js
```

**Just Powsolver**

```sh
node pow.js
```

## RUN On Cloud

Deploy TO Heroku [FREE]

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## API CALLS

**Get Full Details About NANO Address**

```sh
    address = 'nano_3juezzxttp8p8mxn954nudntq4za44x7ppxef8mfemcn4fmfrc9ijh9jons7'

	axios({ method: "POST", url: "https://nanopay.besoeasy.com/nanoinfo/" + address }).then((response) => {
		console.log(response.data)
	// nano information
	});

```

**Get Full Details About NANO Block**

```sh
    block = 'A849EDA52540AECDCA03BD856ACF973D5A142997687FEFCC79721AAD135C55C4'

	axios({ method: "POST", url: "https://nanopay.besoeasy.com/blockinfo/" + block }).then((response) => {
		console.log(response.data)
	// nano information
	});

```

**Send (Amount) NANO**

```sh

	sendto = "nano_3534reyr3imnuhnd8ife3ih9cb7r9gm7rr73cg4cwx3mrj19w1efcq3649wd";
	sendamount = 0.1;

	axios({
		method: "POST",
		url: "https://nanopay.besoeasy.com/send/" + sendto + "/" + sendamount,
		headers: {
			seed: seed,
			index: 0,
		},
	}).then((response) => {
		if (response.data.hash) {
			// nano sent
		} else {
			// nano not sent
		}
	});

```

**Send (Percentage) NANO**

```sh

	sendto = "nano_3534reyr3imnuhnd8ife3ih9cb7r9gm7rr73cg4cwx3mrj19w1efcq3649wd";
	percentage = 5;

	axios({
		method: "POST",
		url: "https://nanopay.besoeasy.com/sendpercent/" + sendto + "/" + percentage,
		headers: {
			seed: seed,
			index: 0,
		},
	}).then((response) => {
		if (response.data.hash) {
			// nano sent
		} else {
			// nano not sent
		}
	});

```

**Recieve NANO**

```sh

	axios({
		method: "POST",
		url: "https://nanopay.besoeasy.com/fetch",
		headers: {
			seed: seed,
			index: 0,
		},
	});

```

**Request POW Cache [Optional]**

```sh

	axios({
		method: "POST",
		url: "https://nanopay.besoeasy.com/powcache",
		headers: {
			seed: seed,
			index: 0,
		},
	});

```

**Request POW**

```sh

    block = 'A849EDA52540AECDCA03BD856ACF973D5A142997687FEFCC79721AAD135C55C4'

	axios({
		method: "POST",
		url: "https://nanopay.besoeasy.com/pow/" + block,
	});

```
