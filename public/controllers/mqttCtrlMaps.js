angular.module('mqttCtrlMaps', [])

    .controller('mqttControllerMaps', function($scope) {

        var conect = function () {
            client = new Paho.MQTT.Client("m12.cloudmqtt.com", Number(30310), "esp8266" + parseInt(Math.random() * 100, 10));
            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;
        }

        conect();

        conect();

        // connect the client
        var options = {
            useSSL: true,
            userName: "bpfkktrd",
            password: "zdu9SCC_2duo",
            cleanSession: true,
            onSuccess:onConnect,
            onFailure:doFail
        }

        //client.connect({onSuccess:onConnect});
        client.connect(options);


        // called when the client connects
        function onConnect() {
            //console.log("Conectado ao Broker com sucesso");
            client.subscribe("owntracks/bpfkktrd/J7");
        }

        function doFail(){
            //console.log("dofail");
            $scope.statusMqtt = 'Conexão Perdida'
        }
        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                //console.log("onConnectionLost:"+responseObject.errorMessage);
                //console.log('Broker desconectado...')
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {

            //console.log('Message Arrived: ' + message.payloadString);
            //console.log('Topic:     ' + message.destinationName);

            if(message.destinationName == 'owntracks/bpfkktrd/J7'){
                //console.log("wemos: " + message.payloadString);
                var gps = angular.fromJson(message.payloadString);
                $scope.gps = gps;
                //console.log($scope.gps);
                $scope.bateria = gps.batt;
                var data = gps.tst;

                $scope.data = new Date(data * 1000)

                var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(gps.lat, gps.lon),
                    mapTypeId: google.maps.MapTypeId.SATTELITE,

                    scrollwheel: false, // Disable Mouse Scroll zooming (Essential for responsive sites!)
                    // All of the below are set to true by default, so simply remove if set to true:
                    panControl:false, // Set to false to disable
                    mapTypeControl:false, // Disable Map/Satellite switch
                    scaleControl:false, // Set to false to hide scale
                    streetViewControl:false, // Set to disable to hide street view
                    overviewMapControl:false, // Set to false to remove overview control
                    rotateControl:false // Set to false to disable rotate control
                }

                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                $scope.markers = [];

                var pessoas = [
                    {
                        city : 'Casa',
                        desc : 'Minha residência!' + gps.tst,
                        lat : -16.715971,
                        long : -49.368871
                    },
                    {
                        city : 'Marcelo',
                        desc : 'Ultima localização: ' + $scope.data,
                        lat : gps.lat,
                        long : gps.lon
                    }
                ];

                var infoWindow = new google.maps.InfoWindow();

                var createMarker = function (info){

                    var icon = {
                        url: "https://avatars3.githubusercontent.com/u/10326782?v=4&s=460", // url
                        scaledSize: new google.maps.Size(50, 50), // scaled size
                        origin: new google.maps.Point(0,0), // origin
                        anchor: new google.maps.Point(0, 0) // anchor
                    };


                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(info.lat, info.long),
                        title: info.city,
                        icon: icon
                    });
                    marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                    google.maps.event.addListener(marker, 'click', function(){
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });

                    $scope.markers.push(marker);

                }

                for (i = 0; i < pessoas.length; i++){
                    createMarker(pessoas[i]);
                }

                $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                }

            }

        }

    });

