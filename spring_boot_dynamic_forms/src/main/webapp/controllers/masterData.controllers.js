'use strict';

angular.module('appDynApp')

    .controller('masterDataCtrl', ['$scope', '$http', '$rootScope','$timeout',
			function($scope, $http, $rootScope, $timeout) {

        $scope.entries = [];

        $scope.isDataSaved = false;
        $scope.isError=false;
        $scope.errorMsg="";
        $scope.successMsg="Successfully Saved";
        $scope.refresh = function() {
        };
       
        $scope.$on('updateSaveStatus',function(event,data){
        	$scope.isDataSaved=true;
        	if(data.message!==""){
        		$scope.successMsg=data.message;
        	}
        	$('#divSuccess').show();
        	$scope.hideBlock('divSuccess');
        });
        
        $scope.$on('updateErrorStatus',function(event,data){
        	 $scope.isError=true;
        	 $scope.errorMsg=data.message;
        	 $('#divError').show();
        	 $scope.hideBlock('divError');
        });
        
        $scope.hideBlock=function(block){
        	$timeout(function(){
        		$('#'+block).hide();
        		 $scope.isDataSaved = false;
            	 $scope.isError=false;
		  	},2000)
        };
        
        $scope.$on("$locationChangeStart", function(event, next, current) {
        	 $scope.isDataSaved = false;
        	 $scope.isError=false;
        	 $scope.errorMsg="";
        });
        
		$scope.refresh();
		
		//
		$scope.submitForm = function( initialPlan ) {
			console.log( initialPlan );
		}
		
		$scope.menuEntries = [];
        $http.get('./getFormList').success(function (data, status, headers, config) {
            $scope.menuEntries = data;
        }).error(function (data, status, headers, config) {
             $scope.status.message="Can't retrieve messages list!";
			 $scope.$emit('updateErrorStatus',$scope.status);
        });		
    }]);
	