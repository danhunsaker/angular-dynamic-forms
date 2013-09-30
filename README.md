angular-dynamic-forms
=====================
Build Forms in AngularJS From Nothing But JSON

Installation
------------
Copy `dynamic-forms.js` into your project wherever your other assets reside.

Use
---
As with any other [AngularJS][] module:

* include the script into your page anywhere after [AngularJS][] itself.

```html
    <script src="assets/js/dynamic-forms.js"></script>
```

* list `dynform` as a dependency of your project.

```javascript
    appModule = angular.module('app', ['dynform']);
```

* create a [dynamic-form](#the-directive) element anywhere in your page.

```html
    <dynamic-form template="formTemplate"
        ng-model="formData"
        ng-submit="processForm()">
    </dynamic-form>
```

* populate your [template](#the-template) with a JSON object describing the form you want to create.

```javascript
    $scope.formTemplate = {
        "first": {
            "type": "text",
            "label": "First Name"
        },
        "last": {
            "type": "text",
            "label": "Last Name"
        },
        "submit": {
            "type": "submit"
        },
    };
```

And that's about it!

Full Specification
------------------
### The Directive ###
You invoke the `dynamic-form` directive using an element (`<dynamic-form></dynamic-form>`) - other
options are unsupported (for now).  It requires two attributes: an [ng-model][], and either a
`template` or a `template-url`.  The [ng-model][] will be used to generate valid [ng-model][]s for
the various input controls in the template.  In accordance with how [AngularJS][] handles this
attribute elsewhere, your entire form's data will be available in keys of whichever model you
specify here.

If you specify a `template-url`, the `dynamic-form` directive will retrieve the form template via
[$http][] and build out your form based on the response.  Currently, failure is silently ignored.
This may change in a later release.

You may not want to rely on the directive to retrieve your form directly - perhaps you want to do
some processing on the server response before passing it to the directive for processing, or maybe
you need to build a more complex [$http][] request with advanced authentication.  Or perhaps you
just want to gracefully handle failure to retrieve the template.  Enter the `template` attribute.
When the directive sees `template`, it ignores any `template-url` and instead uses the object
identified by the `template` attribute.

Any other attributes you specify on the `<dynamic-form>` element are copied across to the `form` or
[ng-form][] element that the directive builds to replace itself with.  Similarly, any pre-existing
contents are copied across as well, to the top of the resulting form, with the
dynamically-specified controls below them.  This allows you to nest `<dynamic-form>`s inside each
other in the same way as [ng-form][] (which is one reason this directive implements this
pseudo-transclusion).

### The Template ###
Regardless of whether it arrives via `template` or `template-url`, the form template is a
fairly-straightforward JavaScript object.  Its keys correspond to input control `name`s, which in
turn (by default) correspond to keys in the form's model.  Each of the values of this object is
another object describing a form input control.  A `type` key identifies what kind of control to
build, which in turn determines what [other keys](#common-options) are expected.  Any `type` that
isn't supported builds a `<span>` containing the value of the `label` key, if one exists, and any
other keys as attributes.  Following is a list of all currently-supported `type`s, and then a more
detailed specification of each.  (Note that not all of these are properly supported in all
browsers, yet; there are a number of references around the web for [which browsers support
what][formsupport])

* [button](#button)
* [checkbox](#checkbox)
* [checklist](#checklist)
* [color](#color)
* [date](#date)
* [datetime](#datetime)
* [datetime-local](#datetime-local)
* [email](#email)
* [file](#file)
* [hidden](#hidden)
* [image](#image)
* [legend](#legend)
* [month](#month)
* [number](#number)
* [password](#password)
* [radio](#radio)
* [range](#range)
* [reset](#reset)
* [search](#search)
* [select](#select)
* [submit](#submit)
* [tel](#tel)
* [text](#text)
* [textarea](#textarea)
* [time](#time)
* [url](#url)
* [week](#week)

#### Common Options ####
* `class`: see [ng-class][]
* `callback`: see [ng-change][] (or [ng-click][] for button-like types)
* `disabled`: see [ng-disabled][]
* `label`: wraps the control in a `<label>` tag with the value as text content (but see specific
    types for exceptions to how this is handled)
* __The following options are only supported for types that have values:__
    * `model`: overrides the control's ID as the value of [ng-model][]; allows multiple controls to
        be tied to a single model
    * `readonly`: see [ng-readonly][]
    * `required`: see [ng-required][]
    * `val`: an initial value for the model

#### button ####
* __Renders:__ `<button></button>`
* __Additional Options:__
    * None
* __Other Notes:__
    * The value of `label` is used as the content of the `<button>` itself; no additional elements
        are created

#### checkbox ####
* __Renders:__ `<input type="checkbox">`
* __Additional Options:__
    * `isOn`: see [ng-true-value][]
    * `isOff`: see [ng-false-value][]
    * `slaveTo`: see [ng-checked][]
* __Other Notes:__
    * See also the [checklist](#checklist) type, below

#### checklist ####
* __Renders:__ multiple `<input type="checkbox">` controls
* __Additional Options:__
    * `options`: an object containing a collection of child objects, each describing a checkbox
        * The key of each child object specifies the key to associate with the checkbox it describes
        * `class`: applies a specific [ng-class][] to the current checkbox, independently of the
            rest
        * See the [checkbox](#checkbox) type for other fields supported here
* __Other Notes:__
    * This is a convenience type, used to tie a group of [checkbox](#checkbox) controls together
        under a single model; the model holds an object, and each control sets a separate key
        within it
    * You can set a `val` on the entire `checklist` (it must, of course, be an object) in addition
        to any per-option `val`s; the per-option versions are set after the full `checklist`
        version, so they will override anything set to their key by the `checklist` itself

#### color ####
* __Renders:__ `<input type="color">`
* __Additional Options:__
    * None
* __Other Notes:__
    * May not be [supported][colorsupport] in all browsers

#### date ####
* __Renders:__ `<input type="date">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### datetime ####
* __Renders:__ `<input type="datetime">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### datetime-local ####
* __Renders:__ `<input type="datetime-local">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### email ####
* __Renders:__ `<input type="email">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * On devices that have on-screen keyboards, the browser may modify the keyboard layout to make
        entering email addresses in these controls easier.

#### file ####
* __Renders:__ `<input type="file">`
* __Additional Options:__
    * `multiple`: whether or not the user can select more than one file at a time with this single
        control
* __Other Notes:__
    * [A directive][filedirective] is included with this module that allows `file` controls to
        properly bind to [AngularJS][] models - the control's FileList object is stored in the
        model, and updating the model's value with a valid FileList object will update the control
        accordingly
    * Also included is [an AngularJS service][fileservice] that wraps the browser's FileReader in a
        promise, so you can get the contents of the selected file for further manipulation, or even
        send it along in an AJAX request, and all without leaving [AngularJS][]
    * Both of these additions are modified versions of code by [K. Scott Allen][] and made
        available on the [OdeToCode][] website; the original versions are linked above

#### hidden ####
* __Renders:__ `<input type="hidden">`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### image ####
* __Renders:__ `<input type="image">`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### legend ####
* __Renders:__ `<legend></legend>`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### month ####
* __Renders:__ `<input type="month">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### number ####
* __Renders:__ `<input type="number">`
* __Additional Options:__
    * 
* __Other Notes:__
    * 
    * May not be [supported][numbersupport] in all browsers

#### password ####
* __Renders:__ `<input type="password">`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### radio ####
* __Renders:__ multiple `<input type="radio">` controls
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### range ####
* __Renders:__ `<input type="range">`
* __Additional Options:__
    * 
* __Other Notes:__
    * By default, this control seems to provide its values to [AngularJS][] as strings.  This might
        be due to [Angular][AngularJS] handling them as regular [text](#text) controls internally.
        Among the other minor tweaks, this module contains a very simple directive to override the
        default [$parsers][] mechanism for `range` controls and convert these values back to numbers
        (floats, in case your `step` is less than one).
    * May not be [supported][rangesupport] in all browsers

#### reset ####
* __Renders:__ `<button type="reset"></button>`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### search ####
* __Renders:__ `<input type="search">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * All browsers support this because it works exactly like a [text](#text) control.  The idea is
        that search boxes will be styled differently, and on some devices might even support
        additional input methods, such as voice recognition.  You'll probably want to tie these
        controls to some kind of search mechanism in your app, since users whose browsers *do*
        render them differently will expect them to act accordingly.

#### select ####
* __Renders:__ `<select></select>`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### submit ####
* __Renders:__ `<button type="submit"></button>`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### tel ####
* __Renders:__ `<input type="tel">`
* __Additional Options:__
    * See [text](#text) below
* __Other Notes:__
    * There is currently no validation support for this control in nearly any browser, and
        [AngularJS][] doesn't provide any by default.  This is mostly because telephone numbers are
        tricky beasts, especially with the differences between how these numbers are allocated from
        one part of the world to another.  And that's before we start getting messy with things
        like VoIP "numbers".

#### text ####
* __Renders:__ `<input type="text">`
* __Additional Options:__
    * 
* __Other Notes:__
    * 

#### textarea ####
* __Renders:__ `<textarea></textarea>`
* __Additional Options:__
    * See [text](#text) above
* __Other Notes:__
    * 

#### time ####
* __Renders:__ `<input type="time">`
* __Additional Options:__
    * See [text](#text) above
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

#### url ####
* __Renders:__ `<input type="url">`
* __Additional Options:__
    * See [text](#text) above
* __Other Notes:__
    * 

#### week ####
* __Renders:__ `<input type="week">`
* __Additional Options:__
    * See [text](#text) above
* __Other Notes:__
    * May not be [supported][datesupport] in all browsers

Acknowledgements
----------------
* [Frank Linehan][] for leading me in [the right direction][].
* [K. Scott Allen][] for the [file input directive][filedirective] and the [FileReader service][fileservice] adapted for use here.

[AngularJS]: http://angularjs.org/
[OdeToCode]: http://odetocode.com/

[colorsupport]: http://caniuse.com/input-color
[datesupport]: http://caniuse.com/input-datetime
[filedirective]: http://odetocode.com/blogs/scott/archive/2013/07/05/a-file-input-directive-for-angularjs.aspx
[fileservice]: http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
[formsupport]: http://caniuse.com/forms
[numbersupport]: http://caniuse.com/input-number
[pholdsupport]: http://caniuse.com/input-placeholder
[rangesupport]: http://caniuse.com/input-range
[the right direction]: http://docs.angularjs.org/guide/directive

[$http]: http://docs.angularjs.org/api/ng.$http
[$parsers]: http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController
[ng-change]: http://docs.angularjs.org/api/ng.directive:ngChange
[ng-checked]: http://docs.angularjs.org/api/ng.directive:ngChecked
[ng-class]: http://docs.angularjs.org/api/ng.directive:ngClass
[ng-click]: http://docs.angularjs.org/api/ng.directive:ngClick
[ng-disabled]: http://docs.angularjs.org/api/ng.directive:ngDisabled
[ng-false-value]: http://docs.angularjs.org/api/ng.directive:input.checkbox
[ng-form]: http://docs.angularjs.org/api/ng.directive:form
[ng-list]: http://docs.angularjs.org/api/ng.directive:ngList
[ng-maxlength]: http://docs.angularjs.org/api/ng.directive:input
[ng-minlength]: http://docs.angularjs.org/api/ng.directive:input
[ng-model]: http://docs.angularjs.org/api/ng.directive:ngModel
[ng-multiple]: http://code.angularjs.org/1.0.8/docs/api/ng.directive:ngMultiple
[ng-options]: http://docs.angularjs.org/api/ng.directive:select
[ng-pattern]: http://docs.angularjs.org/api/ng.directive:input
[ng-readonly]: http://docs.angularjs.org/api/ng.directive:ngReadonly
[ng-required]: http://docs.angularjs.org/api/ng.directive:input
[ng-selected]: http://docs.angularjs.org/api/ng.directive:ngSelected
[ng-true-value]: http://docs.angularjs.org/api/ng.directive:input.checkbox

[Frank Linehan]: http://frank-code.com/
[K. Scott Allen]: http://odetocode.com/about/scott-allen