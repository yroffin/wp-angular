<?php
if (!class_exists('WP_Customize_Control')) {
    return;
}

new theme_customizer();

class JsonData extends WP_Customize_Control {
    public $type = 'json-data';

    public function render_content() {
        ?>
            <label>
                <span><?php echo esc_html( $this->label ); ?></span>
                <textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
            </label>
        <?php
    }
}

class theme_customizer
{
    public function __construct()
    {
        add_action ('admin_menu', array(&$this, 'customizer_admin'));
        add_action( 'customize_register', array(&$this, 'customize_manager_angularjs' ));
    }

    /**
     * Add the Customize link to the admin menu
     * @return void
     */
    public function customizer_admin() {
        add_theme_page( 'Customize', 'Customize', 'edit_theme_options', 'customize.php' );
    }

    /**
     * Customizer manager demo
     * @param  WP_Customizer_Manager $wp_manager
     * @return void
     */
    public function customize_manager_angularjs( $wp_manager )
    {
        $this->customize_theme( $wp_manager );
    }

    /**
     * build theme configuration
     */
    public function customize_theme( $wp_manager )
    {
        $this->theme_configuration($wp_manager, 35);
        $this->facebook_configuration($wp_manager, 36);
        $this->carousel_configuration($wp_manager, 37);
        $this->customiser_ga_key($wp_manager, 38);
        $this->home_configuration($wp_manager, 39);
    }

    /**
     * theme configuration
     */
    public function theme_configuration( $wp_manager, $wp_priority )
    {
        $wp_manager->add_section( 'wpCustomizerThemeConfiguration', array(
            'title'          => 'Theme configuration',
            'priority'       => $wp_priority,
        ) );

        // Back image
        $wp_manager->add_setting( 'wpBackImage', array(
            'default'        => '',
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'wpBackImage', array(
            'label'   => 'Image Setting',
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Cutomize here the background image for your site.',
            'settings'   => 'wpBackImage',
            'priority' => 1
        ) ) );

        // Police
        $wp_manager->add_setting( 'wpDefaultPolice', array(
            'default'        => 'Roboto, sans serif'
        ) );

        $wp_manager->add_control( 'wpDefaultPolice', array(
            'label'   => __('Default police name'),
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Enter here your default font.',
            'settings'   => 'wpDefaultPolice',
            'priority' => 2
        ) );

        $wp_manager->add_setting( 'wpDefaultPoliceName', array(
            'default'        => 'Roboto'
        ) );

        $wp_manager->add_control( 'wpDefaultPoliceName', array(
            'label'   => __('Default police'),
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Enter here your default font.',
            'settings'   => 'wpDefaultPoliceName',
            'priority' => 3
        ) );

        $wp_manager->add_setting( 'wpLogo', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'wpLogo', array(
            'label'   => 'Logo Setting',
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Cutomize here the logo image for your site.',
            'settings'   => 'wpLogo',
            'priority' => 8
        ) ) );

