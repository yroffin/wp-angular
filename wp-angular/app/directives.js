var app = angular.module('RestWordpressApp');

app.animation('.slide', [function() {
  return {
    // make note that other events (like addClass/removeClass)
    // have different function input parameters
    enter: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);

      // remember to call doneFn so that angular
      // knows that the animation has concluded
    },

    move: function(element, doneFn) {
      jQuery(element).fadeIn(1000, doneFn);
    },

    leave: function(element, doneFn) {
      jQuery(element).fadeOut(1000, doneFn);
    }
  }
}]);

/**
 * scroll tips
 */
app.directive('setClassWhenAtTop', function ($window, $log) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
          offsetTop = element.offset().top; // get element's offset top relative to document

      $win.on('scroll', function (e) {
        if ($win.scrollTop() > offsetTop) {
          element.addClass(topClass);
        } else {
          element.removeClass(topClass);
        }
      });
    }
  };
});

/**
 * carousel
 */
app.directive('carousel', function ($window, $log) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/carousel.html'
  }
});

/**
 * carousel
 */
app.directive('slider', function () {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/animated-galeries.html'
  }
});

angular.module('wpDirective.services', ['RestWordpressApp.services'])
/**
 * main controller
 */
.controller('tinyPageCtrl',
['$scope', function($scope){
}])
/**
 * tiny page directive
 */
.directive('tinyPage', ['$log', '$routeParams', 'pageServices', function ($log, $routeParams, pageServices) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/tiny-page.html',
    link: function(scope, element, attrs) {
        /**
         * read routeParams first, then attributes
         */
        var pageId;
        if($routeParams.id === undefined) {
            pageId = attrs.id;
        } else {
            pageId = $routeParams.id;
        }
        /**
         * call service to load scope
         */
        pageServices.page({id:pageId}).then(function(data) {
            scope.page = data;
        });
    }
  }
}])
/**
 * main controller
 */
.controller('defaultPageCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('defaultPage', ['$log', '$routeParams', 'pageServices', function ($log, $routeParams, pageServices) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/default-page.html',
    link: function(scope, element, attrs) {
        /**
         * read routeParams first, then attributes
         */
        var pageId;
        if($routeParams.id === undefined) {
            pageId = attrs.id;
        } else {
            pageId = $routeParams.id;
        }
        /**
         * call service to load scope
         */
        pageServices.page({id:pageId}).then(function(data) {
            scope.page = data;
        });
    }
  }
}])
/**
 * main controller
 */
.controller('tinyPostCtrl',
['$scope', function($scope){
}])
/**
 * tiny page directive
 */
.directive('tinyPost', ['$log', '$routeParams', 'postServices', function ($log, $routeParams, postServices) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/tiny-post.html',
    link: function(scope, element, attrs) {
        /**
         * read routeParams first, then attributes
         */
        var postId;
        if($routeParams.id === undefined) {
            postId = attrs.id;
        } else {
            postId = $routeParams.id;
        }
        /**
         * call service to load scope
         */
        postServices.post({id:postId}).then(function(data) {
            scope.post = data;
        });
    }
  }
}])
/**
 * main controller
 */
.controller('defaultPostCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('defaultPost', ['$log', '$routeParams', 'postServices', function ($log, $routeParams, postServices) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/default-post.html',
    link: function(scope, element, attrs) {
        /**
         * read routeParams first, then attributes
         */
        var postId;
        if($routeParams.id === undefined) {
            postId = attrs.id;
        } else {
            postId = $routeParams.id;
        }
        /**
         * call service to load scope
         */
        postServices.post({id:postId}).then(function(data) {
            scope.post = data;
        });
    }
  }
}])
/**
 * main controller
 */
.controller('facebookFeedCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('facebookFeed', ['$log', '$routeParams', 'facebookService', function ($log, $routeParams, facebookService) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/facebook-feed.html',
    link: function(scope, element, attrs) {
        /**
         * read routeParams first, then attributes
         */
        var facebookId;
        if($routeParams.id === undefined) {
            facebookId = attrs.id;
        } else {
            facebookId = $routeParams.id;
        }
        var facebookApi;
        if($routeParams.id === undefined) {
            facebookApi = attrs.api;
        } else {
            facebookApi = $routeParams.api;
        }
        $log.info("facebookFeed:", facebookId, facebookApi, scope.wpVars.properties.wpFacebookAppId);
        /**
         * call service to load scope
         */
        facebookService.submit(
            scope.wpVars.properties.wpFacebookAppId,
            function(args) {
            facebookService.api(args)
                .then( function(response) {
                       scope.facebook.feeds = response;
                    }, function(failure) {
                        $log.error(failure);
                    }
                )
            },
            {
                id:facebookId,
                api:facebookApi,
                filter:"?fields=message,from,link"
            }
        );
    }
  }
}])
/**
 * simple custom divider widget
 */
.controller('customDividerCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('customDivider', ['$log', '$routeParams', function ($log, $routeParams) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/custom-divider.html',
    link: function(scope, element, attrs) {
        /**
         * add text for this custom divider
         */
        scope.text = attrs.text;
    }
  }
}])
/**
 * simple custom divider widget
 */
.controller('newsLetterCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('newsLetter', ['$log', '$routeParams', function ($log, $routeParams) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/news-letter.html',
    link: function(scope, element, attrs) {
    }
  }
}])
/**
 * simple custom divider widget
 */
.controller('mailToCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('mailTo', ['$log', '$routeParams', function ($log, $routeParams) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/mail-to.html',
    link: function(scope, element, attrs) {
        /**
         * load params
         */
        scope.params = {};
        scope.params.url = attrs.url;
    }
  }
}])
/**
 * simple custom divider widget
 */
.controller('socialsCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('socials', ['$log', '$routeParams', function ($log, $routeParams) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/socials.html',
    link: function(scope, element, attrs) {
        /**
         * load params
         */
        scope.params = {};
        scope.params.socials = angular.fromJson(attrs.scope);
    }
  }
}])
/**
 * simple custom divider widget
 */
.controller('adsBannerCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('adsBanner', ['$log', '$routeParams', 'mediaServices', 'wpDaemon', function ($log, $routeParams, mediaServices, wpDaemon) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/ads-banner.html',
    link: function(scope, element, attrs) {
        /**
         * load params
         */
        scope.params = {};
        scope.params.ads = angular.fromJson(attrs.scope);
        scope.params.middle = (scope.params.ads.length / 2) | 0;
        /**
         * search associated media
         */
        _.each(scope.params.ads, function(advert) {
            mediaServices.media({id:advert.media}).then(function(data) {
                advert.meta = data;
            });
        });
        /**
         * callback
         */
        wpDaemon.submit(5000, {ads:scope.params.ads}, function(context) {
            context.ads.push(context.ads[0]);
            context.ads.shift();
        })
    }
  }
}])
/**
 * grid list widget
 */
.controller('gridListCtrl',
['$scope', '$log', '$routeParams', function($scope, $log, $routeParams){
}])
/**
 * page directive
 */
.directive('gridList', ['$log', '$routeParams', function ($log, $routeParams) {
  return {
    restrict: 'E',
    templateUrl: wpVars.wpTemplateDirectoryUri +'/partials/directives/grid-list.html',
    link: function(scope, element, attrs) {
        /**
         * load params
         */
        scope.params = {};
        scope.params.tiles = angular.fromJson(attrs.scope);
    }
  }
}])
;

