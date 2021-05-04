/**
 *  Create a WaveSurfer instance.
 */
 var wavesurfer; // eslint-disable-line no-var

 /**
  * Init & load.
  */
 document.getElementById("display").innerHTML = "ANNOTAION ALPHA";
 document.addEventListener('DOMContentLoaded', function() {
     // Init wavesurfer
     wavesurfer = WaveSurfer.create({
         container: '#waveform',
         height: 100,
         pixelRatio: 1,
         scrollParent: true,
         normalize: true,
         minimap: true,
         backend: 'MediaElement',
         plugins: [
             WaveSurfer.regions.create(),
             WaveSurfer.minimap.create({
                 height: 30,
                 waveColor: '#ddd',
                 progressColor: '#999',
                 cursorColor: '#999'
             }),
             WaveSurfer.timeline.create({
                 container: '#wave-timeline'
             })
         ]
     });


     wavesurfer.util
         .fetchFile({
             responseType: 'json',
             url: 'static/json/rashomon.json'
         })
         .on('success', function(data) {
             wavesurfer.load(
                 path,
                 data
             );
         });
 
     /* Regions */
 
     wavesurfer.on('ready', function() {
         wavesurfer.enableDragSelection({
             color: randomColor(0.1)
         });

         wavesurfer.enableDragSelection({
            color: randomColor(0.1)
        });

        if (localStorage.regions) {
            loadRegions(JSON.parse(localStorage.regions));
        } else {
            fetch('static/json/annotations.json')
             .then(r => r.json())
             .then(data => {
                displayRegions(data);
                loadRegions(data);
                saveRegions();
             });
        }

     });
     wavesurfer.on('region-click', function(region, e) {
         e.stopPropagation();
         // Play on click, loop on shift click
         e.shiftKey ? region.playLoop() : region.play();
     });
     wavesurfer.on('region-click', editAnnotation);
     wavesurfer.on('region-updated', saveRegions);
     wavesurfer.on('region-removed', saveRegions);
     wavesurfer.on('region-in', showNote);
 
     wavesurfer.on('region-play', function(region) {
         region.once('out', function() {
             wavesurfer.play(region.start);
             wavesurfer.pause();
         });
     });
 
     /* Toggle play/pause buttons. */
     let playButton = document.querySelector('#play');
     let pauseButton = document.querySelector('#pause');
     wavesurfer.on('play', function() {
         playButton.style.display = 'none';
         pauseButton.style.display = '';
     });
     wavesurfer.on('pause', function() {
         playButton.style.display = '';
         pauseButton.style.display = 'none';
     });
 
 
     var data_action = document.querySelector('[data-action="delete-region"]');
     if(data_action){
//         document.getElementById("display1").innerHTML = "data_action exist";
        data_action.addEventListener('click', function() {
            let form = document.forms.edit;
            let regionId = form.dataset.region;
            console.log("regionId: ", regionId);
            if (regionId) {
                wavesurfer.regions.list[regionId].remove();
                form.reset();
            }
        });
      }
      else
      {
        document.getElementById("display1").innerHTML = "data_action not exist";
      }


 });


/**
* Display regions from regions.
*/
function displayRegions(regions) {

 }

 /**
  * Load regions from regions.
  */
 function loadRegions(regions) {
     regions.forEach(function(region) {
         region.color = randomColor(0.1);
         wavesurfer.addRegion(region);
     });
 }

var count = 0;
 /**
  * Save annotations to regions.
  */
 function saveRegions() {
//     document.getElementById("displayA").innerHTML = JSON.stringify(regions, null, 4);
     count = count + 1;

     data1 = JSON.stringify(
         Object.keys(wavesurfer.regions.list).map(function(id) {
             let region = wavesurfer.regions.list[id];
             return {
                 start: region.start,
                 end: region.end,
                 attributes: region.attributes,
                 data: region.data
             };
         })
     );
    localStorage.regions = data1;
//    console.log("Before " + data1);
    $.ajax({
      url : "/examplemethod",
      type : "POST",
      data : data1,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

    })
    .done(function(data){
//      console.log("After " + data1);
    });
 }

 
 /**
  * Random RGBA color.
  */
 function randomColor(alpha) {
     return (
         'rgba(' +
         [
             ~~(Math.random() * 255),
             ~~(Math.random() * 255),
             ~~(Math.random() * 255),
             alpha || 1
         ] +
         ')'
     );
 }
 
 /**
  * Edit annotation for a region.
  */
 function editAnnotation(region) {
    console.log("editAnnotation: ", region);
     let form = document.forms.edit;
     form.style.opacity = 1;
     (form.elements.start.value = Math.round(region.start * 10) / 10),
     (form.elements.end.value = Math.round(region.end * 10) / 10);
     form.elements.note.value = region.data.note || '';
     form.onsubmit = function(e) {
         e.preventDefault();
         region.update({
             start: form.elements.start.value,
             end: form.elements.end.value,
             data: {
                 note: form.elements.note.value
             }
         });
         form.style.opacity = 0;
     };
     form.onreset = function() {
         form.style.opacity = 0;
         form.dataset.region = null;
     };
     form.dataset.region = region.id;
 }
 
 /**
  * Display annotation.
  */
 function showNote(region) {
     if (!showNote.el) {
         showNote.el = document.querySelector('#subtitle');
     }
     showNote.el.textContent = region.data.note || '–';
 }
 