/**
* DynamicForms - Build Forms in AngularJS From Nothing But JSON
* @version v0.0.0 - 2013-09-24
* @link http://bitbucket.org/danhunsaker/angular-dynaimc-forms
* @license LGPLv3+, http://www.gnu.org/licenses/lgpl-3.0.en.html
*/

angular.module('dynform', []);

/**
* Dynamically build an HTML form using a JSON object as a template.
*
* @todo Properly describe this directive.
* @param {Object} [template] - The form template itself, as an object.
* @param {mixed} [model] - 
* @example <dynamic-form template-url="http://example.com/form-template.js" ng-model="formData"></dynamic-form>
*/
angular.module('dynform').directive('dynamic-form', [function () {
  return {
    restrict: 'EM', // supports using directive as element, attribute and class
    transclude: true,
    replace: true,
    template: "<ng-form ng-transclude></ng-form>",
    scope: {
      data: '=ngModel',
      template: '='
    },
    link: function ($scope, element, attrs) {
      //  Basic initialization
      var newLabel = null,
        newElement = null,
        newChild = null,
        id,
        field,
        cbAtt = '',
        supported = {
          //  Text-based elements
          'text': {element: 'input', type: 'text', editable: true, textBased: true},
          'date': {element: 'input', type: 'date', editable: true, textBased: true},
          'datetime': {element: 'input', type: 'datetime-local', editable: true, textBased: true}, //  Cheating - better supported
          'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
          'email': {element: 'input', type: 'email', editable: true, textBased: true},
          'number': {element: 'input', type: 'number', editable: true, textBased: true},
          'password': {element: 'input', type: 'password', editable: true, textBased: true},
          'textarea': {element: 'textarea', editable: true, textBased: true},
          'time': {element: 'input', type: 'time', editable: true, textBased: true},
          'url': {element: 'input', type: 'url', editable: true, textBased: true},
          //  Specialized editables
          'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
          'checklist': {element: 'div', editable: true, textBased: false},
          'radio': {element: 'input', type: 'radio', editable: true, textBased: false},
          'range': {element: 'input', type: 'range', editable: true, textBased: false},
          'select': {element: 'select', editable: true, textBased: false},
          //  Non-editables (mostly buttons)
          'button': {element: 'button', type: 'button', editable: false, textBased: false},
          'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
          'image': {element: 'input', type: 'image', editable: false, textBased: false},
          'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
          'submit': {element: 'button', type: 'submit', editable: false, textBased: false},
          //  Unsupported - yet
          'file': false,
          //  Unsupported until more browsers implement (properly)
          'color': false,
          'month': false,
          'search': false,
          'tel': false,
          'week': false
        };

      //  Check that the required attributes are in place
      if (attrs.hasOwnProperty('ngModel') && attrs.hasOwnProperty('template')) {
        for (id in $scope.template) {
          if ($scope.template.hasOwnProperty(id)) {
            field = $scope.template[id];
            
            if (!supported.hasOwnProperty(field.type) || supported[field.type] === false) {
              //  Unsupported.  Create SPAN with field.display as contents
              newElement = document.createElement('span');
              if (field.hasOwnProperty('display')) {angular.element(newElement).html(field.display);}
              element.appendChild(newElement);
              newElement = null;
            }
            else {
              //  Supported.  Create LABEL with appropriate element(s) as contents
              newLabel = document.createElement('label');
              if (field.hasOwnProperty('display')) {angular.element(newLabel).html(field.display);}
              
              //  Create element (or container) according to type
              newElement = document.createElement(supported[field.type].element);
              if (supported[field.type].hasOwnProperty('type')) {
                newElement.setAttribute('type', supported[field.type].type);
              }
              
              //  Editable fields (those that can feed models)
              if (supported[field.type].hasOwnProperty('editable') && supported[field.type].editable) {
                newElement.setAttribute('name', id);
                newElement.setAttribute('ng-model', 'data.' + id);
                if (field.hasOwnProperty('readonly')) {newElement.setAttribute('ng-readonly', field.readonly);}
                if (field.hasOwnProperty('required')) {newElement.setAttribute('ng-required', field.required);}
              }
              
              //  Fields based on input type=text
              if (supported[field.type].hasOwnProperty('textBased') && supported[field.type].textBased) {
                if (field.hasOwnProperty('minLength')) {newElement.setAttribute('ng-min-length', field.minLength);}
                if (field.hasOwnProperty('maxLength')) {newElement.setAttribute('ng-max-length', field.maxLength);}
                if (field.hasOwnProperty('validate')) {newElement.setAttribute('ng-pattern', field.validate);}
              }
              
              //  Special cases
              if (field.type === 'number' || field.type === 'range') {
                if (field.hasOwnProperty('minValue')) {newElement.setAttribute('min', field.minValue);}
                if (field.hasOwnProperty('maxValue')) {newElement.setAttribute('max', field.maxValue);}
              }
              if (field.type === 'range') {
                if (field.hasOwnProperty('step')) {newElement.setAttribute('step', field.step);}
              }
              if (field.type === 'checkbox') {
                if (field.hasOwnProperty('isOn')) {newElement.setAttribute('ng-true-value', field.isOn);}
                if (field.hasOwnProperty('isOff')) {newElement.setAttribute('ng-false-value', field.isOff);}
                if (field.hasOwnProperty('slaveTo')) {newElement.setAttribute('ng-checked', field.slaveTo);}
              }
              if (field.type === '') {
                continue;
              }
              
              //  Common attributes
              if (field.hasOwnProperty('disabled')) {newElement.setAttribute('ng-disabled', field.disabled);}
              if (field.hasOwnProperty('callback')) {
                if (field.type === 'button' || field.type === 'submit' || field.type === 'reset' || field.type === 'image') {
                  cbAtt = 'ng-click';
                }
                else {
                  cbAtt = 'ng-change';
                }
                newElement.setAttribute(cbAtt, field.callback);
              }
              
              newLabel.appendChild(newElement);
              element.appendChild(newLabel);
              newElement = null;
              newLabel = null;
            }
          }
        }
      }
    }
  };
}]);
