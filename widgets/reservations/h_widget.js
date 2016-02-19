jQuery.support.cors = true;
var $h = jQuery.noConflict(true);
var restaurantObject = {};
var _time, _date, _timeObj, _dateObj = {};
var today = new Date();
var _curDayNum = today.getDay();
var reservHours = [];
var _h_html = '<span class="h_header">Make a Reservation <br/> <small>Powered by <img src="http://www.hostmeapp.com/images/hostme_logo_black.png"/></small> <br/></span><span id="h_reserve_form"><label><i class="fa fa-users"></i></label><input id="h_count" type="number" min="1" placeholder="party" onclick="$h(\'#h_count\').toggleClass(\'h_error\', false);" onchange="partySelected($h(\'#h_count\').val())" /><br/><label><i class="fa fa-calendar"></i></label><input id="h_date" type="text" placeholder="date" onclick="$h(\'#h_date\').toggleClass(\'h_error\', false);" /><br/><label><i class="fa fa-clock-o"></i></label><input id="h_time" type="text" placeholder="time" onclick="$h(\'#h_time\').toggleClass(\'h_error\', false);" /><br/><label><i class="fa fa-phone"></i></label><input id="h_phone" type="text" placeholder="phone" onclick="$h(\'#h_phone\').toggleClass(\'h_error\', false);" /><br/><label><i class="fa fa-user"></i></label><input id="h_name" type="text" placeholder="name" onclick="$h(\'#h_name\').toggleClass(\'h_error\', false);" /><label><i class="fa fa-edit"></i></label><textarea id="h_note" type="text" placeholder="note"></textarea><br/><button onClick="makeReservation()" class="book">Book</button></span><span id="h_reserve_success"><span></span><button onclick="gotIt()"><i class="fa fa-check"></i></button></span><span id="h_reserve_error"><span>Something wrong. Please try again later.</span><button onclick="gotIt()"><i class="fa fa-close"></i></button></span>';
var opts = {
  lines: 11,length: 5,width: 2, radius: 5,corners: 1, rotate: 24,direction: 1,color: '#fff',speed: 2.2,trail: 25,shadow: false,hwaccel: true,className: 'h_spinner',zIndex: 2e9,top: '50%',right: '15px'
};
var spinner = new Spinner(opts).spin();


var _fixThis = function(_num) {
	if (_num > 9)
		return _num
	else
		return ("0" + _num.toString())
}


var searchReservHours = function (day) {
	for (var i = 0; i < reservHours.length; i++ ){
            if (reservHours[i].weekDay == day)
                    return reservHours[i].time;
    };
	return false;
};

var partySelected = function (value){
	$h("#h_date").val('');
	$h("#h_time").val('');
	if (value && Number(value) > 0)
		$h("#h_date").prop('disabled', false);
	else
		$h("#h_date").prop('disabled', true);
}

