var app = angular.module('RestWordpressApp');

app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'height': '100%'
        });
    };
});

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

app.directive('carousel', function ($window, $log) {
  return {
    restrict: 'E',
    templateUrl: wordpressPartialsUrl +'partials/carousel.html'
  }
});
