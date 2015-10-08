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
            console.info("scope", initVars());
            $routeProvider.
                when('/posts', {
                    controller: 'RestWordpressPostsCtrl',
                    templateUrl: initVars().wpPartials+'partials/posts.html'
                }).
                when('/posts/:id', {
                    controller: 'RestWordpressPostCtrl',
                    templateUrl: initVars().wpPartials+'partials/posts-detail.html'
                }).
                when('/pages', {
                    controller: 'RestWordpressPagesCtrl',
                    templateUrl: initVars().wpPartials+'partials/pages.html'
                }).
                when('/pages/:id', {
                    controller: 'RestWordpressPageCtrl',
                    templateUrl: initVars().wpPartials+'partials/pages-detail.html'
                }).
                when('/category/:id', {
                    controller: 'RestWordpressGaleriesCtrl',
                    templateUrl: initVars().wpPartials+'partials/galeries.html'
                }).
                when('/youtube/:id', {
                    controller: 'RestWordpressVideosCtrl',
                    templateUrl: initVars().wpPartials+'partials/videos.html'
                }).
                when('/facebook/:id/:api', {
                    controller: 'FacebookFeedCtrl',
                    templateUrl: initVars().wpPartials+'partials/facebook-feed.html'
                }).
                otherwise({
                    controller: 'RestWordpressPagesCtrl',
                    templateUrl: initVars().wpPartials+'partials/pages.html'
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
    ['$scope', '$mdSidenav', '$location', '$mdBottomSheet', '$window', '$mdDialog', '$mdMedia', '$log',
     function($scope, $mdSidenav, $location, $mdBottomSheet, $window, $mdDialog, $mdMedia, $log){
        /**
         * wath media for adaptive render
         */
        $scope.$watch(function() { return $mdMedia('sm'); }, function(small) {
            $scope.screenIsSmall = small;
        });

        /**
         * store customizer in scope
         * and filter empty url
         */
        $scope.customizer = initVars();
        $scope.customizer.wpCarousel = _.filter($scope.customizer.wpCarousel, function(n) {
        return n.url.length > 0});
         $log.info($scope.customizer);

        /**
         * internal properties
         */
        $scope.wpFacebookFeedId = wpFacebookFeedId;
         if($scope.wpFacebookFeedId === '') $scope.wpFacebookFeedId = undefined;

        if($scope.working === undefined) $scope.working = {};
        $scope.menuId = "left";

        /**
         * toggle navbar
         * @param menuId
         */
        $scope.facebook = function(ev) {
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
            if(target != undefined) {
                $location.path(target);
            }
        }

        /**
         * carousel configuration
         */
        $scope.isActive = function(index) {
            if(index === 0) return 'active';
        }
    }])
    /**
     * menu controller
     */
    .controller('RestWordpressLoadMenuCtrl',
    ['$scope', 'RestWordpressMenus', 'RestWordpressMenusTransform', '$log', '$document', '$mdMenu', function($scope, menuServices, services, $log, $document, $mdMenu){
        /**
         * get configured menu
         */
        $scope.working.menu = {};
        menuServices.menus({}, function(menus) {
            /**
             * check it one menu
             */
            if(menus != undefined && menus[0] != undefined) {
                $scope.wdMenuId = menus[0].ID;
                menuServices.menu({id:$scope.wdMenuId}, function(data) {
                    $scope.working.menu = services.transform(data);
                }, function(failure) {
                    console.error("menu", failure);
                });
            }
        });

        /**
         * open menu handler
         */
        $scope.openMenu = function(item, $event, $mdOpenMenu) {
            $mdOpenMenu($event);
        }
        /**
         * close menu handler
         */
        $scope.closeMenu = function(item, $element) {
            $mdMenu.hide($element);
        }
    }])
    /**
     * menu controller
     */
    .controller('MenuWrapperCtrl',
    ['$scope', '$log', function($scope, $log){
        /**
         * menu wrapper
         */
        $scope.toggle = function(wrapperId) {
            var wrap = $(wrapperId);

            wrap.on("scroll", function(e) {

              if (this.scrollTop > 147) {
                wrap.addClass("fix-search");
                $log.info("add");
              } else {
                wrap.removeClass("fix-search");
                $log.info("remove");
              }

            });
        }
    }])
    /**
     * posts controller
     */
    .controller('RestWordpressPostsCtrl',
    ['$scope', '$mdToast', 'postServices', function($scope, $mdToast, postServices){
        /**
         * load posts in scope
         */
        postServices.posts().then(
            function(data) {
                $scope.working.posts = data;
            }
        );

        /**
         * select a single ne page and route browser on it
         */
        $scope.select = function(post) {
            postServices.post().then(
                function(data) {
                    $scope.location("/posts/" + post.id);
                }
            );
        }
    }])
    /**
     * pages controller
     */
    .controller('RestWordpressPagesCtrl',
    ['$scope', '$mdToast', '$location', 'pageServices', function($scope, $mdToast, $location, pageServices){
        /**
         * init pages
         */
        pageServices.pages().then(function(data) {
            $scope.working.pages = data;
        });

        /**
         * select a single ne page and route browser on it
         */
        $scope.select = function(page) {
            pageServices.page(page).then(function(data) {
                $scope.location("/pages/" + page.ID);
            });
        }
    }])
    /**
     * posts controller
     */
    .controller('RestWordpressPostCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'postServices',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, postServices){
        postServices.post({id:$routeParams.id}).then(function(data) {
            $scope.working.post = data;
        });
    }])
    /**
     * pages controller
     */
    .controller('RestWordpressPageCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'pageServices',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, pageServices){
        pageServices.page({id:$routeParams.id}).then(function(data) {
            $scope.working.page = data;
        });
    }])
    /**
     * categories controller
     */
    .controller('RestWordpressGaleriesCtrl',
    ['$scope', '$routeParams', 'postServices', function($scope, $routeParams, postServices){
        postServices.category({id:$routeParams.id}).then(function(data) {
            $scope.working.tiles = data;
        });
    }])
    /**
     * videos controller
     */
    .controller('RestWordpressVideosCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', 'pageServices', '$sce',
        function($scope, $mdSidenav, $routeParams, $mdToast, pageServices, $sce){
        pageServices.youtube({id:$routeParams.id}).then(function(data) {
            $scope.working.videos = data;
        });
    }])
    .controller('RestWordpressVideosTrustedCtrl',
    ['$scope', '$sce', function($scope, $sce){
        $scope.videoUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.video.id);
    }])
    .controller('FacebookFeedCtrl',
    ['$scope', '$routeParams', 'facebookService', function($scope, $routeParams, facebookService){
        facebookService.submit(
            wordpressFacebookAppId,
            function(args) {
            facebookService.api(args)
                .then(function(response) {
                    $scope.facebook.feeds = response;
                },
                function(failure) {
                    console.error(failure);
                }
                )
            },
            {
                id:$routeParams.id,
                api:$routeParams.api,
                filter:"?fields=message,from,link"
            }
        );
    }])
    .controller('FacebookPictureCtrl',
    ['$scope', '$routeParams', 'facebookService', function($scope, $routeParams, facebookService){
        facebookService.submit(
            wordpressFacebookAppId,
            function(args) {
            facebookService.api(args)
                .then(function(response) {
                    $scope.post.picture = response;
                },
                function(failure) {
                    console.error(failure);
                }
                )
            },
            {
                id:$scope.post.from.id,
                api:'picture'
            }
        );
    }])
;
