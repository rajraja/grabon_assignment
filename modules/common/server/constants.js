'use strict';
/**
 * This module contains list of constants
 */
 var NODE_ENV = process.env.NODE_ENV;
  /****Do not change ******/
  exports.MAX_RANGE_SIZE_FOR_PAGINATION = 50; // Maximum number of results to return at one time during pagination
  /**** End of of not change ******/
  if(NODE_ENV === 'development'){
    exports.MAX_RANGE_SIZE_FOR_PAGINATION = 10;
  }else {
    exports.MAX_RANGE_SIZE_FOR_PAGINATION = 20; // for production
  }

  exports.TEST_TENANT_ID = "5778a4a3743387c66bdd291f"; //tenant_id used for all testing purpose
