//Root url to the place where widget's scripts will be located
var _h_url = '';
//your restaurant's ID. Look at the number at the panel Url. for instance, http://panel.hostmeapp.com/#/panel/2033
var restaurant_id = 2033;
// Your API key. Signup for Api key here https://hostme.portal.azure-api.net
var api_key = '15d957f2416c4060a03af2e29c8c3e7a';


var h_iframe = document.createElement('iframe');
h_iframe.id = 'h_iframe';
h_iframe.width = '230px';
h_iframe.height = '275px';
h_iframe.style.cssText = 'box-sizing:content-box;border: none;padding:5px;';
var _widget = document.getElementById('hostme-reservation-widget-box');
_widget.appendChild(h_iframe);
var _iframeDoc = document.getElementById('h_iframe').contentDocument;
var _iframeHead = _iframeDoc.getElementsByTagName('head').item(0);
var _iframeBody = _iframeDoc.getElementsByTagName('body').item(0);
var _options = document.createElement('script');
_options.innerHTML = "var restaurantId = " + restaurant_id + ";" +
"var _h_widgetSubscriptionKey = '" + api_key + "';" +
"var _h_widgetApiUrl = 'https://api.hostmeapp.com/rsv/v2/web';";
console.log(_widget.childNodes[1].id);
_iframeBody.appendChild(_options);
var _widget_libs = document.createElement('script');
_widget_libs.src = _h_url + 'h_widget_libs.js';
_widget.appendChild(_widget_libs);