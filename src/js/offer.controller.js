angular.module('app.controllers')
    .controller('offersController', function($scope, $state, $filter, apiService, appService, $mdToast) {
        var selectedCatalog = {};
        var deleteId, deleteCatalogId;
        var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        function init(){
            $scope.offerModel = {};
            $scope.isOfferEdit = false;
            $scope.allOffers = [];
            $scope.offerLoading = false;
            $scope.isImageUploading = false;
            $scope.imageStaticUrl = appService.getImageStaticLink();
            $scope.noOfferData = false;
            getAllOffers();
        }

        function getAllOffers(){
            $scope.offerLoading = true;
            apiService.getAllOffer().then(function(data){
                if(data && data.length > 0 && data != 'null') {
                    $scope.allOffers = data;
                    $scope.offerLoading = false;
                    $scope.noOfferData = false;
                    getImage(data);
                }else{
                    $scope.noOfferData = true;
                    $scope.offerLoading = false;
                    $scope.allOffers = [];
                }
            })
        }

        function getImage(Data){
            _.forEach(Data, function(each, key){
                each.start_date = new Date(each.start_date)
                each.end_date = new Date(each.end_date)
                if(_.isEmpty(each.image)){
                    $scope.allOffers[key].imageUrl = 'images/no_uploaded.png'
                }else{
                    $scope.allOffers[key].imageUrl = each.image;
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
        $scope.editOffer = function(editOffr){
            $scope.offerModel = editOffr;
            $scope.isOfferEdit = true;
        }

        $scope.resetOfferForm = function(){
            $scope.offerModel = {};
            $scope.isOfferEdit = false;
            $scope.addEditOfferForm.$setPristine();
            $scope.uploadedImage = null;
            document.getElementById("offerIcon").value = '';
        }

        $scope.submitOfferForm = function (payload) {
            payload.start_date = $filter('date')(payload.start_date, "yyyy-MM-dd");
            payload.end_date = $filter('date')(payload.end_date, "yyyy-MM-dd");
            if($scope.isOfferEdit){
                apiService.editOffer(payload).then(function(response){
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                    $scope.resetOfferForm();
                    getAllOffers();
                })
            }else{
                payload.status = '1';
                apiService.addOffer(payload).then(function(response){
                    if(response && response.data.success == true)
                        showToaster(response.messageSuccess, "success-toast");
                    else
                        showToaster(response.messageError, "error-toast");
                    $scope.resetOfferForm();
                    getAllOffers();
                })
            }
        }

        $scope.deleteOffer = function(offer){
            deleteId = offer.id;
        }

        $scope.confirmDelete = function () {
            apiService.deleteOffer(deleteId).then(function(response){
                if(response && response.data.success == true)
                    showToaster(response.messageSuccess, "success-toast");
                else
                    showToaster(response.messageError, "error-toast");
                getAllOffers();
            })
        }
        $scope.uploadImage = function(divId){
            $scope.isImageUploading = true;
            apiService.uploadImage(divId, true).then(function(data){
                if(data == false || data == ''){
                    $scope.offerModel.image = 'images/no_uploaded.png';
                    $scope.isImageUploading = false;
                }else{
                    $scope.offerModel.image = data;
                    $scope.isImageUploading = false;
                }
            })
        }
        $scope.refreshContent = function(){
            getAllOffers();
        }
        init();
    });