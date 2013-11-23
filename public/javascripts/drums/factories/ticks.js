angular.module('drums.factories')
.factory('Ticks', ['Instruments', function (Instruments) {

  var TickSizes = {QUARTER: 1/4, EIGHTH: 1/8, SIXTEENTH: 1/16},
      currentTick = 0,
      tick = TickSizes.SIXTEENTH;


  var ticksPerBeat = function() {
    return TickSizes.QUARTER / tick;
  };


  var ticksPerMeasure = function() {
    return tickPerBeat() * 4;
  };


  var getTickSize = function() {
    return tick;
  };


  var isTickInMeasure = function(tickIndex, measure) {
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

  
  var getSecondsBetweenEachTick = function(beatsPerMinute) {
    var ticksPerSecond = ticksPerBeat() * beatsPerMinute / 60;
    return 1 / ticksPerSecond;
  };


  var createTicksForInstrument = function(options) {
    var instrument = options.instrument,
        totalTicks = options.totalTicks || 0,
        velocity = options.velocity;

    for (var t = 0; t < totalTicks; t += 1) {
      instrument.ticks[t] = {
        velocity: velocity,
        isActive: false
      };
    }
  };


  var findMaxTickIndex = function() {
    var localMax = -1;
    for (var inst in Instruments.instruments) {
      var instrument = Instruments.instruments[inst];
      for (var t = 0, len = instrument.ticks.length; t < len; t += 1) {
        if (instrument.ticks[t].isActive && t > localMax) {
          localMax = t;
        }
      }
    }
    return localMax;
  };


  /**
   * Set the tick's state and return it.
   */
  var toggleTickState = function(options) {
    var velocity = options.velocity,
        tick = options.tick;

    tick.isActive = !tick.isActive;
    tick.velocity = velocity;

    return tick.isActive;
  };


  var playTick = function(options) {
    var velocity = options.velocity,
        tickIndex = options.tickIndex,
        instrument = options.instrument;

    instrument.sound._volume = velocity.value;
    instrument.sound.play();
    currentTick = tickIndex;
  };

  return {
    currentTick: currentTick,
    getSecondsBetweenEachTick: getSecondsBetweenEachTick,
    createTicksForInstrument: createTicksForInstrument,
    findMaxTickIndex: findMaxTickIndex,
    toggleTickState: toggleTickState,
    isTickInMeasure: isTickInMeasure,
    ticksPerBeat: ticksPerBeat,
    ticksPerMeasure: ticksPerMeasure,
    playTick: playTick,
    getTickSize: getTickSize
  };

}]);
