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
                    templateUrl: wordpressPartialsUrl+'partials/posts.html'
                }).
                when('/posts/:id', {
                    controller: 'RestWordpressPostCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/posts-detail.html'
                }).
                when('/pages', {
                    controller: 'RestWordpressPagesCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/pages.html'
                }).
                when('/pages/:id', {
                    controller: 'RestWordpressPageCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/pages-detail.html'
                }).
                when('/category/:id', {
                    controller: 'RestWordpressGaleriesCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/galeries.html'
                }).
                when('/youtube/:id', {
                    controller: 'RestWordpressVideosCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/videos.html'
                }).
                when('/facebook/:id/:api', {
                    controller: 'FacebookFeedCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/facebook-feed.html'
                }).
                otherwise({
                    controller: 'RestWordpressPagesCtrl',
                    templateUrl: wordpressPartialsUrl+'partials/pages.html'
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
    ['$scope', '$mdSidenav', '$location', '$mdBottomSheet', '$window', '$mdDialog', '$mdMedia',
     function($scope, $mdSidenav, $location, $mdBottomSheet, $window, $mdDialog, $mdMedia){
        /**
         * initialize configuration
         */
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: true,
            right: false
        }

        /**
         * wath media
         */
        $scope.$watch(function() { return $mdMedia('sm'); }, function(small) {
            $scope.screenIsSmall = small;
        });

        /**
         * store customizer in scope
         */
        $scope.customizer = initVars();

        /**
         * internal properties
         */
        $scope.wpFacebookFeedId = wpFacebookFeedId;
         if($scope.wpFacebookFeedId === '') $scope.wpFacebookFeedId = undefined;

        if($scope.working === undefined) $scope.working = {};
        $scope.menuId = "left";

        /**
         * find toast position
         */
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        }

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
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'RestWordpressPosts',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, postServices){
        postServices.post({id:$routeParams.id}, function(data) {
            /**
             * replace HTML entities
             * TODO: replace it with a central service
             */
            if(data) data.title = data.title.replace('<br>',' ');
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
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'RestWordpressPages',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, pageServices){
        pageServices.page({id:$routeParams.id}, function(data) {
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
            /**
             * replace HTML entities
             * TODO: replace it with a central service
             */
            for(var tile=0;tile<data.length;tile++) {
                if(data) data[tile].title = data[tile].title.replace('<br>',' ');
                if(data) data[tile].title = data[tile].title.replace('&#8211;',' ');
            }
            $scope.working.tiles = data;
            $mdToast.show(
                $mdToast.simple()
                    .content(data.length + " Article(s)")
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
     * videos controller
     */
    .controller('RestWordpressVideosCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', 'RestWordpressPages', '$sce',
        function($scope, $mdSidenav, $routeParams, $mdToast, pageServices, $sce){
        pageServices.page({id:$routeParams.id}, function(data) {
            function plainText(text) {
              return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
            };
            var text = plainText(data.content);
            $scope.working.videos = JSON.parse(text);
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
