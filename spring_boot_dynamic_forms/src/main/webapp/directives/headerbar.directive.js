'use strict';

angular.module('appDynApp')

.directive('myHeaderBar', function() {
    return {
        restrict: 'E',
        scope: {
            selected: '@selected'
        },
        link: function(scope, element, attrs) {

        },
        templateUrl: 'views/headerbar/headerbar.html'
    }
});