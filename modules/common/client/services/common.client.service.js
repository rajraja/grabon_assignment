'use strict';

//Common service used for communicating with the configurations REST endpoints
angular.module('common').factory('Common', ['$resource',
  function ($resource) {
    return $resource('api/common/:commonId', {
      commonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }

    });
  }
]);
//Serivce to handle common  requirements
angular.module('common').service('commonService', function($http, $q, lodash, Authentication) {

  return {
    /*
    * Converts the input html to string. Additionally if parameter noOfWords is present
    * @param inputString (Mandatory)
    * @param noOfWords (Optional)
    */
    convertHtmlToString: function(inputString) {
      var outputString = '';
      if(!inputString){
        return outputString;
      }
      else{
        outputString = String(inputString).replace(/<[^>]+>/gm, '');
          outputString = outputString.replace(/(([^\s]+\s\s*){15})(.*)/,"$1…");
         return outputString;
      }

    },

    //Returns Node Enviornment
    getNodeEnvironment: function() {
      return $http.get('/api/getNodeEnvironment');
    },

  };
});

//Serivce to handle common  requirements
angular.module('common').constant("constantsService", {
   "defaultImageUploadPicUrl": '',  //Userd in image upload modal
   'userStatus':[{'key':'active','value':'Active'},{'key':'pending','value':'Pending'},{'key':'deactive','value':'Deactive'}, {'key':'all','value':'All'}],
   'clientItemsPerPage':10,
   'paginatePerPage': 25,
   'userRoles':[{'key':'user', 'value':'User'}, {'key':'admin', 'value':'Admin'}],

});
