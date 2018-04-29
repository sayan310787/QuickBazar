angular.module('app.core')
    .run(function ($rootScope, $location, appService, $state) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if(toState.authentication){
                if(!appService.getAuthentication()){
                    event.preventDefault();
                    $state.go('login');
                  }else{
                    if(!appService.getLoggedInUser() && toState.url != '/orders'){
                        event.preventDefault();
                        $state.go('home.orders');
                    }
                }
            }
            if(toState.url == '/login'){
                if(appService.getAuthentication()){
                    if(fromState.name != "") {
                        event.preventDefault();
                        $state.go(fromState.name)
                    }
                }
            }
        })
    })

.config(function($stateProvider, $urlRouterProvider)
{
    $stateProvider
        .state('login',{
            url: "/login",
            views: {
                "main" : {templateUrl: 'src/view/login.html', controller: 'loginController'},
                "footer": {templateUrl: 'src/view/footer.html'}
            }
        })
        .state('home',{
            url: "/home",
            views: {
                "header": {templateUrl: 'src/view/header.html', controller: 'headerController'},
                "main" : {templateUrl: 'src/view/home.html'},
                "footer": {templateUrl: 'src/view/footer.html'}
            },
            authentication: true
        })
        .state('home.productCatalog',{
            url: "/productCatalog",
            views: {
              "body":{templateUrl: 'src/view/productCatalog.html', controller: 'productCatalogController'}
            },
            authentication: true
        })
        .state('home.catalogItems',{
            url: "/catalogItems?catId",
            views: {
               "body":{templateUrl: 'src/view/itemCatalog.html', controller: 'catalogItemsController'}
            },
            authentication: true
        })
        .state('home.customerManagement',{
            url: "/customerManagement",
            views: {
                "body":{templateUrl: 'src/view/customerManagement.html', controller: 'customerManagementController'}
            },
            authentication: true
        })
        .state('home.offers',{
            url: "/offers",
            views: {
                "body":{templateUrl: 'src/view/offers.html', controller: 'offersController'}
            },
            authentication: true
        })
        .state('home.orders',{
            url: "/orders",
            views: {
                "body":{templateUrl: 'src/view/order.html', controller: 'orderController'}
            },
            resolve:{

            },
            authentication: true
        })
        .state('home.settingsUpdate',{
            url: "/settings-update",
            views: {
                "body":{templateUrl: 'src/view/settingsUpdate.html', controller: 'settingsUpdateController'}
            },
            authentication: true
        })
    $urlRouterProvider.otherwise('login');
});