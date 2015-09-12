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
<?php
    /**
     * declare all vars for html
     */
    $basedir = get_template_directory_uri()."/";
    $partials = "'wp-content/themes/".get_template()."/'";
?>

    <title><?php echo bloginfo('name'); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, height=device-height, minimum-scale=1.0, initial-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <!-- AngularJS Material Design -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.css">
    <link rel="stylesheet" href="<?php echo $basedir; ?>css/specific.css">

    <!-- Roboto fonts -->
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

    <!-- use the font -->
    <style>
        html {
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          height: auto;
        }
        p {
            text-align:justify;
        }
        .cadre {
            opacity: 0.95;
            filter: alpha(opacity=95);
            margin: 8% 8% 0px 8%;
        }
        .header {
            opacity: 1;
            filter: alpha(opacity=100);
            margin: 0px 0px 0px 0px;
            width: 100%;
            height: 100%;
            overflow: hidden;
            visibility: visible;
            left: 0px;
            top: 0px;
            z-index: 20;
            opacity: 1;
        }
        .md-button {
            text-align: left;
        }
        .md-link {
            cursor: pointer;
        }
        img {
            max-width: 100%;
            height:auto;
            margin-left: auto;
            margin-right: auto;
            display: block;
        }
        blockquote {
            display: block;
            -webkit-margin-before: 1em;
            -webkit-margin-after: 1em;
            -webkit-margin-start: 0px;
            -webkit-margin-end: 0px;
        }
    </style>
    <script>
        var wordpressPartialsUrl = <?php echo $partials; ?>;
        var wordpressRestApiUrl = 'index.php?json_route=';
    </script>
</head>
<body ng-cloak style="background-attachment:fixed;" layout="column" ng-controller="RestWordpressCtrl" back-img="http://ille-et-zick.fr/prod/wp-content/uploads/2015/03/ille-et-zik-24-_comp.jpg">

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

<div layout="row" class="cadre" flex>
    <div layout="column" flex id="content">
        <md-card>
            <md-toolbar layout="row">
                <md-button class="md-fab md-raised" aria-label="Menu" ng-click="toggleSideNav()">
                    <ng-md-icon icon="menu"></ng-md-icon><md-tooltip>Menu</md-tooltip>
                </md-button>
                <md-button class="md-fab md-raised" aria-label="Menu" ng-click="location('/facebook/illeetzick/feed')">
                    <ng-md-icon icon="facebook"></ng-md-icon><md-tooltip>Facebook</md-tooltip>
                </md-button>
            </md-toolbar>
             <img src="http://ille-et-zick.fr/prod/wp-content/uploads/2015/06/festival1.jpg" class="md-card-image" layout="row" alt="image caption">
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
<script src="//cdnjs.cloudflare.com/ajax/libs/SVG-Morpheus/0.1.8/svg-morpheus.js"></script>

<!-- Facebook API -->
<script src="//connect.facebook.net/en_US/all.js"></script>

<!-- Application -->
<script src="<?php echo $basedir; ?>config.js"></script>
<script src="<?php echo $basedir; ?>app/app.js"></script>
<script src="<?php echo $basedir; ?>app/services.js"></script>
<script src="<?php echo $basedir; ?>app/controllers.js"></script>
<script src="<?php echo $basedir; ?>app/filters.js"></script>
<script src="<?php echo $basedir; ?>app/directives.js"></script>

</body>
</html>
