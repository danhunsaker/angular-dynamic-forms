'use strict';

angular.module('appDynApp', ['ui.router', 'ngSanitize', 'ngTagsInput', 'ui.bootstrap', 'angularTreeview', 'dynform', 'ngGrid'])

	.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/formbuilder');
		$urlRouterProvider.when('/formbuilder', '/formbuilder/listDesignOfForms');
		
        $stateProvider
            
			.state('formbuilder', {
				url:'/formbuilder',
				controller:'masterDataCtrl',
				templateUrl:'views/navigation/formbuilder.html'                            
            })
			.state('formbuilder.listDesignOfForms', {
				url: '/listDesignOfForms',
				controller:'listDesignOfFormsCtrl',
				templateUrl: 'views/navigation/formbuilder-listDesignOfForms.html'
			})
			.state('formbuilder.renderDesignOfForms', {
				url: '/renderDesignOfForms?formid',
				controller:'listDesignOfFormCreateCtrl',
				templateUrl: 'views/navigation/formbuilder-designOfFormsCreate.html'
			})
			.state('formbuilder.listFormData', {
				url: '/listFormData?formid',
				controller:'listFormDataCtrl',
				templateUrl: 'views/navigation/formbuilder-listFormData.html'
			})
			.state('formbuilder.renderFormData', {
				url: '/renderFormData?formid&dataid',
				controller:'renderFormDataCtrl',
				templateUrl: 'views/navigation/formbuilder-renderFormData.html'
			})
    }]);
