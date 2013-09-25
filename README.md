angular-dynamic-forms
=====================

Build Forms in AngularJS From Nothing But JSON

Installation
------------

Copy `dynamic-forms.js` into your project wherever your other assets reside.

Use
---

As with any other AngularJS module:

* include the script into your page anywhere after AngularJS itself.

```html
<script src="assets/js/dynamic-forms.js">
```

* list `dynform` as a dependency of your project.

```javascript
appModule = angular.module('myApplication', ['dynform']);
```

* create a `dynamic-form` element anywhere in your page.

```html
<dynamic-form template="formTemplate"
	ng-model="formData"
	ng-submit="processForm()">
</dynamic-form>
```

* populate your `template` with a JSON object describing the form you want to create.

```javascript
$scope.formTemplate = {
	"first": {
		"type": "text"
	},
	"last": {
		"type": "text"
	},
	"submit": {
		"type": "submit"
	},
};
```

And that's about it!

Full Specification
------------------

Watch this space for a full list of valid values in your JSON template.