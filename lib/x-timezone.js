
var parse_calendar = require('./parser').parse_calendar;

var iCalendar = require('./icalendar').iCalendar;

var icalendarBlocks = {
	"America/New_York": [
		"BEGIN:DAYLIGHT"
		, "TZOFFSETFROM:-0500"
		, "TZOFFSETTO:-0400"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
		, "END:DAYLIGHT"
		, "BEGIN:STANDARD"
		, "TZOFFSETFROM:-0400"
		, "TZOFFSETTO:-0500"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
		, "END:STANDARD"
	]
	, "America/Chicago": [
		"BEGIN:DAYLIGHT"
		, "TZOFFSETFROM:-0600"
		, "TZOFFSETTO:-0500"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
		, "END:DAYLIGHT"
		, "BEGIN:STANDARD"
		, "TZOFFSETFROM:-0500"
		, "TZOFFSETTO:-0600"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
		, "END:STANDARD"
	]
	, "America/Denver": [
		"BEGIN:DAYLIGHT"
		, "TZOFFSETFROM:-0700"
		, "TZOFFSETTO:-0600"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
		, "END:DAYLIGHT"
		, "BEGIN:STANDARD"
		, "TZOFFSETFROM:-0600"
		, "TZOFFSETTO:-0700"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
		, "END:STANDARD"
	]
	, "America/Phoenix": [
		"BEGIN:STANDARD"
		, "TZOFFSETFROM:-0700"
		, "TZOFFSETTO:-0700"
		, "DTSTART:19700308T020000"
		, "END:STANDARD"
	]
	, "America/Los_Angeles": [
		"BEGIN:DAYLIGHT"
		, "TZOFFSETFROM:-0800"
		, "TZOFFSETTO:-0700"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
		, "END:DAYLIGHT"
		, "BEGIN:STANDARD"
		, "TZOFFSETFROM:-0700"
		, "TZOFFSETTO:-0800"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
		, "END:STANDARD"
	]
	, "America/Anchorage": [
		"BEGIN:DAYLIGHT"
		, "TZOFFSETFROM:-0900"
		, "TZOFFSETTO:-0800"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"
		, "END:DAYLIGHT"
		, "BEGIN:STANDARD"
		, "TZOFFSETFROM:-0800"
		, "TZOFFSETTO:-0900"
		, "DTSTART:19700308T020000"
		, "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"
		, "END:STANDARD"
	]
	, "Pacific/Honolulu": [
		"BEGIN:STANDARD"
		, "TZOFFSETFROM:-1000"
		, "TZOFFSETTO:-1000"
		, "DTSTART:19700308T020000"
		, "END:STANDARD"
	]
};

var timeZonesCalendar = ""
	+ "BEGIN:VCALENDAR\r\n"
	;

for (tzid in icalendarBlocks) {
	timeZonesCalendar += "BEGIN:VTIMEZONE\r\n";
	timeZonesCalendar += "TZID:" + tzid + "\r\n";
	timeZonesCalendar += icalendarBlocks[tzid].join("\r\n") + "\r\n";
	timeZonesCalendar += "END:VTIMEZONE\r\n";
}

timeZonesCalendar += "END:VCALENDAR\r\n"

var altTimeZones = parse_calendar(timeZonesCalendar);

iCalendar.prototype.timezone = function(tzid) {
    if (!tzid) {
        tzid = this.properties['X-WR-TIMEZONE'];
        tzid = tzid && tzid[0] && tzid[0].value;
    }
    if (!tzid) {
        return;
    }
    if (this.components["VTIMEZONE"]) {
	    for(var i=0; i<this.components['VTIMEZONE'].length; ++i) {
	        var tz = this.components['VTIMEZONE'][i];
	        if(tz.getPropertyValue('TZID') == tzid)
	            return tz;
	    }
    }
    for(var i=0; i<altTimeZones.components['VTIMEZONE'].length; ++i) {
        var tz = altTimeZones.components['VTIMEZONE'][i];
        if(tz.getPropertyValue('TZID') == tzid)
            return tz;
    }
};


