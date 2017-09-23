angular.module('mqttCtrl', ['angularMoment', 'ngAnimate'])

    .controller('mqttController', function($scope, $firebaseArray, $http) {

        var vm = this;

        var current_time = new moment ().format("HH:mm");

        vm.name ='Marcelo';

        client = new Paho.MQTT.Client("m12.cloudmqtt.com", Number(30310), "esp8266" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;


        // connect the client
        var options = {
            useSSL: true,
            userName: "bpfkktrd",
            password: "zdu9SCC_2duo",
            cleanSession: true,
            onSuccess:onConnect,
            onFailure:doFail
        }

        $scope.loader = {
            loading: true,
        };

        //client.connect({onSuccess:onConnect});
        client.connect(options);

        //Inicializando as variáveis de ambiente
        $scope.statusMqtt = 'Conectando ao servidor Mqtt...'
        $scope.temperatura = 0;
        $scope.umidade = 0;
        $scope.voltage = 0;
        $scope.wats = 0;
        $scope.cl = 0.00;
        $scope.watsHora = 0;

        //Iniciando o controle de eletrecidade
        $scope.voltagem = 0;
        $scope.amperagem = 0;

        $scope.statusTemp = function(){
            return "panel bg-red";
        }

        $scope.nivelTemp = function(){
            return "fa fa-cog fa-spin fa-5x";
        }

        $scope.msgTemp = 'Sincronizando...'

        $scope.statusUmi = function(){
            return "panel bg-red";
        }

        $scope.nivelUmi = function(){
            return "fa fa-cog fa-spin fa-5x";
        }

        $scope.msgUmi = 'Sincronizando...'

        $scope.statusBateria = function(){
            return "panel bg-red";
        }

        $scope.nivelBateria = function(){
            return "fa fa-cog fa-spin fa-5x";
        }

        $scope.msgBateria = 'Sincronizando...'

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a       message.
            $scope.statusMqtt = 'Conectado'

            $scope.loader = {
                loading: false,
            };

            //console.log("Conectado ao Broker com sucesso");
            client.subscribe("io.m2m/arduino/lightsensor");
            client.subscribe("v1/devices/me/telemetry");
            client.subscribe("owntracks/bpfkktrd/J7");
            client.subscribe("wemos/sensor/temperature");
            client.subscribe("wemos/sensor/humidity");
            client.subscribe("wemos/sensor/voltage");
            client.subscribe('wemos/eletrecidade')
            client.subscribe("wemos");

            //message = new Paho.MQTT.Message("Hello");
            //message.destinationName = "World";
            //client.send(message);
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

            if (message.destinationName == "wemos"){
                //console.log("wemos: " + message.payloadString);
                var wemos = angular.fromJson(message.payloadString);
                $scope.wemos = wemos;
                //console.log($scope.wemos);

                $scope.luz = wemos.luz;

                if($scope.luz == 0){
                    $scope.statusLuz = 'OFF'
                }else{
                    $scope.statusLuz = 'ON'
                }
            }

            if(message.destinationName == 'wemos/sensor/temperature'){
                var t = angular.fromJson(message.payloadString);
                //console.log('Temperatura atual é: ' + t)
                $scope.temperatura = t;

                $scope.msgTemp = 'Temperatura'

                $scope.statusTemp = function(){
                    if ($scope.temperatura < 18){
                        return "panel bg-aqua";
                    }if ($scope.temperatura >= 18 && $scope.temperatura <= 28){
                        return "panel bg-yellow";
                    }
                    else{
                        return "panel bg-red";
                    }
                }

                $scope.nivelTemp = function(){
                    if ($scope.temperatura <18){
                        return "fa fa-thermometer-empty fa-5x";
                    }if ($scope.temperatura >= 18 && $scope.temperatura <= 28){
                        return "fa fa-thermometer-half fa-5x";
                    }else {
                        return "fa fa-thermometer-full fa-5x";
                    }
                }
            }

            if(message.destinationName == 'wemos/sensor/humidity'){
                var h = angular.fromJson(message.payloadString);
                //console.log('Umidade atual é: ' + h)
                $scope.umidade = h;

                $scope.msgUmi = 'Umidade'

                $scope.statusUmi = function(){
                    if ($scope.umidade < 18){
                        return "panel bg-red";
                    }if ($scope.umidade >= 18 && $scope.umidade <= 50){
                        return "panel bg-green";
                    } else{
                        return "panel bg-aqua";
                    }
                }

                $scope.nivelUmi = function(){
                    if ($scope.umidade <18){
                        return "fa fa-cloud fa-5x";
                    }if ($scope.umidade >= 18 && $scope.umidade <= 60){
                        return "fa fa-mixcloud fa-5x";
                    }else {
                        return "fa fa-cloud-download fa-5x";
                    }
                }

            }

            if(message.destinationName == 'wemos/sensor/voltage'){
                var v = angular.fromJson(message.payloadString);
                //console.log('Votagem atual é: ' + v)
                $scope.voltage = v;
                $scope.msgBateria = 'Bateria'

                $scope.statusBateria = function(){
                    if ($scope.voltage < 3.3){
                        return "panel bg-red";
                    }if ($scope.voltage >= 3.3 && $scope.voltage <= 3.8){
                        return "panel bg-yellow";
                    }
                    else{
                        return "panel bg-green";
                    }
                }

                $scope.nivelBateria = function(){
                    if ($scope.voltage < 3.3){
                        return "fa fa-battery-quarter fa-5x";
                    }if ($scope.voltage >= 3.3 && $scope.voltage <= 3.8){
                        return "fa fa-battery-half fa-5x";
                    }
                    if ($scope.voltage > 3.8){
                        return "fa fa-battery-full fa-5x";
                    }
                }
            }

            if(message.destinationName == 'wemos/eletrecidade'){
                var dados = angular.fromJson(message.payloadString);
                $scope.voltagem = dados.voltagem;
                $scope.amperagem = dados.amperagem;
                $scope.wats = dados.wats;
                $scope.watsHora = dados.watsHora;
                var contaLuz = parseFloat((dados.watsHora /1000) * 0.6).toFixed(2);
                $scope.cl = contaLuz;
                console.log($scope.cl)

                //console.log('Eletrecidade atual é: ' + dados.voltagem)

            }


            if(message.destinationName == 'v1/devices/me/telemetry'){
                var temp = angular.fromJson(message.payloadString);
                $scope.temp = temp;
                //console.log($scope.temp);
                $scope.temperatura = temp.temperature;
                $scope.umidade = temp.humidity;

                if( $scope.temperatura < 20){
                    swal({
                            title: "Que calor esta fazendo",
                            text: "Deseja ligar o ar condicionado?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "Sim, ligar!",
                            cancelButtonText: "Não, agora não!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                swal("Deleted!", "Your imaginary file has been deleted.", "success");
                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });
                }
            }

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


        $scope.liga = function() {
            message = new Paho.MQTT.Message("0");
            message.destinationName = "/ESP/LED";
            client.send(message);
        };

        $scope.desliga = function() {
            message = new Paho.MQTT.Message("1");
            message.destinationName = "/ESP/LED";
            client.send(message);
        };
    });

