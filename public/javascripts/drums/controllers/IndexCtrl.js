var IndexCtrl = angular.module('drums.controllers').controller('IndexCtrl', 
['$scope', function ($scope) {
  
  // hower.js should be on the dom
  var soundBd = new Howl({
    urls: ['/sounds/tr-626/TR-626 Kick 1.wav']
  });

  var soundBd2 = new Howl({
    urls: ['/sounds/tr-626/TR-626 Kick 2.wav']
  });

  var soundSd = new Howl({
    urls: ['/sounds/tr-626/TR-626 Snare 1.wav']
  });

  var soundCp = new Howl({
    urls: ['/sounds/tr-626/TR-626 Clap.wav']
  });

  var soundOh = new Howl({
    urls: ['/sounds/tr-626/TR-626 Hat Open.wav']
  });

  var soundCh = new Howl({
    urls: ['/sounds/tr-626/TR-626 Hat Closed.wav']
  });

  var velocities = {
    low: {name: 'low', value: 0.2},
    med: {name: 'med', value: 0.5},
    high: {name: 'high', value: 0.99}
  };

  // Keep track of the highest tick.
  var maxTickActive = -1;

  $scope.isPlaying = false;
  $scope.totalMeasures = 2;
  $scope.bpm = 120;
  $scope.tick = 1/16;
  $scope.loop = true;
  $scope.currentMeasure = 1;
  $scope.currentVelocity = velocities.med;
  $scope.ticksToPlay = 16;
  $scope.currentTick = 0;

  /** Defined samples */
  $scope.instruments = [
    {name: 'BD1', ticks: [], sound: soundBd},
    {name: 'BD2', ticks: [], sound: soundBd2},
    {name: 'SD1', ticks: [], sound: soundSd},
    {name: 'CP', ticks: [], sound: soundCp},
    {name: 'OH', ticks: [], sound: soundOh},
    {name: 'CH', ticks: [], sound: soundCh}
  ];


  $scope.ticksPerBeat = function() {
    var quarterNote = 1/4;
    return quarterNote / $scope.tick;
  };

  $scope.ticksPerMeasure = function() {
    return $scope.ticksPerBeat() * 4;
  };

  $scope.isTickInMeasure = function(tickIndex, measure) {
    switch (measure) {
      case 1:
        return tickIndex < 16;
      case 2:
        return tickIndex < 32 && tickIndex > 15;
      case 3:
        return tickIndex < 48 && tickIndex > 31;
      default:
        return true;
    }
  };

  $scope.getSecondsBetweenEachTick = function() {
    var quarterNote = 1/4,
        ticksPerSecond = $scope.ticksPerBeat() * $scope.bpm / 60;
    return 1 / ticksPerSecond;
  };

  $scope.getTotalTicks = function() {
    return Math.floor($scope.totalMeasures / $scope.tick);
  };


  $scope.changeDefaultVelocity = function(propVal) {
    $scope.currentVelocity = velocities[propVal];
  };

  $scope.incrementBpm = function() {
    $scope.bpm += 1;
  };

  $scope.decrementBpm = function() {
    $scope.bpm -= 1;
  };

  $scope.incrementCurrentMeasure = function() {
    if ($scope.currentMeasure < $scope.totalMeasures) {
      $scope.currentMeasure += 1;
    }
  };

  $scope.decrementCurrentMeasure = function() {
    if ($scope.currentMeasure > 1) {
      $scope.currentMeasure -= 1;
    }
  };

  $scope.toggleLoop = function() {
    $scope.loop = !$scope.loop;
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
        instrument.ticks[t] = {
          velocity: $scope.currentVelocity,
          isActive: false,
          index: t
        };
      }

    }
  };

  var findMaxTickIndex = function() {
    var localMax = -1;
    for (var inst in $scope.instruments) {
      var instrument = $scope.instruments[inst];
      for (var t = 0, len = instrument.ticks.length; t < len; t += 1) {
        if (instrument.ticks[t].isActive && t > localMax) {
          localMax = t;
        }
      }
    }
    return localMax;
  };

  /**
   * Toggles a tick between active and inactive.
   */
  $scope.toggleTick = function(instrument, tickIndex) {
    var tick = instrument.ticks[tickIndex];
    
    if (tick.isActive) {
      tick.isActive = false;
      maxTickActive = findMaxTickIndex();
    } else {
      tick.isActive = true;
      tick.velocity = $scope.currentVelocity;
      maxTickActive = Math.max(tickIndex, maxTickActive);
    }

    $scope.ticksToPlay = Math.ceil(maxTickActive / 16) * 16;
    console.log('ticks to play = ' + $scope.ticksToPlay);
  };

  $scope.eraseAll = function() {
    $scope.createTicks();  
    $scope.currentMeasure = 1;
  };


  $scope.play = function() {
    var pauseTime = $scope.getSecondsBetweenEachTick() * 1000,
        index = -1;

    $scope.isPlaying = true;

    function loop(){
      index += 1;
      if (!$scope.isPlaying) {
        return;
      }

      for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
        var instrument = $scope.instruments[i];
        $scope.currentTick = index;
        if (instrument.ticks[index].isActive) {
          instrument.sound._volume = instrument.ticks[index].velocity.value;
          instrument.sound.play();
        }
      }

      // Check directly against maxTicksToPlay
      // If the user changes the number of measures while playing, 
      // need to reflect the change.
      if (index < $scope.ticksToPlay) {
        if (index === $scope.ticksToPlay - 1) {
          if ($scope.loop) {
            index = -1;
          } else {
            $scope.isPlaying = false;
            return;
          }
        }
        setTimeout(loop, pauseTime);
      } 
    }

    loop();
  };


  $scope.stop = function() {
    if ($scope.isPlaying) {
      $scope.isPlaying = false;
      for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
        $scope.instruments[i].sound.stop();
      }
    }
  };

  /**
   * Auto-execute the following.
   */
  $scope.createTicks();

}]);
