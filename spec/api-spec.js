
var icalendar = require('../lib');

describe("iCalendar API", function () {
	describe("iCalendar object", function () {
		it("Should expose a 'reservations' property", function () {
			var cal = icalendar.parse_calendar(
	            'BEGIN:VCALENDAR\r\n'+
	            'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
	            'VERSION:2.0\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid@someotherplace.com\r\n'+
	            'DTSTART:20110101T100000Z\r\n'+
	            'DTEND:20110101T200000Z\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'END:VCALENDAR\r\n');
			var reservations = cal.reservations();
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(1);
		});
		it("reservations property should return recuring events", function () {
			var cal = icalendar.parse_calendar(
	            'BEGIN:VCALENDAR\r\n'+
	            'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
	            'VERSION:2.0\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid@someotherplace.com\r\n'+
	            'DTSTART:20110101T100000Z\r\n'+
	            'DTEND:20110101T200000Z\r\n'+
            	'RRULE:FREQ=MONTHLY\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'END:VCALENDAR\r\n');
			var reservations = cal.reservations();
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(12); // Note default reservations duration is 1 year
		});
		it("reservations property should return multiple events", function () {
			var cal = icalendar.parse_calendar(
	            'BEGIN:VCALENDAR\r\n'+
	            'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
	            'VERSION:2.0\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid@someotherplace.com\r\n'+
	            'DTSTART:20110101T100000Z\r\n'+
	            'DTEND:20110101T200000Z\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid2@someotherplace.com\r\n'+
	            'DTSTART:20110101T080000Z\r\n'+
	            'DTEND:20110101T090000Z\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'END:VCALENDAR\r\n');
			var reservations = cal.reservations();
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(2); // Note default reservations duration is 1 year
		});
		it("reservations property should handle multiple and recuring events", function () {
			var cal = icalendar.parse_calendar(
	            'BEGIN:VCALENDAR\r\n'+
	            'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
	            'VERSION:2.0\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid@someotherplace.com\r\n'+
	            'DTSTART:20110101T100000Z\r\n'+
	            'DTEND:20110101T200000Z\r\n'+
            	'RRULE:FREQ=MONTHLY\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'BEGIN:VEVENT\r\n'+
	            'DTSTAMP:20111202T165900\r\n'+
	            'UID:testuid2@someotherplace.com\r\n'+
	            'DTSTART:20110101T080000Z\r\n'+
	            'DTEND:20110101T090000Z\r\n'+
	            'SUMMARY:Some Event\r\n'+
	            'DESCRIPTION:Something will happen\r\n'+
	            'END:VEVENT\r\n'+
	            'END:VCALENDAR\r\n');
			var reservations = cal.reservations();
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(13); // Note default reservations duration is 1 year
		});
	})

	// TODO: calendar.events, event.start, event.end, event.rrule, event.getReservations, etc.
})