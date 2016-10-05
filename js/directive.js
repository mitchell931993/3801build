/*global
angular
*/
"use strict";
var app = angular.module('app-directives', []);
/*used to include library.html in template for files within landing */
app.directive('library', function () {
    return {
        restrict: 'E',
        templateUrl: 'includes/library.html'
    };
});
/* used to include schoolibrary.html in template for files within school*/
app.directive('schoolibrary', function () {
    return {
        restrict: 'E',
        templateUrl: '../includes/schoolibrary.html'
    };
});

app.directive('navbar', function () {
    return {
        restrict: 'E',
        templateUrl: 'includes/navbar.html'
    };
});

app.directive('schoolnavbar', function () {
    return {
        restrict: 'E',
        templateUrl: '/includes/schoolnavbar.html'
    };
});

app.directive('newfooter', function () {
    return {
        restrict: 'E',
        templateUrl: '../includes/footer.html'
    };
});

app.directive('visualiser', function () {
    return {
        restrict: 'E',
        templateUrl: '../includes/visualLibrary.html'
    };
});


