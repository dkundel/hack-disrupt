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
var Definition = require('../server/api/definitions/definition.model');

var handleRequest = (route, req, res) => {
  let lastPromise = undefined;
  route.handles.forEach((handle) => {
    if (!lastPromise) {
      lastPromise = apiModules(handle.module)(handle.config, req)(req.body);
    } else {
      lastPromise = lastPromise.then((v) => apiModules(handle.module)(handle.config, req)(_.merge(req.body, v)));
    }
  });
  return lastPromise.then((v) => { res.send(v); return true; }).catch((v) => res.status(500).send(v));
}

module.exports = function(app) {

  // Insert routes below
  app.use('/api/projects', require('./api/project'));
  app.use('/api/modules', require('./api/module'));
  app.use('/api/definitions', require('./api/definitions'));
  //app.use('/auth', require('./auth'));
  try{
    var routes = [{
    "type": "POST",
    "url": "/shoes/",
    "handles": [
      {
      "module": "zalando-articles",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
        },
        "params": {
          "fullText": "{{value.fullText}}",
        }
      }
      },
      {
      "module": "outlook-send",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
        },
        "params": {
          "to": "{{value.to}}",
          "body": "Found a following shoe for you for query '{{value.fullText}}': {{value.content.0.name}}, {{value.content.0.units.0.price.formatted}}. {{value.content.0.shopUrl}}",
          "subject": "{{value.subject}}"
        }
      }
      },
      {
      "module": "twilio",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
          "accountSid": "{{env.accountSid}}",
          "authToken": "{{env.authToken}}"
        },
        "params": {
          "from": "{{value.from}}",
          "to": "{{value.to}}",
          "body": "Hey, found new shoe model: {{value.content.0.name}}, {{value.content.0.units.0.price.formatted}}!"
        }
      }}]}]
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
    };
  }
  catch (e){
    console.log(e);
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

  app.get('/outlook/authenticate', function(req, res){
    var authHelper = require('./api/outlook/authHelper');
    res.send("<a href='" + authHelper.getAuthUrl() + "'>Email</a>");
  });
  app.get('/outlookAuthorize', function(req, res){
    var code = req.query.code;
    var authHelper = require('./api/outlook/authHelper');
    authHelper.getTokenFromCode(code, (re, rs, __, t) => {
      console.log(t);
      re.session.access_token = t.access_token;
      re.session.token = t;
      rs.send(t);
     }, req, res);
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