angular.module('app.controllers')
    .controller('customerManagementController', function($scope, apiService, $filter, appService, $mdToast){

        var deleteUserId;
        function init(){
            $scope.userIdAvailable = undefined;
            $scope.isUserEdit = false;
            $scope.isAdmin = false;
            $scope.currentPage = 0;
            $scope.pageSize = 5;
            $scope.allUsers = [];
            $scope.userLoading = false;
            $scope.isImageUploading = false;
            $scope.imageStaticUrl = appService.getImageStaticLink();
            $scope.userModel = {};
            $scope.noAdminData = false;
            getAllUsers()
        }
        function getAllUsers(){
            $scope.userLoading = true;
            apiService.getAllUser().then(function(data){
                if(data && data.length > 0 && data != 'null') {
                    $scope.allUsers = data;
                    _.forEach(data, function (eachUser) {
                        if(eachUser.type == 'admin') {
                            eachUser.isAdmin = 'Yes';
                        }else{
                            eachUser.isAdmin = 'No';
                        }
                    })
                    $scope.userLoading = false;
                    $scope.noAdminData = false;
                    getImage(data);
                }else{
                    $scope.noAdminData = true;
                    $scope.userLoading = false;
                    $scope.allUsers = [];
                }
            })
        }
        function getImage(Data){
            _.forEach(Data, function(each, key){
                if(_.isEmpty(each.image)){
                    $scope.allUsers[key].imageUrl = 'images/no_uploaded.png'
                }else{
                    $scope.allUsers[key].imageUrl = each.image;
                }
            })
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
        $scope.editUser = function (user) {
            $scope.userModel = user;
            $scope.isUserEdit = true;
            if(user && user.type == 'admin'){
                $scope.isAdmin = true;
            }
        }
        $scope.submitUserForm = function (payload, admin) {
            if($scope.isUserEdit) {
                apiService.editUser(payload).then(function (response) {
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                        $scope.resetUserForm();
                        getAllUsers();
                })
            }else{
                if($scope.isAdmin){
                    payload.type = 'admin';
                }else{
                    payload.type = '';
                }
                payload.password = 'password';
                payload.active = "0";
                apiService.addUser(payload).then(function (response) {
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                        $scope.resetUserForm();
                        getAllUsers();
                })
            }
        }
        $scope.resetUserForm = function () {
            $scope.userModel = {userAddress: []};
            $scope.userIdAvailable = undefined;
            $scope.isUserEdit = false;
            $scope.addEditUserForm.$setPristine();
        }
        $scope.deleteUser = function (payload) {
            deleteUserId = payload.id;
        }
        $scope.confirmDelete = function(){
            apiService.deleteUser(deleteUserId).then(function (response) {
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                    showToaster(response.messageError, "error-toast");
                    getAllUsers();
                    deleteUserId = '';
            })
        }
        $scope.checkUserId = function(userId){
            apiService.getUser('?username='+userId).then(function(response){
                if(response && response[0].id){
                    $scope.userIdAvailable = false;
                }else{
                    $scope.userIdAvailable = true;
                }
            })
        }
        $scope.uploadImage = function(divId){
            $scope.isImageUploading = true;
            apiService.uploadImage(divId).then(function(data){
                if(data == false || data == ''){
                    $scope.userModel.image = 'images/no_uploaded.png';
                    $scope.isImageUploading = false;
                }else{
                    $scope.userModel.image = data;
                    $scope.isImageUploading = false;
                }
            })
        }
        $scope.refreshContent = function(){
            getAllUsers();
        }
        $scope.numberOfUserPages = function(){
            return Math.ceil($scope.getUserData().length/$scope.pageSize);
        }
        $scope.getUserData = function () {
            return $filter('filter')($scope.allUsers, $scope.searchText)
        }
        init();
    });