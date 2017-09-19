// public/core.js
var partyPlaner = angular.module('partyPlaner', []);

function mainController($scope, $http) {
    //LEERE VARIABLE UM EINGABEN DER EVENTMASKE TEMPORÄR ZU SPEICHERN
    $scope.formData = {};
    //LEERE VARIABLE UM EINGABEN DER TEILNEHMERMASKE TEMPORÄR ZU SPEICHERN
    $scope.participantForm = {};

    // WENN SEITE AUFGERUFEN WIRD SOLLEN ALLE EVENTS ANGEZEIGT WERDEN
    $http.get('/api/events') //ANFRAGE AN BACKEND UNTER DER ADRESSE '/api/events'
        .success(function(data) { //BEI ERFOLGREICHER ANFRAGE...
            $scope.events = data; //WIRD VARIABLE $scope.events AUF WERTE DES BACKENDS GESETZT
            console.log(data); //ZUR KONTROLLE WERDEN DATEN AUSGEGEBEN
        })
        .error(function(data) { //BEI FEHLERHAFTEN ANFRAGE...
            console.log('Error: ' + data); //WIRD DIE FEHLERMELDUNG AUSGEGEBEN
        });

    // FUNKTION ZUM ERSTELLEN EINES EVENTS
    $scope.createEvent = function() {
        $http.post('/api/events', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.events = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // FUNKTION UM TEILNEHMER HINZUZUFÜGEN
    $scope.addParticipant = function(id) {
        $http.put('/api/events/add/' + id, $scope.participantForm)
            .success(function(data) {
                $scope.participantForm = {}; // clear the form so our user is ready to enter another
                $scope.events = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // FUNKTION UM EVENT ZU LÖSCHEN
    $scope.deleteEvent = function(id) {
        $http.delete('/api/events/' + id)
            .success(function(data) {
                $scope.events = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
