angular.module('dynaform.elements', [
    'dynaform.elements.text',
    'dynaform.config'
  ])

  .service('dynaformElements', function DynaformElements(parseTextElement, formSupportedElements, $document, $log) {
    var dynaformElements = this;

    dynaformElements.parseTemplate = function (template, element, model, attrs) {
      var newElement,
        iterElem = element,
        foundOne = false;

      angular.forEach(template, function (field, id) {

        if (formSupportedElements.isSupported(field.type)) {
          //  Supported.  Create element (or container) according to type
          if (!angular.isDefined(field.model)) {
            field.model = id;
          }

          newElement = dynaformElements.parseField(field, model, attrs);

          element.append(newElement);
          newElement = null;
        }
        else {
          newElement = formSupportedElements.renderBlankForUnsupportedType(field, newElement, element)
        }
      });

      function parentNotDocument() {
        return !angular.equals(iterElem.parent(), $document)
      }

      function parentNotSelf() {
        return !angular.equals(iterElem.parent(), angular.element())
      }

      //  Determine what tag name to use (ng-form if nested; form if outermost)
      while (parentNotDocument() && parentNotSelf()) {

        function parentNodeName(iterElem) {
          var parentNode = iterElem.parent()[0];
          return attrs.$normalize(angular.lowercase(parentNode.nodeName));
        }

        function isFormType(iterElem) {
          return ['form', 'ngForm', 'dynamicForm'].indexOf(parentNodeName(iterElem)) > -1
        }

        if (isFormType(iterElem)) {
          foundOne = true;
          break;
        }

        iterElem = iterElem.parent();
      }

      if (foundOne) {
        newElement = angular.element("<ng-form></ng-form>");
      }
      else {
        newElement = angular.element("<form></form>");
      }

      return newElement;
    };

    dynaformElements.prepareNewElement = function (newElement, element, model) {
      function setNewElementAttributes(newElement, attrs) {
        angular.forEach(attrs.$attr, function (attName, attIndex) {
          newElement.attr(attName, attrs[attIndex]);
        });
        newElement.attr('model', attrs.ngModel);
        newElement.removeAttr('ng-model');
      }

      function transferClassList(element, newElement) {
        angular.forEach(element.classList, function (clsName) {
          newElement.classList.add(clsName);
        });
      }

      function finalizeNewElement(newElement, element, model) {
        newElement.addClass('dynamic-form');
        newElement.append(element.contents());
        newElement.data('$_cleanModel', angular.copy(model));
      }

      setNewElementAttributes(newElement, attrs);
      transferClassList(element[0], newElement[0]);
      finalizeNewElement(newElement, element, model);

      return newElement;
    };


    dynaformElements.parseField = function (field, model, attrs) {
      var newChild = null,
        optGroups = {},
        cbAtt = '',
        newElement = formSupportedElements.getElementForType(field.type);

      newElement = dynaformElements.parseEditableElements(field, newElement, attrs);
      newElement = parseTextElement(field, newElement);

      if (field.type === 'number' || field.type === 'range') {
        if (angular.isDefined(field.minValue)) {
          newElement.attr('min', field.minValue);
        }
        if (angular.isDefined(field.maxValue)) {
          newElement.attr('max', field.maxValue);
        }
        if (field.type === 'range') {
          if (angular.isDefined(field.step)) {
            newElement.attr('step', field.step);
          }
        }
      }
      else if (['text', 'textarea'].indexOf(field.type) > -1) {
        if (angular.isDefined(field.splitBy)) {
          newElement.attr('ng-list', field.splitBy);
        }
      }
      else if (field.type === 'checkbox') {
        if (angular.isDefined(field.isOn)) {
          newElement.attr('ng-true-value', field.isOn);
        }
        if (angular.isDefined(field.isOff)) {
          newElement.attr('ng-false-value', field.isOff);
        }
        if (angular.isDefined(field.slaveTo)) {
          newElement.attr('ng-checked', field.slaveTo);
        }
      }
      else if (field.type === 'checklist') {
        if (angular.isDefined(field.val)) {
          model[field.model] = angular.copy(field.val);
        }
        if (angular.isDefined(field.options)) {
          if (!(angular.isDefined(model[field.model]) && angular.isObject(model[field.model]))) {
            model[field.model] = {};
          }
          angular.forEach(field.options, function (option, childId) {
            newChild = angular.element('<input type="checkbox" />');
            newChild.attr('name', field.model + '.' + childId);
            newChild.attr('ng-model', attrs.ngModel + "['" + field.model + "']" + "['" + childId + "']");
            if (angular.isDefined(option['class'])) {
              newChild.attr('ng-class', option['class']);
            }
            if (angular.isDefined(field.disabled)) {
              newChild.attr('ng-disabled', field.disabled);
            }
            if (angular.isDefined(field.readonly)) {
              newChild.attr('ng-readonly', field.readonly);
            }
            if (angular.isDefined(field.required)) {
              newChild.attr('ng-required', field.required);
            }
            if (angular.isDefined(field.callback)) {
              newChild.attr('ng-change', field.callback);
            }
            if (angular.isDefined(option.isOn)) {
              newChild.attr('ng-true-value', option.isOn);
            }
            if (angular.isDefined(option.isOff)) {
              newChild.attr('ng-false-value', option.isOff);
            }
            if (angular.isDefined(option.slaveTo)) {
              newChild.attr('ng-checked', option.slaveTo);
            }
            if (angular.isDefined(option.val)) {
              model[field.model][childId] = angular.copy(option.val);
              newChlid.attr('value', field.val);
            }

            if (angular.isDefined(option.label)) {
              newChild = newChild.wrap('<label></label>').parent();
              newChild.append(document.createTextNode(' ' + option.label));
            }
            newElement.append(newChild);
          });
        }
      }
      else if (field.type === 'radio') {
        if (angular.isDefined(field.val)) {
          model[field.model] = angular.copy(field.val);
        }
        if (angular.isDefined(field.values)) {
          angular.forEach(field.values, function (label, val) {
            newChild = angular.element('<input type="radio" />');
            newChild.attr('name', field.model);
            newChild.attr('ng-model', attrs.ngModel + "['" + field.model + "']");
            if (angular.isDefined(field['class'])) {
              newChild.attr('ng-class', field['class']);
            }
            if (angular.isDefined(field.disabled)) {
              newChild.attr('ng-disabled', field.disabled);
            }
            if (angular.isDefined(field.callback)) {
              newChild.attr('ng-change', field.callback);
            }
            if (angular.isDefined(field.readonly)) {
              newChild.attr('ng-readonly', field.readonly);
            }
            if (angular.isDefined(field.required)) {
              newChild.attr('ng-required', field.required);
            }
            newChild.attr('value', val);
            if (angular.isDefined(field.val) && field.val === val) {
              newChild.attr('checked', 'checked');
            }

            if (label) {
              newChild = newChild.wrap('<label></label>').parent();
              newChild.append(document.createTextNode(' ' + label));
            }
            newElement.append(newChild);
          });
        }
      }
      else if (field.type === 'select') {
        if (angular.isDefined(field.multiple) && field.multiple !== false) {
          newElement.attr('multiple', 'multiple');
        }
        if (angular.isDefined(field.empty) && field.empty !== false) {
          newElement.append(angular.element('<option value=""></option>').html(field.empty));
        }

        if (angular.isDefined(field.autoOptions)) {
          newElement.attr('ng-options', field.autoOptions);
        }
        else if (angular.isDefined(field.options)) {
          angular.forEach(field.options, function (option, childId) {
            newChild = angular.element('<option></option>');
            newChild.attr('value', childId);
            if (angular.isDefined(option.disabled)) {
              newChild.attr('ng-disabled', option.disabled);
            }
            if (angular.isDefined(option.slaveTo)) {
              newChild.attr('ng-selected', option.slaveTo);
            }
            if (angular.isDefined(option.label)) {
              newChild.html(option.label);
            }
            if (angular.isDefined(option.group)) {
              if (!angular.isDefined(optGroups[option.group])) {
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
            angular.forEach(optGroups, function (optGroup) {
              newElement.append(optGroup);
            });
            optGroups = {};
          }
        }
      }
      else if (field.type === 'image') {
        if (angular.isDefined(field.label)) {
          newElement.attr('alt', field.label);
        }
        if (angular.isDefined(field.source)) {
          newElement.attr('src', field.source);
        }
      }
      else if (field.type === 'hidden') {
        newElement.attr('name', field.model);
        newElement.attr('ng-model', attrs.ngModel + "['" + field.model + "']");
        if (angular.isDefined(field.val)) {
          model[field.model] = angular.copy(field.val);
          newElement.attr('value', field.val);
        }
      }
      else if (field.type === 'file') {
        if (angular.isDefined(field.multiple)) {
          newElement.attr('multiple', field.multiple);
        }
      }

      //  Common attributes; radio already applied these...
      if (field.type !== "radio") {
        if (angular.isDefined(field['class'])) {
          newElement.attr('ng-class', field['class']);
        }
        //  ...and checklist has already applied these.
        if (field.type !== "checklist") {
          if (angular.isDefined(field.disabled)) {
            newElement.attr('ng-disabled', field.disabled);
          }
          if (angular.isDefined(field.callback)) {
            //  Some input types need listeners on click...
            if (["button", "image", "legend", "reset", "submit"].indexOf(field.type) > -1) {
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

      //  If there's a label, add it.
      if (angular.isDefined(field.label)) {
        //  Some elements have already applied their labels.
        if (["image", "hidden"].indexOf(field.type) > -1) {
          angular.noop();
        }
        //  Button elements get their labels from their contents.
        else if (["button", "legend", "reset", "submit"].indexOf(field.type) > -1) {
          newElement.html(field.label);
        }
        //  Everything else should be wrapped in a label tag.
        else {
          newElement = newElement.wrap('<label></label>').parent();
          newElement.prepend(document.createTextNode(field.label + ' '));
        }
      }

      return newElement;
    };

    dynaformElements.parseEditableElements = function (field, newElement, attrs) {
      var type = field.type,
        model = field.model,
        required = field.required,
        readonly = field.readonly,
        val = field.val;
      //  Editable fields (those that can feed models)
      if (formSupportedElements.isEditable(type)) {
        newElement.attr('name', model);
        newElement.attr('ng-model', attrs.ngModel + "['" + model + "']");

        if (angular.isDefined(readonly)) {
          newElement.attr('ng-readonly', readonly);
        }
        if (angular.isDefined(required)) {
          newElement.attr('ng-required', required);
        }
        if (angular.isDefined(val)) {
          model[model] = angular.copy(val);
          newElement.attr('value', val);
        }
      }

      return newElement;
    }
  })
;
