#angular-middle directive
***
[AngularJS](http://angularjs.org/) directive to center elements vertically and horizontally. If the element is longer than container, it will be expanded.

##Quick start
***

Load `angular-middle.css` and `angular-middle.js` into your html:
```html
<link rel="stylesheet" href="/path/to/angular-middle.css" />
<script src="/path/to/angular-middle.js"></script>
```

Inject `angular-middle` into your application module:
```javascript
var app = angular.module('myApp', ['middle']);
```

Have fun:
```html
<div middle middle-horizontal>
    <div>This element will be centered</div>
</div>
```

##License
***
`angular-middle` uses the [MIT](http://opensource.org/licenses/MIT) license