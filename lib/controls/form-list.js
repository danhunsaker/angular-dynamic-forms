angular.module('dynaform.controls.list', [

])
//  Not a fan of how Angular's ngList is implemented, so here's a better one (IMO).  It will ONLY
  //  apply to <dynamic-form> child elements, and replaces the ngList that ships with Angular.
  .directive('ngList', function () {
    return {
      require: '?ngModel',
      link: function (scope, element, attr, ctrl) {
        var match = /\/(.*)\//.exec(element.attr(attr.$attr.ngList)),
          separator = match && new RegExp(match[1]) || element.attr(attr.$attr.ngList) || ',';

        if (element[0].form !== null && !angular.element(element[0].form).hasClass('dynamic-form')) {
          return;
        }

        ctrl.$parsers.splice(0, 1);
        ctrl.$formatters.splice(0, 1);

        ctrl.$parsers.push(function (viewValue) {
          var list = [];

          if (angular.isString(viewValue)) {
            //  Don't have Angular's trim() exposed, so let's simulate it:
            if (String.prototype.trim) {
              angular.forEach(viewValue.split(separator), function (value) {
                if (value) list.push(value.trim());
              });
            }
            else {
              angular.forEach(viewValue.split(separator), function (value) {
                if (value) list.push(value.replace(/^\s*/, '').replace(/\s*$/, ''));
              });
            }
          }

          return list;
        });

        ctrl.$formatters.push(function (val) {
          var joinBy = angular.isString(separator) && separator || ', ';

          if (angular.isArray(val)) {
            return val.join(joinBy);
          }

          return undefined;
        });
      }
    };
  })
;
