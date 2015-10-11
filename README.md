# wp-angular
Simple wordpress theme based on angular + wp-rest

# How it works

This theme simply use standard wordpress items :
- menu
- post
- page

And render them in angularjs (https://angularjs.org) way using partials html

# Local links oriented urls

All items can be retrieve with local links using $routeProvider (https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)

http://[baseurl]/#[route], routes can be :
* /pages for pages list
* /pages/:id for specific page with its id
* /posts for pages list
* /posts/:id for specific page with its id
* /category/:id for browsing a specific category
* /youtube/:page-id for browsing a specific page with a youtube description
* /slide/:category-id for sliding a specific category
* /facebook/:id/:api for read facebook wal

## Pages browsing

TODO

## Posts browsing

TODO

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
