/**
 * DynamicForms - Build Forms in AngularJS From Nothing But JSON
 * @version v0.0.1 - 2014-03-13
 * @link http://bitbucket.org/danhunsaker/angular-dynamic-forms
 * @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.en.html
 */

/**
 * Dynamically build an HTML form using a JSON object as a template.
 *
 * @todo Properly describe this directive.
 * @param {Object} [template] - The form template itself, as an object.
 * @param {string} [templateUrl] - The URL to retrieve the form template from; template overrides.
 * @param {mixed} ngModel - An object in the current scope where the form data should be stored.
 * @example <dynamic-form template-url="form-template.js" ng-model="formData"></dynamic-form>
 */
angular.module('dynform', [
    'dynaform.controls.input',
    'dynaform.controls.list',
    'dynaform.lib.file-reader',
    'dynaform.config',
    'dynaform.elements'
  ])

  .controller('DynamicFormCtrl', function ($scope, $element, $attrs, $q, $parse, $http, $templateCache, $compile, $document, $timeout, formSupportedElements, dynaformElements) {
    var attrs = $attrs,
      element = $element,
      newElement = null,
      foundOne = false,
      iterElem = element,
      model = null;

    function parseTemplate() {
      return $q.when($parse(attrs.template)($scope));
    }

    function loadTemplate() {
      return $http.get(attrs.templateUrl, {cache: $templateCache}).then(function (result) {
        return result.data;
      });
    }

    //  Check that the required attributes are in place
    if (angular.isDefined(attrs.ngModel) && (angular.isDefined(attrs.template) || angular.isDefined(attrs.templateUrl)) && !element.hasClass('dynamic-form')) {
      //  Grab the template. either from the template attribute, or from the URL in templateUrl
      var getTemplate = attrs.template ? parseTemplate : loadTemplate;

      model = $parse(attrs.ngModel)($scope);

      getTemplate().then(function (template) {

        newElement = dynaformElements.parseTemplate(template, element, model, attrs);


        //  Psuedo-transclusion
        angular.forEach(attrs.$attr, function (attName, attIndex) {
          newElement.attr(attName, attrs[attIndex]);
        });

        newElement.attr('model', attrs.ngModel);

        newElement.removeAttr('ng-model');

        angular.forEach(element[0].classList, function (clsName) {
          newElement[0].classList.add(clsName);
        });

        newElement.addClass('dynamic-form');

        newElement.append(element.contents());

        //  onReset logic
        newElement.data('$_cleanModel', angular.copy(model));
        newElement.bind('reset', function () {
          $timeout(function () {
            $scope.$broadcast('reset', arguments);
          }, 0);
        });
        $scope.$on('reset', function () {
          $scope.$apply(function () {
            $scope[attrs.ngModel] = {};
          });
          $scope.$apply(function () {
            $scope[attrs.ngModel] = angular.copy(newElement.data('$_cleanModel'));
          });
        });

        //  Compile and update DOM
        $compile(newElement)($scope);
        element.replaceWith(newElement);
      });
    }
  })

  .directive('dynamicForm', function () {
    return {
      restrict: 'E', // supports using directive as element only
      controller: "DynamicFormCtrl"
    };
  });
/*  End of dynamic-forms.js */
