AFRAME.registerComponent('play-audio-on-click', {
    init: function () {
      var el = this.el;  // <a-box>
      console.log('sivashanmugam')
      console.log(el)
      el.addEventListener('click', function () {
        var audioIns = new Audio("https://shivashanmugam.github.io/Web-Audio-API-With-visualizer/vogel-dreamwave.mp3");
        audioIns.play();
        


      });
    } 
  });