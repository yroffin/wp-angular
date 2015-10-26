# wp-angular
Simple wordpress theme based on angular (and based on plugin wp-rest and wp-menu), all render are computed on internet browser.

# How it works

This theme simply use standard wordpress items :
- menu
- post
- page

And render them in angularjs [angularjs](https://angularjs.org) way using partials html.

Specific menu item can also be used :
- slide
- youtube
- facebook

# Internal mecanism

All items can be retrieve with local links using angularjs [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) with this kind of url http://[baseurl]/#[route]

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

## Page plugin

Page worpress menu item is automaticaly transformed into one menu category item.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-page.PNG)

## Post plugin

Post worpress menu item is automaticaly transformed into one menu category item.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-post.PNG)

## Category plugin

Category worpress menu item is automaticaly transformed into one menu category item.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-category.PNG)

## Youtube plugin

In order to declare __youtube__ plugin just add a custom link to your default menu.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-youtube.PNG)

| Attribute              | Description  |
| :------------      |:--------------- |
| url           | url ex: \#/youtube/:pageId (pageId is the page id) |
| title         | title of your custom link in menu |
| attribute     | attributes of your custom menu |

All youtube links are described in the target page like this :

    <code>
    [
    {"title":"your_title","id":"youtube_id"},
    ...
    {"title":"your_title","id":"youtube_id"}
    ]
    </code>

## Slide plugin

In order to declare __slide__ plugin just add a custom link to your default menu.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-slide.PNG)

| Attribute              | Description  |
| :------------      |:--------------- |
| url           | url ex: \#/slide/:categoryId (categoryId is the category id) |
| title         | title of your custom link in menu |
| attribute     | attributes of your custom menu |

## Facebook plugin

In order to declare __facebook__ plugin just add a custom link to your default menu.

![Texte alternatif](https://googledrive.com/host/0B-1rUiMKBiO4TktVRTk1VVVMY0U/menu-facebook.PNG)

| Attribute              | Description  |
| :------------      |:--------------- |
| url           | url ex: \#/facebook/:facebookId/feed (facebookId is the page id) |
| title         | title of your custom link in menu |
| attribute     | attributes of your custom menu |

# Theme customizer

## Facebook configuration

### Face book app id

Enter here your Facebook App ID to access to a rich set of client-side functionality for adding Social Plugins, Facebook Login and Graph API calls. If empty Facebook App Id option is disabled.

### Face book feed id

Enter here your Facebook feed id you want to browse. If empty Facebook Feed browse option is disabled.

## Theme configuration

### Image Setting

Cutomize here the background image for your site.

### Logo Setting

Cutomize here the logo image for your site.

###  Default police

Enter here your default font to apply in your theme.

### Default police name

Enter here your default font name, used to load css file.

### Logo width

Enter here your logo width.

### Logo height

Enter here your logo height.

## Carousel configuration

### Description of slide xx

Cutomize here the description for slide xx.

### Description of slide image xx

Cutomize here the slide01 image for your carousel.

## Home configuration

Home configuration introduce 5 maximum tiles configuration, see above for tile models

## Footer configuration

Footer configuration introduce 5 maximum tiles configuration, see above for tile models

## Tiles

Each tile can be :
- tiny-post
- facebook-feed
- mail-to
- new-letter
- socials
- ads-banner

### Tiny post tile

| Attribute              | Description  |
| :------------      |:--------------- |
| span         | tile size in responsive grid |
| type         | tiny-post |
| data.id         | an id attribute, this id is the post id to display |

```
{
    "span": {
        "row": 1,
        "col": 1
    },
    "type": "tiny-post",
    "data": {
        "id": 1781
    }
}
```

### Facebook tile

| Attribute              | Description  |
| :------------      |:--------------- |
| span         | tile size in responsive grid |
| type         | facebook-feed |
| data.id      | facebook page id |
| data.api     | facebook api, ex: feed |

```
{
	"span": {
		"row": 1,
		"col": 3
	},
	"type": "facebook-feed",
	"data": {
		"id": "illeetzick",
		"api": "feed"
	}
}
```

### Avertissement banner tile

| Attribute              | Description  |
| :------------      |:--------------- |
| span         | tile size in responsive grid |
| type         | ads-banner |
| data.ads     | an array of objects |
| data.ads[].media | media id |
| data.ads[].url | media url |
| data.ads[].text | text to display |

```
{
	"span": {
		"row": 1,
		"col": 3
	},
	"type": "ads-banner",
	"data": {
		"ads": [{
			"media": "1429",
			"url": "http://www.google.fr",
			"text": "pub 1"
		},
        ...
		{
			"media": "1442",
			"url": "http://www.google.fr",
			"text": "pub 2"
		}]
	}
}
```
