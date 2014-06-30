"use strict";
// Copyright (C) 2011 Tri Tech Computers Ltd.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// 

var util = require('util');

var CalendarObject = require('./base').CalendarObject;
var schema = require('./base').schema;

var iCalendar = require('./icalendar').iCalendar;

var RRule = require('./rrule').RRule;



var VEvent = exports.VEvent = function(calendar, uid) {
    if(!(calendar instanceof iCalendar)) {
        uid = calendar;
        calendar = null;
    }
    CalendarObject.call(this, calendar, 'VEVENT');

//    TODO: Move validation to its own method
//    if(uid === undefined)
//        throw Error("UID is a required parameter");

    if(uid !== undefined) {
        this.addProperty('DTSTAMP', new Date());
        this.addProperty('UID', uid);
    }
}
util.inherits(VEvent, CalendarObject);

VEvent.prototype.setSummary = function(summ) {
    this.addProperty('SUMMARY', summ);
}

VEvent.prototype.setLocation = function(loc) {
    this.addProperty('LOCATION', loc);
}

VEvent.prototype.setDescription = function(desc) {
    this.addProperty('DESCRIPTION', desc);
}

VEvent.prototype.setDate = function(start, end) {
    this.addProperty('DTSTART', start);
    if(end instanceof Date)
        this.addProperty('DTEND', end);
    else
        this.addProperty('DURATION', end);
}

VEvent.prototype.rrule = function() {
    var rr = this.getPropertyValue('RRULE');
    if(!rr) return null;

    var exceptions = [];
    var ex, i=0;
    while(ex = this.getPropertyValue('EXDATE', i++))
        exceptions.push.apply(exceptions, ex);

    return new RRule(rr, {
        DTSTART: this.getPropertyValue('DTSTART'),
        DTEND: this.getPropertyValue('DTEND'),
        EXDATE: exceptions
    });
}
// TODO:
    // Returns the start date, or throws an error
VEvent.prototype.start = function() {
    var result = this.getPropertyValue('DTSTART');
    if (!result) throw new Error('No start date found.');
    return result;
};
    // Returns the end date, or calculates the end date from the duration,
    // or throws an error.
VEvent.prototype.end = function() {
    var result = this.getPropertyValue('DTEND');
    if (!result) {
        var dur = this.duration();
        // duration always returns a value, sometimes 0
        result = new Date(this.start().valueOf() + dur);    
    }
    if (!result) throw new Error("Can't get end date.");
    return result;
};
    // returns the duration in miliseconds, or calcuates the duration from the end date,
    // or throws an error.
VEvent.prototype.duration = function() {
    var result = this.getPropertyValue('DURATION');
    if (!result) {
        // Don't use the end helper or you'll get an infinite loop.
        var end = this.getPropertyValue('DTEND');
        if (end) {
            result = end - this.getPropertyValue('DTSTART');            
        }
    } else {
        result *= 1000; // iCal Duration is in seconds, javascript in miliseconds
    }
    // TODO return a duration of 24 hours for events with a start date.time == 0 (ie midnight)
    if (!result && result !== 0) return 0; // throw new Error("Can't get duration.");
    return result;
};
VEvent.prototype.inTimeRange = function(start, end) {
    var rr = this.rrule();
    if(rr) {
        var next = rr.next(start);
        return (!!next && (!end || next <= end));
    }

    var dtstart = this.getPropertyValue('DTSTART');
    var dtend = this.getPropertyValue('DTEND');
    if(!dtend) {
        var duration = this.getPropertyValue('DURATION');
        if(duration === 0)
            // Special case for zero-duration, as per RFC4791
            return (!start || start <= dtstart) && (!end || end > dtstart);

        else if(duration)
            dtend = new Date(dtstart.valueOf() + this.getPropertyValue('DURATION')*1000);
        else 
            dtend = new Date(dtstart.valueOf() + 24*60*60*1000); // +1 day
    }

    return (!start || start < dtend) && (!end || end > dtstart);
}

    // used to parse dates into a four diget number to represent time,
    // eg parseTime(new Date("12/12/12 07:00:00")) =  700
    // eg parseTime(new Date("12/11/12 9:00:00 pm")) =  2100

    var parseTime = function (time) {
        // TODO: handle errors.
        return Number(time.toISOString().match(/T\d\d:\d\d/)[0].replace("T", ""))
    }

VEvent.prototype.getReservations = function(now, until) {
    var start = this.start();
    var end = this.end();
    var dur = this.duration();
    var startTime = parseTime(start);
    var endTime = parseTime(end);
    var rrule = this.rrule();
    var uid = this.getPropertyValue('UID');
    var summary = this.getPropertyValue('SUMMARY');
    var description = this.getPropertyValue('DESCRIPTION');
    
    now = now ? new Date(now - 1) : new Date();
    if (!until) {
        until = new Date();
        until.setYear(now.getFullYear() + 1);   
    }
    
    var results = [];

    if (rrule) {
        // don't push the original event
        // limit the number of occurences
        var events = rrule.nextOccurences(now, until);

        events.forEach(function (start) {
            end = new Date(start.valueOf() + dur);
            results.push({
                start: start
                , end: end
                , uid: uid
                , summary: summary
                , description: description
            });
        });
    } else if (start > now) {
        results.push({
            start: start
            , end: end
            , uid: uid
            , summary: summary
            , description: description
        });
    }

    return results;
};

schema.VEVENT = {
    factory: VEvent,
    valid_properties: [],
    required_properties: ['DTSTAMP','UID'],
    valid_children: [],
    required_children: []
};
