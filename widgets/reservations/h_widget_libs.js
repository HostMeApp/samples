    var h_scripts = [
            "https://code.jquery.com/jquery-2.1.3.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.6.11/jquery.timepicker.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js",
            _h_url + "/moment-timezone-with-data.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.js",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.time.js",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/picker.date.js",
            "https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin.min.js",
    ];
    var h_styles = [
            //"https://code.jquery.com/ui/1.11.4/themes/pepper-grinder/jquery-ui.css",
            "https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.6.11/jquery.timepicker.min.css",
            "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/themes/classic.css",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/themes/classic.time.css",
            "https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.6/compressed/themes/classic.date.css"
    ];

   function Requires(libraries, handler) {
        var library = libraries[0];
        if (typeof libraries_loaded == 'undefined')
            libraries_loaded = [];
        for (var i=0; i<libraries_loaded.length; i++)
            if (libraries_loaded[i] == library)
                return;
        var head = _iframeDoc.getElementsByTagName('body').item(0);
        var js = _iframeDoc.createElement('script');
        js.setAttribute('language', 'javascript');
        js.setAttribute('type', 'text/javascript');
        js.onload = function () {
            libraries.shift();
            if (libraries.length == 0) {
                handler.call();
            } else {
                Requires.apply(this, [libraries, handler]);
            }
        };
        js.setAttribute('src', library);
        head.appendChild(js);
        libraries_loaded[libraries_loaded.length] = library;
    }
    
    Requires(h_scripts, function () {
        var _h_widget = _iframeDoc.createElement('div');
        _h_widget.id = 'hostme-reservation-widget';
        var _h_widget_script = _iframeDoc.createElement('script');
        _h_widget_script.src = _h_url + 'h_widget.js';
        _iframeBody.appendChild(_h_widget);
        _iframeHead.appendChild(_h_widget_script);
        for (var i = 0; i < h_styles.length; i++){
            var _link = _iframeDoc.createElement('link');
            _link.href = h_styles[i];
            _link.rel = 'stylesheet';
            _iframeHead.appendChild(_link);
        };
    }); 