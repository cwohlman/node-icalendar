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
//
// NB: All calculations here happen using the UTC portion of a datetime object
//   as if it were the local time. This is done to reuse the TZ-agnostic date
//   calculations provided to us. Without this, performing date calculations
//   across local DST boundaries would yield surprising results.
//


var types = require('./types');

var moment = require('moment');

var SUPPORTED_PARTS = ['FREQ','INTERVAL','COUNT','UNTIL','BYDAY','BYMONTH','BYMONTHDAY'];
var WKDAYS = ['SU','MO','TU','WE','TH','FR','SA'];

var RRule = exports.RRule = function(rule, options, dtend) {
    if(options instanceof Date)
        options = { DTSTART: options, DTEND: dtend };

    options = options || {};

    // XXX ensure that timezone info is available, and write a function which
    // uses that info to create a correct moment object

    this.start = options.DTSTART ? moment.parseZone(options.DTSTART) : null;
    this.end = options.DTEND ? moment.parseZone(options.DTEND) : null;

    this.exceptions = options.EXDATE || [];

    if(typeof rule === 'string')
        rule = RRule.parse(rule);

    this.rule = {};
    for(var i in (rule||{})) {
        if(SUPPORTED_PARTS.indexOf(i) == -1)
            throw new Error(i+" is not currently supported!");

        this.rule[i] = RULE_PARTS[i]
                ? RULE_PARTS[i].parse(rule[i])
                : rule[i];
    }
}

RRule.parse = function(value) {
    var parts = value.split(/=|;/);
    var rrule = {};
    for(var i=0; i<parts.length; i+=2) {
        rrule[parts[i]] = parts[i+1];
    }
    return rrule;
}

RRule.prototype.setFrequency = function(freq) {
    this.rule.FREQ = freq;
}

RRule.prototype.valueOf = function() { return this.rule; }

RRule.prototype.toString = function() {
    // FREQ comes first, as per spec
    var out = [ 'FREQ='+this.rule.FREQ ];
    for(var k in this.rule) {
        if(k=='FREQ') continue;

        out.push(k+'='+((RULE_PARTS[k] || {}).format
                ? RULE_PARTS[k].format(this.rule[k])
                : this.rule[k]));
    }
    return out.join(';');
}

RRule.prototype._next = function (after) {

}

RRule.prototype.next = function (after) {
    return this.nextOccurences(after, 1);
}


// Use only moments beyond this point.

// after is exclusive, until is inclusive
RRule.prototype.nextOccurences = function (after, count_or_until) {
    if(arguments.length === 1) {
        count_or_until = after;
        after = undefined;
    }

    var freq = FREQ[this.rule.FREQ];
    var interval = this.rule.INTERVAL || 1;
    var until = this.rule.UNTIL;
    var count = this.rule.COUNT;

    after = moment(after || this.start.valueOf() - 1);
    until = until ? moment(until) : null;

    // if a count is specified, we can't jump to the after date, we have to 
    // see how many occurences are before the after date.
    var next = count ? this.start : after;
    var resultCount = null;

    if (count_or_until instanceof Date)
        if (until)
            until = moment(Math.min(until.valueOf(), count_or_until.valueOf()));
        else
            until = moment()
    else
        resultCount = count_or_until;

    if (!resultCount && !count && !until)
        throw new Error("Infinite occurences requested! Please specify an end date or max count");
    var i = 0;
    var results = [];
    var length = 0; // length is updated every time an occurance is found
                    // length is used to check against count.

    var byRules = [start.clone().startOf(freq)];


    while ((!until || next <= until) // XXX until is inclusive
        && (!count || length < count)
        && (!resultCount || results.length < resultCount)
        ) {
        // There are several cases where a user could ask for virtually infinte occurences,
        // we'll be generous and give them 100k, if they want more than 100k, they can fork this
        // library.
        i++;
        if (i > 100000) throw new Error("Excessive iterations! Over " + length + " occurences processed.")

        // If the next matches, push it to the result set
        // If not, push forward to the next bymonth, byweek, byday, etc.
        // If there is no next by, apply the interval eg next = next.StartOf(freq).add(freq, interval)
        // XXX watchout for funny by rules, eg, the by rule is bigger than the freq,
        // or multiple by rules
        // see 'every day in january until jan 2000'
        // "FREQ=YEARLY;UNTIL=20000131T090000Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA",
        // "FREQ=DAILY;UNTIL=20000131T090000Z;BYMONTH=1",

        // XXX normalize next, that is, enusure that next has same year, month, day of week, time, etc 
        // relative to the frequency rule.

        // At this point the date should be valid for the recurrence
        // we still need to test for exdate eg (if next not in exdates)

        // number of seconds difference between 
        var diff = (next - next.clone().startOf(freq)) - (start - start.clone().startOf(freq))})



        if (after <= next) results.push(next.clone().toDate());
        length++;

        next = next.add(freq, interval).startOf(
            freq // or by rule, whichever is greater
        );
    }
    if (after && !count) next = after;
    if (!after || after < this.start) after = new Date(this.start.valueOf() - 1);
    return results;
}

