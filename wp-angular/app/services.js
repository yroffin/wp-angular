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
 */
var myAppServices = angular.module('RestWordpressApp.services', [ 'ngResource' ]);

/**
 * posts services
 */
myAppServices.factory('RestWordpressPosts', [ '$resource', function($resource, $windows) {
	return $resource('', {}, {
			/**
			 * get all crontab (raw configuration resource)
			 */
			posts: {
				method: 'GET',
				url: wordpressRestApiUrl + '/posts',
				params: {},
				isArray: true,
				cache: false
			},
			/**
			 * get label detail (raw configuration resource)
			 */
			post: {
				method: 'GET',
				url: wordpressRestApiUrl + '/posts/:id',
				isArray: false,
				cache: false
			},
			/**
			 * get post by category
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
			 * get all crontab (raw configuration resource)
			 */
			pages: {
				method: 'GET',
				url: wordpressRestApiUrl + '/pages',
				params: {},
				isArray: true,
				cache: false
			},
			/**
			 * get label detail (raw configuration resource)
			 */
			page: {
				method: 'GET',
				url: wordpressRestApiUrl + '/pages/:id',
				isArray: false,
				cache: false
			}
		}
	)}]);
