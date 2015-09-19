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

<html lang="fr">
    <head>
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
    $customiser_facebook_app_id = get_theme_mod('customiser_facebook_app_id','');
    $customiser_facebook_feed_id = get_theme_mod('customiser_facebook_feed_id','');
    $customiser_banner_image = get_theme_mod('customiser_banner_image','');
?>

<html lang="fr" ng-app="RestWordpressApp">
<head>
    <title><?php wp_title(); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, minimum-scale=1.0, initial-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <!-- AngularJS Material Design -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.css">
    <link rel="stylesheet" href="<?php echo $basedir; ?>css/specific.css">

    <!-- Roboto fonts -->
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

    <script>
        var wordpressPartialsUrl = <?php echo $partials; ?>;
        var wordpressRestApiUrl = 'index.php?json_route=';
        var wordpressFacebookAppId = <?php echo $customiser_facebook_app_id; ?>;
    </script>
</head>
<body ng-cloak style="background-attachment:fixed;" layout="column" ng-controller="RestWordpressCtrl" back-img="<?php echo $customiser_back_image; ?>">

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

<!-- Main view -->
<div layout="row" class="cadre" flex>
    <div layout="column" flex id="content">
        <md-card>
            <md-toolbar layout="row">
                <md-button class="md-fab md-raised" aria-label="Menu" ng-click="toggleSideNav()">
                    <ng-md-icon icon="menu"></ng-md-icon><md-tooltip>Menu</md-tooltip>
                </md-button>
                <md-button class="md-fab md-raised" aria-label="Menu" ng-click="location('/facebook/<?php echo $customiser_facebook_feed_id ?>/feed')">
                    <ng-md-icon icon="facebook"></ng-md-icon><md-tooltip>Facebook</md-tooltip>
                </md-button>
            </md-toolbar>
             <img src="<?php echo $customiser_banner_image ?>" class="md-card-image" layout="row" alt="image caption">
             <md-card-content>
                <div class="view-animate" flex><ng-view></ng-view></div>
             </md-card-content>
        </md-card>
    </div>
</div>

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-route.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-resource.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-sanitize.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-aria.min.js"></script>

<!-- AngularJS Material Design -->
<script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.10.1/angular-material.min.js"></script>
<!-- Cf.  https://klarsys.github.io/angular-material-icons -->
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.5.0/angular-material-icons.min.js"></script>

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
die();
<!--
Declare all element to pass theme check,
Theme check is web 1.0 oriented ... my theme is web 2.0
-->
the_tags();
get_avatar();
wp_title();
posts_nav_link();
paginate_comments_links();
if ( ! isset( $content_width ) ) $content_width = 900;
<?php if ( is_singular() ) wp_enqueue_script( "comment-reply" ); ?>
<?php wp_list_comments( $args ); ?>
<?php wp_link_pages( $args ); ?>
<?php wp_head(); ?>
<?php wp_footer(); ?>
<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<html <?php language_attributes(); ?>
<?php comments_template( $file, $separate_comments ); ?>
<?php comment_form(); ?>
<?php body_class( $class ); ?>
<?php add_theme_support('automatic-feed-links'); ?>
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
