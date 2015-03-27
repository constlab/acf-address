<?php
/*
Plugin Name: Advanced Custom Fields: Address
Plugin URI: PLUGIN_URL
Description: SHORT_DESCRIPTION
Version: 1.0.0
Author: AUTHOR_NAME
Author URI: AUTHOR_URL
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

const FIELD_NAME = 'address';

load_plugin_textdomain('acf-' . FIELD_NAME, false, dirname(plugin_basename(__FILE__)) . '/lang/');

function include_field_types_address($version)
{
    include_once('acf-address-v5.php');
}

add_action('acf/include_field_types', 'include_field_types_address');

function register_fields_address()
{
    include_once('acf-address-v4.php');
}

add_action('acf/register_fields', 'register_fields_address');

/*if (is_admin()) {
    require_once('ajax-controller.php');
    new ajax_controller();
}*/