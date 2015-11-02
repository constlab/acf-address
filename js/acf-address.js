function init_map(field_id) {
    //console.log(field_id);
}

/*acf.fields.address = acf.field.extend({
 type: 'address',
 $el: null,
 $input: null,

 status: '', // '', 'loading', 'ready'
 geocoder: false,
 map: false,
 maps: {},
 pending: $(),
 actions: {
 'ready': 'initialize'
 },
 initialize: function () {
 console.log('init');
 }
 });*/

(function ($) {
    function initialize_field($el) {

        console.log('init hook');
        console.log($el);

        initMap($el);


    }


    if (typeof acf.add_action !== 'undefined') {

        /*
         *  ready append (ACF5)
         *
         *  These are 2 events which are fired during the page load
         *  ready = on page load similar to $(document).ready()
         *  append = on new DOM elements appended via repeater field
         *
         *  @type	event
         *  @date	20/07/13
         *
         *  @param	$el (jQuery selection) the jQuery element which contains the ACF fields
         *  @return	n/a
         */

        acf.add_action('ready append', function ($el) {

            // search $el for fields of type 'FIELD_NAME'
            acf.get_fields({type: 'address'}, $el).each(function () {

                initialize_field($(this));

            });

        });


    } else {


        /*
         *  acf/setup_fields (ACF4)
         *
         *  This event is triggered when ACF adds any new elements to the DOM.
         *
         *  @type	function
         *  @since	1.0.0
         *  @date	01/01/12
         *
         *  @param	event		e: an event object. This can be ignored
         *  @param	Element		postbox: An element which contains the new HTML
         *
         *  @return	n/a
         */

        $(document).on('acf/setup_fields', function (e, postbox) {

            $(postbox).find('.field[data-field_type="address"]').each(function () {

                initialize_field($(this));

            });

        });


    }


    function initMap($mapElement) {

        ymaps.ready(function () {

            /**
             * Массив сохраняемых данных
             *
             * address - краткий адрес, без города
             * addressFull - полный адрес, с городом
             * coordinates - координаты адреса
             * coordinatesMetro - координаты ближайшей станции метро
             * metroDist - расстояние до ближайшей станции метро (в метрах)
             * addressMetro - адрес ближайшей станции метро
             * addressMetroFull - полный адрес ближайшей станции метро
             * metroLine - ближайшая линия метро, формат line_{number}
             *
             * @type {{}}
             */
            var field = {};

            /**
             * Центр карты и координаты метки по умолчанию
             * @type {number[]}
             */
            var centerMap = [55.753994, 37.622093];

            /**
             * Карта
             * @type {undefined}
             */
            var addressMap = undefined;

            /**
             * Метка
             * @type {ymaps.GeoObject}
             */
            var geoPoint = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: centerMap
                }
            }, {
                preset: 'islands#blackStretchyIcon',
                draggable: true
            });

            geoPoint.events.add('dragend', function () {
                changeLocation();
            });

            /**
             * Кнопка определения местоположения
             * @type {GeolocationButton}
             */
            var geolocationButton = new GeolocationButton({
                data: {
                    image: btn.img,
                    title: 'Определить местоположение'
                },
                geolocationOptions: {
                    enableHighAccuracy: true,
                    noPlacemark: false,
                    point: geoPoint,
                    afterSearch: function () {
                        changeLocation()
                    }
                }
            }, {
                selectOnClick: false
            });

            /**
             * Строка поиска адреса
             * @type {ymaps.control.SearchControl}
             */
            var searchControl = new ymaps.control.SearchControl({
                noPlacemark: true
            });

            searchControl.events.add('resultselect', function (e) {
                var index = e.get("resultIndex");
                var result = searchControl.getResult(index);

                result.then(function (res) {
                    var geo = res.geometry.getCoordinates();
                    geoPoint.geometry.setCoordinates(geo);
                    changeLocation();
                });

            });

            /**
             * Кнопка для поиска ближайшего метро
             * @type {Button}
             */
            var button = new ymaps.control.Button({
                data: {
                    image: btn.metro,
                    title: 'Найти ближайшее метро'
                }
            }, {
                selectOnClick: false
            });

            button.events.add('click', function () {
                findMetro();
            });

            /**
             * Поиск ближайшего метро
             */
            function findMetro() {
                ymaps.geocode(field.coordinates, {
                    kind: 'metro',
                    results: 1
                }).then(function (res) {
                    if (res.geoObjects.getLength()) {
                        var m0 = res.geoObjects.get(0);
                        var coords = m0.geometry.getCoordinates();

                        field.coordinatesMetro = coords;

                        var dist = ymaps.coordSystem.geo.getDistance(field.coordinates, coords);

                        field.metroDist = Math.round(dist).toFixed(0);

                        res.geoObjects.options.set('preset', 'twirl#metroMoscowIcon');
                        addressMap.geoObjects.add(res.geoObjects);

                        var getObject = res.geoObjects.get(0);
                        field.addressMetro = getObject.properties.get('name');
                        field.addressMetroFull = getObject.properties.get('text').replace('Россия,', '').trim();

                        $('.metro-row').show();
                        $('input[name="metro"]').val(field.addressMetro);
                        $('input[name="metro_full"]').val(field.addressMetroFull);
                        $('input[name="metro_dist"]').val(field.metroDist);

                        var metroLine = colorMetro(field.addressMetroFull);
                        if (metroLine != undefined)
                            field.metroLine = metroLine;

                    }
                });
            }

            /**
             * Событие при смене координат
             */
            function changeLocation() {
                var coord = geoPoint.geometry.getCoordinates();
                field.coordinates = coord;

                ymaps.geocode(coord).then(function (res) {
                    var getObject = res.geoObjects.get(0);
                    field.address = getObject.properties.get('name');
                    field.addressFull = getObject.properties.get('text').replace('Россия,', '').trim();

                    updateField();
                });

            }

            /**
             * Обновление полей с адресом
             */
            function updateField() {
                $('input[name="address"]').val(field.address);
                $('input[name="address_full"]').val(field.addressFull);
            }

            /**
             * Загрузка данных
             */
            function loadField() {
                //field = JSON.parse($('#acf-address-input').val());
                updateField();

                var loadCoord = (field.coordinates != undefined) ? field.coordinates : centerMap;
                var loadZoom = (field.zoom != undefined) ? field.zoom : 10;

                geoPoint.geometry.setCoordinates(loadCoord);
                addressMap.setCenter(loadCoord);
                addressMap.setZoom(loadZoom);

                if (field.addressMetro != undefined || field.addressMetroFull != undefined) {
                    $('.metro-row').show();
                    $('input[name="metro"]').val(field.addressMetro);
                    $('input[name="metro_full"]').val(field.addressMetroFull);
                    $('input[name="metro_dist"]').val(field.metroDist);

                }

            }

            /**
             * Возвращает номер линии метро
             *
             * @param metro
             * @returns {*}
             */
            function colorMetro(metro) {
                var metroArray = metro.split(',');
                if (metroArray.length >= 3) {
                    metro = metroArray[2].replace('линия', '').trim();
                } else
                    return undefined;

                var moscowMetro = {};

                moscowMetro['Сокольническая'] = 'line_1';
                moscowMetro['Замоскворецкая'] = 'line_2';
                moscowMetro['Арбатско-Покровская'] = 'line_3';
                moscowMetro['Филёвская'] = 'line_4';
                moscowMetro['Кольцевая'] = 'line_5';
                moscowMetro['Калужско-Рижская'] = 'line_6';
                moscowMetro['Таганско-Краснопресненская'] = 'line_7';
                moscowMetro['Калининско-Солнцевская'] = 'line_8';
                moscowMetro['Калининская'] = 'line_8';
                moscowMetro['Серпуховско-Тимирязевская'] = 'line_9';
                moscowMetro['Люблинско-Дмитровская'] = 'line_10';
                moscowMetro['Каховская'] = 'line_11';
                moscowMetro['Бутовская'] = 'line_12';

                return moscowMetro[metro];

            }

            $('.address-btn-cancel').click(function () {
                tb_remove();
            });

            $('#address-btn-ok').click(function () {
                $('#acf-address-input').val(JSON.stringify(field));
                $('#acf-address-display').val(field.addressFull);
                tb_remove();
            });

            $('#acf-address-btn').click(function () {

                if (addressMap != undefined)
                    addressMap.destroy();

                addressMap = new ymaps.Map($mapElement, {
                    center: centerMap,
                    zoom: 9,
                    behaviors: ['default', 'scrollZoom']
                });

                addressMap.events.add('boundschange', function (e) {
                    var zoom = e.get("newZoom");
                    field.zoom = zoom;
                });

                addressMap.controls
                    .add(geolocationButton, {top: 5, left: 100})
                    .add('zoomControl')
                    .add('typeSelector', {top: 5, right: 5})
                    .add(button, {top: 5, left: 65})
                    .add(searchControl, {top: 5, left: 200});

                addressMap.geoObjects.add(geoPoint);

                loadField();

            });

            $('#acf-address-clear').click(function () {
                field = {};

                $('.metro-row').hide();

                $('#acf-address-display').val('');
                $('#acf-address-display').val('');
                $('input[name="metro"]').val('');
                $('input[name="metro_full"]').val('');
                $('input[name="metro_dist"]').val('');
            });

            $('#acf-address-display').click(function () {
                $('#acf-address-btn').trigger('click');
            });

            field = JSON.parse($('#acf-address-input').val());
            $('#acf-address-display').val(field.addressFull);

        });
    }

})(jQuery);