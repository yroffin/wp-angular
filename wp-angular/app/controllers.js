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

angular.module('RestWordpressApp',[
    'ngMaterial',
    'ngMdIcons',
    'ngRoute',
    'ngSanitize',
    'angular-google-analytics',
    'RestWordpressApp.services',
    'wpDirective.services'
])
    .config(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(initVars().properties.wpGaKey);
    })
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider.
                when('/posts', {
                    controller: 'wpPostsCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/posts.html'
                });
            $routeProvider.
                when('/posts/:id', {
                    controller: 'wpPostCtrl',
                    template: '<default-post />'
                }).
                when('/pages', {
                    controller: 'wpPagesCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/pages.html'
                }).
                when('/pages/:id', {
                    controller: 'wpPageCtrl',
                    template: '<default-page />'
                }).
                when('/categories', {
                    controller: 'wpCategoriesCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/categories.html'
                }).
                when('/categories/:slug', {
                    controller: 'wpGaleriesCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/galeries.html'
                }).
                when('/youtube/:id', {
                    controller: 'wpVideosCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/videos.html'
                }).
                when('/medias', {
                    controller: 'wpMediasCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/medias.html'
                }).
                when('/medias/:id', {
                    controller: 'wpMediasDetailCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/photos.html'
                }).
                when('/slides', {
                    controller: 'wpCategoriesCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/slides.html'
                }).
                when('/slides/:slug', {
                    controller: 'wpSliderCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/animated-slides.html'
                }).
                when('/facebook/:id/:api', {
                    controller: 'FacebookFeedCtrl',
                    template: '<facebook-feed />'
                }).
                otherwise({
                    controller: 'wpHomeCtrl',
                    templateUrl: initVars().wpTemplateDirectoryUri+'/partials/home.html'
                });
        }])
    .config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider
            .theme('default')
            .primaryPalette('grey', {
                'default': '400', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
                .accentPalette('orange', {
                'default': '200' // use shade 200 for default, and keep all other shades the same
            });
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider
            .theme('warn')
            .primaryPalette('red', {
                'default': '500',
                'hue-1': '300',
                'hue-2': '800',
                'hue-3': 'A100'
            });
    })
    /**
     * main controller
     */
    .controller('wpMainCtrl',
    ['$scope', '$mdSidenav', '$location', '$mdBottomSheet', '$window', '$mdDialog', '$mdMedia', '$log', 'Analytics',
     function($scope, $mdSidenav, $location, $mdBottomSheet, $window, $mdDialog, $mdMedia, $log, Analytics){
        /**
         * wath media for adaptive render
         */
        $scope.$watch(function() {
            return $mdMedia('(max-width: 768px)');
        }, function(small) {
            $scope.screenIsSmall = small;
        });

        /**
         * store wpVars in scope
         * and filter empty url
         */
        $scope.wpVars = initVars();
        $scope.wpVars.wpCarousel = _.filter($scope.wpVars.wpCarousel, function(n) {
            return n.url != undefined && n.url.length > 0
        });

        /**
        * specific transformation for home tile
        */
        $scope.wpTiles = [];
        try {
            if($scope.wpVars.properties.wpTile01Active == 1) {
                $scope.wpTiles.push(angular.fromJson(initVarsInstance.properties.wpTile01Data));
            }
            if($scope.wpVars.properties.wpTile02Active == 1) {
                $scope.wpTiles.push(angular.fromJson(initVarsInstance.properties.wpTile02Data));
            }
            if($scope.wpVars.properties.wpTile03Active == 1) {
                $scope.wpTiles.push(angular.fromJson(initVarsInstance.properties.wpTile03Data));
            }
            if($scope.wpVars.properties.wpTile04Active == 1) {
                $scope.wpTiles.push(angular.fromJson(initVarsInstance.properties.wpTile04Data));
            }
            if($scope.wpVars.properties.wpTile05Active == 1) {
                $scope.wpTiles.push(angular.fromJson(initVarsInstance.properties.wpTile05Data));
            }
        } catch(e) {
            $log.warn("$scope.wpTiles: ", e);
        }

        $log.info("wpVars: ", $scope.wpVars);
        $log.info("wpTiles: ", $scope.wpTiles);

        if($scope.working === undefined) $scope.working = {};

        /**
         * breadcrumbs
         */
        $scope.breadcrumb = {};
        $scope.breadcrumb.breadcrumbs = [];

        /**
         * fix posts breadcrumb
         */
        $scope.breadcrumb.posts = function(detail) {
            $scope.breadcrumb.active = true;
            if(detail == undefined) {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/posts', 'name':'article(s)'}
                ];
            } else {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/posts', 'name':'article(s)'},
                    {'location':'#/posts/' + detail.id, 'name':detail.title}
                ];
            }
        }
        /**
         * fix pages breadcrumb
         */
        $scope.breadcrumb.pages = function(detail) {
            $scope.breadcrumb.active = true;
            if(detail == undefined) {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/pages', 'name':'page(s)'}
                ];
            } else {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/pages', 'name':'page(s)'},
                    {'location':'#/pages/' + detail.id, 'name':detail.title}
                ];
            }
        }
        /**
         * fix category breadcrumb
         */
        $scope.breadcrumb.categories = function(detail) {
            $scope.breadcrumb.active = true;
            if(detail === undefined) {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/categories', 'name':'categorie(s)'}
                ];
            } else {
                $scope.breadcrumb.breadcrumbs = [
                    {'location':'#/categories', 'name':'categorie(s)'},
                    {'location':'#/categories/' + detail.slug, 'name':detail.name},
                    {'location':'#/slides/' + detail.slug, 'name':detail.name + ' (slide)'}
                ];
            }
        }

        /**
         * empty bread crumb
         */
        $scope.breadcrumb.empty = function() {
                $scope.breadcrumb.active = false;
        }

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
        $scope.showCarousel = function(showIt) {
            $scope.carouselIsVisible = showIt;
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
    .controller('wpLoadMenuCtrl',
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
              } else {
                wrap.removeClass("fix-search");
              }

            });
        }
    }])
    /**
     * home controller
     */
    .controller('wpHomeCtrl',
    ['$scope', '$log', 'pageServices', function($scope, $log, pageServices) {
        $scope.showCarousel(true);
        $scope.breadcrumb.empty();
        /**
         * set up tile
         */
        $scope.home = {};
        $scope.home.tiles = [];
        _.each($scope.wpTiles, function(item) {
            $log.info("Tile:", item);
            $scope.home.tiles.push(item);
        });
    }])
    /**
     * posts controller
     */
    .controller('wpPostsCtrl',
    ['$scope', '$mdToast', 'postServices', function($scope, $mdToast, postServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.posts();

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
    .controller('wpCategoriesCtrl',
    ['$scope', '$mdToast', '$location', 'categoryServices', function($scope, $mdToast, $location, categoryServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.categories();
        /**
         * init categories
         */
        categoryServices.categories().then(function(cat) {
            $scope.working.categories = cat;
        });
    }])
    /**
     * pages controller
     */
    .controller('wpPagesCtrl',
    ['$scope', '$mdToast', '$location', 'pageServices', function($scope, $mdToast, $location, pageServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.pages();
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
    .controller('wpPostCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'postServices',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, postServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.posts();
    }])
    /**
     * pages controller
     */
    .controller('wpPageCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', '$location', 'pageServices',
        function($scope, $mdSidenav, $routeParams, $mdToast, $location, pageServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.pages();
    }])
    /**
     * categories controller
     */
    .controller('wpGaleriesCtrl',
    ['$scope', '$routeParams', 'postServices', '$log', function($scope, $routeParams, postServices, $log){
        $scope.showCarousel(false);
        $scope.breadcrumb.categories();
        postServices.categoryBySlug({slug:$routeParams.slug}).then(function(data) {
            $scope.working.galery = {};
            $scope.working.galery.category = data.cat;
            $scope.breadcrumb.categories(data.cat);
            $scope.working.galery.posts = data.posts;
        });
    }])
    /**
     * slider controller
     */
    .controller('wpSliderCtrl',
    ['$scope', '$log', '$routeParams', '$timeout', 'postServices', function($scope, $log, $routeParams, $timeout, postServices){
        $scope.showCarousel(false);
        $scope.breadcrumb.categories();
        /**
         * next slide animation
         */
        $scope.nextSlide = function() {
            $scope.working.slideActive = true;
            var idx = _.findIndex($scope.working.slide.slides, 'selected', true);
            var newIdx = idx+1;
            if(newIdx>=$scope.working.slide.slides.length) {
                newIdx = 0;
            }
            $scope.working.slide.slides[newIdx].selected = true;
            $scope.working.slide.slides[idx].selected = false;
            $timeout($scope.nextSlide, 10000);
        }
        /**
         * init slides
         */
        $scope.loadSlides = function(slug) {
            postServices.categoryBySlug({slug:slug}).then(function(data) {
                $scope.working.slide = {};
                $scope.working.slide.category = data.cat;
                $scope.breadcrumb.categories(data.cat);
                $scope.working.slide.slides = data.posts;
                _.forEach(data.posts, function(item) {
                  item.selected = false;
                });
                _.last(data.posts).selected = true;
                /**
                 * activate slides
                 */
                if($scope.working.slideActive === undefined || $scope.working.slideActive === false) {
                    $scope.nextSlide();
                }
            });
        }
        /**
         * load from scope
         */
        var slides = $routeParams.slug;
        $scope.loadSlides(slides);
    }])
    /**
     * medias controller
     */
    .controller('wpMediasCtrl',
    ['$scope', '$log', '$mdDialog', 'mediaServices',
        function($scope, $log, $mdDialog, mediaServices){
            $scope.showCarousel(false);
            /**
             * pagination next
             */
            $scope.mediaNext = function(page) {
                if($scope.working.media != undefined) {
                    var page = $scope.working.media.pagination.active + 1;
                    if(page > $scope.working.media.pagination.totalPages) {
                        page = $scope.working.media.pagination.totalPages;
                    }
                }
                $scope.load(page);
            }
            /**
             * pagination prev
             */
            $scope.mediaPrev = function(page) {
                if($scope.working.media != undefined) {
                    var page = $scope.working.media.pagination.active - 1;
                    if(page < 1) {
                        page = 1;
                    }
                    $scope.load(page);
                }
            }
            /**
             * load
             */
            $scope.load = function(page) {
                /**
                 * load all medias and set pagination
                 */
                $log.info("Chargement page ", page)
                mediaServices.medias({page:page}).then(function(data) {
                    if($scope.working.media === undefined) {
                        $scope.working.media = {};
                    }
                    $scope.working.media.medias = data.medias;
                    $scope.working.media.pagination = data.pagination;
                });
            }
            $scope.mediaDialog = function(media) {
                $scope.mediaDialogData = {
                    media: media
                };
                $mdDialog.show({
                  scope: $scope,
                  preserveScope: true,
                  controller: 'wpMediaDialogCtrl',
                  templateUrl: initVars().wpPartials+'partials/dialog/media.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose:true
                })
                .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                  $scope.status = 'You cancelled the dialog.';
                });
            };
            /**
             * no scope then load page 1
             */
            if($scope.working.media === undefined) {
                $scope.load(1);
            }
    }])
    /**
     * medias controller
     */
    .controller('wpMediaDialogCtrl', ['$scope', '$log', 'mediaServices',
        function($scope, $log, mediaServices){
        $scope.media = $scope.mediaDialogData.media;
    }])
    /**
     * videos controller
     */
    .controller('wpVideosCtrl',
    ['$scope', '$mdSidenav', '$routeParams', '$mdToast', 'pageServices', '$sce',
        function($scope, $mdSidenav, $routeParams, $mdToast, pageServices, $sce){
        $scope.showCarousel(false);
        pageServices.youtube({id:$routeParams.id}).then(function(data) {
            $scope.working.videos = data;
        });
    }])
    .controller('wpVideosTrustedCtrl',
    ['$scope', '$sce', function($scope, $sce){
        $scope.videoUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+$scope.video.id);
    }])
    .controller('FacebookFeedCtrl',
    ['$scope', '$routeParams', 'facebookService', function($scope, $routeParams, facebookService){
        $scope.showCarousel(false);
        facebookService.submit(
            $scope.wpVars.properties.wpFacebookAppId,
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
            $scope.wpVars.properties.wpFacebookAppId,
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
