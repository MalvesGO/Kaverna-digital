angular.module('mqttCtrlEnergia', [])

    .controller('mqttControllerEnergia', function($scope) {

        var vm = this;

        var conect = function () {
            client = new Paho.MQTT.Client("m12.cloudmqtt.com", Number(30310), "esp8266" + parseInt(Math.random() * 100, 10));
            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;
        }

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

        $scope.loader = {
            loading: true,
        };

        //client.connect({onSuccess:onConnect});
        client.connect(options);


        // called when the client connects
        function onConnect() {
            //console.log("Conectado ao Broker com sucesso");
            client.subscribe('wemos/eletrecidade')
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

            if(message.destinationName == 'wemos/eletrecidade'){

                $scope.statusMqtt = 'Conectado'

                $scope.loader = {
                    loading: false,
                };
            }

            //console.log('Message Arrived: ' + message.payloadString);
            //console.log('Topic:     ' + message.destinationName);

            if(message.destinationName == 'wemos/eletrecidade'){
                var dados = angular.fromJson(message.payloadString);
                $scope.voltagem = dados.voltagem;
                $scope.amperagem = dados.amperagem;
                $scope.wats = dados.wats;
                $scope.watsHora = dados.watsHora;
                var contaLuz = parseFloat((dados.watsHora /1000) * 0.6).toFixed(2);
                $scope.cl = contaLuz;
                //console.log('Consumo eletrico ' + $scope.cl)

                $scope.statusVoltagem = function(){
                    if ($scope.voltagem < 200){
                        return "panel bg-red";
                    }if ($scope.voltagem >= 200){
                        return "panel bg-green";
                    }
                }

                $scope.statusAmperagem = function(){
                    if ($scope.amperagem < 10){
                        return "panel bg-green";
                    }if ($scope.amperagem >= 10){
                        return "panel bg-red";
                    }
                }

                $scope.statusWats = function(){
                    if ($scope.wats < 300){
                        return "panel bg-green";
                    }if ($scope.wats >= 300 && $scope.wats <= 600){
                        return "panel bg-yellow";
                    }
                    else{
                        return "panel bg-red";
                    }
                }

                $scope.statusCl = function(){
                    if ($scope.cl < 30){
                        return "panel bg-green";
                    }if ($scope.cl >= 30 && $scope.cl <= 80){
                        return "panel bg-yellow";
                    }
                    else{
                        return "panel bg-red";
                    }
                }

            }

        }

    });

