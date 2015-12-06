'use strict'

var fs = require('fs');
var ncp = require('ncp').ncp;
var rmdir = require('rimraf');
var uuid = require('node-uuid');
var archiver = require('archiver');
var path = require('path');
var hbs = require('handlebars');
var fs = require('fs');
var _ = require('lodash');
var Definition = require('../server/api/definitions/definition.model');

var generateRoutes = (directory, dfs) => {
  var definitions = dfs || [
    {
      "type" : "POST",
      "url" : "/example/:id",
      "handles" : [
        {
          "module" : "mongodb",
          "x" : 100,
          "y" : 150,
          "config" : {
            "params" : {
              "email" : "{{value.email}}"
            },
            "configuration" : {
              "collection" : "{{value.collection}}",
              "database" : "{{env.database}}",
              "port" : "{{env.port}}",
              "hostname" : "{{env.hostname}}"
            }
          },
        },
        {
          "module" : "twilio",
          "x" : 100,
          "y" : 520,
          "config" : {
            "params" : {
              "body" : "Hi, {{value.name}}! How are you?",
              "to" : "{{value.to}}",
              "from" : "{{value.from}}"
            },
            "configuration" : {
              "authToken" : "{{env.authToken}}",
              "accountSid" : "{{env.accountSid}}"
            }
          },
        }
      ],
      "__v" : 0
    }
  ];
  var modules = [];

  for(var i in definitions){
    var route = definitions[i];
    if(route.type == "POST"){
      route.post = true;
    } else if(route.type == "GET"){
      route.get = true;
    }

    var localModules = [];
    for(var j in route.handles){
      var handle = route.handles[j];
      handle.stringconfig = JSON.stringify(handle.config);
      modules.push(handle.module);
      localModules.push(handle.module);
    }
    route.modules = localModules;
  }
  fs.readFile('./server/code-templates/routes.js', 'utf8', function (err, fileContents) {
    if(err){
      console.log(err);
      return;
    }

    // Remove BOM character if there is one at the start of the file.
    if(fileContents.charCodeAt(0) == 65279) fileContents = fileContents.substr(1);

    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context, null, 4);
    });
    hbs.registerHelper('var', function(context) {
        return context.replace(/[\-]+/g,'');
    });
    let compiled = hbs.compile(fileContents);
    var routes = compiled({
      modules: _.uniq(modules),
      routes: definitions
    });
    fs.writeFileSync(path.join(directory, 'routes.js'), routes, 'utf8');
  })
}

var generateServer = () => {
  var promise = new Promise(function(resolve, reject){
    Definition.find({}).lean().then(function (defs) {
      console.log("efs" + JSON.stringify(defs));

      var archiveName = uuid.v4();
      ncp('./rest-server/', './' + archiveName, function (err) {
        ncp('./server/api-modules/', './' + archiveName + '/api-modules/', function (err) {
        if (err) {
          return console.error(err);
        }

      console.log('done!');

      generateRoutes('./' + archiveName, defs);

      var output = fs.createWriteStream(archiveName + '.zip');
      var archive = archiver('zip');
      output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        rmdir('./' + archiveName, function(error){
          console.log(error);
        });
        resolve(archiveName + '.zip');
      });

      archive.on('error', function(err){
          throw err;
      });

      archive.pipe(output);
      archive.glob('./' + archiveName + '/**/*');
      archive.finalize();
    })})})});

  return promise;
}

module.exports = generateServer;