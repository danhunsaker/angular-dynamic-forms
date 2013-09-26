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
        "label": "date"
      },
      "datetime": {
        "type": "datetime",
        "label": "datetime"
      },
      "datetime-local": {
        "type": "datetime-local",
        "label": "datetime-local"
      },
      "email": {
        "type": "email",
        "label": "email"
      },
      "month": {
        "type": "month",
        "label": "month"
      },
      "number": {
        "type": "number",
        "label": "number"
      },
      "password": {
        "type": "password",
        "label": "password"
      },
      "search": {
        "type": "search",
        "label": "search"
      },
      "tel": {
        "type": "tel",
        "label": "tel"
      },
      "textarea": {
        "type": "textarea",
        "label": "textarea"
      },
      "time": {
        "type": "time",
        "label": "time"
      },
      "url": {
        "type": "url",
        "label": "url"
      },
      "week": {
        "type": "week",
        "label": "week"
      },
      "checkbox": {
        "type": "checkbox",
        "label": "checkbox"
      },
      "range": {
        "type": "range",
        "label": "range"
      },
      "select": {
        "type": "select",
        "label": "select"
      },
      "checklist": {
        "type": "checklist",
        "label": "checklist"
      },
      "color": {
        "type": "color",
        "label": "color"
      },
      "file": {
        "type": "file",
        "label": "file"
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