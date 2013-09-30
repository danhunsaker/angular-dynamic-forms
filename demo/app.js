angular.module('app', ['dynform'])
  .controller('AppCtrl', ['$scope', function ($scope) {
    $scope.stdFormTemplate = {
      "text": {
        "type": "text",
        "label": "text",
        "placeholder": "text"
      },
      "date": {
        "type": "date",
        "label": "date",
        "placeholder": "date"
      },
      "datetime": {
        "type": "datetime",
        "label": "datetime",
        "placeholder": "datetime"
      },
      "datetime-local": {
        "type": "datetime-local",
        "label": "datetime-local",
        "placeholder": "datetime-local"
      },
      "email": {
        "type": "email",
        "label": "email",
        "placeholder": "email"
      },
      "month": {
        "type": "month",
        "label": "month",
        "placeholder": "month"
      },
      "number": {
        "type": "number",
        "label": "number",
        "placeholder": "number"
      },
      "password": {
        "type": "password",
        "label": "password",
        "placeholder": "password"
      },
      "search": {
        "type": "search",
        "label": "search",
        "placeholder": "search"
      },
      "tel": {
        "type": "tel",
        "label": "tel",
        "placeholder": "tel"
      },
      "textarea": {
        "type": "textarea",
        "label": "textarea",
        "placeholder": "textarea"
      },
      "time": {
        "type": "time",
        "label": "time",
        "placeholder": "time"
      },
      "url": {
        "type": "url",
        "label": "url",
        "placeholder": "url"
      },
      "week": {
        "type": "week",
        "label": "week",
        "placeholder": "week"
      },
      "checkbox": {
        "type": "checkbox",
        "label": "checkbox"
      },
      "color": {
        "type": "color",
        "label": "color"
      },
      "file": {
        "type": "file",
        "label": "file",
        "multiple": true
      },
      "range": {
        "type": "range",
        "label": "range",
        "model": "number",
        "val": 42,
        "minValue": -42,
        "maxValue": 84
      },
      "select": {
        "type": "select",
        "label": "select"
      },
      "checklist": {
        "type": "checklist",
        "label": "checklist"
      },
      "radio": {
        "type": "radio",
        "label": "radio"
      },
      "button": {
        "type": "button",
        "label": "button"
      },
      "hidden": {
        "type": "hidden",
        "label": "hidden"
      },
      "image": {
        "type": "image",
        "label": "image"
      },
      "legend": {
        "type": "legend",
        "label": "legend"
      },
      "reset": {
        "type": "reset",
        "label": "reset"
      },
      "submit": {
        "type": "submit",
        "label": "submit"
      },
      "bogus": {
        "type": "bogus",
        "label": "bogus"
      }
    };
    $scope.stdFormData = {};
    $scope.urlFormData = {};
  }])
  .filter('pretty', function() {
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