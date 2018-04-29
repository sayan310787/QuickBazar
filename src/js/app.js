'use strict';
// Declare app level module which depends on filters, and services
angular.module('app.controllers', []);
angular.module('app.core', []);
angular.module('app.service', []);
angular.module('app', [
    'ngMaterial',
    'ngMdIcons',
    'ui.router',
    'ngCookies',
    'app.core',
    'app.controllers',
    'app.service',
    'ui.toggle',
    'base64',
    'chart.js'
])
    .controller('appController', function($scope, $state, $location, $window){

    });