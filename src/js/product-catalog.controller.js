angular.module('app.controllers')
    .controller('productCatalogController', function($scope, $state, $filter, apiService, appService, $mdToast){
        var selectedCatalog = {};
        var deleteId, deleteCatalogId, imageData;

        function init(){
            $scope.catalogModel = {};
            $scope.isCatalogEdit = false;
            $scope.allCatalog = [];
            $scope.imageFromCatalog = true;
            $scope.catLoading = false;
            $scope.isImageUploading = false;
            $scope.noCatData = false;
            $scope.imageStaticUrl = appService.getImageStaticLink();
            getAllCatalog();
        }

        function getAllCatalog(){
            $scope.catLoading = true;
            apiService.getAllCatalog().then(function(data){
                if(data && data.length > 0) {
                    appService.setCatData(data);
                    $scope.allCatalog = data;
                    $scope.catLoading = false;
                    $scope.noCatData = false;
                    getImage(data);
                }else{
                    $scope.noCatData = true;
                    $scope.catLoading = false;
                    $scope.allCatalog = [];
                }
            })
        }

        function getImage(Data){
            _.forEach(Data, function(each, key){
                if(_.isEmpty(each.icon)){
                    $scope.allCatalog[key].imageUrl = 'images/no_uploaded.png'
                }else{
                    $scope.allCatalog[key].imageUrl = each.icon;
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
        $scope.editCatalog = function(editCat){
            $scope.catalogModel = editCat;
            $scope.isCatalogEdit = true;
        }

        $scope.resetCatalogForm = function(){
            $scope.catalogModel = {};
            $scope.isCatalogEdit = false;
            $scope.addEditCatalogForm.$setPristine();
            $scope.uploadedImage = null;
            document.getElementById("catIcon").value = '';
        }

        $scope.submitCatalogForm = function (payload) {
            if($scope.isCatalogEdit){
                apiService.editCatalog(payload).then(function(response){
                    if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                    else
                    showToaster(response.messageError, "error-toast");
                    $scope.resetCatalogForm();
                    getAllCatalog();
                })
            }else{
               apiService.addCatalog(payload).then(function(response){
                   if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                   else
                       showToaster(response.messageError, "error-toast");
                    $scope.resetCatalogForm();
                    getAllCatalog();
                })
            }
        }

        $scope.deleteCatalog = function(catalog){
            deleteId = catalog.id;
        }

        $scope.confirmDelete = function () {
            apiService.deleteCatalog(deleteId).then(function(response){
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                    showToaster(response.messageError, "error-toast");
                getAllCatalog();
            })
        }

        $scope.viewItems = function(catelog){
            $state.go('home.catalogItems')
        }

        $scope.uploadImage = function(divId){
            $scope.isImageUploading = true;
            apiService.uploadImage(divId).then(function(data){
                if(data == false || data == ''){
                    $scope.catalogModel.icon = 'images/no_uploaded.png';
                    $scope.isImageUploading = false;
                }else{
                    $scope.catalogModel.icon = data;
                    $scope.isImageUploading = false;
                }
            })
        }
        $scope.refreshContent = function(){
            getAllCatalog();
        }
        init();

    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if(input !== undefined && input instanceof Array){
                return input.slice(start);
            }else{
                return ;
            }
        }
    });