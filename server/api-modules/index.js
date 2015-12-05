'use strict';

module.exports = (moduleId) => {
	return (config, req, value) => {
		console.log("Configuration: %j", config);
		let env = require('../../environment');
		return require('./' + moduleId)(req, env, config)(value);
	}
}