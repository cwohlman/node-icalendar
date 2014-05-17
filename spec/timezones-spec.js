
var fs = require('fs');

var parse_calendar = require('../lib/parser').parse_calendar;

xdescribe("Timezone parsing", function () {
	// This is an edge case,
	// TODO: write tests for all the other cases
	xdescribe("Should handle X-WR-TIMEZONE", function () {
		it("Should parse America/Los_Angeles", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/Los_Angeles\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0800"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0700")); //DST
		})
		it("Should parse America/New_York", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/New_York\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0500"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0400")); //DST
		})
		it("Should parse America/Chicago", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/Chicago\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0600"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0500")); //DST
		})
		it("Should parse America/Denver", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/Denver\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0700"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0600")); //DST
		})
		it("Should parse America/Phoenix", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/Phoenix\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0700"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0700")); //No DST
		})
		
		it("Should parse America/Anchorage", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:America/Anchorage\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-0900"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-0800")); //DST
		})

		it("Should parse Pacific/Honolulu", function () {
			var cal = parse_calendar(
				"BEGIN:VCALENDAR\r\n" +
				"PRODID:-//Ximian//NONSGML Evolution Calendar//EN\r\n" +
				"VERSION:2.0\r\n" +
				"METHOD:PUBLISH\r\n" +
				"X-WR-TIMEZONE:Pacific/Honolulu\r\n" +
				"BEGIN:VEVENT\r\n" +
				"UID:20111219T180855Z-1971-1000-1-0@virtualbox\r\n" +
				"DTSTAMP:20111219T180855Z\r\n" +
				"DTSTART:20120104T090000\r\n" +
				"DTEND:20120704T103000\r\n" +
				"SUMMARY:Test summ\r\n" +
				"DESCRIPTION:Test desc\r\n" +
				"CLASS:PUBLIC\r\n" +
				"CREATED:20111219T180914Z\r\n" +
				"LAST-MODIFIED:20111219T180914Z\r\n" +
				"END:VEVENT\r\n" +
				"END:VCALENDAR\r\n"
				);
			expect(cal.events()[0].start()).toEqual(new Date("2012-01-04T09:00:00-1000"));
			expect(cal.events()[0].end()).toEqual(new Date("2012-07-04T10:30:00-1000")); //No DST
		})
	})
})