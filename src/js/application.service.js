angular.module('app.core')
    .factory('appService', function($cookies){
        var catData = [];
        var url = 'http://quickbazar.in/api/user/';
        function getAuthentication(){
            var status = $cookies.get('auth');
            if(status){
                return true;
            }else{
                return false;
            }
        }
        function getLoggedInUser(){
            var user = $cookies.get('userId');
            if(user === 'master@admin')
            return true;
            else
            return false;
        }
        function getCredentials(){
            var cred = {}
            cred = $cookies.get('pass');
            //cred.userName = $cookies.get('userId');
            return cred;
        }
        function setCatData(data){
            catData = data;
        }
        function getCatData(){
            return catData;
        }
        function getImageStaticLink(){
            return 'http://quickbazar.in/api/uploads/product/';
        }

        return{
            getAuthentication: getAuthentication,
            getCredentials: getCredentials,
            setCatData: setCatData,
            getCatData: getCatData,
            getImageStaticLink: getImageStaticLink,
            getLoggedInUser: getLoggedInUser
        }
    });