'use strict';

angular.module('appDynApp', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ngTagsInput', 'angularTreeview', 'dynform', 'ngGrid'])

	.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/cgaas');
		$urlRouterProvider.when('/cgaas', '/cgaas/listAttributes');
		
        $stateProvider
            
			.state('cgaas', {
				url:'/cgaas',
				controller:'masterDataCtrl',
				templateUrl:'views/navigation/cgaas.html'                            
            })
			.state('cgaas.listAttributes', {
				url: '/listAttributes?formid',
				controller:'listAttributesCtrl',
				templateUrl: 'views/navigation/cgaas-listAttributes.html'
			})
			.state('cgaas.renderAttributes', {
				url: '/renderAttributes?formid&dataid',
				controller:'renderAttributesCtrl',
				templateUrl: 'views/navigation/cgaas-renderAttributes.html'
			})
    }]);
