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

  .controller('DynamicFormCtrl', function ($scope, $element, $attrs, $q, $parse, $http, $templateCache, $compile, $timeout, dynaformElements, $log) {
    var attrs = $attrs,
      element = $element,
      newElement = null,
      model = null;


    function parseTemplate() {
      $log.debug('Template found in attributes:', attrs.template);
      return $q.when($parse(attrs.template)($scope));
    }

    function loadTemplate() {
      $log.debug('loading template...', attrs.templateUrl);
      return $http.get(attrs.templateUrl, {cache: $templateCache}).then(function (result) {
        $log.debug('Template loaded:', result.data);
        return result.data;
      });
    }

    function hasRequiredAttributes(attrs) {
      var hasModel = angular.isDefined(attrs.ngModel),
        hasTemplateOrTemplateUrl = (angular.isDefined(attrs.template) || angular.isDefined(attrs.templateUrl)),
        doesNotHaveDynamicFormClass = !element.hasClass('dynamic-form');

      if (!hasModel) {
        $log.error("Dynamic form does not have ng-model defined. Attributes:", attrs);
      }

      if (!hasTemplateOrTemplateUrl) {
        $log.error("Dynamic form does not template or templateUrl defined. Attributes:", attrs);
      }

      if (!doesNotHaveDynamicFormClass) {
        $log.error("Dynamic form already has dynamic-form css class. Attributes:", attrs);
      }

      return  hasModel && hasTemplateOrTemplateUrl && doesNotHaveDynamicFormClass;
    }

    if (hasRequiredAttributes(attrs)) {
      //  Grab the template. either from the template attribute, or from the URL in templateUrl
      var getTemplate = attrs.template ? parseTemplate : loadTemplate;

      model = $parse(attrs.ngModel)($scope);

      getTemplate().then(function (template) {

        newElement = dynaformElements.parseTemplate(template, element, model, attrs);
        newElement = dynaformElements.prepareNewElement(newElement, element, model);

        function configureReset(newElement, attrs) {
          newElement.bind('reset', function () {
            $timeout(function () {
              $scope.$broadcast('reset', arguments);
            }, 0);
          });

          function resetModel(newElement, modelAttribute) {
            $scope.$apply(function () {
              $scope[modelAttribute] = {};
            });
            $scope.$apply(function () {
              $scope[modelAttribute] = angular.copy(newElement.data('$_cleanModel'));
            });
          }

          $scope.$on('reset', function () {
            resetModel(newElement, attrs.ngModel);
          });
        }

        function compileAndReplaceElement(element, newElement) {
          $compile(newElement)($scope);
          element.replaceWith(newElement);
        }

        configureReset(newElement, attrs);
        compileAndReplaceElement(element, newElement)
      });
    }
  })

  .directive('dynamicForm', function () {
    return {
      restrict: 'E', // supports using directive as element only
      controller: "DynamicFormCtrl"
    };
  })

;
/*  End of dynamic-forms.js */