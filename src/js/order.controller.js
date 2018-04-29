angular.module('app.controllers')
    .controller('orderController', function($scope, $state, $filter, apiService, appService, $timeout, $mdToast) {
        function init(){
            $scope.currentPage = 0;
            $scope.pageSize = 5;
            $scope.allOrders = [];
            $scope.orderLoading = false;
            $scope.orderModel = {};
            $scope.noOrderData = false;
            getAllOrders()
        }
        function getAllOrders(){
            $scope.orderLoading = true;
            apiService.getAllOrders().then(function(response) {
                if(response && response.length > 0 && response != 'null'){
                var data = []
                data = transformOrderData(response);
                //$scope.allOrders = Object.values($scope.allOrders)
                $scope.allOrders = _.orderBy(data, ['id'], ['desc']);
                $scope.orderLoading = false;
                $scope.noOrderData = false;
            }else{
                    $scope.noOrderData = true;
                    $scope.orderLoading = false;
                    $scope.allOrders = [];
                }
            });
        }
        function transformOrderData(orderData){
            var transformedData = _(orderData).groupBy(function(o){
               return o.id;
           })
           .transform(function(result, value, key){
                    result[key] = manupulateData(value);
               }).value()
            return transformedData;
        }
        function manupulateData(data){
             var result = data[0];
            result.id = parseInt(result.id);
            result.order_date = new Date(result.order_date)
            result.products = data;
            result.isExpanded = false;
            return result;
        }
        $scope.showDetails = function(order){
            order.isExpanded = !order.isExpanded;
        }
        $scope.orderUpdate = function(payload, action){
            var modifiedPayload = {};
              modifiedPayload.id = payload.id;
            if(action == 'accept'){
                modifiedPayload.status = '1';
            }else{
                modifiedPayload.status = '2';
            }
            apiService.orderUpdate(modifiedPayload).then(function(data){
                getAllOrders();
            })
        }
        init();
        $scope.viewOrder = function (order) {
            $scope.orderModel = order;
        }
        $scope.savePdf = function(order) {
            $scope.orderModel = order;
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Please wait while PDF gets generated')
                    .position('top right')
                    .hideDelay(3000)
                    .theme("success-toast")
            );
            $timeout(function(){
                var pdf = new jsPDF('p', 'pt', 'letter');
                var canvas = pdf.canvas
                canvas.height = 72 * 15;
                canvas.width = 72 * 15;
                var html = $("#PdfDiv").html();
                var options = {
                    pagesplit: true
                };
                html2pdf(html, pdf, function(pdf) {
                    pdf.autoPrint();
                    window.open(pdf.output('bloburl'), '_blank');
                    //pdf.save('OrderDetails.pdf');
                });
            }, 5000);
        }
        $scope.refreshContent = function(){
            getAllOrders();
        }
        $scope.numberOfUserPages = function(){
            return Math.ceil($scope.getOrderData().length/$scope.pageSize);
        }
        $scope.getOrderData = function () {
            return $filter('filter')($scope.allOrders, $scope.searchText)
        }
    });