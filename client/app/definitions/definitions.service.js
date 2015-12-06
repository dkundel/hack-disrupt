'use strict';

angular.module('hackDisruptApp')
  .service('Definitions', function ($http) {
    $http.get('/api/definitions').then((resp) => {
      this.All = resp.data;
      this.Active = resp.data[0];
      this.CurrentIdx = 0;
    });

    this.GetByIdx = (idx) => {
      this.Active = this.All[idx];
      this.CurrentIdx = idx;
    }
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.Save = (def) => {
      this.All[this.CurrentIdx] = def;
      this.Active = def;

      $http.put('/api/definitions/' + def._id, def).then(() => {
        console.log('Updated!');
      });
    }

    this.Download = () => {
      $http.post('/download', {routes: angular.copy(this.All)}).then((resp) => {
        console.log(resp);
      });
    }
  });
