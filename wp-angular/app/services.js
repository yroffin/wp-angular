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

/* Services */

/**
 * wordpressRestApiUrl must contain a valid url rest api
 * - for main wp-json api
 * - and for menu extent
 */
var myAppServices = angular.module('RestWordpressApp.services', [ 'ngResource' ]);

/**
 * posts services
 */
myAppServices.factory('RestWordpressPosts', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get posts collection
			 */
			posts: {
				method: 'GET',
				url: wordpressRestApiUrl + '/posts',
				params: {},
				isArray: true,
				cache: false
			},
			/**
			 * get single post
			 */
			post: {
				method: 'GET',
				url: wordpressRestApiUrl + '/posts/:id',
				isArray: false,
				cache: false
			},
			/**
			 * get posts by category (collection)
			 */
			byCategory: {
				method: 'GET',
				url: wordpressRestApiUrl + '/posts&filter[category_name]=:id',
				isArray: true,
				cache: false
			}
		}
	)}]);

/**
 * pages services
 */
myAppServices.factory('RestWordpressPages', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get pages collection
			 */
			pages: {
				method: 'GET',
				url: wordpressRestApiUrl + '/pages',
				params: {},
				isArray: true,
				cache: false
			},
			/**
			 * get single page
			 */
			page: {
				method: 'GET',
				url: wordpressRestApiUrl + '/pages/:id',
				isArray: false,
				cache: false
			}
		}
	)}]);

/**
 * menu services
 * - url are cached
 */
myAppServices.factory('RestWordpressMenus', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get menus collection
			 */
			menus: {
				method: 'GET',
				url: wordpressRestApiUrl + '/menus',
				params: {},
				isArray: true,
				cache: true
			},
			/**
			 * get single menu
			 */
			menu: {
				method: 'GET',
				url: wordpressRestApiUrl + '/menus/:id',
				isArray: false,
				cache: true
			}
		}
	)}]);

/**
 * posts transformation
 */
myAppServices.factory('businessServices', ['$mdToast', '$log', 'RestWordpressPosts', function($mdToast, $log, wpPostServices) {
    /**
     * initialize configuration
     */
    return {
        /**
         * transform post
         */
        transformPost: function(post) {
            var data = {
                id: post.ID,
                content: post.content,
                title: post.title,
                date: post.date
            }
            if(post.featured_image && post.featured_image.guid) {
                data.featured_image = post.featured_image.guid;
            }
            /**
             * replace HTML entities
             * TODO: replace it with a central service
             */
            if(data) {
                data.title = data.title.replace('<br>',' ');
                data.title = data.title.replace('&#8211;',' ');
            }
            return data;
        },
        /**
         * transform page
         */
        transformPage: function(page) {
            var data = {
                id: page.ID,
                content: page.content,
                title: page.title,
                date: page.date
            }
            if(page.featured_image && page.featured_image.guid) {
                data.featured_image = page.featured_image.guid;
            }
            return data;
        },
        /**
         * toast position
         */
        getToastPosition : function() {
            var toastPosition = {
                bottom: false,
                top: true,
                left: true,
                right: false
            }
            return Object.keys(toastPosition).filter(function(pos) { return toastPosition[pos]; }).join(' ');
        },
        /**
         * toast ok
         */
        toastOk : function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(this.getToastPosition())
                    .hideDelay(3000)
            );
        },
        /**
         * toast failure
         */
        toastFailure : function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(this.getToastPosition())
                    .hideDelay(3000)
            ).theme("failure-toast")
        }
    }
}]);

/**
 * pages transformation
 */
