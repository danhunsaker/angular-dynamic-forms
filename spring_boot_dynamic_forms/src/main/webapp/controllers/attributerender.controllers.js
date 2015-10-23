'use strict';

angular.module('appDynApp')

    .controller('renderAttributesCtrl', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    	
		if($location.search().formid != undefined){
		    //alert($location.search().formid);
			$scope.formid = $location.search().formid;
		}
		if($location.search().dataid != undefined){
			$scope.dataid = $location.search().dataid;
		}
    	
        $scope.urlFormData = {};   // JavaScript needs an object to put our form's models into.

        $scope.processForm = function () {
            alert ($scope.urlFormData);
            $http.post( "/saveForm",  $scope.urlFormData);
        };        
    }])
    .filter('pretty', function() {
        return function (input) {
            var temp;
            try {
                temp = angular.fromJson(input);
            }
            catch (e) {
                temp = input;
            }

            return angular.toJson(temp, true);
        };
    });
