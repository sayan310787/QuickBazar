angular.module('app.controllers')
    .controller('addEditController', function($scope, apiService){
        function init(){
            $scope.isFaqEdit = false;
            $scope.isFaqLoading = false;
            $scope.isTermsLoading = false;
            $scope.isTermsEdit = false;
            $scope.faqModel = {};
            $scope.termsModel = {};
            getAllFaq();
            getAllTerms();
        }
        function getAllFaq(){
            $scope.isFaqLoading = true;
            apiService.getAllFaq().then(function(data){
                if(data){
                    $scope.allFaq = _.filter(data, function(eachFaq){
                        return eachFaq.active == 1
                    })
                    $scope.isFaqLoading = false;
                }
            })
        }
        function getAllTerms(){
            $scope.isTermsLoading = true;
            apiService.getAllTerms().then(function(data){
                if(data){
                    $scope.allTerms = _.filter(data, function(eachTerm){
                        return eachTerm.active == 1
                    })
                    $scope.isTermsLoading = false;
                }
            })
        }
        $scope.editFaq = function (payload) {
            $scope.isFaqEdit = true;
            $scope.faqModel = payload;
        }
        $scope.deleteFaq = function(payload){
            apiService.deleteFaq(payload.id).then(function(response){
                getAllFaq();
                $scope.resetFaqForm();
            })
        }
        $scope.submitFaqForm = function(payload){
            if($scope.isFaqEdit){
                apiService.editFaq(payload).then(function(response){
                    getAllFaq();
                    $scope.resetFaqForm();
                })
            }else{
                apiService.addFaq(payload).then(function(response){
                    getAllFaq();
                    $scope.resetFaqForm();
                })
            }
        }
        $scope.editTerms = function(payload){
            $scope.isTermsEdit = true;
            $scope.termsModel = payload;
        }
        $scope.deleteTerms = function(payload){
            apiService.deleteTerms(payload.id).then(function(response){
                getAllTerms();
                $scope.resetTermsForm();
            })
        }
        $scope.submitTermsForm = function(payload){
            if($scope.isTermsEdit){
                apiService.editTerms(payload).then(function(response){
                    getAllTerms();
                    $scope.resetTermsForm();
                })
            }else{
                apiService.addTerms(payload).then(function(response){
                    getAllTerms();
                    $scope.resetTermsForm();
                })
            }
        }
        $scope.resetFaqForm = function(){
            $scope.faqModel = {};
            $scope.isFaqEdit = false;
            $scope.addEditFaqForm.$setPristine();
        }
        $scope.resetTermsForm = function(){
            $scope.termsModel = {};
            $scope.isTermsEdit = false;
            $scope.addEditTermsForm.$setPristine();
        }
        init();
    })