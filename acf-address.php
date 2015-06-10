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

/**
 * Функция для использования в шаблонах
 *
 * @param $field_selector
 * @param int $post_id
 * @param bool $full
 * @return string
 */
function address_field($field_selector, $post_id = 0, $full = true)
{
    if ($post_id == 0) {
        $post_id = get_the_ID();
    }

    if (!$post_id) {
        return '';
    }

    $field = get_field($field_selector, $post_id);
    if (empty($field)) {
        return '';
    }

    $field = json_decode($field);
    $address = ($full) ? $field->addressFull : $field->address;

    if ($field->addressMetro) {
        return '<div class="metro ' . $field->metroLine . '" title="' . $field->addressMetro . ' (около ' . $field->metroDist . ' м.)"></div>' . $address;
    }

    return $address;
}