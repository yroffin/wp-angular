<?php
new theme_customizer();

class theme_customizer
{
    public function __construct()
    {
        add_action ('admin_menu', array(&$this, 'customizer_admin'));
        add_action( 'customize_register', array(&$this, 'customize_manager_demo' ));
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
    public function customize_manager_demo( $wp_manager )
    {
        $this->demo_section( $wp_manager );
    }

    public function demo_section( $wp_manager )
    {
        $wp_manager->add_section( 'customiser_section', array(
            'title'          => 'Theme configuration',
            'priority'       => 35,
        ) );

        // Back Image
        $wp_manager->add_setting( 'customiser_back_image', array(
            'default' => 'http://www.google.fr',
        ) );

        $wp_manager->add_control( 'customiser_back_image', array(
            'label'   => __('Url for background image'),
            'section' => 'customiser_section',
            'description' => 'Cutomize here the background image for your site.',
            'type'    => 'text',
            'priority' => 1
        ) );

        // Facebook secure id
        $wp_manager->add_setting( 'customiser_facebook_app_id', array(
            'default' => '01234560123456789',
        ) );

        $wp_manager->add_control( 'customiser_facebook_app_id', array(
            'label'   => __('Face book app id'),
            'section' => 'customiser_section',
            'description' => 'Enter here your Facebook App ID to access to a rich set of client-side functionality for adding Social Plugins, Facebook Login and Graph API calls. If empty Facebook App Id option is disabled.',
            'type'    => 'text',
            'priority' => 1
        ) );

        // Facebook feed id
        $wp_manager->add_setting( 'customiser_facebook_feed_id', array(
            'default' => '',
        ) );

        $wp_manager->add_control( 'customiser_facebook_feed_id', array(
            'label'   => __('Face book feed id'),
            'section' => 'customiser_section',
            'description' => 'Enter here your Facebook feed id you want to browse. If empty Facebook Feed browse option is disabled.',
            'type'    => 'text',
            'priority' => 1
        ) );

        // Back image
        $wp_manager->add_setting( 'customiser_back_image', array(
            'default'        => '',
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'customiser_back_image', array(
            'label'   => 'Image Setting',
            'section' => 'customiser_section',
            'description' => 'Cutomize here the background image for your site.',
            'settings'   => 'customiser_back_image',
            'priority' => 8
        ) ) );

        // Banner
        $wp_manager->add_setting( 'customiser_banner_image', array(
            'default'        => '',
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'customiser_banner_image', array(
            'label'   => 'Banner Setting',
            'section' => 'customiser_section',
            'description' => 'Cutomize here the banner image for your site.',
            'settings'   => 'customiser_banner_image',
            'priority' => 8
        ) ) );

        // Police
        $wp_manager->add_setting( 'customiser_default_police', array(
            'default'        => 'Roboto, sans serif'
        ) );

        $wp_manager->add_control( 'customiser_default_police', array(
            'label'   => __('Default police'),
            'section' => 'customiser_section',
            'description' => 'Enter here your default font.',
            'settings'   => 'customiser_default_police'
        ) );

        $wp_manager->add_setting( 'customiser_default_police_name', array(
            'default'        => 'Roboto'
        ) );

        $wp_manager->add_control( 'customiser_default_police_name', array(
            'label'   => __('Default police'),
            'section' => 'customiser_section',
            'description' => 'Enter here your default font.',
            'settings'   => 'customiser_default_police_name'
        ) );

        // Logo
        $wp_manager->add_setting( 'customiser_logo_width', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( 'customiser_logo_width', array(
            'label'   => __('Logo width'),
            'section' => 'customiser_section',
            'description' => 'Enter here your logo width.',
            'settings'   => 'customiser_logo_width'
        ) );

        $wp_manager->add_setting( 'customiser_logo', array(
            'default'        => ''
        ) );

        $wp_manager->add_control( new WP_Customize_Image_Control( $wp_manager, 'customiser_logo', array(
            'label'   => 'Logo Setting',
            'section' => 'customiser_section',
            'description' => 'Cutomize here the logo image for your site.',
            'settings'   => 'customiser_logo',
            'priority' => 8
        ) ) );
}

}?>
