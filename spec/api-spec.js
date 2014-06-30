
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
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
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
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
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
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
			expect(reservations).toBeTruthy();
			console.log("Reservations:",reservations);
			expect(reservations.length).toBe(2); // Note default reservations duration is 1 year
		});
		it("reservations property should return reservations for a multi-day event.", function () {
			var cal = icalendar.parse_calendar(
				'BEGIN:VCALENDAR\r\n'+
				'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
				'VERSION:2.0\r\n'+
				'BEGIN:VEVENT\r\n'+
				'DTSTAMP:20111202T165900\r\n'+
				'UID:testuid@someotherplace.com\r\n'+
				'DTSTART:20110101T100000Z\r\n'+
				'DTEND:20110102T200000Z\r\n'+
				'SUMMARY:Some Event\r\n'+
				'DESCRIPTION:Something will happen\r\n'+
				'END:VEVENT\r\n'+
				'END:VCALENDAR\r\n');
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(2); // Note default reservations duration is 1 year
			expect(reservations[0].start.time).toEqual(10 * 60); // Note default reservations duration is 1 year
			expect(reservations[0].end.time).toEqual(24 * 60 - 1); // Note default reservations duration is 1 year
		});
		it("reservations property should return all-day reservation for a all-day event.", function () {
			var cal = icalendar.parse_calendar(
				'BEGIN:VCALENDAR\r\n'+
				'PRODID:-//Bobs Software Emporium//NONSGML Bobs Calendar//EN\r\n'+
				'VERSION:2.0\r\n'+
				'BEGIN:VEVENT\r\n'+
				'DTSTAMP:20111202T165900\r\n'+
				'UID:testuid@someotherplace.com\r\n'+
				'DTSTART:20110101T000000Z\r\n'+
				'DTEND:20110102T000000Z\r\n'+
				'SUMMARY:Some Event\r\n'+
				'DESCRIPTION:Something will happen\r\n'+
				'END:VEVENT\r\n'+
				'END:VCALENDAR\r\n');
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(1); // Note default reservations duration is 1 year
			expect(reservations[0].end.time).toBe(23 * 60 + 59); // Note default reservations duration is 1 year
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
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"));
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(13); // Note default reservations duration is 1 year
		});
		it("reservations property should return timezone adjusted events for each day", function () {
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
			var reservations = cal.reservations(new Date("2011-01-01T00:00:00Z"), new Date("2012-01-01T00:00:00Z"), "America/Los_Angeles");
			expect(reservations).toBeTruthy();
			expect(reservations.length).toBe(12);
			// expect(reservations[0].date.year).toEqual(2011);
			// expect(reservations[0].date.month).toEqual(01);
			expect(reservations[0].date.date).toEqual(01);
			expect(reservations[0].start.time).toEqual(2 * 60);
			expect(reservations[0].end.time).toEqual(12 * 60);
		});
	})

	// TODO: calendar.events, event.start, event.end, event.rrule, event.getReservations, etc.
})