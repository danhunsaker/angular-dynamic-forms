angular.module('dynaform.controls.input', [])
//  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/05/a-file-input-directive-for-angularjs.aspx
  .directive('input', function ($parse) {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {
        if (attrs.type === 'file') {
          var modelGet = $parse(attrs.ngModel),
            modelSet = modelGet.assign,
            onChange = $parse(attrs.onChange),
            updateModel = function () {
              scope.$apply(function () {
                modelSet(scope, element[0].files);
                onChange(scope);
              });
            };

          ctrl.$render = function () {
            element[0].files = this.$viewValue;
          };
          element.bind('change', updateModel);
        }
        else if (attrs.type === 'range') {
          ctrl.$parsers.push(function (val) {
            if (val) {
              return parseFloat(val);
            }
          });
        }
      }
    };
  })
;
