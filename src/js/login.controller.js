angular.module('app.controllers')
    .controller('loginController', function($scope, $state, $cookies, apiService, $base64, appService){
        $scope.loginModel = {username: '', password: ''};
        $scope.errorLogin = false;
        $scope.dataLoading = false;
        $scope.login = function(){
            $scope.dataLoading = true;
            var pass = $base64.encode($scope.loginModel.username+':'+$scope.loginModel.password);
            $cookies.put('pass', pass)
            apiService.login($scope.loginModel).then(function (data) {
                $scope.errorLogin = false;
                if(data instanceof Array && (data[0].id && data[0].type == 'admin')){
                    $cookies.put('auth', $scope.loginModel);
                    $cookies.put('userName', (data[0].name || 'Admin'));
                    $cookies.put('userId', (data[0].username || 'admin'));
                    $cookies.put('imageUrl', (data[0].image || 'images/person.png'));
                    $scope.dataLoading = false;
                    if(appService.getLoggedInUser()){
                        $state.go('home.productCatalog')
                    }else{
                        $state.go('home.orders')
                    }
                }else{
                    $cookies.remove('pass');
                    $scope.errorLogin = true;
                    $scope.dataLoading = false;
                }
            })
        }
    });