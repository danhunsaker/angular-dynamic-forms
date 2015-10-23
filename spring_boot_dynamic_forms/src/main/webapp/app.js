'use strict';

angular.module('appDynApp', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ngTagsInput', 'angularTreeview', 'dynform', 'ngGrid'])

	.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/dynforms');
		$urlRouterProvider.when('/dynforms', '/dynforms/listAttributes');
		
        $stateProvider
            
			.state('dynforms', {
				url:'/dynforms',
				controller:'masterDataCtrl',
				templateUrl:'views/navigation/dynforms.html'                            
            })
			.state('dynforms.listAttributes', {
				url: '/listAttributes?formid',
				controller:'listAttributesCtrl',
				templateUrl: 'views/navigation/dynforms-listAttributes.html'
			})
			.state('dynforms.renderAttributes', {
				url: '/renderAttributes?formid&dataid',
				controller:'renderAttributesCtrl',
				templateUrl: 'views/navigation/dynforms-renderAttributes.html'
			})
    }]);
