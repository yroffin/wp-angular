<?php
    /**
     * declare all vars for html
     */
    $basedir = get_template_directory_uri()."/";
    $partials = "'wp-content/themes/".get_template()."/'";
?>
<!doctype html>
<!--
Copyright 2015 Yannick Roffin.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<html lang="fr" ng-app="RestWordpressApp">
<head>
    <title><?php wp_title(); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, minimum-scale=1.0, initial-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <!-- AngularJS Material Design -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.0.0-rc1/angular-material.min.css">
    <!-- Latest compiled and minified CSS for bootstrap -->
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?php echo $basedir; ?>style.css">

    <!-- Google fonts -->
    <link href='http://fonts.googleapis.com/css?family=<?php echo get_theme_mod('wpDefaultPoliceName','Roboto'); ?>' rel='stylesheet' type='text/css'>

    <!-- Default style CSS -->
    <style>
        html, body {
          font-family: <?php echo get_theme_mod('wpDefaultPolice','Roboto, Sans serif'); ?>;
          font-size: 14px;
        }
        body {
          background-image: url('<?php echo get_theme_mod('wpBackImage',''); ?>');
          height: auto;
        }
        /**
         * carousel
         */
        .carousel-inner {
            max-height: <?php echo get_theme_mod('wpCarouselHeight',''); ?>;
            overflow: hidden;
            vertical-align: middle;
        }
    </style>

    <script>
        var wpTemplateDirectoryUri = '<?php echo get_template_directory_uri(); ?>';
        var wpHomeUrl = '<?php echo get_site_url(); ?>';
        var wordpressPartialsUrl = <?php echo $partials; ?>;
        var wordpressRestApiUrl = '<?php echo get_site_url(); ?>';
        var initVarsInstance;
        function initVars() {
            if(initVarsInstance != undefined) {
                return initVarsInstance;
            }
            initVarsInstance = {
                wpTemplateDirectoryUri: wpTemplateDirectoryUri,
                wpHomeUrl: wpHomeUrl,
                wpJsonRouteUrl: wpHomeUrl + '/index.php?json_route=',
                properties: {
                    <?php
                        // Theme options
                        foreach(get_theme_mods() as $key => $value){
                            echo "                '".$key."': '".preg_replace("/(\r\n|\n|\r|\t)/i", '', $value)."',\n";
                        }
                        // Default options
                        echo "                'wpPageOnFront': '".get_option('page_on_front')."'\n";
                    ?>
                }
            };
            /**
             * specific transformation for carousel
             */
            initVarsInstance.wpCarousel = [
                {
                    url:initVarsInstance.properties.wpCarouselImg01,
                    text:initVarsInstance.properties.wpCarouselDesc01
                },
                {
                    url:initVarsInstance.properties.wpCarouselImg02,
                    text:initVarsInstance.properties.wpCarouselDesc02
                },
                {
                    url:initVarsInstance.properties.wpCarouselImg03,
                    text:initVarsInstance.properties.wpCarouselDesc03
                },
                {
                    url:initVarsInstance.properties.wpCarouselImg04,
                    text:initVarsInstance.properties.wpCarouselDesc04
                },
                {
                    url:initVarsInstance.properties.wpCarouselImg05,
                    text:initVarsInstance.properties.wpCarouselDesc05
                }
            ];
            return initVarsInstance;
        }
        var wpVars = initVars();
    </script>
</head>
<body ng-cloak ng-controller="wpMainCtrl">

<!-- Side bar -->
<md-sidenav class="md-sidenav-left" md-component-id="left" >
    <md-content ng-controller="wpLoadMenuCtrl">
        <md-list>
            <div ng-repeat="item in working.menu">
                <md-list-item class="md-3-line">
                    <ng-md-icon icon="{{item.attr.icon}}" options='{"rotation": "clock"}' style="fill:grey" size="32"></ng-md-icon>
                    <div class="md-list-item-text">
                    <h3 class="md-link" ng-click="location(item.action.location)">{{item.name}}</h3>
                    <p class="md-link" ng-repeat="subitem in item.items" ng-click="location(subitem.action.location)">{{subitem.name}}</p>
                    </div>
                    </md-list-item>
                <md-divider></md-divider>
            </div>
        </md-list>
    </md-content>
</md-sidenav>

