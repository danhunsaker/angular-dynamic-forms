angular.module('app', ['dynform'])
    .controller('AppCtrl', ['$scope', function ($scope) {
        $scope.urlFormData = {};   // JavaScript needs an object to put our form's models into.

        $scope.processForm = function () {
            alert ($scope.urlFormData.MACH_NUMBER);
        };
        
    }])
    .filter('nl2br', function() {
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
