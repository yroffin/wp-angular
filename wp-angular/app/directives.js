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

app.directive('menu', function(){
    return function(scope, element, attrs){
        scope.working = {};
        scope.wdMenuId = attrs.menu;
    };
});
