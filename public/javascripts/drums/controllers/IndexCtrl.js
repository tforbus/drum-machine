angular.module('drums.controllers').controller('IndexCtrl', 
['$scope', 'Instruments', 'Ticks', function ($scope, Instruments, Ticks) {

  // Keep track of the highest tick.
  var maxTickActive = -1;

  $scope.velocities = Instruments.velocities;
  $scope.instruments = Instruments.instruments;

  $scope.isPlaying = false;
  $scope.totalMeasures = 2;
  $scope.bpm = 120;
  $scope.loop = true;
  $scope.currentMeasure = 1;
  $scope.currentVelocity = $scope.velocities.med;
  $scope.ticksToPlay = 16;
  $scope.currentTick = 0;


  $scope.isTickInMeasure = function(tickIndex, measure) {
    return Ticks.isTickInMeasure(tickIndex, measure);
  };


  $scope.getTotalTicks = function() {
    return Math.floor($scope.totalMeasures / Ticks.getTickSize());
  };


  $scope.changeDefaultVelocity = function(propVal) {
    $scope.currentVelocity = $scope.velocities[propVal];
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
    $scope.stop();
    
    for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
      var options = {
        instrument: $scope.instruments[i],
        totalTicks: $scope.getTotalTicks(),
        velocity: $scope.currentVelocity
      };

      Ticks.createTicksForInstrument(options);
    }
  };


  /**
   * Toggles a tick between active and inactive.
   */
  $scope.toggleTick = function(instrument, tickIndex) {
    var options = {
      velocity: $scope.currentVelocity,
      tick: instrument.ticks[tickIndex]
    };

    var nowActive = Ticks.toggleTickState(options);
    maxTickActive = Ticks.findMaxTickIndex();

    $scope.ticksToPlay = Math.ceil(maxTickActive / 16) * 16;
  };


  $scope.eraseAll = function() {
    $scope.currentVelocity = $scope.velocities.med;
    $scope.currentMeasure = 1;
    $scope.createTicks();  
  };


  $scope.play = function() {
    var index = -1;
    $scope.isPlaying = true;

    function loop(){
      index += 1;
      if (!$scope.isPlaying) {
        return;
      }

      for (var i = 0, len = $scope.instruments.length; i < len; i += 1) {
        var instrument = $scope.instruments[i];
        if (instrument.ticks[index].isActive) {
          Ticks.playTick({
            velocity: instrument.ticks[index].velocity,
            instrument: instrument,
            tickIndex: index
          });
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
        setTimeout(loop, Ticks.getSecondsBetweenEachTick($scope.bpm) * 1000);
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