// Return the next occurrence after dt
// RRule.prototype.next = function(after) {
//     after = after && to_utc_date(after);

//     // Events don't occur before the start or after the end...
//     if(!after || after < this.start)
//         after = new Date(this.start.valueOf() - 1);
//     if(this.until && after > this.until) return null;

//     var freq = FREQ[this.rule.FREQ];
//     if(!freq)
//         throw new Error(this.rule.FREQ+' recurrence is not supported');

//     NextOccurs:
//     while(true) {
//         var next = freq.next(this.rule, this.start, after);

//         // Exclude EXDATES
//         var nextInLocal = from_utc_date(next);
//         for(var i=0; i < this.exceptions.length; i++) {
//             var exdate = this.exceptions[i];
//             if((exdate.valueOf() == nextInLocal.valueOf())
//                     || (exdate.date_only && y(to_utc_date(exdate)) == y(nextInLocal)
//                     && m(to_utc_date(exdate)) == m(nextInLocal) && d(to_utc_date(exdate)) == d(nextInLocal))) {
//                 after = next;
//                 continue NextOccurs;
//             }
//         }

//         break;
//     }

//     // Date is off the end of the spectrum...
//     if(this.until && next > this.until)
//         return null;

//     if(this.rule.COUNT && this.count_end !== null) {
//         if(this.count_end === undefined) {
//             // Don't check this while we're trying to compute it...
//             this.count_end = null;
//             this.count_end = this.nextOccurences(this.rule.COUNT).pop();
//         }

//         if(next > to_utc_date(this.count_end))
//             return null;
//     }

//     if(this.rule.UNTIL && next > to_utc_date(this.rule.UNTIL))
//         return null;

//     return from_utc_date(next);
// }

// RRule.prototype.nextOccurences = function(after, count_or_until) {
//     if(arguments.length === 1) {
//         count_or_until = after;
//         after = undefined;
//     }

//     var arr = [];
//     if(count_or_until instanceof Date) {
//         while(true) {
//             after = this.next(after);
//             if(after && after <= count_or_until)
//                 arr.push(after);
//             else
//                 break;
//         }
//     }
//     else {
//         if (count_or_until >= 10000) throw new Error("Argument out of range, did you mean to specify 10000+ occurences?");
//         if (isNaN(Number(count_or_until))) throw new Error("Invalid argument, please specify a date or number.");
//         while(count_or_until-- && after !== null) {
//             after = this.next(after);
//             if(after)
//                 arr.push(after);
//         }
//     }
//     return arr;
// }


