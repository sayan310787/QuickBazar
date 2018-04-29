angular.module('app.controllers')
    .controller('settingsUpdateController', function($scope, apiService, $filter, $mdToast) {
        var deletePinId;
        function init() {
            $scope.pinCodeModel = {};
            $scope.currentPage = 0;
            $scope.pageSize = 5;
            $scope.allPinCode = [];
            $scope.dayLimit = {};
            getPinCodes();
            getDayLimit();
        }
        function showToaster(message, type){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom right')
                    .hideDelay(3000)
                    .theme(type)
            );
        }
        function getPinCodes(){
            apiService.getPinCodes().then(function (data) {
                $scope.allPinCode = data;
            })
        };
        function getDayLimit(){
            apiService.getDayLimit().then(function (data) {
                $scope.dayLimit.day_limit = data[0].day_limit;
                $scope.dayLimit.id = data[0].id;
            })
        }
        $scope.addPinCode = function(payload){
                apiService.addPinCode(payload).then(function (response) {
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                    getPinCodes()
                })
        }
        $scope.deletePinCode = function (payload) {
            deletePinId = payload.id;
        }
        $scope.confirmDelete = function(){
            apiService.deletePinCode(deletePinId).then(function (response) {
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                    showToaster(response.messageError, "error-toast");
                    getPinCodes();
                    deletePinId = '';
            })
        }
        $scope.updateDailyLimit = function(){
            apiService.updateDailyLimit($scope.dayLimit).then(function (response) {
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                    showToaster(response.messageError, "error-toast");
                getDayLimit()
            })
        }
        $scope.resetPinCodeForm = function(){
            $scope.pinCodeModel = {};
            $scope.addPinCodeForm.$setPristine();
        }
        $scope.refreshContentPin = function(){
            getPinCodes();
        }
        $scope.refreshContentDaily = function(){
            getDayLimit();
        }
        $scope.numberOfUserPages = function(){
            return Math.ceil($scope.getPinCodeData().length/$scope.pageSize);
        }
        $scope.getPinCodeData = function () {
            return $filter('filter')($scope.allPinCode, $scope.searchText)
        }
        init();
    });