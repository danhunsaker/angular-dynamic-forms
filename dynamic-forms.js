/**
* DynamicForms - Build Forms in AngularJS From Nothing But JSON
* @version v0.0.0 - 2013-09-24
* @link http://bitbucket.org/danhunsaker/angular-dynaimc-forms
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
angular.module('dynform', [])
  .directive('dynamicForm', ['$q', '$parse', '$http', '$templateCache', '$compile', function ($q, $parse, $http, $templateCache, $compile) {
    var supported = {
        //  Text-based elements
        'text': {element: 'input', type: 'text', editable: true, textBased: true},
        'date': {element: 'input', type: 'date', editable: true, textBased: true},
        'datetime': {element: 'input', type: 'datetime-local', editable: true, textBased: true}, //  Cheating - better supported
        'datetime-local': {element: 'input', type: 'datetime-local', editable: true, textBased: true},
        'email': {element: 'input', type: 'email', editable: true, textBased: true},
        'month': {element: 'input', type: 'month', editable: true, textBased: true},
        'number': {element: 'input', type: 'number', editable: true, textBased: true},
        'password': {element: 'input', type: 'password', editable: true, textBased: true},
        'search': {element: 'input', type: 'search', editable: true, textBased: true},
        'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
        'textarea': {element: 'textarea', editable: true, textBased: true},
        'time': {element: 'input', type: 'time', editable: true, textBased: true},
        'url': {element: 'input', type: 'url', editable: true, textBased: true},
        'week': {element: 'input', type: 'week', editable: true, textBased: true},
        //  Specialized editables
        'checkbox': {element: 'input', type: 'checkbox', editable: true, textBased: false},
        'color': {element: 'input', type: 'color', editable: true, textBased: false},
        'file': {element: 'input', type: 'file', editable: true, textBased: false},
        'range': {element: 'input', type: 'range', editable: true, textBased: false},
        'select': {element: 'select', editable: true, textBased: false},
        //  Pseudo-non-editables (containered)
        'checklist': {element: 'div', editable: false, textBased: false},
        'radio': {element: 'div', editable: false, textBased: false},
        //  Non-editables (mostly buttons)
        'button': {element: 'button', type: 'button', editable: false, textBased: false},
        'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
        'image': {element: 'input', type: 'image', editable: false, textBased: false},
        'reset': {element: 'button', type: 'reset', editable: false, textBased: false},
        'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
      };
    
    return {
      restrict: 'EM', // supports using directive as element and comment
      transclude: true,
      replace: true,
      template: "<ng-form ng-transclude></ng-form>",
      scope: {
        data: '=ngModel'
      },
      link: function ($scope, element, attrs) {
        //  Basic initialization
        var newElement = null,
          newChild = null,
          optGroups = {},
          cbAtt = '';
        
        //  Check that the required attributes are in place
        if (attrs.hasOwnProperty('ngModel') && (attrs.hasOwnProperty('template') || attrs.hasOwnProperty('templateUrl'))) {
          //  Grab the template. either from the template attribute, or from the URL in templateUrl
          (attrs.template ? $q.when($parse(attrs.template)($scope.$parent)) :
            $http.get(attrs.templateUrl, {cache: $templateCache}).then(function (result) {
              return result.data;
            })
          ).then(function (template) {
            angular.forEach(template, function (field, id) {
              if (!supported.hasOwnProperty(field.type) || supported[field.type] === false) {
                //  Unsupported.  Create SPAN with field.label as contents
                newElement = angular.element('<span></span>');
                if (field.hasOwnProperty('label')) {angular.element(newElement).html(field.label);}
                element.append(newElement);
                newElement = null;
              }
              else {
                //  Supported.  Create element (or container) according to type
                newElement = angular.element('<' + supported[field.type].element + '></' + supported[field.type].element + '>');
                if (supported[field.type].hasOwnProperty('type')) {
                  newElement.attr('type', supported[field.type].type);
                }
                
                //  Editable fields (those that can feed models)
                if (supported[field.type].hasOwnProperty('editable') && supported[field.type].editable) {
                  newElement.attr('name', id);
                  newElement.attr('ng-model', "data['" + id + "']");
                  $scope.data[id] = '';
                  if (field.hasOwnProperty('readonly')) {newElement.attr('ng-readonly', field.readonly);}
                  if (field.hasOwnProperty('required')) {newElement.attr('ng-required', field.required);}
                }
                
                //  Fields based on input type=text
                if (supported[field.type].hasOwnProperty('textBased') && supported[field.type].textBased) {
                  if (field.hasOwnProperty('minLength')) {newElement.attr('ng-minlength', field.minLength);}
                  if (field.hasOwnProperty('maxLength')) {newElement.attr('ng-maxlength', field.maxLength);}
                  if (field.hasOwnProperty('validate')) {newElement.attr('ng-pattern', field.validate);}
                  if (field.hasOwnProperty('placeholder')) {newElement.attr('placeholder', field.placeholder);}
                }
                
                //  Special cases
                if (field.type === 'number' || field.type === 'range') {
                  if (field.hasOwnProperty('minValue')) {newElement.attr('min', field.minValue);}
                  if (field.hasOwnProperty('maxValue')) {newElement.attr('max', field.maxValue);}
                  if (field.type === 'range') {
                    if (field.hasOwnProperty('step')) {newElement.attr('step', field.step);}
                  }
                }
                else if (field.type === 'checkbox') {
                  if (field.hasOwnProperty('isOn')) {newElement.attr('ng-true-value', field.isOn);}
                  if (field.hasOwnProperty('isOff')) {newElement.attr('ng-false-value', field.isOff);}
                  if (field.hasOwnProperty('slaveTo')) {newElement.attr('ng-checked', field.slaveTo);}
                }
                else if (field.type === 'checklist') {
                  $scope.data[id] = {};
                  if (field.hasOwnProperty('options')) {
                    angular.forEach(field.options, function (option, childId) {
                      newChild = angular.element('<input type="checkbox" />');
                      newChild.attr('name', id + '.' + childId);
                      newChild.attr('ng-model', "data['" + id + "']['" + childId + "']");
                      $scope.data[id][childId] = '';
                      if (option.hasOwnProperty('class')) {newChild.attr('ng-class', option['class']);}
                      if (field.hasOwnProperty('disabled')) {newChild.attr('ng-disabled', field.disabled);}
                      if (field.hasOwnProperty('readonly')) {newChild.attr('ng-readonly', field.readonly);}
                      if (field.hasOwnProperty('required')) {newChild.attr('ng-required', field.required);}
                      if (field.hasOwnProperty('callback')) {newChild.attr('ng-change', field.callback);}
                      if (option.hasOwnProperty('isOn')) {newChild.attr('ng-true-value', option.isOn);}
                      if (option.hasOwnProperty('isOff')) {newChild.attr('ng-false-value', option.isOff);}
                      if (option.hasOwnProperty('slaveTo')) {newChild.attr('ng-checked', option.slaveTo);}
                      
                      if (option.hasOwnProperty('label')) {
                          newChild = newChild.wrap('<label></label>').parent();
                          newChild.append(document.createTextNode(' ' + option.label));
                      }
                      newElement.append(newChild);
                    });
                  }
                }
                else if (field.type === 'radio') {
                  $scope.data[id] = '';
                  if (field.hasOwnProperty('values')) {
                    angular.forEach(field.values, function (label, val) {
                      newChild = angular.element('<input type="radio" />');
                      newChild.attr('name', id);
                      newChild.attr('ng-model', "data['" + id + "']");
                      if (field.hasOwnProperty('class')) {newChild.attr('ng-class', field['class']);}
                      if (field.hasOwnProperty('disabled')) {newChild.attr('ng-disabled', field.disabled);}
                      if (field.hasOwnProperty('callback')) {newChild.attr('ng-change', field.callback);}
                      if (field.hasOwnProperty('readonly')) {newChild.attr('ng-readonly', field.readonly);}
                      if (field.hasOwnProperty('required')) {newChild.attr('ng-required', field.required);}
                      if (val) {newChild.attr('value', val);}
                      
                      if (label) {
                          newChild = newChild.wrap('<label></label>').parent();
                          newChild.append(document.createTextNode(' ' + label));
                      }
                      newElement.append(newChild);
                    });
                  }
                }
                else if (field.type === 'select') {
                  if (field.hasOwnProperty('multiple')) {
                    newElement.attr('multiple', field.multiple);
                    $scope.data[id] = [];
                  }
                  if (field.hasOwnProperty('hasEmpty')) {newElement.append(angular.element('<option value=""></option>').html(field.hasEmpty));}
                  
                  if (field.hasOwnProperty('autoOptions')) {
                    newElement.attr('ng-options', field.autoOptions);
                  }
                  else if (field.hasOwnProperty('options')) {
                    angular.forEach(field.options, function (option, childId) {
                      newChild = angular.element('<option></option>');
                      newChild.attr('value', childId);
                      if (option.hasOwnProperty('disabled')) {newChild.attr('ng-disabled', option.disabled);}
                      if (option.hasOwnProperty('label')) {newChild.html(option.label);}
                      if (option.hasOwnProperty('group')) {
                        if (!optGroups.hasOwnProperty(option.group)) {
                          optGroups[option.group] = angular.element('<optgroup></optgroup>');
                          optGroups[option.group].attr('label', option.group);
                        }
                        optGroups[option.group].append(newChild);
                      }
                      else {
                        newElement.append(newChild);
                      }
                    });
                    
                    if (!angular.equals(optGroups, {})) {
                      newElement.append(optGroups);
                      optGroups = {};
                    }
                  }
                }
                else if (field.type === 'image') {
                  if (field.hasOwnProperty('label')) {newElement.attr('alt', field.label);}
                  if (field.hasOwnProperty('source')) {newElement.attr('src', field.source);}
                }
                else if (field.type === 'hidden') {
                  newElement.attr('name', id);
                  newElement.attr('ng-model', "data['" + id + "']");
                }
                
                //  Common attributes; radio already applied these...
                if (field.type !== "radio") {
                  if (field.hasOwnProperty('class')) {newElement.attr('ng-class', field['class']);}
                  //  ...and checklist has already applied these.
                  if (field.type !== "checklist") {
                    if (field.hasOwnProperty('disabled')) {newElement.attr('ng-disabled', field.disabled);}
                    if (field.hasOwnProperty('callback')) {
                      //  Some input types need listeners on click...
                      if (["button", "submit", "reset", "image"].indexOf(field.type) > -1) {
                        cbAtt = 'ng-click';
                      }
                      //  ...the rest on change.
                      else {
                        cbAtt = 'ng-change';
                      }
                      newElement.attr(cbAtt, field.callback);
                    }
                  }
                }
                
                //  Set up default values
                if (field.hasOwnProperty('default')) {
                  $scope.data[id] = field.val;
                }
                
                //  If there's a label, add it.
                if (field.hasOwnProperty('label')) {
                  //  Some elements have already applied their labels.
                  if (["image", "hidden"].indexOf(field.type) > -1) {
                    angular.noop();
                  }
                  //  Button elements get their labels from their contents.
                  else if (["button", "submit", "reset"].indexOf(field.type) > -1) {
                    newElement.html(field.label);
                  }
                  //  Everything else should be wrapped in a label tag.
                  else {
                    newElement = newElement.wrap('<label></label>').parent();
                    newElement.prepend(document.createTextNode(field.label + ' '));
                  }
                }
                element.append(newElement);
                newElement = null;
              }
            });
            $compile(element.contents())($scope);
          });
        }
      }
    };
  }])
  .directive('input', ['$parse', function ($parse) {
      return {
          restrict: "E",
          link: function (scope, element, attrs) {
            if (attrs.type === 'file') {
              var modelGet = $parse(attrs.ngModel),
                modelSet = modelGet.assign,
                onChange = $parse(attrs.onChange),
                updateModel = function () {
                  scope.$apply(function () {
                      modelSet(scope, element[0].files[0]);
                      onChange(scope);
                  });                    
                };
               
              element.bind('change', updateModel);
            }
          }
      };
  }]);
