/**
 * Main application routes
 */

'use strict';
var apiModules = require('./api-modules');
var errors = require('./components/errors');
var path = require('path');
var _ = require('lodash');
var generateServer = require('../server-generator');
var mime = require('mime');
var fs = require('fs');

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
  app.use('/api/projects', require('./api/project'));
  app.use('/api/modules', require('./api/module'));
  app.use('/api/definitions', require('./api/definitions'));
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
  }

  app.get('/download', function(req, res){
    var serverFile = generateServer();
    serverFile.then(function(path){
      var file = __dirname + "/../" + path;
      res.download(file, "server.zip", function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }

        fs.unlink(file);
      });
    });
    serverFile.catch(function(err){
      console.log(err);
    });
  });

  app.post('/calendar', function(req, res){
    var out = require('./api/outlook/index.controller');
    out.calendar(req, res);
  });
  app.get('/outlook2', function(req, res){
    var out = require('./api/outlook/index.controller');
    out.send(req, res);
  });
  app.get('/outlook', function(req, res){
    var out = require('./api/outlook/index.controller');
    out.get(req, res);
  });

  app.post('/esri', function(req, res){
    let esri = require('./api-modules/esri')({}, {}, {});
    esri(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/esrifind', function(req, res){
    let esri = require('./api-modules/esriFind')({}, {}, {});
    esri(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });


  app.post('/zalando-article-reviews', function(req, res){
    let zalando = require('./api-modules/zalando-article-reviews')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-article-reviews-reviewId', function(req, res){
    let zalando = require('./api-modules/zalando-article-reviews-reviewId')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-article-reviews-reviewId', function(req, res){
    let zalando = require('./api-modules/zalando-article-reviews-reviewId')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-article-reviews-summaries', function(req, res){
    let zalando = require('./api-modules/zalando-article-reviews-summaries')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-article-reviews-summaries-articleModelId', function(req, res){
    let zalando = require('./api-modules/zalando-article-reviews-summaries-articleModelId')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles', function(req, res){
    let zalando = require('./api-modules/zalando-articles')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId-media', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId-media')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId-media-reviews', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId-media-reviews')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId-media-reviews-reviews-summary', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId-media-reviews-reviews-summary')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId-units', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId-units')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-articles-articleId-units-unitId', function(req, res){
    let zalando = require('./api-modules/zalando-articles-articleId-units-unitId')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-brands', function(req, res){
    let zalando = require('./api-modules/zalando-brands')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-brands-key', function(req, res){
    let zalando = require('./api-modules/zalando-brands-key')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-categories', function(req, res){
    let zalando = require('./api-modules/zalando-categories')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-categories-key', function(req, res){
    let zalando = require('./api-modules/zalando-categories-key')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-domains', function(req, res){
    let zalando = require('./api-modules/zalando-domains')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-facets', function(req, res){
    let zalando = require('./api-modules/zalando-facets')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-filters', function(req, res){
    let zalando = require('./api-modules/zalando-filters')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-filters-filtername', function(req, res){
    let zalando = require('./api-modules/zalando-filters-filtername')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });

  app.post('/zalando-recommendations-articleIds', function(req, res){
    let zalando = require('./api-modules/zalando-recommendations-articleIds')({}, {}, {});
    zalando(req.body)
      .then(function(val){console.log(val); res.send(val);})
      .catch(function(val){console.log(val); res.send(val);});
  });


  // app.post('/twilio', function(req, res){
  //   let twilio = require('./api-modules/twilio')({}, {}, {});
  //   twilio(req.body)
  //     .then(function(val){console.log(val); res.send(val);})
  //     .catch(function(val){console.log(val); res.send(val);});
  // });

  // All undefined asset or api routes should return a 404

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};