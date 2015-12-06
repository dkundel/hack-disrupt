'use strict';

var _ = require('lodash');

{{#each modules}}
var {{var this}} = require('./api-modules/{{this}}');
{{/each}}

var env = require('./environment');

var handleRequest = (modules, configs, req, res) => {
  let lastPromise = undefined;
  modules.forEach((module, i) => {
    if (!lastPromise) {
      lastPromise = module(req, env, configs[i])(req.body);
    } else {
      lastPromise = lastPromise.then((v) => module(req, env, configs[i])(_.merge(req.body, v)));
    }
  });
  return lastPromise.then((v) => { res.send(v); return true; }).catch((v) => res.status(500).send(v));
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
		app.{{lower this.type}}("{{this.url}}", (req, res) => handleRequest([{{#each this.modules}}{{var this}}, {{/each}}], configs["{{this.url}}"], req, res));
	{{/each}}
};
