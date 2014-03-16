angular.module('dynaform.elements.text', [
    'dynaform.config'
])
  .factory('parseTextElement', function(formSupportedElements) {
    var supported = formSupportedElements.elements;
    return function(field, newElement) {
      if (angular.isDefined(supported[field.type].textBased) && supported[field.type].textBased) {
        if (angular.isDefined(field.minLength)) {
          newElement.attr('ng-minlength', field.minLength);
        }
        if (angular.isDefined(field.maxLength)) {
          newElement.attr('ng-maxlength', field.maxLength);
        }
        if (angular.isDefined(field.validate)) {
          newElement.attr('ng-pattern', field.validate);
        }
        if (angular.isDefined(field.placeholder)) {
          newElement.attr('placeholder', field.placeholder);
        }
      }

      if (['text', 'textarea'].indexOf(field.type) > -1) {
        if (angular.isDefined(field.splitBy)) {
          newElement.attr('ng-list', field.splitBy);
        }
      }

      return newElement
    }
  })
;
