angular.module('drums.factories')
.factory('Instruments', function () {

  // Sound files are private
  var soundBd1 = new Howl({
    urls: ['/sounds/tr-626/TR-626 Kick 1.wav']
  });

  var soundBd2 = new Howl({
    urls: ['/sounds/tr-626/TR-626 Kick 2.wav']
  });

  var soundSd1 = new Howl({
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

  var instruments = [
    {name: 'BD1', ticks: [], sound: soundBd1},
    {name: 'BD2', ticks: [], sound: soundBd2},
    {name: 'SD', ticks: [], sound: soundSd1},
    {name: 'CP', ticks: [], sound: soundCp},
    {name: 'OH', ticks: [], sound: soundOh},
    {name: 'CH', ticks: [], sound: soundCh}
  ];

  return {
    velocities: velocities,
    instruments: instruments
  };

});
