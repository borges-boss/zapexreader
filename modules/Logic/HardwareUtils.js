import Sound from 'react-native-sound';

const HardwareUtils = {
  playSound: function (file) {
    Sound.setCategory('Playback');
    var sound = new Sound(file, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          sound.getDuration() +
          'number of channels: ' +
          sound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
          sound.stop(()=>{
            sound.release();
          });

        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      
      sound.setVolume(0.5);
    });
  },
};

export default HardwareUtils;
