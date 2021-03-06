var RRule = require('../lib/rrule').RRule;
var parse_calendar = require('../lib/parser').parse_calendar;
describe("Should parse event with and without timezone info", function () {
	it("Should parse with Google timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\n" +
		"PRODID:-//Google Inc//Google Calendar 70.9054//EN\n" +
		"VERSION:2.0\n" +
		"CALSCALE:GREGORIAN\n" +
		"METHOD:PUBLISH\n" +
		"X-WR-CALNAME:test cal for z-adams spec\n" +
		"X-WR-TIMEZONE:America/Los_Angeles\n" +
		"BEGIN:VTIMEZONE\n" +
		"TZID:America/Los_Angeles\n" +
		"X-LIC-LOCATION:America/Los_Angeles\n" +
		"BEGIN:DAYLIGHT\n" +
		"TZOFFSETFROM:-0800\n" +
		"TZOFFSETTO:-0700\n" +
		"TZNAME:PDT\n" +
		"DTSTART:19700308T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n" +
		"END:DAYLIGHT\n" +
		"BEGIN:STANDARD\n" +
		"TZOFFSETFROM:-0700\n" +
		"TZOFFSETTO:-0800\n" +
		"TZNAME:PST\n" +
		"DTSTART:19701101T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n" +
		"END:STANDARD\n" +
		"END:VTIMEZONE\n" +
		"BEGIN:VEVENT\n" +
		"DTSTART;TZID=America/Los_Angeles:20140125T110000\n" +
		"DTEND;TZID=America/Los_Angeles:20140125T220000\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SA\n" +
		"EXDATE;TZID=America/Los_Angeles:20140125T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140222T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140329T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140426T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140510T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140524T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140628T110000\n" +
		"EXDATE;TZID=America/Los_Angeles:20140726T110000\n" +
		"DTSTAMP:20140520T181309Z\n" +
		"UID:ii1umeh3l1lequfjnklhnr5uhg@google.com\n" +
		"CREATED:20140114T025322Z\n" +
		"DESCRIPTION:\n" +
		"LAST-MODIFIED:20140515T180009Z\n" +
		"LOCATION:\n" +
		"SEQUENCE:0\n" +
		"STATUS:CONFIRMED\n" +
		"SUMMARY:Test EventSF\n" +
		"TRANSP:OPAQUE\n" +
		"END:VEVENT\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-01-25T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-01-25T10:00:00-0800"))).toEqual(new Date("2014-01-25T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-08-23T10:00:00-0700"))).toEqual(new Date("2014-08-23T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-08-23T02:00:00-0800"))).toEqual(new Date("2014-08-23T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-25T02:00:00-0800"))).toEqual(new Date("2014-10-25T11:00:00-0700"));
	});
	it("Should parse with Apple timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\r\n" +
		"VERSION:2.0\r\n" +
		"X-WR-CALNAME:test cal for z-adams spec\r\n" +
		"X-APPLE-CALENDAR-COLOR:#882F00FF\r\n" +
		"BEGIN:VTIMEZONE\r\n" +
		"TZID:America/Los_Angeles\r\n" +
		"X-LIC-LOCATION:America/Los_Angeles\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:18831118T120702\r\n" +
		"RDATE;VALUE=DATE-TIME:18831118T120702\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0752\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19180331T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19190330T100000Z;BYDAY=-1SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19181027T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19191026T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19420209T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19420209T020000\r\n" +
		"TZNAME:PWT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19450814T160000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450814T160000\r\n" +
		"TZNAME:PPT\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19490101T020000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19670101T000000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19740106T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19750223T020000\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19500430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19660424T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19500924T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19610924T090000Z;BYDAY=-1SU;BYMONTH=9\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19621028T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19661030T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19670430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19730429T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19671029T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20061029T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19760425T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19860427T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19870405T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20060402T100000Z;BYDAY=1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:20070311T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:20071104T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"END:VTIMEZONE\r\n" +
		"BEGIN:VEVENT\r\n" +
		"DTEND;TZID=America/Los_Angeles:20140125T220000\r\n" +
		"UID:ii1umeh3l1lequfjnklhnr5uhg@google.com\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140329T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140628T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140726T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140426T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140222T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140524T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140125T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140510T110000\r\n" +
		"DTSTAMP:20140520T181309Z\r\n" +
		"LOCATION:\r\n" +
		"DESCRIPTION:\r\n" +
		"STATUS:CONFIRMED\r\n" +
		"SEQUENCE:0\r\n" +
		"SUMMARY:Test Event\r\n" +
		"LAST-MODIFIED:20140515T180009Z\r\n" +
		"DTSTART;TZID=America/Los_Angeles:20140125T110000\r\n" +
		"CREATED:20140114T025322Z\r\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SA\r\n" +
		"TRANSP:OPAQUE\r\n" +
		"END:VEVENT\r\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-01-25T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-01-25T10:00:00-0800"))).toEqual(new Date("2014-01-25T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-08-23T10:00:00-0700"))).toEqual(new Date("2014-08-23T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-08-23T02:00:00-0800"))).toEqual(new Date("2014-08-23T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-25T02:00:00-0800"))).toEqual(new Date("2014-10-25T11:00:00-0700"));
	});
	it("Should parse with Google timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\n" +
		"PRODID:-//Google Inc//Google Calendar 70.9054//EN\n" +
		"VERSION:2.0\n" +
		"CALSCALE:GREGORIAN\n" +
		"METHOD:PUBLISH\n" +
		"X-WR-CALNAME:test cal for z-adams spec\n" +
		"X-WR-TIMEZONE:America/Los_Angeles\n" +
		"BEGIN:VTIMEZONE\n" +
		"TZID:America/Los_Angeles\n" +
		"X-LIC-LOCATION:America/Los_Angeles\n" +
		"BEGIN:DAYLIGHT\n" +
		"TZOFFSETFROM:-0800\n" +
		"TZOFFSETTO:-0700\n" +
		"TZNAME:PDT\n" +
		"DTSTART:19700308T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n" +
		"END:DAYLIGHT\n" +
		"BEGIN:STANDARD\n" +
		"TZOFFSETFROM:-0700\n" +
		"TZOFFSETTO:-0800\n" +
		"TZNAME:PST\n" +
		"DTSTART:19701101T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n" +
		"END:STANDARD\n" +
		"END:VTIMEZONE\n" +
		"BEGIN:VEVENT\r\n" +
		"DTSTART;TZID=America/Los_Angeles:20140209T110000\r\n" +
		"DTEND;TZID=America/Los_Angeles:20140209T170000\r\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SU\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140518T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140511T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140914T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140629T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140525T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140427T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140309T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140727T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140330T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140223T110000\r\n" +
		"DTSTAMP:20140520T181309Z\r\n" +
		"UID:uvqhl71ff9e1dbj32rcv5glubc@google.com\r\n" +
		"CREATED:20140131T183222Z\r\n" +
		"DESCRIPTION:\r\n" +
		"LAST-MODIFIED:20140131T183222Z\r\n" +
		"LOCATION:\r\n" +
		"SEQUENCE:0\r\n" +
		"STATUS:CONFIRMED\r\n" +
		"SUMMARY:Test Event\r\n" +
		"TRANSP:OPAQUE\r\n" +
		"END:VEVENT\r\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-02-09T10:00:00-0800"))).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-23T10:00:00-0700"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-26T02:00:00-0800"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
	});
	it("Should parse with Apple timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\r\n" +
		"VERSION:2.0\r\n" +
		"X-WR-CALNAME:test cal for z-adams spec\r\n" +
		"X-APPLE-CALENDAR-COLOR:#882F00FF\r\n" +
		"BEGIN:VTIMEZONE\r\n" +
		"TZID:America/Los_Angeles\r\n" +
		"X-LIC-LOCATION:America/Los_Angeles\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:18831118T120702\r\n" +
		"RDATE;VALUE=DATE-TIME:18831118T120702\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0752\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19180331T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19190330T100000Z;BYDAY=-1SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19181027T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19191026T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19420209T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19420209T020000\r\n" +
		"TZNAME:PWT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19450814T160000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450814T160000\r\n" +
		"TZNAME:PPT\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19490101T020000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19670101T000000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19740106T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19750223T020000\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19500430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19660424T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19500924T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19610924T090000Z;BYDAY=-1SU;BYMONTH=9\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19621028T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19661030T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19670430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19730429T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19671029T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20061029T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19760425T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19860427T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19870405T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20060402T100000Z;BYDAY=1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:20070311T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:20071104T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"END:VTIMEZONE\r\n" +
		"BEGIN:VEVENT\r\n" +
		"DTEND;TZID=America/Los_Angeles:20140209T170000\r\n" +
		"UID:uvqhl71ff9e1dbj32rcv5glubc@google.com\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140427T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140330T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140511T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140518T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140727T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140525T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140629T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140309T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140914T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140223T110000\r\n" +
		"DTSTAMP:20140520T181309Z\r\n" +
		"LOCATION:\r\n" +
		"DESCRIPTION:\r\n" +
		"STATUS:CONFIRMED\r\n" +
		"SEQUENCE:0\r\n" +
		"SUMMARY:Test Event\r\n" +
		"LAST-MODIFIED:20140131T183222Z\r\n" +
		"DTSTART;TZID=America/Los_Angeles:20140209T110000\r\n" +
		"CREATED:20140131T183222Z\r\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SU\r\n" +
		"TRANSP:OPAQUE\r\n" +
		"END:VEVENT\r\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-02-09T10:00:00-0800"))).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-23T10:00:00-0700"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-26T02:00:00-0800"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
	});
	it("Should parse with Google timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\n" +
		"PRODID:-//Google Inc//Google Calendar 70.9054//EN\n" +
		"VERSION:2.0\n" +
		"CALSCALE:GREGORIAN\n" +
		"METHOD:PUBLISH\n" +
		"X-WR-CALNAME:test cal for z-adams spec\n" +
		"X-WR-TIMEZONE:America/Los_Angeles\n" +
		"BEGIN:VTIMEZONE\n" +
		"TZID:America/Los_Angeles\n" +
		"X-LIC-LOCATION:America/Los_Angeles\n" +
		"BEGIN:DAYLIGHT\n" +
		"TZOFFSETFROM:-0800\n" +
		"TZOFFSETTO:-0700\n" +
		"TZNAME:PDT\n" +
		"DTSTART:19700308T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n" +
		"END:DAYLIGHT\n" +
		"BEGIN:STANDARD\n" +
		"TZOFFSETFROM:-0700\n" +
		"TZOFFSETTO:-0800\n" +
		"TZNAME:PST\n" +
		"DTSTART:19701101T020000\n" +
		"RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n" +
		"END:STANDARD\n" +
		"END:VTIMEZONE\n" +
		"BEGIN:VEVENT\r\n" +
		"DTSTART;TZID=America/Los_Angeles:20140209T110000\r\n" +
		"DTEND;TZID=America/Los_Angeles:20140209T170000\r\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SU\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140518T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140511T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140914T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140629T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140525T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140427T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140309T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140727T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140330T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140223T110000\r\n" +
		"DTSTAMP:20140520T181309Z\r\n" +
		"UID:uvqhl71ff9e1dbj32rcv5glubc@google.com\r\n" +
		"CREATED:20140131T183222Z\r\n" +
		"DESCRIPTION:\r\n" +
		"LAST-MODIFIED:20140131T183222Z\r\n" +
		"LOCATION:\r\n" +
		"SEQUENCE:0\r\n" +
		"STATUS:CONFIRMED\r\n" +
		"SUMMARY:Test Event\r\n" +
		"TRANSP:OPAQUE\r\n" +
		"END:VEVENT\r\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-02-09T10:00:00-0800"))).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-23T10:00:00-0700"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-26T02:00:00-0800"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
	});
	it("Should parse with Apple timezone def", function () {

		var ical = 
		"BEGIN:VCALENDAR\r\n" +
		"VERSION:2.0\r\n" +
		"X-WR-CALNAME:test cal for z-adams spec\r\n" +
		"X-APPLE-CALENDAR-COLOR:#882F00FF\r\n" +
		"BEGIN:VTIMEZONE\r\n" +
		"TZID:America/Los_Angeles\r\n" +
		"X-LIC-LOCATION:America/Los_Angeles\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:18831118T120702\r\n" +
		"RDATE;VALUE=DATE-TIME:18831118T120702\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0752\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19180331T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19190330T100000Z;BYDAY=-1SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19181027T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19191026T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19420209T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19420209T020000\r\n" +
		"TZNAME:PWT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19450814T160000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450814T160000\r\n" +
		"TZNAME:PPT\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19450930T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19490101T020000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19460101T000000\r\n" +
		"RDATE;VALUE=DATE-TIME:19670101T000000\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19480314T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19740106T020000\r\n" +
		"RDATE;VALUE=DATE-TIME:19750223T020000\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19500430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19660424T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19500924T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19610924T090000Z;BYDAY=-1SU;BYMONTH=9\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19621028T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19661030T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19670430T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19730429T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:19671029T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20061029T090000Z;BYDAY=-1SU;BYMONTH=10\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19760425T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=19860427T100000Z;BYDAY=-1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:19870405T020000\r\n" +
		"RRULE:FREQ=YEARLY;UNTIL=20060402T100000Z;BYDAY=1SU;BYMONTH=4\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:DAYLIGHT\r\n" +
		"DTSTART:20070311T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3\r\n" +
		"TZNAME:PDT\r\n" +
		"TZOFFSETFROM:-0800\r\n" +
		"TZOFFSETTO:-0700\r\n" +
		"END:DAYLIGHT\r\n" +
		"BEGIN:STANDARD\r\n" +
		"DTSTART:20071104T020000\r\n" +
		"RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11\r\n" +
		"TZNAME:PST\r\n" +
		"TZOFFSETFROM:-0700\r\n" +
		"TZOFFSETTO:-0800\r\n" +
		"END:STANDARD\r\n" +
		"END:VTIMEZONE\r\n" +
		"BEGIN:VEVENT\r\n" +
		"DTEND;TZID=America/Los_Angeles:20140109T170000\r\n" +
		"UID:uvqhl71ff9e1dbj32rcv5glubc@google.com\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140427T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140330T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140511T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140518T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140727T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140525T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140629T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140309T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140914T110000\r\n" +
		"EXDATE;TZID=America/Los_Angeles:20140223T110000\r\n" +
		"DTSTAMP:20140520T181309Z\r\n" +
		"LOCATION:\r\n" +
		"DESCRIPTION:\r\n" +
		"STATUS:CONFIRMED\r\n" +
		"SEQUENCE:0\r\n" +
		"SUMMARY:Test Event\r\n" +
		"LAST-MODIFIED:20140131T183222Z\r\n" +
		"DTSTART;TZID=America/Los_Angeles:20140109T110000\r\n" +
		"CREATED:20140131T183222Z\r\n" +
		"RRULE:FREQ=WEEKLY;BYDAY=SU\r\n" +
		"TRANSP:OPAQUE\r\n" +
		"END:VEVENT\r\n" +
		"END:VCALENDAR\n" +
		"";
		var cal = parse_calendar(ical);

		expect(cal.events()[0].start()).toEqual(new Date("2014-01-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-02-08T10:00:00-0800"))).toEqual(new Date("2014-02-09T11:00:00-0800"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-23T10:00:00-0700"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
		expect(cal.events()[0].rrule().next(new Date("2014-10-25T02:00:00-0800"))).toEqual(new Date("2014-10-26T11:00:00-0700"));
	});
})

