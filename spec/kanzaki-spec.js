var RRule = require('../lib/rrule').RRule;

describe("Should pass all kanzaki.com rrule examples", function () {
  // body...

  [
    [
        "Daily for 10 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=DAILY;COUNT=10",
        [
          "1997-09-02T09:00:00Z",
          "1997-09-03T09:00:00Z",
          "1997-09-04T09:00:00Z",
          "1997-09-05T09:00:00Z",
          "1997-09-06T09:00:00Z",
          "1997-09-07T09:00:00Z",
          "1997-09-08T09:00:00Z",
          "1997-09-09T09:00:00Z",
          "1997-09-10T09:00:00Z",
          "1997-09-11T09:00:00Z"
        ],
        false,
        "(1997 9:00 AM EDT)September 2-11"
    ],
    [
        "Daily until December 24, 1997:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=DAILY;UNTIL=19971224T000000Z",
        "(1997 9:00 AM EDT)September 2-30;October 1-25\r\n1997 9:00 AM EST)October 26-31;November 1-30;December 1-23"
    ],
    [
        "Every other day - forever:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=DAILY;INTERVAL=2",
        "(1997 9:00 AM EDT)September2,4,6,8...24,26,28,30;\r\nOctober 2,4,6...20,22,24\r\n1997 9:00 AM EST)October 26,28,30;November 1,3,5,7...25,27,29;\r\nDec 1,3,..."
    ],
    [
        "Every 10 days, 5 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=DAILY;INTERVAL=10;COUNT=5",
        "(1997 9:00 AM EDT)September 2,12,22;October 2,12"
    ],
    [
        "Everyday in January, for 3 years:",
        "1998-02-01T15:00:00.000Z",
        "FREQ=YEARLY;UNTIL=20000131T090000Z;",
        "BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA",
        "FREQ=DAILY;UNTIL=20000131T090000Z;BYMONTH=1",
        "(1998 9:00 AM EDT)January 1-31\r\n1999 9:00 AM EDT)January 1-31\r\n2000 9:00 AM EDT)January 1-31"
    ],
    [
        "Weekly for 10 occurrences",
        "1997-10-02T14:00:00.000Z",
        "FREQ=WEEKLY;COUNT=10",
        "(1997 9:00 AM EDT)September 2,9,16,23,30;October 7,14,21\r\n1997 9:00 AM EST)October 28;November 4"
    ],
    [
        "Weekly until December 24, 1997",
        "1997-09-02T14:00:00.000Z",
        "FREQ=WEEKLY;UNTIL=19971224T000000Z",
        [
          "1997-09-02T14:00:00Z",
          "1997-09-09T14:00:00Z",
          "1997-09-16T14:00:00Z",
          "1997-09-23T14:00:00Z",
          "1997-09-30T14:00:00Z",
          "1997-10-07T14:00:00Z",
          "1997-10-14T14:00:00Z",
          "1997-10-21T14:00:00Z",
          "1997-10-28T14:00:00Z",
          "1997-11-04T14:00:00Z",
          "1997-11-11T14:00:00Z",
          "1997-11-18T14:00:00Z",
          "1997-11-25T14:00:00Z",
          "1997-12-02T14:00:00Z",
          "1997-12-09T14:00:00Z",
          "1997-12-16T14:00:00Z",
          "1997-12-23T14:00:00Z"
        ],
        true,
        "(1997 9:00 AM EDT)September 2,9,16,23,30;October 7,14,21(1997 9:00 AM EST)October 28;November 4,11,18,25;\r\nDecember 2,9,16,23"
    ],
    [
        "Every other week - forever:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=WEEKLY;INTERVAL=2;WKST=SU",
        "(1997 9:00 AM EDT)September 2,16,30;October 14(1997 9:00 AM EST)October 28;November 11,25;December 9,23\r\n1998 9:00 AM EST)January 6,20;February\r\n..."
    ],
    [
        "Weekly on Tuesday and Thursday for 5 weeks:",
        "1997-10-02T14:00:00.000Z",
        "RULE:FREQ=WEEKLY;UNTIL=19971007T000000Z;WKST=SU;BYDAY=TU,TH",
        "FREQ=WEEKLY;COUNT=10;WKST=SU;BYDAY=TU,TH",
        "(1997 9:00 AM EDT)September 2,4,9,11,16,18,23,25,30;October 2"
    ],
    [
        "Every other week on Monday, Wednesday and Friday until December 24\r\n1997, but starting on Tuesday, September 2, 1997:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR",
        "(1997 9:00 AM EDT)September 2,3,5,15,17,19,29;October\r\n1,3,13,15,17\r\n1997 9:00 AM EST)October 27,29,31;November 10,12,14,24,26,28;\r\nDecember 8,10,12,22"
    ],
    [
        "Every other week on Tuesday and Thursday, for 8 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=WEEKLY;INTERVAL=2;COUNT=8;WKST=SU;BYDAY=TU,TH",
        "(1997 9:00 AM EDT)September 2,4,16,18,30;October 2,14,16"
    ],
    [
        "Monthly on the 1st Friday for ten occurrences:",
        "1997-10-05T14:00:00.000Z",
        "FREQ=MONTHLY;COUNT=10;BYDAY=1FR",
        "(1997 9:00 AM EDT)September 5;October 3\r\n1997 9:00 AM EST)November 7;Dec 5\r\n1998 9:00 AM EST)January 2;February 6;March 6;April 3\r\n1998 9:00 AM EDT)May 1;June 5"
    ],
    [
        "Monthly on the 1st Friday until December 24, 1997:",
        "1997-10-05T14:00:00.000Z",
        "FREQ=MONTHLY;UNTIL=19971224T000000Z;BYDAY=1FR",
        "(1997 9:00 AM EDT)September 5;October 3\r\n1997 9:00 AM EST)November 7;December 5"
    ],
    [
        "Every other month on the 1st and last Sunday of the month for 10\r\noccurrences:",
        "1997-10-07T14:00:00.000Z",
        "FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU",
        "(1997 9:00 AM EDT)September 7,28\r\n1997 9:00 AM EST)November 2,30\r\n1998 9:00 AM EST)January 4,25;March 1,29\r\n1998 9:00 AM EDT)May 3,31"
    ],
    [
        "Monthly on the second to last Monday of the month for 6 months:",
        "1997-10-22T14:00:00.000Z",
        "FREQ=MONTHLY;COUNT=6;BYDAY=-2MO",
        "(1997 9:00 AM EDT)September 22;October 20\r\n1997 9:00 AM EST)November 17;December 22\r\n1998 9:00 AM EST)January 19;February 16"
    ],
    [
        "Monthly on the third to the last day of the month, forever:",
        "1997-10-28T15:00:00.000Z",
        "FREQ=MONTHLY;BYMONTHDAY=-3",
        "(1997 9:00 AM EDT)September 28\r\n1997 9:00 AM EST)October 29;November 28;December 29\r\n1998 9:00 AM EST)January 29;February 26 ..."
    ],
    [
        "Monthly on the 2nd and 15th of the month for 10 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=MONTHLY;COUNT=10;BYMONTHDAY=2,15",
        "(1997 9:00 AM EDT)September 2,15;October 2,15\r\n1997 9:00 AM EST)November 2,15;December 2,15\r\n1998 9:00 AM EST)January 2,15"
    ],
    [
        "Monthly on the first and last day of the month for 10 occurrences:",
        "1997-10-30T15:00:00.000Z",
        "FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1",
        "(1997 9:00 AM EDT)September 30;October 1\r\n1997 9:00 AM EST)October 31;November 1,30;December 1,31\r\n1998 9:00 AM EST)January 1,31;February 1"
    ],
    [
        "Every 18 months on the 10th thru 15th of the month for 10\r\noccurrences:",
        "1997-10-10T14:00:00.000Z",
        "FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15",
        "(1997 9:00 AM EDT)September 10,11,12,13,14,15\r\n1999 9:00 AM EST)March 10,11,12,13"
    ],
    [
        "Every Tuesday, every other month:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=MONTHLY;INTERVAL=2;BYDAY=TU",
        "(1997 9:00 AM EDT)September 2,9,16,23,30\r\n1997 9:00 AM EST)November 4,11,18,25\r\n1998 9:00 AM EST)January 6,13,20,27;March 3,10,17,24,31 ..."
    ],
    [
        "Yearly in June and July for 10 occurrences:",
        "1997-07-10T14:00:00.000Z",
        "FREQ=YEARLY;COUNT=10;BYMONTH=6,7",
        "(1997 9:00 AM EDT)June 10;July 10\r\n1998 9:00 AM EDT)June 10;July 10\r\n1999 9:00 AM EDT)June 10;July 10\r\n2000 9:00 AM EDT)June 10;July 10\r\n2001 9:00 AM EDT)June 10;July 10",
        "Note: Since none of the BYDAY, BYMONTHDAY or BYYEARDAY componentsare specified, the day is gotten from DTSTART"
    ],
    [
        "Every other year on January, February, and March for 10 occurrences:",
        "1997-04-10T14:00:00.000Z",
        "FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3",
        "(1997 9:00 AM EST)March 10\r\n1999 9:00 AM EST)January 10;February 10;March 10\r\n2001 9:00 AM EST)January 10;February 10;March 10\r\n2003 9:00 AM EST)January 10;February 10;March 10"
    ],
    [
        "Every 3rd year on the 1st, 100th and 200th day for 10 occurrences:",
        "1997-02-01T15:00:00.000Z",
        "FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200",
        "(1997 9:00 AM EST)January 1\r\n1997 9:00 AM EDT)April 10;July 19\r\n2000 9:00 AM EST)January 1\r\n2000 9:00 AM EDT)April 9;July 18\r\n2003 9:00 AM EST)January 1\r\n2003 9:00 AM EDT)April 10;July 19\r\n2006 9:00 AM EST)January 1"
    ],
    [
        "Monday of week number 20 (where the default start of the week is Monday), forever:",
        "1997-06-12T14:00:00.000Z",
        "FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO",
        "(1997 9:00 AM EDT)May 12\r\n1998 9:00 AM EDT)May 11\r\n1999 9:00 AM EDT)May 17 ..."
    ],
    [
        "Every Thursday in March, forever:",
        "1997-04-13T14:00:00.000Z",
        "FREQ=YEARLY;BYMONTH=3;BYDAY=TH",
        "(1997 9:00 AM EST)March 13,20,27\r\n1998 9:00 AM EST)March 5,12,19,26\r\n1999 9:00 AM EST)March 4,11,18,25 ..."
    ],
    [
        "Every Thursday, but only during June, July, and August, forever:",
        "1997-07-05T14:00:00.000Z",
        "FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8",
        "(1997 9:00 AM EDT)June 5,12,19,26;July 3,10,17,24,31;\r\nAugust 7,14,21,28\r\n1998 9:00 AM EDT)June 4,11,18,25;July 2,9,16,23,30;\r\nAugust 6,13,20,27\r\n1999 9:00 AM EDT)June 3,10,17,24;July 1,8,15,22,29;\r\nAugust 5,12,19,26 ..."
    ],
    [
        "Every Friday the 13th, forever:",
        "1997-10-02T14:00:00.000Z",
        "EXDATE;TZID=US-Eastern:19970902T090000",
        "FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13",
        "(1998 9:00 AM EST)February 13;March 13;November 13\r\n1999 9:00 AM EDT)August 13\r\n2000 9:00 AM EDT)October 13 ..."
    ],
    [
        "The first Saturday that follows the first Sunday of the month, forever:",
        "1997-10-13T14:00:00.000Z",
        "FREQ=MONTHLY;BYDAY=SA;BYMONTHDAY=7,8,9,10,11,12,13",
        "(1997 9:00 AM EDT)September 13;October 11\r\n1997 9:00 AM EST)November 8;December 13\r\n1998 9:00 AM EST)January 10;February 7;March 7\r\n1998 9:00 AM EDT)April 11;May 9;June 13... ..."
    ],
    [
        "Every four years, the first Tuesday after a Monday in November, forever (U.S. Presidential Election day):",
        "1996-12-05T15:00:00.000Z",
        "FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8",
        "(1996 9:00 AM EST)November 5\r\n2000 9:00 AM EST)November 7\r\n2004 9:00 AM EST)November 2 ..."
    ],
    [
        "The 3rd instance into the month of one of Tuesday, Wednesday or Thursday, for the next 3 months:",
        "1997-10-04T14:00:00.000Z",
        "FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3",
        "(1997 9:00 AM EDT)September 4;October 7\r\n1997 9:00 AM EST)November 6"
    ],
    [
        "The 2nd to last weekday of the month:",
        "1997-10-29T15:00:00.000Z",
        "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2",
        "(1997 9:00 AM EDT)September 29\r\n1997 9:00 AM EST)October 30;November 27;December 30\r\n1998 9:00 AM EST)January 29;February 26;March 30"
    ],
    [
        "Every 3 hours from 9:00 AM to 5:00 PM on a specific day:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=HOURLY;INTERVAL=3;UNTIL=19970902T170000Z",
        "(September 2, 1997 EDT)09:00,12:00,15:00"
    ],
    [
        "Every 15 minutes for 6 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=MINUTELY;INTERVAL=15;COUNT=6",
        "(September 2, 1997 EDT)09:00,09:15,09:30,09:45,10:00,10:15"
    ],
    [
        "Every hour and a half for 4 occurrences:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=MINUTELY;INTERVAL=90;COUNT=4",
        "(September 2, 1997 EDT)09:00,10:30;12:00;13:30"
    ],
    [
        "Every 20 minutes from 9:00 AM to 4:40 PM every day:",
        "1997-10-02T14:00:00.000Z",
        "FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40",
        "FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16",
        "(September 2, 1997 EDT)9:00,9:20,9:40,10:00,10:20, ... 16:00,16:20,16:40\r\nSeptember 3, 1997 EDT)9:00,9:20,9:40,10:00,10:20,...16:00,16:20,16:40 ..."
    ],
    [
        "An example where the days generated makes a difference because of WKST:",
        "1997-09-05T14:00:00.000Z",
        "FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO",
        "(1997 EDT)Aug 5,10,19,24"
    ],
    [
        "changing only WKST from MO to SU, yields different results...",
        "1997-09-05T14:00:00.000Z",
        "FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU",
        "(1997 EDT)August 5,17,19,31"
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
        console.log("rule", items[0]);
        if (expectedSet instanceof Array) {
          expectedSet = expectedSet.map(function (d) {
            return new Date(d);
          });
          console.log("oneMore", oneMore);
          expect(rule.nextOccurences(expectedSet.length + oneMore)).toEqual(expectedSet);
        }
      });
    });
  });
});