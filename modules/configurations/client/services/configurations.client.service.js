'use strict';

//Configurations service used for communicating with the configurations REST endpoints
angular.module('configurations').factory('Configurations', ['$resource',
  function ($resource) {
    return $resource('api/configurations/:configurationId', {
      configurationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Serivce to handle configuration settings requirements
angular.module('configurations').service('configurationSettingsService', function($http, $q, lodash, Authentication) {
  var configurationSettings = {};
  /*
  * Function to return language specific resourceBundle
  */
  var getResourceBundle = function(inputLanguageCode, resourceBundle) {
    var outputResourceBundle = {};
    var defaultResourceBundle = {};
    for(var i = 0; i< resourceBundle.length ; i++){
      if(resourceBundle[i].languageCode == inputLanguageCode){
        outputResourceBundle = resourceBundle[i];
        break;
      }
      else if(resourceBundle[i].languageCode == 'en'){
        defaultResourceBundle = resourceBundle[i];
      }
    }
    if(lodash.isEmpty(defaultResourceBundle) && lodash.isEmpty(outputResourceBundle)){
      defaultResourceBundle = resourceBundle[0];//If for example the quiz is created in Japanes, and is assigned to an user whose language is English, we need to show him at least the quiz in japanese rather than blank.
    }
    return lodash.isEmpty(outputResourceBundle)? defaultResourceBundle : outputResourceBundle;
  };
  return {

    //Gets configuration settings
    getConfigurationSettings: function() {
      var deferred = $q.defer();
      if (!lodash.isEmpty(configurationSettings)) {
        deferred.resolve(configurationSettings); //If data is already present, send immediately
      }
      else{      
      var promise = $http.get('/api/configurations',{});  //Get all configurations for this tenant_id
      // $q.all(promise)
        promise.then(
          function(results) {
            lodash.forEach(results.data, function(thisData){
              var thisConfigName = thisData.configName;
              //Lets add the i18nResourceBundle for the configuration
              var i18nResourceBundle =  getResourceBundle(Authentication.user.languageCode,thisData.resourceBundle);
              thisData.i18nResourceBundle = i18nResourceBundle;
              lodash.forEach(thisData.list, function(thisListItem,index){
                var listItemi18nResourceBundle = getResourceBundle(Authentication.user.languageCode,thisListItem.resourceBundle);
                thisData.list[index].i18nResourceBundle = listItemi18nResourceBundle;

              });
              configurationSettings[thisConfigName] = thisData;
            });
            deferred.resolve(configurationSettings)
          },
          function(errors) {
            deferred.reject(errors);
          });
        }
      return deferred.promise;
    },
    //Returns the correct resource bundle based on language.
    getResourceBundle: function(inputLanguageCode, resourceBundle) {
      var outputResourceBundle = {};
      var defaultResourceBundle = {};
      for (var i = 0; i < resourceBundle.length; i++) {
        if (resourceBundle[i].languageCode == inputLanguageCode) {
          outputResourceBundle = resourceBundle[i];
          break;
        } else if (resourceBundle[i].languageCode == 'en') {
          defaultResourceBundle = resourceBundle[i];
        }
      }
      if(lodash.isEmpty(defaultResourceBundle) && lodash.isEmpty(outputResourceBundle)){
        defaultResourceBundle = resourceBundle[0];//If for example the quiz is created in Japanes, and is assigned to an user whose language is English, we need to show him at least the quiz in japanese rather than blank.
      }
      return lodash.isEmpty(outputResourceBundle) ? defaultResourceBundle : outputResourceBundle;
    },
    //Updates configuration settings
    updateConfigurationSettings: function(updateItems) {
      var deferred = $q.defer();
      var urlCalls = [];
      angular.forEach(updateItems, function(updateItem) {
        // var urlObj = {};
        // urlObj[configNameItem] = $http.post('/api/superadminConfigsByName',{configName:configNameItem});
        urlCalls.push($http.put('/api/configurations/' + updateItem._id, updateItem));
        //urlCalls.push(urlObj);
      });
      $q.all(urlCalls)
        .then(
          function(results) {
            deferred.resolve(results)
          },
          function(errors) {
            deferred.reject(errors);
          });
      return deferred.promise;
    }
  };
});
