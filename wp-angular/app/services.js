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
 * category services
 */
myAppServices.factory('wpCategoriesRest', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get categories collection
			 */
			categories: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/taxonomies/category/terms',
				params: {},
				isArray: true,
				cache: true
			},
			/**
			 * get single category
			 */
			category: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/taxonomies/category/terms/:id',
				isArray: false,
				cache: true
			}
    });
}]);

/**
 * category services
 */
myAppServices.factory('wpMediaRest', [ '$resource', function($resource) {
	return $resource('', {}, {
			/**
			 * get categories collection
			 */
			medias: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/media',
				params: {page: '@page'},
				isArray: true,
				cache: true
			},
			/**
			 * get single category
			 */
			media: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/media/:id',
				isArray: false,
				cache: true
			}
    });
}]);

/**
 * posts services
 */
myAppServices.factory('wpPostsRest', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get posts collection
			 */
			posts: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/posts',
				params: {},
				isArray: true,
				cache: true
			},
			/**
			 * get single post
			 */
			post: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/posts/:id',
				isArray: false,
				cache: true
			},
			/**
			 * get posts by category (collection)
			 */
			byCategoryName: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/posts&filter[category_name]=:name',
				isArray: true,
				cache: true
			},
			/**
			 * get posts by category (collection)
			 */
			byCategorySlug: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/posts&filter[category_name]=:slug',
				isArray: true,
				cache: true
			},
			/**
			 * get posts by category (collection)
			 */
			byCategoryId: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/posts&filter[category_id]=:id',
				isArray: true,
				cache: true
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
				url: wpVars.wpJsonRouteUrl + '/pages',
				params: {},
				isArray: true,
				cache: true
			},
			/**
			 * get single page
			 */
			page: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/pages/:id',
				isArray: false,
				cache: true
			}
		}
	)}]);

/**
 * menu services
 * - url are cached
 */
myAppServices.factory('RestWordpressMenus', [ '$resource', function($resource) {
	return $resource('', {}, {
			/**
			 * get menus collection
			 */
			menus: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/menus',
				params: {},
				isArray: true,
				cache: true
			},
			/**
			 * get single menu
			 */
			menu: {
				method: 'GET',
				url: wpVars.wpJsonRouteUrl + '/menus/:id',
				isArray: false,
				cache: true
			}
		}
	)}]);

/**
 * posts transformation
 */
myAppServices.factory('businessServices', ['$mdToast', '$log', 'wpPostsRest', function($mdToast, $log, wpPostServices) {
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
                date: post.date,
                category: post.terms.category
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
         * transform category
         */
        transformCategory: function(cat) {
            var data = {
                id: cat.ID,
                name: cat.name,
                slug: cat.slug,
                description: cat.description
            }
            return data;
        },
        /**
         * transform media
         */
        transformMedia: function(media) {
            var data = {
                id: media.ID,
                title: media.title,
                isImage: media.is_image,
                format: media.format,
                guid: media.guid,
                source: media.source,
                meta: media.attachment_meta
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
        toastOk : function(message, args) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(this.getToastPosition())
                    .hideDelay(3000)
            );
            $log.info(message, args);
        },
        /**
         * toast failure
         */
        toastFailure : function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(this.getToastPosition())
                    .hideDelay(6000)
                    .theme("warn")
            )
            $log.warn(message);
        }
    }
}]);

/**
 * pages transformation
 */
