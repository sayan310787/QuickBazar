angular.module('app.service')
    .factory('apiService', function($http, $window){
        var url = 'http://quickbazar.in/api/user/';
        //var url = './'; http://quickbazar.in/api/user/product/
        var successMessage = 'Operation Successful';
        var errorMessage = 'Error. Please try again';
        function login(payload){
            return $http.post(url+'login.php', payload).then(function (response) {
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function getAllCatalog(){
            return $http.get(url + 'category.php').then(function (response) {
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function editCatalog(payload){
            return $http.put(url + 'category.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function addCatalog(payload){
            return $http.post(url + 'category.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage};
            }).catch(function(error){
                return error;
            })
        }
        function deleteCatalog(catalogId){
            return $http.delete(url + 'category.php?id='+catalogId).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function getAllItems(catalogId){
            return $http.get(url + 'item.php?'+catalogId).then(function (response) {
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function editItem(payload){
            return $http.put(url + 'item.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function addItem(payload){
            return $http.post(url + 'item.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function deleteItem(itemId){
            return $http.delete(url + 'item.php?id='+itemId).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function getAllUser(){
            return $http.get(url + 'user.php').then(function(response){
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function getUser(userId){
            return $http.get(url + 'user.php'+userId).then(function(response){
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function addUser(payload){
            return $http.post(url + 'user.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function editUser(payload){
            return $http.put(url + 'user.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function deleteUser(userId){
            return $http.delete(url + 'user.php?id='+userId).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function uploadImage(divId, fromOffer){
            var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
            var uploadLink;
            var sFileName = $("#"+divId).val();
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        var filesSelected = document.getElementById(divId).files;
                        if (filesSelected.length > 0) {
                            var fileToLoad = filesSelected[0];
                            var fileName = filesSelected[0].name;
                            var fileReader = new FileReader();
                                var fd = new FormData();
                                fd.append('image', fileToLoad);
                            if(fromOffer){
                                uploadLink = 'uploadbanner.php';
                            }else {
                                uploadLink = 'upload.php';
                            }
                                return $http.post(url + uploadLink, fd,
                                    {
                                        transformResponse: function (data, headersGetter, status) {
                                            return data
                                        }, headers: {'Content-Type': undefined}
                                    }).then(function (response) {
                                        var attachmentId = JSON.parse(response.data);
                                        if (attachmentId && attachmentId.status !== 200) {
                                            return attachmentId;
                                        } else {
                                            return '';
                                        }
                                    }).catch(function (error) {
                                        return '';
                                    });
                        }
                    }
                }
                if (!blnValid) {
                    return false;
                }
            }
        }
        function getImage(imageId){
            return $http.get(url + 'image.php'+ imageId, {responseType: "arraybuffer"}).then(function(data){
            return $window.URL.createObjectURL(new Blob([data.data], {type: 'image/png'}));
        }).catch(function(error){
                return error;
            });
        }
        function getAllOrders(){
            return $http.get(url + 'orders.php').then(function (response) {
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function orderUpdate(payload){
            return $http.put(url + 'orders.php', payload).then(function (response) {
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function getAllOffer(){
            return $http.get(url + 'offer.php').then(function (response) {
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function editOffer(payload){
            return $http.put(url + 'offer.php', payload).then(function (response) {
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function addOffer(payload){
            return $http.post(url + 'offer.php', payload).then(function (response) {
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function deleteOffer(offerId){
            return $http.delete(url + 'offer.php?id='+offerId).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function getPinCodes(){
            return $http.get(url + 'pincode.php').then(function(response){
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function addPinCode(payload){
            return $http.post(url + 'pincode.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function deletePinCode(pinCodeId){
            return $http.delete(url + 'pincode.php?id='+pinCodeId).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }
        function getDayLimit(){
            return $http.get(url + 'dayLimit.php').then(function(response){
                return response.data;
            }).catch(function(error){
                return error;
            })
        }
        function updateDailyLimit(payload){
            return $http.put(url + 'dayLimit.php', payload).then(function(response){
                return {data: response.data, messageSuccess: successMessage, messageError: errorMessage};
            }).catch(function(error){
                return error;
            })
        }

        return {
            login: login,
            getAllCatalog: getAllCatalog,
            editCatalog: editCatalog,
            addCatalog: addCatalog,
            deleteCatalog: deleteCatalog,
            getAllItems: getAllItems,
            editItem: editItem,
            addItem: addItem,
            deleteItem: deleteItem,
            getAllUser: getAllUser,
            getUser: getUser,
            addUser: addUser,
            editUser: editUser,
            deleteUser: deleteUser,
            editItem: editItem,
            getImage: getImage,
            uploadImage: uploadImage,
            getAllOrders: getAllOrders,
            orderUpdate: orderUpdate,
            getAllOffer: getAllOffer,
            editOffer: editOffer,
            addOffer: addOffer,
            deleteOffer: deleteOffer,
            getPinCodes: getPinCodes,
            addPinCode: addPinCode,
            deletePinCode: deletePinCode,
            getDayLimit:getDayLimit,
            updateDailyLimit: updateDailyLimit
        }
    })