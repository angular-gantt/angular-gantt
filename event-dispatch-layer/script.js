// Code goes here
(function($) {
    $(document).ready(function() {
        var eventDispatchLayer = $('.event-dispatch-layer');

        eventDispatchLayer[0].addEventListener('click', function(e) {
            var x = e.pageX, y = e.pageY;
            var res = [];

            var ele = document.elementFromPoint(x,y);
            while(ele && ele.tagName !== 'BODY' && ele.tagName !== 'HTML'){
                res.push(ele);
                ele.style.display = 'none';
                ele = document.elementFromPoint(x,y);
            }

            for(var i = 0; i < res.length; i++){
                res[i].style.display = '';
            }
            console.log(res);
        });
    });
})(jQuery);