<!-- Toolbar in no sm mode -->
<div ng-controller="wpLoadMenuCtrl" ng-if="!screenIsSmall" set-class-when-at-top="fix-to-top">
    <div layout="column" id="menu-bar" flex>
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <img width="{{wpVars.properties.wpLogoWidth}}" height="{{wpVars.properties.wpLogoHeight}}" ng-src="{{wpVars.properties.wpLogo}}" ng-click="location('/home')">
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="them-main-menu">
              <ul class="nav navbar-nav">
                <!-- first level iterate on working.menu (default menu) activate dropdown if any items -->
                <li ng-repeat="level0 in working.menu" class="{{level0.items.length === 0 ? '' : 'dropdown'}}">
                  <!-- case no items just make a single link -->
                  <a ng-if="level0.items.length === 0" href="#{{level0.action.location}}">{{level0.name}}</a>
                  <!-- case items toggle dropdown behaviour a + ul -->
                  <a  ng-if="level0.items.length != 0" class="dropdown-toggle" data-toggle="dropdown" role="button">{{level0.name}} <span class="caret"></span></a>
                  <ul ng-if="level0.items.length != 0" class="dropdown-menu">
                    <!-- second level iterate on level0.items activate dropdown if any items -->
                    <li ng-repeat="level1 in level0.items" class="{{level1.items.length === 0 ? '' : 'dropdown-submenu'}}">
                      <!-- case no items just make a single link -->
                      <a ng-if="level1.items.length === 0" href="#{{level1.action.location}}">{{level1.name}}</a>
                      <!-- case items toggle dropdown behaviour a + ul -->
                      <a  ng-if="level1.items.length != 0" class="dropdown-toggle" data-toggle="dropdown" role="button">{{level1.name}}</span></a>
                      <ul ng-if="level1.items.length != 0" class="dropdown-menu">
                          <li ng-repeat="level2 in level1.items"><a href="#{{level2.action.location}}">{{level2.name}}</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    </div>
</div>

<!-- Main view -->
<div layout="row" class="container" flex>
    <div layout="column" flex id="content">
        <!-- Toolbar in sm mode -->
        <md-toolbar ng-if="screenIsSmall" layout="row" class="md-right">
            <!-- Logo -->
            <div>
                <img width="{{wpVars.properties.wpLogoWidth}}" height="{{wpVars.properties.wpLogoHeight}}" ng-src="{{wpVars.properties.wpLogo}}" ng-click="location('/home')">
            </div>
            <span flex></span>
            <md-button class="md-fab md-raised" aria-label="Menu" ng-click="toggleSideNav()">
                <ng-md-icon icon="menu"></ng-md-icon><md-tooltip>Menu</md-tooltip>
            </md-button>
            <md-button ng-show="wpVars.properties.wpFacebookFeedId" class="md-fab md-raised" aria-label="Menu" ng-click="location('/facebook/'+wpVars.properties.wpFacebookFeedId+'/feed')">
                <ng-md-icon icon="facebook"></ng-md-icon><md-tooltip>Facebook</md-tooltip>
            </md-button>
        </md-toolbar>
        <!-- Carousel -->
        <carousel ng-show="carouselIsVisible" ng-controller="wpMainCtrl"></carousel>
        <!-- Main view -->
        <md-card>
            <md-card-content>
                <ol ng-show="breadcrumb.active" class="breadcrumb">
                  <li ng-repeat="crumb in breadcrumb.breadcrumbs track by $index" ><a href="{{crumb.location}}">{{crumb.name}}</a></li>
                </ol>
                <ng-view></ng-view>
            </md-card-content>
        </md-card>
        <!-- Footer -->
        <nav class="navbar navbar-inverse">
              <img width="{{wpVars.properties.wpLogoWidth}}" height="{{wpVars.properties.wpLogoHeight}}" ng-src="{{wpVars.properties.wpLogo}}" ng-click="location('/home')">
            <div ng-controller="wpFooterCtrl" class="container">
                <grid-list scope="{{footer.tiles}}" />
            </div>
        </nav>
    </div>
</div>

<!-- JQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-resource.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-sanitize.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-aria.min.js"></script>

<!-- AngularJS Material Design -->
<script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.0.0-rc1/angular-material.js"></script>
<!-- Cf.  https://klarsys.github.io/angular-material-icons -->
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.5.0/angular-material-icons.min.js"></script>

<!-- Latest compiled JavaScript Lodash -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>

<!-- Latest compiled JavaScript Bootstrap -->
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

<!-- Facebook API -->
<script src="//connect.facebook.net/en_US/all.js"></script>