myAppServices.factory('pageServices', ['$q', '$log', 'businessServices', 'RestWordpressPages', function($q, $log, businessServices, wpPageServices) {
    /**
     * initialize configuration
     */
    return {
        /**
         * retrieve normalized pages
         */
        pages: function() {
            var deferred = $q.defer();

            wpPageServices.pages({}, function(data) {
                /**
                 * normalize data
                 */
                var pages = [];
                _.forEach(data, function(n) {
                    pages.push(businessServices.transformPage(n));
                });
                deferred.resolve(pages);
                businessServices.toastOk(pages.length + " page(s)");
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized page
         */
        page: function(page) {
            var deferred = $q.defer();

            wpPageServices.page({id:page.id}, function(data) {
                /**
                 * normalize data
                 */
                deferred.resolve(businessServices.transformPage(data));
                businessServices.toastOk("Page " + data.title);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized page
         */
        youtube: function(page) {
            var deferred = $q.defer();

            wpPageServices.page({id:page.id}, function(data) {
                /**
                 * normalize data
                 */
                function plainText(text) {
                  return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
                };
                var text = plainText(data.content);
                var result = JSON.parse(text);
                deferred.resolve(result);
                $log.info("Vidéo(s)", result);
                businessServices.toastOk("Video(s) " + data.title);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        }
    }
}]);

/**
 * postServices
 */
myAppServices.factory('postServices', ['$mdToast', '$q', '$log', 'businessServices', 'RestWordpressPosts', function($mdToast, $q, $log, businessServices, wpPostServices) {
    /**
     * initialize configuration
     */
    return {
        /**
         * retrieve normalized posts
         */
        posts: function() {
            var deferred = $q.defer();

            wpPostServices.posts({}, function(data) {
                /**
                 * normalize data
                 */
                var posts = [];
                _.forEach(data, function(n) {
                    posts.push(businessServices.transformPost(n));
                });
                deferred.resolve(posts);
                businessServices.toastOk(posts.length + " article(s)");
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized post
         */
        post: function(post) {
            var deferred = $q.defer();

            wpPostServices.post({id:post.id}, function(data) {
                /**
                 * normalize data
                 */
                deferred.resolve(businessServices.transformPost(data));
                businessServices.toastOk("Article " + data.title);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized post
         */
        category: function(category) {
            var deferred = $q.defer();

            wpPostServices.byCategory({id:category.id}, function(data) {
                /**
                 * normalize data
                 */
                var posts = [];
                _.forEach(data, function(n) {
                    posts.push(businessServices.transformPost(n));
                });
                deferred.resolve(posts);
                businessServices.toastOk(posts.length + " article(s)");
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        }
    }
}]);

/**
 * menu transformation
 */
myAppServices.factory('RestWordpressMenusTransform', ['$log', function($log) {
  return {
      transform: function(rawMenu) {

         /**
          * extract category from url
          */
         function extract(url) {
             var index = url.lastIndexOf("category");
             var cat = '';
             for(index+=9;index < url.length && url[index] != '/';index++) {
                 cat += url[index];
             }
             return cat;
         }

         /**
          * menu transformation
          */
         function action(raw, attr) {
              if(raw.object === 'page' && attr != undefined && attr.type === 'youtube') {
                  return {
                      raw: raw,
                      location: '/youtube/' + raw.object_id
                  }
              }
              if(raw.object === 'page') {
                  return {
                      raw: raw,
                      location: '/pages/' + raw.object_id
                  }
              }
              if(raw.object === 'post') {
                  return {
                      raw: raw,
                      location: '/posts/' + raw.object_id
                  }
              }
              if(raw.object === 'category') {
                  return {
                      raw: raw,
                      location: '/category/' + extract(raw.url)
                  }
              }
              /**
               * ignore custom entry, only if not start with #
               */
              if(raw.object === 'custom') {
                  if(raw.url != undefined && raw.url.substring(0,1) === '#') {
                      return {
                          raw: raw,
                          location: raw.url.substring(1)
                      }
                  } else {
                      return {
                          raw: raw
                      }
                  }
              }
             throw {message: "No transformation", context: raw};
          }
          /**
           * parse attributes
           */
          function parse(attr) {
              if(attr === "") return {};
              var transformedString = attr.
                replace(/&nbsp;/g,"!x!").
                replace(/&laquo;/g,"!%!").
                replace(/&raquo;/g,"!%!").
                replace(/&lsquo;/g,"!%!").
                replace(/&rsquo;/g,"!%!").
                replace(/!x!/g, "").
                replace(/!%!/g, "\"") + "";
              try {
                  return JSON.parse(transformedString);
              } catch(e) {
                  throw {exception:e, raw: attr, transform: transformedString};
              }
          }

          var menu = [];
          var menuMap = {};
          /**
           * compute root level
           */
          for(var index=0;index < rawMenu.count;index++) {
              var item = rawMenu.items[index];
              if(item.parent === 0) {
                  /**
                   * store it in map
                   */
                  menuMap[item.ID] = {
                    id:item.ID,
                    name:item.title,
                    action: action(item, parse(item.attr)),
                    attr: parse(item.attr),
                    items:[]
                  };
                  /**
                   * and maintain collection view
                   */
                  menu.push(menuMap[item.ID]);
              }
          }
          /**
           * compute first level
           */
          for(var index=0;index < rawMenu.count;index++) {
              var item = rawMenu.items[index];
              if(item.parent != 0) {
                  menuMap[item.parent].items.push({
                    id:item.ID,
                    name:item.title,
                    attr: parse(item.attr),
                    action: action(item, parse(item.attr))
                  });
              }
          }
          return menu;
      }
  };
}]);

/**
 * facebook service
 */
myAppServices.factory('facebookService', function($q,$window,$rootScope) {
  return {
        submit: function(appId, callback, args) {
            /**
             * check authentification
             */
            if(!$rootScope.facebook) {
                $rootScope.facebook = {};
                /**
                 * init facebook api
                 */
                $window.fbAsyncInit = function() {
                    FB.init({
                      appId: appId,
                      status: true,
                      cookie: true,
                      xfbml: true,
                      version: 'v2.4'
                    });
                };
                fbAsyncInit();
                /**
                 * autologin
                 */
                FB.login(function(response) {
                   if (response.authResponse) {
                     FB.api('/me', function(response) {
                         $rootScope.facebook.me = response;
                         /**
                          * callback
                          */
                         callback(args);
                     });
                   } else {
                         console.error('User cancelled login or did not fully authorize.');
                   }
                 });
            } else {
                 /**
                  * callback
                  */
                callback(args);
            }
        },
        api: function(ctx) {
            var deferred = $q.defer();
            var filter = '';
            if(ctx.filter != undefined) filter = ctx.filter;
            FB.api('/'+ctx.id+'/'+ctx.api+filter, function(response) {
                if (!response || response.error) {
                    deferred.reject(response);
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
});
