angular.module('app.controllers')
    .controller('headerController', function($scope, $state, $cookies, apiService, $base64, appService){
        $scope.passModel = {};
        $scope.inputType = 'password';
        $scope.imageStaticUrl = appService.getImageStaticLink();
        $scope.logout = function () {
            $cookies.remove('auth');
            $cookies.remove('pass');
            $cookies.remove('userName');
            $cookies.remove('userId');
            $cookies.remove('imageUrl');
            $state.go('login');
        }
        $scope.userId = $cookies.get('userName') || 'Admin';
        $scope.imageUrl =  $cookies.get('imageUrl');
        if(appService.getLoggedInUser()){
            $scope.notRestricted = true;
        }else{
            $scope.notRestricted = false;
        }
        $scope.navigate = function (state) {
            $state.go(state);
        }
        $scope.$state = $state;
        $scope.changePassword = function () {
            apiService.getUser('?username='+$scope.userId).then(function(response){
                $scope.passModel = response[0];
            })
        }
        $scope.submitPassForm = function(payload) {
            var pass = $base64.encode($scope.userId+':'+payload.currentPassword);
            if (payload.newPassword !== payload.currentPassword && (pass === $cookies.get('pass'))) {
                payload.password = payload.newPassword
            apiService.editUser(payload).then(function (response) {
                console.log('Password Changed Successfully');
                $scope.resetPassForm();
            })
        }else{
            console.log('Password Not Changed');
        }
        }
        $scope.hideShowPassword = function(){
            if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
        };
        $scope.resetPassForm = function(){
            $scope.passModel = {};
            $scope.inputType = 'password';
            $scope.passChangeForm.$setPristine();
        }
    })