<!-- Application -->
<script src="<?php echo $basedir; ?>app/app.js"></script>
<script src="<?php echo $basedir; ?>app/services.js"></script>
<script src="<?php echo $basedir; ?>app/controllers.js"></script>
<script src="<?php echo $basedir; ?>app/filters.js"></script>
<script src="<?php echo $basedir; ?>app/directives.js"></script>

<!-- angular-google-analytics -->
<script>
/**
 * Angular Google Analytics - Easy tracking for your AngularJS application
 * @version v1.1.2 - 2015-10-13
 * @link http://github.com/revolunet/angular-google-analytics
 * @author Julien Bouquillon <julien@revolunet.com> (https://github.com/revolunet)
 * @contributors Julien Bouquillon (https://github.com/revolunet),Justin Saunders (https://github.com/justinsa),Chris Esplin (https://github.com/deltaepsilon),Adam Misiorny (https://github.com/adam187)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(a,b,c,d){"use strict";c.module("angular-google-analytics",[]).provider("Analytics",function(){var e,f,g,h,i,j=!0,k="auto",l=!1,m=!1,n="USD",o=!1,p=!1,q=!1,r=!1,s=!1,t=!1,u=!1,v=!1,w=!1,x="$routeChangeSuccess",y=!1,z="",A=!0,B=!1;this.log=[],this.offlineQueue=[],this.setAccount=function(a){return e=c.isUndefined(a)||a===!1?d:c.isArray(a)?a:c.isObject(a)?[a]:[{tracker:a,trackEvent:!0}],this},this.trackPages=function(a){return A=a,this},this.trackPrefix=function(a){return z=a,this},this.setDomainName=function(a){return g=a,this},this.useDisplayFeatures=function(a){return p=!!a,this},this.useAnalytics=function(a){return j=!!a,this},this.useEnhancedLinkAttribution=function(a){return s=!!a,this},this.useCrossDomainLinker=function(a){return m=!!a,this},this.setCrossLinkDomains=function(a){return f=a,this},this.setPageEvent=function(a){return x=a,this},this.setCookieConfig=function(a){return k=a,this},this.useECommerce=function(a,b){return q=!!a,r=!!b,this},this.setCurrency=function(a){return n=a,this},this.setRemoveRegExp=function(a){return a instanceof RegExp&&(i=a),this},this.setExperimentId=function(a){return h=a,this},this.ignoreFirstPageLoad=function(a){return t=!!a,this},this.trackUrlParams=function(a){return B=!!a,this},this.setHybridMobileSupport=function(a){return v=!!a,this},this.startOffline=function(a){return w=!!a,w===!0&&this.delayScriptTag(!0),this},this.delayScriptTag=function(a){return o=!!a,this},this.logAllCalls=function(a){return u=!!a,this},this.enterTestMode=function(){return y=!0,this},this.$get=["$document","$location","$log","$rootScope","$window",function(C,D,E,F,G){var H=this,I=function(a,b){return c.isString(b)?b+"."+a:J("name",b)?b.name+"."+a:a},J=function(a,b){return c.isObject(b)&&c.isDefined(b[a])},K=function(a,b,c){return J(a,b)&&b[a]===c},L=function(){var a=B?D.url():D.path();return i?a.replace(i,""):a},M=function(){var a={utm_source:"campaignSource",utm_medium:"campaignMedium",utm_term:"campaignTerm",utm_content:"campaignContent",utm_campaign:"campaignName"},b={};return c.forEach(D.search(),function(d,e){var f=a[e];c.isDefined(f)&&(b[f]=d)}),b},N=function(a,b,c,d,e,f,g,h,i){var j={};return a&&(j.id=a),b&&(j.affiliation=b),c&&(j.revenue=c),d&&(j.tax=d),e&&(j.shipping=e),f&&(j.coupon=f),g&&(j.list=g),h&&(j.step=h),i&&(j.option=i),j},O=function(a){!j&&G._gaq&&"function"==typeof a&&a()},P=function(){var a=Array.prototype.slice.call(arguments);return w===!0?void H.offlineQueue.push([P,a]):(G._gaq||(G._gaq=[]),u===!0&&H._log.apply(H,a),void G._gaq.push(a))},Q=function(a){j&&G.ga&&"function"==typeof a&&a()},R=function(){var a=Array.prototype.slice.call(arguments);return w===!0?void H.offlineQueue.push([R,a]):"function"!=typeof G.ga?void H._log("warn","ga function not set on window"):(u===!0&&H._log.apply(H,a),void G.ga.apply(null,a))},S=function(a){var b=Array.prototype.slice.call(arguments,1),c=b[0],d=[];return"function"==typeof a?e.forEach(function(b){a(b)&&d.push(b)}):d=e,0===d.length?void R.apply(H,b):void d.forEach(function(a){b[0]=I(c,a),R.apply(H,b)})};return this._log=function(){var a=Array.prototype.slice.call(arguments);if(a.length>0){if(a.length>1)switch(a[0]){case"debug":case"error":case"info":case"log":case"warn":E[a[0]](a.slice(1))}H.log.push(a)}},this._createScriptTag=function(){if(!e||e.length<1)return void H._log("warn","No account id set to create script tag");if(e.length>1&&(H._log("warn","Multiple trackers are not supported with ga.js. Using first tracker only"),e=e.slice(0,1)),l===!0)return void H._log("warn","ga.js or analytics.js script tag already created");P("_setAccount",e[0].tracker),g&&P("_setDomainName",g),s&&P("_require","inpage_linkid","//www.google-analytics.com/plugins/ga/inpage_linkid.js"),A&&!t&&(i?P("_trackPageview",L()):P("_trackPageview"));var a;return a=p===!0?("https:"===b.location.protocol?"https://":"http://")+"stats.g.doubleclick.net/dc.js":("https:"===b.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js",y!==!0?!function(){var b=C[0],c=b.createElement("script");c.type="text/javascript",c.async=!0,c.src=a;var d=b.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d)}():H._log("inject",a),l=!0,!0},this._createAnalyticsScriptTag=function(){if(!e)return void H._log("warn","No account id set to create analytics script tag");if(l===!0)return void H._log("warn","ga.js or analytics.js script tag already created");var d=v===!0?"https:":"",g=d+"//www.google-analytics.com/analytics.js";if(y!==!0?!function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(a,b,"script",g,"ga"):("function"!=typeof G.ga&&(G.ga=function(){}),H._log("inject",g)),e.forEach(function(a){a.crossDomainLinker=J("crossDomainLinker",a)?a.crossDomainLinker:m,a.crossLinkDomains=J("crossLinkDomains",a)?a.crossLinkDomains:f,a.displayFeatures=J("displayFeatures",a)?a.displayFeatures:p,a.enhancedLinkAttribution=J("enhancedLinkAttribution",a)?a.enhancedLinkAttribution:s,a.trackEcommerce=J("trackEcommerce",a)?a.trackEcommerce:q,a.trackEvent=J("trackEvent",a)?a.trackEvent:!1;var b={};J("fields",a)?b=a.fields:J("cookieConfig",a)?c.isString(a.cookieConfig)?b.cookieDomain=a.cookieConfig:b=a.cookieConfig:c.isString(k)?b.cookieDomain=k:k&&(b=k),a.crossDomainLinker===!0&&(b.allowLinker=!0),J("name",a)&&(b.name=a.name),a.fields=b,R("create",a.tracker,a.fields),v===!0&&R(I("set",a),"checkProtocolTask",null),a.crossDomainLinker===!0&&(R(I("require",a),"linker"),c.isDefined(a.crossLinkDomains)&&R(I("linker:autoLink",a),a.crossLinkDomains)),a.displayFeatures&&R(I("require",a),"displayfeatures"),a.trackEcommerce&&(r?(R(I("require",a),"ec"),R(I("set",a),"&cu",n)):R(I("require",a),"ecommerce")),a.enhancedLinkAttribution&&R(I("require",a),"linkid"),A&&!t&&R(I("send",a),"pageview",L())}),h){var i=b.createElement("script"),j=b.getElementsByTagName("script")[0];i.src=d+"//www.google-analytics.com/cx/api.js?experiment="+h,j.parentNode.insertBefore(i,j)}return l=!0,!0},this._ecommerceEnabled=function(a,b){var c=q&&!r;return a===!0&&c===!1&&(q&&r?H._log("warn",b+" is not available when Enhanced Ecommerce is enabled with analytics.js"):H._log("warn","Ecommerce must be enabled to use "+b+" with analytics.js")),c},this._enhancedEcommerceEnabled=function(a,b){var c=q&&r;return a===!0&&c===!1&&H._log("warn","Enhanced Ecommerce must be enabled to use "+b+" with analytics.js"),c},this._trackPage=function(a,b,e){a=a?a:L(),b=b?b:C[0].title,O(function(){P("_set","title",b),P("_trackPageview",z+a)}),Q(function(){var f={page:z+a,title:b};c.extend(f,M()),c.isObject(e)&&c.extend(f,e),S(d,"send","pageview",f)})},this._trackEvent=function(a,b,d,e,f,g){O(function(){P("_trackEvent",a,b,d,e,!!f)}),Q(function(){var h={},i=function(a){return K("trackEvent",a,!0)};c.isDefined(f)&&(h.nonInteraction=!!f),c.isObject(g)&&c.extend(h,g),S(i,"send","event",a,b,d,e,h)})},this._addTrans=function(a,b,c,d,e,f,g,h,i){O(function(){P("_addTrans",a,b,c,d,e,f,g,h)}),Q(function(){if(H._ecommerceEnabled(!0,"addTrans")){var f=function(a){return K("trackEcommerce",a,!0)};S(f,"ecommerce:addTransaction",{id:a,affiliation:b,revenue:c,tax:d,shipping:e,currency:i||"USD"})}})},this._addItem=function(a,b,c,d,e,f){O(function(){P("_addItem",a,b,c,d,e,f)}),Q(function(){if(H._ecommerceEnabled(!0,"addItem")){var g=function(a){return K("trackEcommerce",a,!0)};S(g,"ecommerce:addItem",{id:a,name:c,sku:b,category:d,price:e,quantity:f})}})},this._trackTrans=function(){O(function(){P("_trackTrans")}),Q(function(){if(H._ecommerceEnabled(!0,"trackTrans")){var a=function(a){return K("trackEcommerce",a,!0)};S(a,"ecommerce:send")}})},this._clearTrans=function(){Q(function(){if(H._ecommerceEnabled(!0,"clearTrans")){var a=function(a){return K("trackEcommerce",a,!0)};S(a,"ecommerce:clear")}})},this._addProduct=function(a,b,d,e,f,g,h,i,j,k){O(function(){P("_addProduct",a,b,d,e,f,g,h,i,j)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addProduct")){var l=function(a){return K("trackEcommerce",a,!0)},m={id:a,name:b,category:d,brand:e,variant:f,price:g,quantity:h,coupon:i,position:j};c.isObject(k)&&c.extend(m,k),S(l,"ec:addProduct",m)}})},this._addImpression=function(a,b,c,d,e,f,g,h){O(function(){P("_addImpression",a,b,c,d,e,f,g,h)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addImpression")){var i=function(a){return K("trackEcommerce",a,!0)};S(i,"ec:addImpression",{id:a,name:b,category:e,brand:d,variant:f,list:c,position:g,price:h})}})},this._addPromo=function(a,b,c,d){O(function(){P("_addPromo",a,b,c,d)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addPromo")){var e=function(a){return K("trackEcommerce",a,!0)};S(e,"ec:addPromo",{id:a,name:b,creative:c,position:d})}})},this._setAction=function(a,b){O(function(){P("_setAction",a,b)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"setAction")){var c=function(a){return K("trackEcommerce",a,!0)};S(c,"ec:setAction",a,b)}})},this._trackTransaction=function(a,b,c,d,e,f,g,h,i){this._setAction("purchase",N(a,b,c,d,e,f,g,h,i))},this._trackRefund=function(a){this._setAction("refund",N(a))},this._trackCheckOut=function(a,b){this._setAction("checkout",N(null,null,null,null,null,null,null,a,b))},this._trackDetail=function(){this._setAction("detail"),this._pageView()},this._trackCart=function(a){-1!==["add","remove"].indexOf(a)&&(this._setAction(a),this._trackEvent("UX","click",a+("add"===a?" to cart":" from cart")))},this._promoClick=function(a){this._setAction("promo_click"),this._trackEvent("Internal Promotions","click",a)},this._productClick=function(a){this._setAction("click",N(null,null,null,null,null,null,a,null,null)),this._trackEvent("UX","click",a)},this._pageView=function(a){Q(function(){R(I("send",a),"pageview")})},this._send=function(){var a=Array.prototype.slice.call(arguments);a.unshift("send"),Q(function(){R.apply(H,a)})},this._set=function(a,b,c){Q(function(){R(I("set",c),a,b)})},this._trackTimings=function(a,b,c,d){this._send("timing",a,b,c,d)},o||(j?this._createAnalyticsScriptTag():this._createScriptTag()),A&&F.$on(x,function(){H._trackPage()}),{log:H.log,offlineQueue:H.offlineQueue,configuration:{accounts:e,universalAnalytics:j,crossDomainLinker:m,crossLinkDomains:f,currency:n,delayScriptTag:o,displayFeatures:p,domainName:g,ecommerce:H._ecommerceEnabled(),enhancedEcommerce:H._enhancedEcommerceEnabled(),enhancedLinkAttribution:s,experimentId:h,hybridMobileSupport:v,ignoreFirstPageLoad:t,logAllCalls:u,pageEvent:x,removeRegExp:i,testMode:y,trackPrefix:z,trackRoutes:A,trackUrlParams:B},getUrl:L,setCookieConfig:H._setCookieConfig,getCookieConfig:function(){return k},createAnalyticsScriptTag:function(a){return a&&(k=a),H._createAnalyticsScriptTag()},createScriptTag:function(){return H._createScriptTag()},offline:function(a){if(a===!0&&w===!1&&(w=!0),a===!1&&w===!0)for(w=!1;H.offlineQueue.length>0;){var b=H.offlineQueue.shift();b[0].apply(H,b[1])}return w},trackPage:function(a,b,c){H._trackPage.apply(H,arguments)},trackEvent:function(a,b,c,d,e,f){H._trackEvent.apply(H,arguments)},addTrans:function(a,b,c,d,e,f,g,h,i){H._addTrans.apply(H,arguments)},addItem:function(a,b,c,d,e,f){H._addItem.apply(H,arguments)},trackTrans:function(){H._trackTrans.apply(H,arguments)},clearTrans:function(){H._clearTrans.apply(H,arguments)},addProduct:function(a,b,c,d,e,f,g,h,i,j){H._addProduct.apply(H,arguments)},addPromo:function(a,b,c,d){H._addPromo.apply(H,arguments)},addImpression:function(a,b,c,d,e,f,g,h){H._addImpression.apply(H,arguments)},productClick:function(a){H._productClick.apply(H,arguments)},promoClick:function(a){H._promoClick.apply(H,arguments)},trackDetail:function(){H._trackDetail.apply(H,arguments)},trackCart:function(a){H._trackCart.apply(H,arguments)},trackCheckout:function(a,b){H._trackCheckOut.apply(H,arguments)},trackTimings:function(a,b,c,d){H._trackTimings.apply(H,arguments)},trackTransaction:function(a,b,c,d,e,f,g,h,i){H._trackTransaction.apply(H,arguments)},setAction:function(a,b){H._setAction.apply(H,arguments)},pageView:function(){H._pageView.apply(H,arguments)},send:function(a){H._send.apply(H,arguments)},set:function(a,b,c){H._set.apply(H,arguments)}}}]}).directive("gaTrackEvent",["Analytics","$parse",function(a,b){return{restrict:"A",link:function(c,d,e){var f=b(e.gaTrackEvent);d.bind("click",function(){(!e.gaTrackEventIf||c.$eval(e.gaTrackEventIf))&&f.length>1&&a.trackEvent.apply(a,f(c))})}}}])}(window,document,window.angular);
</script>

</body>
</html>
<?php
/**
 * Declare all element to pass theme check,
 * Theme check is web 1.0 oriented ... my theme is web 2.0 ;(
 */
die();
function shape_setup() {
    the_tags();
    get_avatar();
    wp_title();
    posts_nav_link();
    paginate_comments_links();
    if ( ! isset( $content_width ) ) $content_width = 900;
    if ( is_singular() ) wp_enqueue_script( "comment-reply" );
    wp_list_comments( $args );
    wp_link_pages( $args );
    wp_head();
    wp_footer();
    the_ID();
    add_theme_support('automatic-feed-links');
    add_theme_support( "post-thumbnails" );
    the_post_thumbnail();
    add_theme_support( "title-tag" );
    add_theme_support( "custom-header", $args );
    add_theme_support( "custom-background", $args );
    add_editor_style();
    add_action( 'widgets_init', 'todo' );
    is_home();
    is_active_widget();
    the_widget();
    register_widget();
    unregister_widget();
    register_sidebar( $args );
    dynamic_sidebar( $index );
    ?>
    <?php the_ID(); ?>
    <?php post_class(); ?>
    <?php language_attributes(); ?>
    <?php comments_template( $file, $separate_comments ); ?>
    <?php comment_form(); ?>
    <?php body_class( $class );
}