        // Logo
        $wp_manager->add_setting( 'wpLogoWidth', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( 'wpLogoWidth', array(
            'label'   => __('Logo width'),
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Enter here your logo width.',
            'settings'   => 'wpLogoWidth',
            'priority' => 9
        ) );

        // Logo
        $wp_manager->add_setting( 'wpLogoHeight', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( 'wpLogoHeight', array(
            'label'   => __('Logo height'),
            'section' => 'wpCustomizerThemeConfiguration',
            'description' => 'Enter here your logo height.',
            'settings'   => 'wpLogoHeight',
            'priority' => 10
        ) );
    }

    /**
     * facebook configuration
     */
    public function facebook_configuration( $wp_manager, $wp_priority )
    {
        $wp_manager->add_section( 'wpCustomizerFacebookSection', array(
            'title'          => 'Facebook configuration',
            'priority'       => $wp_priority,
        ) );

        // Facebook secure id
        $wp_manager->add_setting( 'wpFacebookAppId', array(
            'default' => '01234560123456789',
        ) );

        $wp_manager->add_control( 'wpFacebookAppId', array(
            'label'   => __('Facebook app id'),
            'section' => 'wpCustomizerFacebookSection',
            'description' => 'Enter here your Facebook App ID to access to a rich set of client-side functionality for adding Social Plugins, Facebook Login and Graph API calls. If empty Facebook App Id option is disabled.',
            'type'    => 'text',
            'priority' => 1
        ) );

        // Facebook feed id
        $wp_manager->add_setting( 'wpFacebookFeedId', array(
            'default' => '',
        ) );

        $wp_manager->add_control( 'wpFacebookFeedId', array(
            'label'   => __('Face book feed id'),
            'section' => 'wpCustomizerFacebookSection',
            'description' => 'Enter here your Facebook feed id you want to browse. If empty Facebook Feed browse option is disabled.',
            'type'    => 'text',
            'priority' => 1
        ) );
    }

    /**
     * carousel configuration
     */
    public function carousel_configuration_slide( $wp_manager, $wp_numero )
    {
        // Description
        $wp_manager->add_setting( 'wpCarouselDesc0'.$wp_numero, array(
            'default' => 'TODO',
        ) );

        $wp_manager->add_control( 'wpCarouselDesc0'.$wp_numero, array(
            'label'   => __('Description of slide '.$wp_numero),
            'section' => 'wpCustomizerCarousel',
            'description' => 'Cutomize here the description for slide0'.$wp_numero.'.',
            'type'    => 'text',
            'priority' => $wp_numero
        ) );

        // Image
        $wp_manager->add_setting( 'wpCarouselImg0'.$wp_numero, array(
            'default'        => 'TODO'
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'wpCarouselImg0'.$wp_numero, array(
            'label'   => 'Image',
            'section' => 'wpCustomizerCarousel',
            'description' => 'Cutomize here the slide0'.$wp_numero.' image.',
            'settings'   => 'wpCarouselImg0'.$wp_numero,
            'priority' => $wp_numero
        ) ) );
    }

    /**
     * CAROUSEL
     */
    public function carousel_configuration( $wp_manager, $wp_priority )
    {
        // Carousel
        $wp_manager->add_section( 'wpCustomizerCarousel', array(
            'title'          => 'Carousel configuration',
            'priority'       => $wp_priority,
        ) );

        // Carousel height
        $wp_manager->add_setting( 'wpCarouselHeight', array(
            'default' => '128px',
        ) );

        $wp_manager->add_control( 'wpCarouselHeight', array(
            'label'   => __('Carousel height'),
            'section' => 'wpCustomizerCarousel',
            'description' => 'Enter here your carousel default height.',
            'type'    => 'text',
            'priority' => 1
        ) );

        // Carousel slides
        $this->carousel_configuration_slide($wp_manager, 1);
        $this->carousel_configuration_slide($wp_manager, 2);
        $this->carousel_configuration_slide($wp_manager, 3);
        $this->carousel_configuration_slide($wp_manager, 4);
        $this->carousel_configuration_slide($wp_manager, 5);
    }

    /**
     * google analytics
     */
    public function customiser_ga_key( $wp_manager, $wp_priority )
    {
        // google analytics
        $wp_manager->add_section( 'wpCustomizerGoogleAnalytics', array(
            'title'          => 'Google analytics configuration',
            'priority'       => $wp_priority,
        ) );

        $wp_manager->add_setting( 'wpGaKey', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( 'wpGaKey', array(
            'label'   => __('Google analytics key'),
            'section' => 'wpCustomizerGoogleAnalytics',
            'description' => 'Cutomize here the google analytics key.',
            'type'    => 'text',
            'priority' => $wp_priority
        ) );
    }

    /**
     * home page configuration
     */
    public function home_configuration( $wp_manager, $wp_priority )
    {
        // home page section
        $wp_manager->add_section( 'wpCustomizerHomePage', array(
            'title'          => 'Home page configuration',
            'priority'       => $wp_priority,
        ) );

        // Tiles
        $this->home_configuration_tile($wp_manager, "01");
        $this->home_configuration_tile($wp_manager, "02");
        $this->home_configuration_tile($wp_manager, "03");
        $this->home_configuration_tile($wp_manager, "04");
        $this->home_configuration_tile($wp_manager, "05");
    }


    /**
     * home page configuration
     */
    public function home_configuration_tile( $wp_manager, $wpTileNumber )
    {
        $wpPageTileActive = 'wpTile'.$wpTileNumber.'Active';
        $wpPageTileData = 'wpTile'.$wpTileNumber.'Data';

        // tile definition type
        $wp_manager->add_setting( $wpPageTileActive, array('default' => ''));
        $wp_manager->add_control(
                $wpPageTileActive,
                array(
                    'label'          => __( 'Tile '.$wpTileNumber.' on / off' ),
                    'section'        => 'wpCustomizerHomePage',
                    'settings'       => $wpPageTileActive,
                    'type'           => 'checkbox'
                )
        );

        // data definition type
        $wp_manager->add_setting( $wpPageTileData, array(
                                        'default' => ''
                                    )
                                );

        $wp_manager->add_control(
            new JsonData(
                $wp_manager,
                $wpPageTileData,
                array(
                    'label' => 'Data',
                    'section' => 'wpCustomizerHomePage',
                    'settings' => $wpPageTileData
                )
            )
        );
    }
}?>
