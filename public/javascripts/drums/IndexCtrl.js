var IndexCtrl = angular.module('drums.controllers').controller('IndexCtrl', 
['$scope', function ($scope) {
  
  // hower.js should be on the dom
  var soundBd = new Howl({
    urls: ['/sounds/tr-626/TR-626 Kick 1.wav']
  });
  var soundSd = new Howl({
    urls: ['/sounds/tr-626/TR-626 Snare 1.wav']
  });

  var soundOh = new Howl({
    urls: ['/sounds/tr-626/TR-626 Hat Open.wav']
  });

  var soundCh = new Howl({
    urls: ['/sounds/tr-626/TR-626 Hat Closed.wav']
  });

  $scope.beats = 4;
  $scope.bpm = 120;
  $scope.tick = 1/16;
  $scope.loop = false;
  $scope.instruments = [
    {name: 'BD', ticks: [], sound: soundBd},
    {name: 'SD', ticks: [], sound: soundSd},
    {name: 'OH', ticks: [], sound: soundOh},
    {name: 'CH', ticks: [], sound: soundCh}
  ];

  $scope.getSecondsBetweenEachTick = function() {
    var quarterNote = 1/4,
        ticksPerSecond = quarterNote / $scope.tick * $scope.bpm / 60;
    return 1 / ticksPerSecond;
  };


  $scope.getTotalTicks = function() {
    return Math.floor($scope.beats / $scope.tick);
  };


  /**
   * On re-assigning how many beats there are, add those ticks.
   * On initializing, create that many empty ticks.
   */
  $scope.createTicks = function() {
    var numberOfTicks = $scope.getTotalTicks();
    for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
      var instrument = $scope.instruments[i];
      instrument.ticks = new Array(numberOfTicks);

      for (var t = 0; t < numberOfTicks; t += 1) {
        instrument.ticks[t] = 0;
      }

    }
  };

  $scope.toggleTick = function(instrument, tickIndex) {
    if (instrument.ticks[tickIndex]) {
      instrument.ticks[tickIndex] = 0;
    } else {
      instrument.ticks[tickIndex] = 1;
    }
  };


  $scope.play = function() {
    var pauseTime = $scope.getSecondsBetweenEachTick() * 1000,
        maxTimes = 16,
        index = -1;

    function loop(){
      index += 1;
      for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
        var instrument = $scope.instruments[i];
        if (instrument.ticks[index]) {
          instrument.sound.play();
        }
      }
      if (index < maxTimes) {
        setTimeout(loop, pauseTime);
      }
    }
    loop();
   // var totalTicks = $scope.getTotalTicks(),
   //     totalInstruments = $scope.instruments.length;
   // for (var instrument = 0; instrument < totalInstruments; instrument += 1) {
   //   var currentInstrument = $scope.instruments[instrument];
   //   for (var tick = 0; tick < totalTicks; tick += 1) {
   //     if (currentInstrument.ticks[tick]) {
   //       currentInstrument.sound.play();
   //     }
   //   }
   // }
  };

  /**
   * Auto-execute the following.
   */
  $scope.createTicks();

}]);
