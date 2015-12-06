'use strict';
{{#each modules}}
var {{this}} = require('./api-modules/{{this}}');
{{/each}}

var handleRequest = (modules, configs, req, res) => {
  var promise = null;
  for(var i in modules){
    var module = modules[i];
	var config = configs[i];

    if(promise == null){
      promise = module(config, req, req.body);
    } else{
      var localPromise = promise;
      promise = localPromise.then(value => module(config, req, _.merge(req.body, value)));

      localPromise.catch(function(val){console.log(val); res.send(val);});
    }
  }

  promise.then(function(val){console.log(val); res.send(val);});
  promise.catch(function(val){console.log(val); res.send(val);});
}

var configs = {
	{{#each routes}}
		"{{this.url}}": [
		{{#each this.handles}}
			{{{json this.config}}},
		{{/each}}
		],
	{{/each}}
}

module.exports = function(app) {
	{{#each routes}}
		{{#if this.post}}
	app.post("{{this.url}}", (req, res) => handleRequest([{{this.modules}}], configs["{{this.url}}"], req, res));
		{{else}}
	app.get("{{this.url}}", (req, res) => handleRequest([{{this.modules}}], configs["{{this.url}}"],req, res));
		{{/if}}
	{{/each}}
};
