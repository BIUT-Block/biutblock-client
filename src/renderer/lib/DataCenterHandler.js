const request = require('request')
const dataCenterUrl = "http://localhost:3000/mining-pool/"

const DataCenterHandler = {
	createWallet: function (params, callback) {
		request({
			url: `${dataCenterUrl}createwallet`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body) => {
			callback(body)
		})
	},

	findOutWallet: function (params, callback) {
		request({
			url: `${dataCenterUrl}finditem`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body) => {
			callback(body)
		})
	},
	
	updateWallet: function (params, callback) {
		request({
			url: `${dataCenterUrl}updatefreezevalue`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body) => {
			callback(body)
		})
	}
}

module.exports = DataCenterHandler