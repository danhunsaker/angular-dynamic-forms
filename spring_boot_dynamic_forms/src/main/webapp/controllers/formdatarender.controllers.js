'use strict';

angular.module('appDynApp')

    .controller('renderFormDataCtrl', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    	
    
    	
		if($location.search().formid != undefined){
		    //alert($location.search().formid);
			$scope.formid = $location.search().formid;
		}
		if($location.search().dataid != undefined){
			$scope.dataid = $location.search().dataid;
		}
    	
        $scope.urlFormData = {};         // JavaScript needs an object to put our form's models into.
        
        $scope.processForm = function () {
                $http.post( "/saveForm?formid="+$location.search().formid+"&dataid="+$location.search().dataid,$scope.urlFormData)
                .success(function (data, status, headers, config) {
                			
                			alert("Database updated successfully!!!");
                })
                .error(function(data, status, headers, config){
                	       alert("Failed to save the data!!!");
                }
                );
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