myAppServices.factory('mediaServices', ['$q', '$log', 'businessServices', 'wpMediaRest', function($q, $log, businessServices, wpMediaRest) {
    /**
     * initialize configuration
     */
    return {
        /**
         * retrieve normalized medias (collection)
         */
        medias: function(parameters) {
            var deferred = $q.defer();

            wpMediaRest.medias(parameters, function(data, responseHeaders) {
                /**
                 * normalize data
                 */
                var medias = [];
                _.forEach(data, function(n) {
                    medias.push(businessServices.transformMedia(n));
                });
                /**
                 * build page index
                 */
                var pagination = {
                        pages: [],
                        total: responseHeaders()['x-wp-total'],
                        totalPages: responseHeaders()['x-wp-totalpages']
                };
                for(var index = 1; index <= pagination.totalPages; index++) {
                    pagination.pages.push({index: index, active: index == parameters.page})
                    if(index == parameters.page) {
                        pagination.active = index;
                    }
                }
                deferred.resolve({
                    medias:medias,
                    pagination: pagination
                });
                businessServices.toastOk(medias.length + " media(s)", medias);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized media
         */
        media: function(media) {
            var deferred = $q.defer();

            wpMediaRest.media({id:media.id}, function(data) {
                /**
                 * normalize data
                 */
                var transformed = businessServices.transformMedia(data);
                deferred.resolve(transformed);
                businessServices.toastOk("Media " + transformed.title + " #" + transformed.id);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        }
    }
}]);

/**
 * pages transformation
 */
myAppServices.factory('categoryServices', ['$q', '$log', 'businessServices', 'wpCategoriesRest', function($q, $log, businessServices, wpCategoriesRest) {
    /**
     * initialize configuration
     */
    return {
        /**
         * retrieve normalized pages
         */
        categories: function() {
            var deferred = $q.defer();

            wpCategoriesRest.categories({}, function(data) {
                /**
                 * normalize data
                 */
                var categories = [];
                _.forEach(data, function(n) {
                    categories.push(businessServices.transformCategory(n));
                });
                deferred.resolve(categories);
                businessServices.toastOk(categories.length + " categorie(s)");
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized category
         */
        category: function(category) {
            var deferred = $q.defer();

            wpCategoriesRest.category({id:category.id}, function(data) {
                /**
                 * normalize data
                 */
                var transformed = businessServices.transformCategory(data);
                deferred.resolve(transformed);
                businessServices.toastOk("Categorie " + transformed.name + " #" + transformed.id);
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
        },
        /**
         * retrieve normalized category
         */
        categoryBySlug: function(parameter) {
            var deferred = $q.defer();

            wpCategoriesRest.categories({}, function(data) {
                /**
                 * filter it
                 */
                var cats = _.filter(data, function(cat) {
                    return cat.slug === parameter.slug;
                })
                if(cats === undefined) {
                    businessServices.toastFailure("Category " + parameter.slug + " inconnue");
                    deferred.reject("Category " + parameter.slug + " inconnue");
                }else {
                    /**
                     * normalize data
                     */
                    var transformed = businessServices.transformCategory(cats[0]);
                    deferred.resolve(transformed);
                    businessServices.toastOk("Categorie " + transformed.name + " #" + transformed.id);
                }
            }, function(failure) {
                businessServices.toastFailure(failure);
                deferred.reject(failure);
            });

            return deferred.promise;
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
myAppServices.factory('postServices', ['$mdToast', '$q', '$log', 'businessServices', 'wpPostsRest', 'categoryServices', function($mdToast, $q, $log, businessServices, wpPostsRest, categoryServices) {
    /**
     * initialize configuration
     */
    return {
        /**
         * retrieve normalized posts
         */
        posts: function() {
            var deferred = $q.defer();

            wpPostsRest.posts({}, function(data) {
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

            wpPostsRest.post({id:post.id}, function(data) {
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
         * retrieve normalized category, then its posts
         */
        categoryBySlug: function(parameter) {
            var deferred = $q.defer();

            categoryServices.categoryBySlug({slug:parameter.slug}).then(function(cat) {
                /**
                 * founded category
                 */
                wpPostsRest.byCategorySlug({slug:cat.slug}, function(data) {
                    /**
                     * normalize data
                     */
                    var posts = [];
                    _.forEach(data, function(n) {
                        posts.push(businessServices.transformPost(n));
                    });
                    deferred.resolve({cat:cat, posts:posts});
                    businessServices.toastOk(posts.length + " article(s)");
                }, function(failure) {
                    businessServices.toastFailure(failure);
                    deferred.reject(failure);
                });
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
                      location: '/categories/' + extract(raw.url)
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
           * compute all level in a single map
           */
          _.forEach(rawMenu.items, function(item, key) {
              /**
               * store it in map
               */
              menuMap[item.ID] = {
                id:item.ID,
                order:item.order,
                name:item.title,
                action: action(item, parse(item.attr)),
                attr: parse(item.attr),
                parent: item.parent,
                items:[]
              };
          });
          /**
           * compute all level
           */
          _.forEach(menuMap, function(item, key) {
              var parentId = item.id;
              item.items = _.sortBy(
                  _.filter(menuMap, function(element) {
                    return element.parent === parentId;
                  }), function(item) {
                      return item.order;
                  });
              if(item.parent === 0) {
                  menu.push(item);
              }
          });
          return _.sortBy(menu, function(item) {
              return item.order;
          });
      }
  };
}]);

/**
 * facebook service
 */
myAppServices.factory('facebookService', function($q, $window, $rootScope) {
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

/**
 * facebook service
 */
myAppServices.factory('wpDaemon', ['$timeout', '$log', function($timeout, $log) {
  var that = {
        activities: [],
        timeout: $timeout,
        started: false,
        /**
         * start method
         */
        start: function() {
            if(that.started) return;
            that.started = true;
            that.timeout(that.eachSecond, 1000);
            that.timeout(that.eachFiveSecond, 5000);
        },
        /**
         * runner
         */
        runner: function(score) {
            _.each(that.activities, function(context) {
                if(score === context.score) {
                    context.callback(context.data);
                }
            })
        },
        /**
         * eachSecond daemon
         */
        eachSecond: function() {
            that.runner(1000);
            that.timeout(that.eachSecond, 1000);
        },
        /**
         * eachSecond daemon
         */
        eachFiveSecond: function() {
            that.runner(5000);
            that.timeout(that.eachFiveSecond, 5000);
        },
        /**
         * submit a new callback
         */
        submit: function(score, ctx, callback) {
            that.activities.push({score: score, data:ctx, callback: callback});
        }
    }
  return that;
}]);
