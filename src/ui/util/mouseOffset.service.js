gantt.service('mouseOffset', [ function () {
    // Mouse offset support for lesser browsers (read IE 8)

    return {
        getOffset: function(evt) {
            if(evt.layerX && evt.layerY) {
                return {x: evt.layerX, y: evt.layerY};
            } else {
                var el = evt.target, x,y;
                x=y=0;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    x += el.offsetLeft - el.scrollLeft;
                    y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                x = evt.clientX - x;
                y = evt.clientY - y;
                return { x: x, y: y };
            }
        }
    };
}]);