'use strict';

angular.module('appDynApp')

    .controller('masterDataCtrl', ['$scope', '$http', '$rootScope','$timeout',
			function($scope, $http, $rootScope, $timeout) {

		$scope.menuEntries = [];
        $http.get('./getTemplateList').success(function (data, status, headers, config) {
            $scope.menuEntries = data;
        }).error(function (data, status, headers, config) {
             alert("Failed to load the data!, returned status" + status + " data =" + JSON.stringify(data));
        
             $scope.status.message="Can't retrieve messages list!";
			 $scope.$emit('updateErrorStatus',$scope.status);
        });		
    }]);
	