xdescribe("Should pass all kanzaki.com rrule examples", function () {
[
	[
		"FREQ=WEEKLY;BYDAY=SA",
		"2014-01-25T11:00:00",
		"FREQ=WEEKLY;BYDAY=SA",
		[
			"2014-01-25T11:00:00Z",
			"2014-02-01T11:00:00Z",
			"2014-02-08T11:00:00Z",
			"2014-02-15T11:00:00Z",
			"2014-02-22T11:00:00Z",
			"2014-03-01T11:00:00Z",
			"2014-03-08T11:00:00Z",
			"2014-03-15T11:00:00Z",
			"2014-03-22T11:00:00Z",
			"2014-03-29T11:00:00Z",
		],
		false
	],

	[
		"FREQ=WEEKLY;UNTIL=20150414T180000Z;WKST=SU;BYDAY=TU",
		"2014-04-15T11:00:00",
		"FREQ=WEEKLY;UNTIL=20150414T180000Z;WKST=SU;BYDAY=TU",
		[
			"2014-04-15T11:00:00Z",
			"2014-04-22T11:00:00Z",
			"2014-04-29T11:00:00Z",
			"2014-05-06T11:00:00Z",
			"2014-05-13T11:00:00Z",
			"2014-05-20T11:00:00Z",
			"2014-05-27T11:00:00Z",
			"2014-06-03T11:00:00Z",
			"2014-06-10T11:00:00Z",
			"2014-06-17T11:00:00Z",
			"2014-06-24T11:00:00Z",
			"2014-07-01T11:00:00Z",
			"2014-07-08T11:00:00Z",
			"2014-07-15T11:00:00Z",
			"2014-07-22T11:00:00Z",
			"2014-07-29T11:00:00Z",
			"2014-08-05T11:00:00Z",
			"2014-08-12T11:00:00Z",
			"2014-08-19T11:00:00Z",
			"2014-08-26T11:00:00Z",
			"2014-09-02T11:00:00Z",
			"2014-09-09T11:00:00Z",
			"2014-09-16T11:00:00Z",
			"2014-09-23T11:00:00Z",
			"2014-09-30T11:00:00Z",
			"2014-10-07T11:00:00Z",
			"2014-10-14T11:00:00Z",
			"2014-10-21T11:00:00Z",
			"2014-10-28T11:00:00Z",
			"2014-11-04T11:00:00Z",
			"2014-11-11T11:00:00Z",
			"2014-11-18T11:00:00Z",
			"2014-11-25T11:00:00Z",
			"2014-12-02T11:00:00Z",
			"2014-12-09T11:00:00Z",
			"2014-12-16T11:00:00Z",
			"2014-12-23T11:00:00Z",
			"2014-12-30T11:00:00Z",
			"2015-01-06T11:00:00Z",
			"2015-01-13T11:00:00Z",
			"2015-01-20T11:00:00Z",
			"2015-01-27T11:00:00Z",
			"2015-02-03T11:00:00Z",
			"2015-02-10T11:00:00Z",
			"2015-02-17T11:00:00Z",
			"2015-02-24T11:00:00Z",
			"2015-03-03T11:00:00Z",
			"2015-03-10T11:00:00Z",
			"2015-03-17T11:00:00Z",
			"2015-03-24T11:00:00Z",
			"2015-03-30T11:00:00Z",
			"2015-04-07T11:00:00Z",
			"2015-04-14T11:00:00Z",
			
		],
		true,
	],

	[
		"FREQ=WEEKLY;UNTIL=20140415T175959Z;WKST=MO;BYDAY=TU",
		"2014-03-04T11:00:00",
		"FREQ=WEEKLY;UNTIL=20140415T175959Z;WKST=MO;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140506T000000Z;INTERVAL=2;BYDAY=MO",
		"2014-04-07T17:00:00",
		"FREQ=WEEKLY;UNTIL=20140506T000000Z;INTERVAL=2;BYDAY=MO",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140407T235959Z;INTERVAL=2;BYDAY=MO",
		"2014-03-10T17:00:00",
		"FREQ=WEEKLY;UNTIL=20140407T235959Z;INTERVAL=2;BYDAY=MO",
		[]
	],

	[
		"FREQ=WEEKLY;COUNT=2;INTERVAL=2;BYDAY=WE",
		"2014-04-16T11:00:00",
		"FREQ=WEEKLY;COUNT=2;INTERVAL=2;BYDAY=WE",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140630T233000Z;INTERVAL=2;BYDAY=MO",
		"2014-05-05T16:30:00",
		"FREQ=WEEKLY;UNTIL=20140630T233000Z;INTERVAL=2;BYDAY=MO",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;UNTIL=20140225T190000Z",
		"2014-01-28T11:00:00",
		"FREQ=WEEKLY;INTERVAL=2;BYDAY=TU;UNTIL=20140225T190000Z",
		[]
	],

	[
		"FREQ=WEEKLY;BYDAY=TH;UNTIL=20140306T075959Z",
		"2013-11-14T11:00:00",
		"FREQ=WEEKLY;BYDAY=TH;UNTIL=20140306T075959Z",
		[]
	],

	[
		"FREQ=WEEKLY;BYDAY=TH",
		"2014-03-06T11:00:00",
		"FREQ=WEEKLY;BYDAY=TH",
		[]
	],

	[
		"FREQ=WEEKLY;BYDAY=SU",
		"2014-02-09T11:00:00",
		"FREQ=WEEKLY;BYDAY=SU",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU",
		"2014-11-30T10:00:00",
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU;UNTIL=20141123T075959Z",
		"2014-09-28T10:00:00",
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU;UNTIL=20141123T075959Z",
		[]
	],

	[
		"FREQ=MONTHLY;BYDAY=-1SA",
		"2014-11-29T10:00:00",
		"FREQ=MONTHLY;BYDAY=-1SA",
		[]
	],

	[
		"FREQ=MONTHLY;BYDAY=4SA;UNTIL=20141122T075959Z",
		"2013-07-27T10:00:00",
		"FREQ=MONTHLY;BYDAY=4SA;UNTIL=20141122T075959Z",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU;UNTIL=20140914T065959Z",
		"2014-04-27T10:30:00",
		"FREQ=WEEKLY;INTERVAL=4;BYDAY=SU;UNTIL=20140914T065959Z",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140428T180000Z;INTERVAL=4;BYDAY=MO",
		"2014-02-03T11:00:00",
		"FREQ=WEEKLY;UNTIL=20140428T180000Z;INTERVAL=4;BYDAY=MO",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140512T180000Z;INTERVAL=4;BYDAY=MO",
		"2014-02-17T11:00:00",
		"FREQ=WEEKLY;UNTIL=20140512T180000Z;INTERVAL=4;BYDAY=MO",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140204T185959Z;INTERVAL=4;WKST=MO;BYDAY=TU",
		"2014-02-03T11:00:00",
		"FREQ=WEEKLY;UNTIL=20140204T185959Z;INTERVAL=4;WKST=MO;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140204T185959Z;INTERVAL=4;WKST=MO;BYDAY=TU",
		"2013-12-09T11:00:00",
		"FREQ=WEEKLY;UNTIL=20140204T185959Z;INTERVAL=4;WKST=MO;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20140419T000000Z;INTERVAL=4;BYDAY=FR",
		"2014-01-24T17:00:00",
		"FREQ=WEEKLY;UNTIL=20140419T000000Z;INTERVAL=4;BYDAY=FR",
		[]
	],

	[
		"FREQ=WEEKLY;WKST=SU;INTERVAL=2;BYDAY=TU;UNTIL=20131112T075959Z",
		"2013-10-15T11:00:00",
		"FREQ=WEEKLY;WKST=SU;INTERVAL=2;BYDAY=TU;UNTIL=20131112T075959Z",
		[]
	],

	[
		"FREQ=WEEKLY;WKST=SU;UNTIL=20131112T190000Z;INTERVAL=4;BYDAY=TU",
		"2013-11-12T11:00:00",
		"FREQ=WEEKLY;WKST=SU;UNTIL=20131112T190000Z;INTERVAL=4;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20131015T175959Z;INTERVAL=2;WKST=MO;BYDAY=TU",
		"2013-09-03T11:00:00",
		"FREQ=WEEKLY;UNTIL=20131015T175959Z;INTERVAL=2;WKST=MO;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20131231T190000Z;INTERVAL=2;BYDAY=TU",
		"2013-09-24T11:00:00",
		"FREQ=WEEKLY;UNTIL=20131231T190000Z;INTERVAL=2;BYDAY=TU",
		[]
	],

	[
		"FREQ=WEEKLY;WKST=SU;BYDAY=TH;UNTIL=20130905T065959Z",
		"2012-06-21T11:00:00",
		"FREQ=WEEKLY;WKST=SU;BYDAY=TH;UNTIL=20130905T065959Z",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=2;BYDAY=MO;UNTIL=20130924T000000Z",
		"2013-05-20T17:00:00",
		"FREQ=WEEKLY;INTERVAL=2;BYDAY=MO;UNTIL=20130924T000000Z",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20130823T180000Z;BYDAY=FR",
		"2013-08-09T11:00:00",
		"FREQ=WEEKLY;UNTIL=20130823T180000Z;BYDAY=FR",
		[]
	],

	[
		"FREQ=WEEKLY;INTERVAL=2;WKST=SU;BYDAY=WE;UNTIL=20130626T180000Z",
		"2013-05-15T11:00:00",
		"FREQ=WEEKLY;INTERVAL=2;WKST=SU;BYDAY=WE;UNTIL=20130626T180000Z",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20131215T180000Z;INTERVAL=4;BYDAY=SU",
		"2013-06-30T10:00:00",
		"FREQ=WEEKLY;UNTIL=20131215T180000Z;INTERVAL=4;BYDAY=SU",
		[]
	],

	[
		"FREQ=WEEKLY;BYDAY=TU;UNTIL=20130501T000000Z",
		"2013-03-05T17:00:00",
		"FREQ=WEEKLY;BYDAY=TU;UNTIL=20130501T000000Z",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20120222T193000Z;INTERVAL=2;WKST=SU;BYDAY=WE",
		"2012-02-08T11:30:00",
		"FREQ=WEEKLY;UNTIL=20120222T193000Z;INTERVAL=2;WKST=SU;BYDAY=WE",
		[]
	],

	[
		"FREQ=WEEKLY;UNTIL=20120130T193000Z;INTERVAL=2;WKST=SU;BYDAY=MO",
		"2012-01-16T11:30:00",
		"FREQ=WEEKLY;UNTIL=20120130T193000Z;INTERVAL=2;WKST=SU;BYDAY=MO",
		[]
	]
].forEach(function (items) {
    it(items[0], function () {
      var startDate = new Date(items[1]);
      // items[1] should be the rrule to test, or an array of rrules 
      // all of which should produce the same recurrence set
      var rrules = items[2];
      // items[3] should be the set of dates we expect the 
      // rule to generate
      var expectedSet = items[3];
      // items[4] should be a boolean flag specifying if the 
      // recurance set is finite
      var oneMore = items[4] ? 1 : 0;
      // items[5] should be a human readable representation of 
      // the expected set
      var expectedDates = items[5];
      rrules = [].concat(rrules); //ensure array
      expect(rrules.length).toBe(1);
      rrules.forEach(function (rr) {
        var rule = new RRule(rr, startDate);
        if (expectedSet instanceof Array) {
          expectedSet = expectedSet.map(function (d) {
            return new Date(d);
          });
          expect(rule.nextOccurences(null, expectedSet.length + oneMore)).toEqual(expectedSet);
        }
      });
    });
  });
});