var RULE_PARTS = {
    INTERVAL: {
        parse: function(v) { return parseInt(v,10); }
    },
    UNTIL: {
        parse: function(v) {
            if(v instanceof Date) return v;
            return types.parse_value('DATE-TIME', v);
        },
        format: function(v) { return types.format_value('DATE-TIME', v); }
    },
    FREQ: {
        parse: function(v) { return v; },
    },
    BYMONTH: {
        parse: function(v) {
            if(typeof v === 'number') return [v];

            return v.split(',').map(function(mo) {
                return parseInt(mo,10);
            });
        },
        format: function(v) {
            return v.join(',');
        }
    },
    BYDAY: {  // 2TH (second thursday) -> [2,4]
        parse: function(v) {
            var days = v.split(',').map(function(day) {
                var m = day.match(/([+-]?\d)?(SU|MO|TU|WE|TH|FR|SA)/);
                return [parseInt(m[1],10)||0, WKDAYS.indexOf(m[2])];
            });

            days.sort(function(d1, d2) {
                // Sort by week, day of week
                if(d1[0] == d2[0])
                    return d1[1] - d2[1];
                else
                    return d1[0] - d2[0];
            });

            return days;
        },
        format: function(v) {
            return v.map(function(day) {
                return (day[0] || '')+WKDAYS[day[1]];
            }).join(',');
        }
    },
    EXDATE: {
      parse: function(v) {
        return v.split(',').map(function(dt) {
          return dt.length == 8 ? types.parse_value('DATE', dt) : types.parse_value('DATE-TIME', dt);
        });
      },
      format: function(v) {
        return v.map(function(dt) {
            return types.format_value(dt.date_only ? 'DATE' : 'DATE-TIME', dt);
        }).join(',');
      }
    }
};

// These parts use the same format...
RULE_PARTS['BYMONTHDAY'] = RULE_PARTS['BYMONTH'];
RULE_PARTS['COUNT'] = RULE_PARTS['INTERVAL'];

var FREQ = {
    DAILY: 'day'
    , WEEKLY: 'week'
    , MONTHLY: 'month'
    , YEARLY: 'year'
};

function sort_dates(dateary) {
    return dateary.sort(function(dt1, dt2) {
        if(dt1 === null && dt2 === null) return 0;
        if(dt1 === null) return 1;
        if(dt2 === null) return -1;

        return dt1.valueOf() - dt2.valueOf();
    });
}

// Check that a particular date is within the limits
// designated by the BYMONTH rule
function check_bymonth(rules, dt) {
    if(!rules || !rules.length) return true;
    return rules.indexOf(m(dt)) !== -1;
}

// Advance to the next month that satisfies the rule...
function bymonth(rules, dt) {
    if(!rules || !rules.length) return dt;

    var candidates = rules.map(function(rule) {
        var delta = rule-m(dt);
        if(delta < 0) delta += 12;

        var newdt = add_m(new Date(dt), delta);
        set_d(newdt, 1);
        return newdt;
    });
    
    var newdt = sort_dates(candidates).shift();
    return newdt || dt;
}


function bymonthday(rules, dt, after) {
    if(!rules || !rules.length) return dt;

    var candidates = rules.map(function(rule) {
        var newdt = set_d(new Date(dt), rule);
        return (newdt.valueOf() <= after.valueOf() ? null : newdt);
    });

    var newdt = sort_dates(candidates).shift();
    return newdt || dt;
}


// Advance to the next day that satisfies the byday rule...
function byday(rules, dt, after) {
    if(!rules || !rules.length) return dt;

    // Generate a list of candiDATES. (HA!)
    var candidates = rules.map(function(rule) {
        // Align on the correct day of the week...
        var days = rule[1]-wkday(dt);
        if(days < 0) days += 7;
        var newdt = add_d(new Date(dt), days);

        if(rule[0] > 0) {
            var wk = 0 | ((d(newdt) - 1) / 7) + 1;
            if(wk > rule[0]) return null;

            add_d(newdt, (rule[0] - wk) * 7);
        }
        else if(rule[0] < 0) {
            // Find all the matching days in the month...
            var dt2 = new Date(newdt);
            var days = [];
            while(m(dt2) === m(newdt)) {
                days.push(d(dt2));
                add_d(dt2, 7);
            }

            // Then grab the nth from the end...
            set_d(newdt, days.reverse()[(-rule[0])-1]);
        }

        // Ignore if it's a past date...
        if (newdt.valueOf() <= after.valueOf()) return null;

        return newdt;
    });

    // Select the date occurring next...
    var newdt = sort_dates(candidates).shift();
    return newdt || dt;
}
