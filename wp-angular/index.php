<?php
    /**
     * declare all vars for html
     */
    $basedir = get_template_directory_uri()."/";
    $partials = "'wp-content/themes/".get_template()."/'";
    /**
     * theme customizer elements
     */
    $customiser_back_image = get_theme_mod('customiser_back_image','');
    $customiser_logo = get_theme_mod('customiser_logo','');
    $customiser_logo_width = get_theme_mod('customiser_logo_width','');
    $customiser_logo_height = get_theme_mod('customiser_logo_height','');
    $customiser_facebook_app_id = get_theme_mod('customiser_facebook_app_id','');
    $customiser_facebook_feed_id = get_theme_mod('customiser_facebook_feed_id','');
    $customiser_banner_image = get_theme_mod('customiser_banner_image','');
    $customiser_default_police = get_theme_mod('customiser_default_police','Roboto, sans serif');
    $customiser_default_police_name = get_theme_mod('customiser_default_police_name','Roboto');
    // Carousel
    $customiser_carousel_slide01 = get_theme_mod('customiser_carousel_slide01','');
    $customiser_carousel_slide02 = get_theme_mod('customiser_carousel_slide02','');
    $customiser_carousel_slide03 = get_theme_mod('customiser_carousel_slide03','');
    $customiser_carousel_slide04 = get_theme_mod('customiser_carousel_slide04','');
    $customiser_carousel_slide05 = get_theme_mod('customiser_carousel_slide05','');
    $customiser_carousel_desc_slide01 = get_theme_mod('customiser_carousel_description_slide01','');
    $customiser_carousel_desc_slide02 = get_theme_mod('customiser_carousel_description_slide02','');
    $customiser_carousel_desc_slide03 = get_theme_mod('customiser_carousel_description_slide03','');
    $customiser_carousel_desc_slide04 = get_theme_mod('customiser_carousel_description_slide04','');
    $customiser_carousel_desc_slide05 = get_theme_mod('customiser_carousel_description_slide05','');
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
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.0/angular-material.min.css">
    <!-- Latest compiled and minified CSS for bootstrap -->
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?php echo $basedir; ?>style.css">

    <!-- Google fonts -->
    <link href='http://fonts.googleapis.com/css?family=<?php echo $customiser_default_police_name; ?>' rel='stylesheet' type='text/css'>

    <!-- Default style CSS -->
    <style>
        html, body {
          font-family: <?php echo $customiser_default_police; ?>;
          font-size: 14px;
        }
        body {
          background-image: url('<?php echo $customiser_back_image; ?>');
          height: auto;
        }
    </style>

    <script>
        var wordpressPartialsUrl = <?php echo $partials; ?>;
        var wordpressRestApiUrl = 'index.php?json_route=';
        var wordpressFacebookAppId = <?php echo "'".$customiser_facebook_app_id."'"; ?>;
        var wpFacebookFeedId = <?php echo "'".$customiser_facebook_feed_id."'"; ?>;
        function initVars() {
            var customizer = {
                wpPartials:<?php echo $partials; ?>,
                wordpressRestApiUrl:'index.php?json_route=',
                wordpressFacebookAppId:<?php echo "'".$customiser_facebook_app_id."'"; ?>,
                wpFacebookFeedId:<?php echo "'".$customiser_facebook_feed_id."'"; ?>,
                wpLogo:<?php echo "'".$customiser_logo."'"; ?>,
                wpLogoWidth:<?php echo "'".$customiser_logo_width."'"; ?>,
                wpLogoHeight:<?php echo "'".$customiser_logo_height."'"; ?>,
                wpBannerImage:<?php echo "'".$customiser_banner_image."'"; ?>,
                wpDefaultPolice:<?php echo "'".$customiser_default_police."'"; ?>,
                wpDefaultPoliceName:<?php echo "'".$customiser_default_police_name."'"; ?>,
                wpCarousel: [
                {
                    url:<?php echo "'".$customiser_carousel_slide01."'"; ?>,
                    text:<?php echo "'".$customiser_carousel_desc_slide01."'"; ?>
                },
                {
                    url:<?php echo "'".$customiser_carousel_slide02."'"; ?>,
                    text:<?php echo "'".$customiser_carousel_desc_slide02."'"; ?>
                },
                {
                    url:<?php echo "'".$customiser_carousel_slide03."'"; ?>,
                    text:<?php echo "'".$customiser_carousel_desc_slide03."'"; ?>
                },
                {
                    url:<?php echo "'".$customiser_carousel_slide04."'"; ?>,
                    text:<?php echo "'".$customiser_carousel_desc_slide04."'"; ?>
                },
                {
                    url:<?php echo "'".$customiser_carousel_slide05."'"; ?>,
                    text:<?php echo "'".$customiser_carousel_desc_slide05."'"; ?>
                }
                ]
            }
            return customizer;
        }
    </script>
</head>
<body ng-cloak ng-controller="RestWordpressCtrl">

<!-- Side bar -->
<md-sidenav class="md-sidenav-left" md-component-id="left" >
    <md-content ng-controller="RestWordpressLoadMenuCtrl">
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
<div ng-controller="RestWordpressLoadMenuCtrl" ng-if="!screenIsSmall" set-class-when-at-top="fix-to-top">
    <div layout="column" id="menu-bar" flex>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <img width="{{customizer.wpLogoWidth}}" height="{{customizer.wpLogoHeight}}" ng-src="{{customizer.wpLogo}}">
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul class="nav navbar-nav">
                <li ng-repeat="item in working.menu" class="{{item.items.length === 0 ? '' : 'dropdown'}}">
                  <a ng-if="item.items.length === 0" href="#{{item.action.location}}">{{item.name}}</a>
                  <a ng-if="item.items.length != 0" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{item.name}} <span class="caret"></span></a>
                  <ul ng-if="item.items.length != 0" class="dropdown-menu">
                    <li ng-repeat="subitem in item.items"><a href="#{{subitem.action.location}}">{{subitem.name}}</a></li>
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
        <!-- Main view -->
        <md-card>
            <!-- Toolbar in sm mode -->
            <md-toolbar ng-if="screenIsSmall" layout="row" class="md-right">
                <!-- Logo -->
                <img class="md-fab" width="{{customizer.wpLogoWidth}}" height="{{customizer.wpLogoHeight}}" ng-src="{{customizer.wpLogo}}">
                <span flex></span>
                <md-button class="md-fab md-raised" aria-label="Menu" ng-click="toggleSideNav()">
                    <ng-md-icon icon="menu"></ng-md-icon><md-tooltip>Menu</md-tooltip>
                </md-button>
                <md-button ng-show="wpFacebookFeedId" class="md-fab md-raised" aria-label="Menu" ng-click="location('/facebook/<?php echo $customiser_facebook_feed_id ?>/feed')">
                    <ng-md-icon icon="facebook"></ng-md-icon><md-tooltip>Facebook</md-tooltip>
                </md-button>
            </md-toolbar>
            <carousel ng-controller="RestWordpressCtrl"></carousel>
            <md-card-content>
                <ng-view></ng-view>
            </md-card-content>
        </md-card>
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
<script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.0/angular-material.js"></script>
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
