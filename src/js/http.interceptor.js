angular.module('app.core')
.config(function ($httpProvider){
    $httpProvider.interceptors.push('requestHeader')
})
    .factory('requestHeader', function(appService, $base64){
        return {request: function(config){
            var cred = appService.getCredentials();
            if(cred) {
                config.headers['Authorization'] = 'Basic ' + cred
            }
            //config.headers['Content-Type'] = undefined;
            //config.headers['Process-Data'] = false;
            return config
        }}
    })