var initTimeControls = function (data){
	restaurantObject = data;
	reservHours = restaurantObject.reservationHours.openingHours;
	moment.tz.setDefault(restaurantObject.timeZone);
	
	$h('#hostme-reservation-widget').html(_h_html);
	$h('#h_reserve_success').hide();
	$h('#h_reserve_error').hide();
        
	//var _ourIntervals = searchReservHours(_curDayNum);

	//if (_ourIntervals){
	//	_time = $h('#h_time').pickatime({
	//		format: 'hh:i A',
	//		interval: 15,
	//		disable: [true]
	//	});
	//	$h("#h_time").prop('disabled', false);
	//	$h("#h_time").prop('placeholder','time');
	//}
	//else{

	_time = $h('#h_time').pickatime({
		format: 'hh:i A',
		interval: data.hoursInterval || 15,
		disable: [true]
	});

	$h("#h_time").prop('disabled', true);
	$h("#h_date").prop('disabled', true);
	//	$h("#h_time").prop('disabled', true);
	//	$h("#h_time").prop('placeholder','day is not available for reserve');
	//}
	

	_timeObj = _time.pickatime('picker');
	
	_date = $h('#h_date').pickadate(
		{
			min: moment(moment().format("YYYY-MM-DD")).toDate(),
            //max: moment(moment().add(14, 'days').format("YYYY-MM-DD")).toDate(),
			onSet: function(context) {
				if (_dateObj.get('select')){
					var _newIntervals = searchReservHours(_dateObj.get('select').day);

					$h("#h_time").prop('disabled', true);
					$h("#h_time").val('');

					if (!_newIntervals){
						_timeObj.clear();
						$h("#h_time").prop('placeholder','day is not available for reserve');
					}
					else{
						_date = moment(context.select).format("YYYY-MM-DDTHH:mm:ssZ")
						_date = _date.replace(/(([\d]{2})\:([\d]{2})\:([\d]{2}))/, "12:00:00")
						_date = _date.replace(/(\-[\d]{2}\-[\d]{2})/, "-" + (_fixThis(_dateObj.get('select').month + 1)) + "-" + (_fixThis(_dateObj.get('select').date)))

						getAvailability(
								_date,
								$h('#h_count').val(),
								function(data){
									var _availabilities = [
										true
									];
									for (var i = 0; i < data.length; i++){
										if (data[i].acceptReservations && data[i].availabilityLevel == "Available")
											_availabilities.push(
													[data[i].time.slice(0, 2), data[i].time.slice(3, 5) ]
											)
									}
									_timeObj.set('disable', _availabilities);

									$h("#h_time").prop('disabled', false);
									$h("#h_time").prop('placeholder','time');
								},function(data){
									_timeObj.set('disable', [true]);
								});
						//_timeObj.set('min', (moment(moment().startOf('day').format("YYYY-MM-DD ") + _newIntervals[0].open).toDate()));
						//_timeObj.set('max', (moment(moment().endOf('day').format("YYYY-MM-DD ") + _newIntervals[0].close).toDate()));
						//_timeObj.clear();

					}
				}
			}
		}
	);
	_dateObj = _date.pickadate('picker');
};

var getAvailability = function(date, party, callback, callbackError) {
	spinner.spin();
	$h('button.book').append(spinner.el);
	$h('button.book').attr('disabled','disabled');

	$h.ajax({
		cache: false,
		crossDomain: true,
		type: "GET",
		url: _h_widgetApiUrl + "/restaurants/" + restaurantId + "/availability?date=" + date + "&PartySize=" + party + "&RangeInMinutes=720&subscription-key=" + _h_widgetSubscriptionKey,
		callback: 'callback',
		success: function (data) {
			$h('button.book').removeAttr('disabled');
			spinner.stop();
			callback(data);
		},
		error: function (data) {
			$h('button.book').removeAttr('disabled');
			spinner.stop();
			callbackError(data);
		}
	});
};

var makeReservation = function () {
	_curTimeObj = _timeObj.get('select');
	_curDateObj = _dateObj.get('select');
	var _timeToPost = '';
	if (_curTimeObj != null && _curDateObj != null){
		var _date = {
			Y: _curDateObj.year,
			M: _fixThis(_curDateObj.month + 1),
			D: _fixThis(_curDateObj.date),
			H: _fixThis(_curTimeObj.hour),
			m: _fixThis(_curTimeObj.mins)
		}
		_timeToPost = _date.Y + "-" + _date.M + "-" + _date.D + "T" + _date.H + ":" + _date.m + moment().format(":ss.SSSZ");
	}

	
	var data = {
		reservationTime: _timeToPost,
		customerName: $h('#h_name').val(),
		groupSize: $h('#h_count').val(),
		phoneNumber: $h('#h_phone').val(),
		note: $h('#h_note').val()
	};
	
	if (!($h('#h_time').val().length > 0))
	{
		$h('#h_time').toggleClass('h_error', true);
	}
	else{
		$h('#h_time').toggleClass('h_error', false);
	}
	if (!($h('#h_date').val().length > 0))
	{
		$h('#h_date').toggleClass('h_error', true);
	}
	else{
		$h('#h_date').toggleClass('h_error', false);
	}
	if (!(data.customerName.length > 2))
	{
		$h('#h_name').toggleClass('h_error', true);
	}
	if (!(data.groupSize > 0))
	{
		$h('#h_count').toggleClass('h_error', true);
	}
	if (!(data.phoneNumber.length > 9))
	{
		$h('#h_phone').toggleClass('h_error', true);
	}
	
	if (data.reservationTime.length > 0 && data.customerName.length > 2 && data.groupSize > 0 && data.phoneNumber.length > 9)
	{
		spinner.spin();
		$h('button.book').append(spinner.el);
		$h('button.book').attr('disabled','disabled');
		
		$h.ajax({
                        cache: false,
                        crossDomain: true,
			type: "POST",
			url: _h_widgetApiUrl + "/restaurants/" + restaurantId + "/reservations?subscription-key=" + _h_widgetSubscriptionKey,
			data:data,
			callback: 'callback',
			success: function (data) {
				$h(':input','#hostme-reservation-widget').val('');
				$h('button.book').removeAttr('disabled');
				spinner.stop();
                                $h('#h_reserve_form').hide();
                                $h('#h_reserve_success span').html('Your reservation on<br/>' + moment(data.reservationTime).format("DD MMM hh:mm A") + '<br/>at ' + data.restaurant.name + ' has been accepted.');
                                $h('#h_reserve_success').show();
                                console.log(data);
			},
			error: function (data) {
                                $h('button.book').removeAttr('disabled');
				spinner.stop();
				if (data.responseJSON != undefined && data.responseJSON.message == 'Reservation can not be made in past.'){
					$h('#h_time').toggleClass('h_error', true);
					$h('#h_date').toggleClass('h_error', true);
				}
                                else{
                                    $h('#h_reserve_form').hide();
                                    $h('#h_reserve_error').show();
                                }
				console.log(data);
			}
		});
	}
}; 

