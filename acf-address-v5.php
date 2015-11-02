<?php

class acf_field_address extends acf_field {

	/*
*  __construct
*
*  This function will setup the field type data
*
*  @type	function
*  @date	5/03/2014
*  @since	5.0.0
*
*  @param	n/a
*  @return	n/a
*/

	function __construct() {

		/*
		*  name (string) Single word, no spaces. Underscores allowed
		*/

		$this->name = 'address';


		/*
		*  label (string) Multiple words, can include spaces, visible when selecting a field type
		*/

		$this->label = 'Адрес';//__('Address', 'acf-address');


		/*
		*  category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
		*/

		$this->category = 'basic';


		/*
		*  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
		*/

		$this->defaults = array(
			'font_size' => 14,
		);


		/*
		*  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
		*  var message = acf._e('FIELD_NAME', 'error');
		*/

		$this->l10n = array(
			'error' => __( 'Error! Please enter a higher value', 'acf-address' ),
		);


		// do not delete!
		parent::__construct();

	}

	/*
	*  render_field_settings()
	*
	*  Create extra settings for your field. These are visible when editing a field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field_settings( $field ) {

		/*
		*  acf_render_field_setting
		*
		*  This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
		*  The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
		*
		*  More than one setting can be added by copy/paste the above code.
		*  Please note that you must also have a matching $defaults value for the field name (font_size)
		*/

