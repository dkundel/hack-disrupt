/**
 * Main application routes
 */

'use strict';
var apiModules = require('./api-modules');
var errors = require('./components/errors');
var path = require('path');
var _ = require('lodash');

var handleRequest = (route, req, res) => {
  var promise = null;
  for(var i in route.handles){
    var handle = route.handles[i];

    if(promise == null){
      console.log("Initializing chain with module:" + handle.module);
      promise = apiModules(handle.module)(handle.config, req, req.body);
    } else{
      console.log("Continuing with module:" + handle.module);

      var localPromise = promise;
      promise = localPromise.then(v => apiModules(handle.module)(handle.config, req, _.merge(req.body, v)));

      localPromise.catch(function(val){console.log(val); res.send(val);});
    }
  }

  promise.then(function(val){console.log(val); res.send(val);});
  promise.catch(function(val){console.log(val); res.send(val);});
}

module.exports = function(app) {

  // Insert routes below
  //app.use('/auth', require('./auth'));
  try{
    var routes = require('./api/definition').routes;
    for(var i in routes){
      let route = routes[i];
      console.log("Route: " +  route);

      if(route.type == "POST"){
        app.post(route.url, (req, res) => handleRequest(route, req, res));
      }
      else if(route.type == "GET"){
        app.get(route.url, (req, res) => handleRequest(route, req, res));
      }
      console.log("Route ready: " + route.type + " " + route.url);
    }
  }
  catch (e){
    // TODO
    app.post('/:module', (req, res) => require('./api-modules')(req.params.module)(req, res));
  }

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};