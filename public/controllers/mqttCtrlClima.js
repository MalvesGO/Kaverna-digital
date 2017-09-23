angular.module('mqttCtrlClima', ['ngAnimate'])

    .controller('mqttControllerClima', function($scope, $firebaseArray, $http) {

        var vm = this;

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

            client.subscribe("wemos/sensor/temperature");
            client.subscribe("wemos/sensor/humidity");
            client.subscribe("wemos/sensor/voltage");
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

        }
    });