var initHostmeWidget = function(){
	
    $h("<style>body{width:100%;height: 100%;margin:0;}html{overflow: hidden;}#hostme-reservation-widget .h_header{text-align: center;display: block;margin-left: 20px;margin-bottom: 3px;} #hostme-reservation-widget .h_header img{height: 11px;max-width:45px;vertical-align: text-bottom;padding-bottom: 2px;} #hostme-reservation-widget label{width:20px;display:inline-block;text-align:center;margin-right:3px;vertical-align:top;margin-top:7px;}#hostme-reservation-widget input{border-radius:3px;border:1px solid #cbd5dd;height:30px;margin-bottom:3px;padding:3px;vertical-align:middle;box-sizing: border-box; width:205px;font-size:14px;}#hostme-reservation-widget textarea{height: 35px;border-radius:3px;border:1px solid #cbd5dd;margin-bottom:3px;padding:3px;vertical-align:middle;box-sizing:border-box;width:205px;font-size:14px;}#hostme-reservation-widget button.book{color:#fff;background-color:#1bb7a0;border-color:#18a18d;border-radius:4px;border:1px solid transparent;padding: 6px 12px;width:100px;margin-left:75px;position:relative;font-size:14px;}#hostme-reservation-widget button.book:hover, #hostme-reservation-widget button.book:focus, #hostme-reservation-widget button.book:active{color: #fff;background-color: #148b79;border-color: #106b5e;} #hostme-reservation-widget .h_error{border-color:red;} #hostme-reservation-widget{color:#767676;width:230px;font-size: 16px; position:relative;}#hostme-reservation-widget .picker{top:0px}#hostme-reservation-widget .picker__holder{max-width:200px;border-radius:3px;}#hostme-reservation-widget .picker__list-item{padding: 5px 5px;}.picker__button--clear, .picker__button--close, .picker__button--today{padding:3px 0;} .picker__list {max-height:165px;}.picker__day{line-height: 18px;padding: 2px 0;}#hostme-reservation-widget .picker--opened .picker__holder{max-height: 240px; outline: none;}.picker__header{margin-top:5px;}.picker__table{margin-top: 8px;margin-bottom: 5px;}#h_reserve_success,#h_reserve_error{text-align:center;display:block;}#h_reserve_success span,#h_reserve_error span{text-align:center;margin-top:25px;margin-left: 20px;display:block;}#h_reserve_success button, #h_reserve_error button{height:30px;width:30px;border-radius:15px;border:none;margin:10px;margin-left:20px;color:#fafafa;outline:none;}#h_reserve_success button{background-color:#1bb7a0;}#h_reserve_error button{background-color:red;}#h_reserve_form input[disabled] {background-color: rgba(130, 130, 130, 0.11);}</style>" ).appendTo( "head" );
    
    (function() {
        $h.ajax({
        crossOrigin: true,
        type: "GET",
        url: _h_widgetApiUrl + "/restaurants/" + restaurantId + "?subscription-key=" + _h_widgetSubscriptionKey,
        callback: 'callback',
        success: function (data) {
            initTimeControls(data);
        }
        });
    })
    ();

};   

initHostmeWidget();

var gotIt = function (){
    $h('#h_reserve_success').hide();
    $h('#h_reserve_error').hide();
    $h('#h_reserve_form').show();
};