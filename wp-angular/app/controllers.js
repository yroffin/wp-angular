/*
 * Copyright 2015 Yannick Roffin.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* Controllers */

angular.module('RestWordpressApp',['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngSanitize', 'RestWordpressApp.services'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider.
                when('/posts', {
                    controller: 'RestWordpressPostsCtrl',
                    templateUrl: 'partials/posts.html'
                }).
                when('/posts/:id', {
                    controller: 'RestWordpressPostCtrl',
                    templateUrl: 'partials/posts-detail.html'
                }).
                when('/pages', {
                    controller: 'RestWordpressPagesCtrl',
                    templateUrl: 'partials/pages.html'
                }).
                when('/pages/:id', {
                    controller: 'RestWordpressPageCtrl',
                    templateUrl: 'partials/pages-detail.html'
                }).
                when('/galeries/:id', {
                    controller: 'RestWordpressGaleriesCtrl',
                    templateUrl: 'partials/galeries.html'
                }).
                otherwise({
                    controller: 'RestWordpressPageCtrl',
                    templateUrl: 'partials/pages-detail.html'
                });
        }])
    .config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default': '400', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
                .accentPalette('orange', {
                'default': '200' // use shade 200 for default, and keep all other shades the same
            });
    })
    /**
     * main controller
     */
    .controller('RestWordpressCtrl',
    ['$scope', '$mdSidenav', '$location', '$mdBottomSheet', function($scope, $mdSidenav, $location, $mdBottomSheet){
        /**
         * initialize configuration
         */
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: true,
            right: false
        }

        $scope.menubar = __menubar;

        $scope.working = {};
        $scope.menuId = "left";

        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        }

        /**
         * toggle navbar
         * @param menuId
         */
        $scope.toggleSideNav = function() {
            $mdSidenav($scope.menuId).toggle();
        }

        /**
         * load configuration
         */
        $scope.location = function(target) {
            $mdSidenav($scope.menuId).close();
            $location.path(target);
        }
    }])
    /**
     * posts controller
     */
    .controller('RestWordpressPostsCtrl',
    ['$scope', '$mdToast', 'RestWordpressPosts', function($scope, $mdToast, postServices){
        postServices.posts({}, function(data) {
            $scope.working.posts = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.length + " post(s)")
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }, function(failure) {
            $mdToast.show(
                $mdToast.simple()
                    .content(failure)
                    .position($scope.getToastPosition())
                    .hideDelay(3000).theme("failure-toast")
            );
        });

                /**
         * select a single ne page and route browser on it
         */
        $scope.select = function(post) {
            postServices.post({id:post.ID}, function(data) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(post.title)
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
                $scope.location("/posts/" + post.ID);
            }, function(failure) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(failure)
                        .position($scope.getToastPosition())
                        .hideDelay(3000).theme("failure-toast")
                );
            });
        }
    }])
    /**
     * pages controller
     */
    .controller('RestWordpressPagesCtrl',
    ['$scope', '$mdToast', '$location', 'RestWordpressPages', function($scope, $mdToast, $location, pageServices){
        /**
         * init pages
         */
        pageServices.pages({}, function(data) {
            $scope.working.pages = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.length + " pages(s)")
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }, function(failure) {
            $mdToast.show(
                $mdToast.simple()
                    .content(failure)
                    .position($scope.getToastPosition())
                    .hideDelay(3000).theme("failure-toast")
            );
        });

        /**
         * select a single ne page and route browser on it
         */
        $scope.select = function(page) {
            pageServices.page({id:page.ID}, function(data) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(page.title)
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
                $scope.location("/pages/" + page.ID);
            }, function(failure) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(failure)
                        .position($scope.getToastPosition())
                        .hideDelay(3000).theme("failure-toast")
                );
            });
        }
    }])
    /**
     * posts controller
     */
    .controller('RestWordpressPostCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'RestWordpressPosts', function($scope, $mdSidenav, $routeParams, $mdToast, $location, postServices){
        postServices.post({id:$routeParams.id}, function(data) {
            $scope.working.post = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.title)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }, function(failure) {
            $mdToast.show(
                $mdToast.simple()
                    .content(failure)
                    .position($scope.getToastPosition())
                    .hideDelay(3000).theme("failure-toast")
            );
        });
    }])
    /**
     * pages controller
     */
    .controller('RestWordpressPageCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'RestWordpressPages', function($scope, $mdSidenav, $routeParams, $mdToast, $location, pageServices){
        var id = 444;
        if($routeParams.id != undefined) {
            id = $routeParams.id;
        }
        pageServices.page({id:id}, function(data) {
            $scope.working.page = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.title)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }, function(failure) {
            $mdToast.show(
                $mdToast.simple()
                    .content(failure)
                    .position($scope.getToastPosition())
                    .hideDelay(3000).theme("failure-toast")
            );
        });
    }])
    /**
     * categories controller
     */
    .controller('RestWordpressGaleriesCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'RestWordpressPosts', function($scope, $mdSidenav, $routeParams, $mdToast, $location, postServices){
        postServices.byCategory({id:$routeParams.id}, function(data) {
            $scope.working.tiles = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.length + " Pin(s)")
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }, function(failure) {
            $mdToast.show(
                $mdToast.simple()
                    .content(failure)
                    .position($scope.getToastPosition())
                    .hideDelay(3000).theme("failure-toast")
            );
        });
    }])
;
