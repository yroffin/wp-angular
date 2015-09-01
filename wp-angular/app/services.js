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
				url: wordpressRestApiUrl + '/posts?filter[category_name]=:id',
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
				cache: false
			},
			/**
			 * get single menu
			 */
			menu: {
				method: 'GET',
				url: wordpressRestApiUrl + '/menus/:id',
				isArray: false,
				cache: false
			}
		}
	)}]);

/**
 * menu transformation
 */
myAppServices.factory('RestWordpressMenusTransform', function() {
  var transformedMenu = {
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
         function action(raw) {
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
               * ignore custom entry
               */
              if(raw.object === 'custom') {
                  return {
                      raw: raw
                  }
              }
             throw {message: "No transformation", context: raw};
          }

          function parse(attr) {//"{&lsquo;icon&rsquo;:&rsquo;mail&rsquo;}"
              if(attr === "") return {};
              var transformedString = attr.
                replace(/&lsquo;/g,"!").
                replace(/&rsquo;/g,"!").
                replace(/!/g, "\"") + "";
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
                    action: action(item),
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
                    action: action(item)
                  });
              }
          }
          return menu;
      }
  };
  return transformedMenu;
});
