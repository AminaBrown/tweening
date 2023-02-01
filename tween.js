const main_div = d3.select('.tween').append('svg').attr('class','tween-svg').attr('viewBox','0 0 1440 900')
		svg_group = main_div.append('g').attr('class','svg-g');

var min = 360, max = 1080;
var height = 700, num_circ = 2;            

var circ = svg_group.append('circle')
            .attr('class','tween-circle-left')
            .attr('r',height/(2*num_circ)-100)
            .attr('cx',min)
            .attr('cy',height/(num_circ+1)*1)
            .style('fill','#A3C4BC')

        svg_group.append('circle')
            .attr('class','tween-circle-right')
            .attr('r',height/(2*num_circ)-100)
            .attr('cx',max)
            .attr('cy',height/(num_circ+1)*2)
            .style('fill','#A3C4BC')

var position = d3.scaleLinear()
    .domain([0,1])
    .range([min,max])

var color = d3.scaleLinear()
    .domain([0,1])
    .range(["#A3C4BC","#9984D4"])
    // BFD7B5

function updatePosition(percent) {
   d3.selectAll('.tween-circle-left')
   .attr('cx',position(percent)) 
   .style('fill',color(percent))


   d3.selectAll('.tween-circle-right')
   .attr('cx',position(1-percent)) 
   .style('fill',color(percent))
}

/**
 * scroller - handles the details
 * of figuring out which section
 * the user is currently scrolled
 * to.
 *
 */
function scroller() {
    var container = d3.select('body');
    // event dispatcher
    var dispatch = d3.dispatch('active', 'progress');
  
    // d3 selection of all the
    // text sections that will
    // be scrolled through
    var sections = null;
  
    // array that will hold the
    // y coordinate of each section
    // that is scrolled through
    var sectionPositions = [];
    var currentIndex = -1;
    // y coordinate of
    var containerStart = 0;
  
    /**
     * scroll - constructor function.
     * Sets up scroller to monitor
     * scrolling of els selection.
     *
     * @param els - d3 selection of
     *  elements that will be scrolled
     *  through by user.
     */
    function scroll(els) {
      sections = els;
  
      // when window is scrolled call
      // position. When it is resized
      // call resize.
      d3.select(window)
        .on('scroll.scroller', position)
        .on('resize.scroller', resize);
  
      // manually call resize
      // initially to setup
      // scroller.
      resize();
  
      // hack to get position
      // to be called once for
      // the scroll position on
      // load.
      // @v4 timer no longer stops if you
      // return true at the end of the callback
      // function - so here we stop it explicitly.
      var timer = d3.timer(function () {
        position();
        timer.stop();
      });
    }
  
    /**
     * resize - called initially and
     * also when page is resized.
     * Resets the sectionPositions
     *
     */
    function resize() {
      // sectionPositions will be each sections
      // starting position relative to the top
      // of the first section.
      sectionPositions = [];
      var startPos;
      sections.each(function (d, i) {
        var top = this.getBoundingClientRect().top;
        if (i === 0) {
          startPos = top;
        }
        sectionPositions.push(top - startPos);
      });
      containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
    }
  
    /**
     * position - get current users position.
     * if user has scrolled to new section,
     * dispatch active event with new section
     * index.
     *
     */
    function position() {
      var pos = window.pageYOffset - 10 - containerStart;
      var sectionIndex = d3.bisect(sectionPositions, pos);
      sectionIndex = Math.min(sections.size() - 1, sectionIndex);
  
      if (currentIndex !== sectionIndex) {
        // @v4 you now `.call` the dispatch callback
        dispatch.call('active', this, sectionIndex);
        currentIndex = sectionIndex;
      }
  
      var prevIndex = Math.max(sectionIndex - 1, 0);
      var prevTop = sectionPositions[prevIndex];
      var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
      // @v4 you now `.call` the dispatch callback
      dispatch.call('progress', this, currentIndex, progress);
    }
  
    /**
     * container - get/set the parent element
     * of the sections. Useful for if the
     * scrolling doesn't start at the very top
     * of the page.
     *
     * @param value - the new container value
     */
    scroll.container = function (value) {
      if (arguments.length === 0) {
        return container;
      }
      container = value;
      return scroll;
    };
  
    // @v4 There is now no d3.rebind, so this implements
    // a .on method to pass in a callback to the dispatcher.
    scroll.on = function (action, callback) {
      dispatch.on(action, callback);
    };
  
    return scroll;
  }


// setup scroll functionality
var scroll = scroller()
.container(d3.select('#h-scroll'));

// pass in .step selection as the steps
scroll(d3.selectAll('.step'));

scroll.on('progress', function (index, progress) {
// plot.update(index, progress);
console.log(progress)
if (progress > 0 & progress < 1){
    updatePosition(progress)
} else if (progress <= 0){
    updatePosition(0)
} else {
    updatePosition(1)
}
});


