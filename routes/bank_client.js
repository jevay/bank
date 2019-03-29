var client = require('axios');

module.exports.get_response = function(url, params_json){
	client.get(url, {params:params_json}).then((response) => {
		return response;
	}).catch((error) => {
		return error;
	});
}

module.exports.post_request = function(url, data_json){
	client.post(url, data_json).then((response) => {
		return response;
	}).catch((error) => {
		return error;
	});
}