angular.module('app.controllers')
    .controller('catalogItemsController', function($scope, $state, $filter, apiService, $rootScope, $timeout, appService, $mdToast) {
        var deleteItemId, selectedSlug;
        function init(){
            $scope.slugAvailable = undefined;
            $scope.isItemEdit = false;
            $scope.isAdmin = false;
            $scope.currentPage = 0;
            $scope.pageSize = 5;
            $scope.allItems = [];
            $scope.isLoading = false;
            $scope.itemModel = {};
            $scope.selectCatalog = [];
            $scope.imageStaticUrl = appService.getImageStaticLink();
            $scope.noProdData = false;
            getAllCatData();
        }
        function getAllItems(selectId){
            $scope.isLoading = true;
            console.log($scope.isLoading);
            apiService.getAllItems(selectId).then(function(data){
                if(data && data.length > 0 && data != 'null') {
                    $scope.allItems = data;
                    $scope.isLoading = false;
                    $scope.noProdData = false;
                    getImage(data);
                }else{
                    $scope.allItems = [];
                    $scope.noProdData = true;
                    $scope.isLoading = false;
                }
            })
        }
        function getImage(Data){
            _.forEach(Data, function(each, key){
                if(_.isEmpty(each.image)){
                    $scope.allItems[key].imageUrl = 'images/no_uploaded.png'
                }else{
                    $scope.allItems[key].imageUrl = each.image;
                }
            })
        }
        function getAllCatData(){
            $scope.isLoading = true;
            if($state.params.catId){
                $scope.selectCatalog = $state.params.catId;
                if(appService.getCatData().length > 0) {
                    $scope.allCatalog = appService.getCatData();
                    var slugObj = $scope.allCatalog.filter(function(each){
                        if(each.id == $state.params.catId)
                            return each.slug;
                    });
                    if(slugObj && slugObj[0]){
                        selectedSlug = slugObj[0].slug;
                    }
                    getAllItems('category_id='+$scope.selectCatalog);
                }else {
                    apiService.getAllCatalog().then(function (data) {
                        if (data) {
                            $scope.allCatalog = data;
                            $scope.selectCatalog = $scope.allCatalog[0].id;
                            selectedSlug = $scope.allCatalog[0].slug;
                            getAllItems('category_id='+$scope.selectCatalog);
                        }
                    })
                }
            }else{
                apiService.getAllCatalog().then(function(data){
                    if(data) {
                        $scope.allCatalog = data;
                        $scope.selectCatalog = $scope.allCatalog[0].id;
                        selectedSlug = $scope.allCatalog[0].slug;
                        getAllItems('category_id='+$scope.selectCatalog);
                    }
                })
            }
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
        $scope.fetchItemById = function(selectCat){
            getAllItems('category_id='+selectCat);
        }
        $scope.editUser = function (user) {
            $scope.itemModel = user;
            $scope.isItemEdit = true;
        }
        $scope.submitUserForm = function (payload, admin) {
            if($scope.isItemEdit) {
                apiService.editItem(payload).then(function (response) {
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                    $scope.resetUserForm();
                    getAllItems('category_id='+$scope.selectCatalog);
                })
            }else{
                payload.category_id = parseInt($scope.selectCatalog);
                payload.currency = "Rs";
                apiService.addItem(payload).then(function (response) {
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                    $scope.resetUserForm();
                    getAllItems('category_id='+$scope.selectCatalog);
                })
            }
        }
        $scope.resetUserForm = function () {
            $scope.itemModel = {};
            $scope.isItemEdit = false;
            $scope.addEditItemForm.$setPristine();
            document.getElementById("prodIcon").value = '';
        }
        $scope.deleteUser = function (payload) {
            deleteItemId = payload.id
        }
        $scope.confirmDelete = function(){
            apiService.deleteItem(deleteItemId).then(function (response) {
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                showToaster(response.messageError, "error-toast");
                getAllItems('category_id='+$scope.selectCatalog);
                deleteItemId = '';
            })
        }
        $scope.uploadImage = function(divId){
            $scope.isImageUploading = true;
            apiService.uploadImage(divId).then(function(data){
                if(data == false || data == ''){
                    $scope.itemModel.image = 'images/no_uploaded.png';
                    $scope.isImageUploading = false;
                }else{
                    $scope.itemModel.image = data;
                    $scope.isImageUploading = false;
                }
            })
        }
        $scope.checkSlug = function(slug){
            apiService.getAllItems('slug='+slug).then(function(response){
                if(response && response[0].id){
                    $scope.slugAvailable = false;
                }else{
                    $scope.slugAvailable = true;
                }
            })
        }
        $scope.refreshContent = function(){
            getAllItems('category_id='+$scope.selectCatalog);
        }
        $scope.numberOfUserPages = function(){
            return Math.ceil($scope.getUserData().length/$scope.pageSize);
        }
        $scope.getUserData = function () {
            return $filter('filter')($scope.allItems, $scope.searchText)
        }
        init();
    });