		/*acf_render_field_setting($field, array(
			'label' => __('Font Size', 'acf-address'),
			'instructions' => __('Customise the input font size', 'acf-address'),
			'type' => 'number',
			'name' => 'font_size',
			'prepend' => 'px',
		));*/
	}

	/*
	*  render_field()
	*
	*  Create the HTML interface for your field
	*
	*  @param	$field (array) the $field being rendered
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field( $field ) {

		/*
		*  Review the data of $field.
		*  This will show what data is available
		*/

		/*echo '<pre>';
		print_r($field);
		echo '</pre>';*/


		/*
		*  Create a simple text input using the 'font_size' setting.
		*/


		$field_id = $field['id'] . '-' . uniqid();

		?>
		<?php add_thickbox(); ?>


		<?php echo uniqid() ?>


		<div id="dialog-<?php echo $field_id ?>" style="display:none;">
			<div class="map" style="width: 100%; height: 400px"></div>

			<input type="text" name="<?php echo esc_attr( $field['name'] ) ?>"
			       value="<?php echo esc_attr( $field['value'] ) ?>"
			       style="display: none"/>

			<table id="form-address" class="form-table">
				<tbody>
				<tr>
					<th scope="row">
						Адрес
					</th>
					<td>
						<fieldset>
							<input type="text" name="address"/>
						</fieldset>
					</td>
				</tr>
				<tr>
					<th scope="row">
						Полный адрес
					</th>
					<td>
						<fieldset>
							<input type="text" name="address_full"/>
						</fieldset>
					</td>
				</tr>
				<tr class="metro-row">
					<th scope="row">
						Ближайшее метро
					</th>
					<td>
						<fieldset>
							<input type="text" name="metro"/>
						</fieldset>
					</td>
				</tr>
				<tr class="metro-row">
					<th scope="row">
						Ближайшее метро <br/>

						<p class="description">Полный адрес</p>
					</th>
					<td>
						<fieldset>
							<input type="text" name="metro_full"/>
						</fieldset>
					</td>
				</tr>
				<tr class="metro-row">
					<th scope="row">
						Расстояние до метро
					</th>
					<td>
						<fieldset>
							<input type="text" name="metro_dist"/>
						</fieldset>
					</td>
				</tr>
				</tbody>
			</table>
			<p class="submit" style="text-align: right">
				<button class="button address-btn-cancel">Отмена</button>
				&nbsp;
				<button class="button button-primary" id="address-btn-ok">Сохранить</button>
			</p>

		</div>

		<div class="acf-input-parent">
			<div class="acf-input-left">
				<input type="text" id="acf-address-display" style="width: 100%" readonly/>
			</div>
			<div class="acf-input-right">
				<a href="#" class="button" id="acf-address-clear">Очистить</a>&nbsp;
				<a href="#TB_inline?width=900&height=400&inlineId=dialog-<?php echo $field_id ?>"
				   class="button thickbox" id="acf-address-btn">Выбрать адрес</a>
			</div>
		</div>

		<script>
			(function ($) {
				$(document).ready(function () {
					//init_map('<?php echo $field_id ?>');
				});
			})(jQuery);
		</script>

		<?php
	}


	/*
	*  input_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
	*  Use this action to add CSS + JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function input_admin_enqueue_scripts() {

		$dir = plugin_dir_url( __FILE__ );

		// register & include CSS
		wp_register_style( 'acf-input-address', "{$dir}css/acf-address.css" );
		wp_enqueue_style( 'acf-input-address' );

		wp_register_script( 'yandex-map-api', 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU', array( 'jquery' ), null, true );
		wp_enqueue_script( 'yandex-map-api' );

		wp_register_script( 'yandex-geo-btn', "{$dir}js/geolocation-button.js", array( 'yandex-map-api' ), null, true );
		wp_enqueue_script( 'yandex-geo-btn' );

		wp_register_script( 'acf-address', "{$dir}js/acf-address.js", array( 'yandex-map-api' ), null, true );
		wp_enqueue_script( 'acf-address' );

		/*wp_register_script( 'yandex-location-tool', "{$dir}js/location-tool.js", array('yandex-map-api'), null, true );
		wp_enqueue_script( 'yandex-location-tool' );

		wp_register_script( 'yandex-cross-control', "{$dir}js/cross-control.js", array('yandex-map-api'), null, true );
		wp_enqueue_script( 'yandex-cross-control' );


		wp_register_script( 'acf-input-address', "{$dir}js/input-map.js", array( 'yandex-map-api' ), null, true );
		wp_enqueue_script( 'acf-input-address' );*/


		wp_localize_script( 'yandex-geo-btn', 'btn', array(
			'img'   => "{$dir}img/wifi.png",
			'metro' => "{$dir}img/metro.png",
		) );

	}


	/*
	*  input_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	/*

	function input_admin_head() {



	}

	*/


	/*
	   *  input_form_data()
	   *
	   *  This function is called once on the 'input' page between the head and footer
	   *  There are 2 situations where ACF did not load during the 'acf/input_admin_enqueue_scripts' and
	   *  'acf/input_admin_head' actions because ACF did not know it was going to be used. These situations are
	   *  seen on comments / user edit forms on the front end. This function will always be called, and includes
	   *  $args that related to the current screen such as $args['post_id']
	   *
	   *  @type	function
	   *  @date	6/03/2014
	   *  @since	5.0.0
	   *
	   *  @param	$args (array)
	   *  @return	n/a
	   */

	/*

	   function input_form_data( $args ) {



	   }

	   */


	/*
	*  input_admin_footer()
	*
	*  This action is called in the admin_footer action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_footer)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	/*

	function input_admin_footer() {



	}

	*/


	/*
	*  field_group_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is edited.
	*  Use this action to add CSS + JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	/*

	function field_group_admin_enqueue_scripts() {

	}

	*/

	/*
	*  field_group_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is edited.
	*  Use this action to add CSS and JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/
	/*

	function field_group_admin_head() {

	}

	*/
	/*
	*  load_value()
	*
	*  This filter is applied to the $value after it is loaded from the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/

	/*

	function load_value( $value, $post_id, $field ) {

		return $value;

	}

	*/


	/*
	*  update_value()
	*
	*  This filter is applied to the $value before it is saved in the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/

	/*

	function update_value( $value, $post_id, $field ) {

		return $value;

	}

	*/


	/*
	*  format_value()
	*
	*  This filter is appied to the $value after it is loaded from the db and before it is returned to the template
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value which was loaded from the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*
	*  @return	$value (mixed) the modified value
	*/

	/*

	function format_value( $value, $post_id, $field ) {

		// bail early if no value
		if( empty($value) ) {

			return $value;

		}


		// apply setting
		if( $field['font_size'] > 12 ) {

			// format the value
			// $value = 'something';

		}


		// return
		return $value;
	}

	*/


	/*
	*  validate_value()
	*
	*  This filter is used to perform validation on the value prior to saving.
	*  All values are validated regardless of the field's required setting. This allows you to validate and return
	*  messages to the user if the value is not correct
	*
	*  @type	filter
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$valid (boolean) validation status based on the value and the field's required setting
	*  @param	$value (mixed) the $_POST value
	*  @param	$field (array) the field array holding all the field options
	*  @param	$input (string) the corresponding input name for $_POST value
	*  @return	$valid
	*/

	/*

	function validate_value( $valid, $value, $field, $input ){

		// Basic usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = false;
		}


		// Advanced usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = __('The value is too little!','acf-FIELD_NAME'),
		}


		// return
		return $valid;

	}

	*/


	/*
	*  delete_value()
	*
	*  This action is fired after a value has been deleted from the db.
	*  Please note that saving a blank value is treated as an update, not a delete
	*
	*  @type	action
	*  @date	6/03/2014
	*  @since	5.0.0
	*
	*  @param	$post_id (mixed) the $post_id from which the value was deleted
	*  @param	$key (string) the $meta_key which the value was deleted
	*  @return	n/a
	*/

	/*

	function delete_value( $post_id, $key ) {



	}

	*/


	/*
	*  load_field()
	*
	*  This filter is applied to the $field after it is loaded from the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/

	/*

	function load_field( $field ) {

		return $field;

	}

	*/


	/*
	*  update_field()
	*
	*  This filter is applied to the $field before it is saved to the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/

	/*

	function update_field( $field ) {

		return $field;

	}

	*/


	/*
	*  delete_field()
	*
	*  This action is fired after a field is deleted from the database
	*
	*  @type	action
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	n/a
	*/

	/*

	function delete_field( $field ) {



	}

	*/


}

// create field
new acf_field_address();