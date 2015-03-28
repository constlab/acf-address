(function ($) {

    ymaps.ready(function () {

        /**
         * Массив сохраняемых данных
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
                point: geoPoint
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
                    field.addressMetroFull = getObject.properties.get('text');

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
                field.addressFull = getObject.properties.get('text');

                updateField();
            });

        }

        /**
         * Обновление полей с адресом
         */
        function updateField() {

            $('input[name="address"]').val(field.address);
            $('input[name="address_full"]').val(field.addressFull);

            console.log(field);
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
            moscowMetro['Серпуховско-Тимирязевская'] = 'line_9';
            moscowMetro['Люблинско-Дмитровская'] = 'line_10';
            moscowMetro['Каховская'] = 'line_11';
            moscowMetro['Бутовская'] = 'line_12';

            return moscowMetro[metro];

        }

        $('#address-btn-cancel').click(function () {
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

            addressMap = new ymaps.Map('map', {
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

        field = JSON.parse($('#acf-address-input').val());
        $('#acf-address-display').val(field.addressFull);

    });

})(jQuery);