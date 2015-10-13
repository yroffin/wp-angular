# wp-angular
Simple wordpress theme based on angular (and based on plugin wp-rest and wp-menu), all render are computed on workstation side.

# How it works

This theme simply use standard wordpress items :
- menu
- post
- page

And render them in angularjs [angularjs](https://angularjs.org) way using partials html

# Local links oriented urls

All items can be retrieve with local links using [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) with this kind of url http://[baseurl]/#[route]

    angular.module('wpApp',['ngMaterial', ...
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
           $routeProvider.
                 when('/posts', {
                     controller: 'RestWordpressPostsCtrl',
                     templateUrl: initVars().wpPartials+'partials/posts.html'
                 });
             $routeProvider.
    ...


| Route              | Description  |
| :------------      |:--------------- |
| /pages             | page(s) list    |
| /pages/:id         | one specific page |
| /posts             | post(s) list    |
| /posts/:id         | one specific post |
| /category/:cat-id  | for browsing a specific category    |
| /youtube/:page-id  | for browsing a specific page with a youtube description    |
| /slide/:cat-id     | for sliding a specific category    |
| /facebook/:id/:api | for read facebook feed    |

## Pages browsing

Default pages menu is fully analyzed and automaticaly transformed in menu for this theme, no action is needed by the webmaster.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/Capture001.PNG)

A page is transformed to http://[baseurl]/#/pages/:id (:id is the page id)

## Posts browsing

Default posts menu is fully analyzed and automaticaly transformed in menu for this theme, no action is needed by the webmaster.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/Capture002.PNG)

A post is transformed to http://[baseurl]/#/posts/:id (:id is the page id)

## Category browsing

TODO

## Youtube browsing

TODO

## Slide browsing

TODO

## Facebook browsing

TODO

# Menu management

Standard default menu is read and used in theme with some transformation :
- post target become \#/posts/:id
- page target become \#/posts/:id
- category target become \#/category/:id
- custom link are used to access to specific components 
    - youtube
    - slide
    - facebook

## Youtube custom link

TODO

## Slide custom link

TODO

## Facebook custom link

TODO

# Theme customizer
