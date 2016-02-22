'use strict';

angular.module('appDynApp')

    .controller('listDesignOfFormsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

        $scope.messages = [];
    	$scope.status={};
		$scope.status.message="";
		
		if($location.search().formid != undefined){
		    //alert($location.search().formid);
			$scope.formid = $location.search().formid;
		} else {
			$scope.formid = 1;
		}
		
        $http.get('./getTemplateList/').success(function (data, status, headers, config) {
            $scope.messages = data;
        }).error(function (data, status, headers, config) {
             $scope.status.message="Can't retrieve messages list!";
			 $scope.$emit('updateErrorStatus',$scope.status);
        });

        $scope.deleteRule = function(id) {
           
            $http.get('./deleteArlData/' + id).success(function (data, status, headers, config) {
            	$scope.status.message="Deleted Successfully";
 				$scope.$emit('updateSaveStatus',$scope.status);
                $scope.messages = $scope.messages.filter(function(message) {
                        return message.id != id;
                    }
                );               
            }).error(function (data, status, headers, config) {
            	 $scope.status.message="Error occurred";
				 $scope.$emit('updateErrorStatus',$scope.status);
            });
        };
        
        $scope.GenerateSchema = function(id) {
            $http.post('./generateJsonSchema/' + id).success(function (data, status, headers, config) {
            }).error(function (data, status, headers, config) {
            	 $scope.status.message="Error occurred";
				 $scope.$emit('updateErrorStatus',$scope.status);
            });
        };
    }])
	