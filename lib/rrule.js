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
    return this.nextOccurences(after, 1)[0];
}

RRule.prototype.nextOccurences = function (after, count_or_until) {
    var rule = {};
    for (var prop in this.rule) {
        rule[prop.toLowerCase()] = this.rule[prop];
    }
    rule.freq = FREQ[rule.freq];
    var until = this.rule.UNTIL;
    var count = this.rule.COUNT;

    after = moment(after || this.start);
    until = until ? moment(until) : null;

    var results = [];

    // XXX we could optimize this to only start generating recurunces after the after date,
    // but we need to be sure we have everything normallized first.
    results.push(this.start);

    var resultCount = null;

    if (count_or_until instanceof Date)
        if (until)
            until = moment(Math.min(until.valueOf(), count_or_until.valueOf()));
        else
            until = moment(count_or_until);
    else
        resultCount = count_or_until;

    if (!resultCount && !count && !until)
        throw new Error("Infinite occurences requested! Please specify an end date or max count");

    var processors = byUnits.filter(function (a) {
        return rule['by' + a] || rule.freq == a;
    });
    var length = 1;
    var callback = function (date) {
        // until, count, user_until, user_after and exdate should be handled here

        if (until && date >= until) return true;

        if (date >= after) results.push(date);

        length++
        
        if (count && length >= count) return true;
        if (resultCount && results.length >= resultCount) return true;

        if (length > 10000) throw new Error('Excessive results, reccurence set produced 10k+ results. Please narrow the date window or specify a count.');
    };
    var reset = function (a) {return a};
    // This loop is backwards on purpose
    for (var i = processors.length - 1; i >= 0; i--) {
        var a = processors[i];
        var parent = byUnitHandlers[processors[i-1]];
        var processor = byUnitHandlers[a];
        var values = rule['by' + a];
        values = values && values[0] && [].concat(values[0]);
        var interval = rule.freq == a ? rule.interval : 0; // this serves double duty as a flag.
        if (interval !== 0) var next = processor.increment(this.start.clone(), interval, reset);
        callback = recurCallback(processor, parent, values, interval, reset, callback);
        reset = recurReset(reset, processor.reset);
    };
    // next is set inside the processors loop, that way it can be run with the correct settings.
    callback(next);
    return results.map(function (a) {return a.toDate();});
}

var byUnitHandlers = {};
var byUnits = ["year","month","week","date","dayOfYear","day","hour","minute","second"]
byUnits.forEach(function (unit) {
    byUnitHandlers[unit] = {
        increment: function (date, interval, reset) {
            interval = interval || 1;
            date = date.add(unit, interval);
            date = reset(date);
            return date;
        },
        next: function (date, values, interval, reset, callback) {
            date = date.clone();
            while (true) {
                if (values instanceof Array) {
                    // XXX more efficient incrementer, ie
                    // bymonth=1 should increment by a year each time.
                    while (values.indexOf(date.get(unit)) == -1) {
                        this.increment(date, interval, reset);
                    }
                }
                date = date.clone(); // just in case :)
                var result = callback(date);
                if (result) return true;
                else if (result === false) return;
                date = date.clone();
                this.increment(date, interval, reset);          
            }
        },
        stop: function (start, date) {
            return start.get(unit) != date.get(unit);
        },
        reset: function (date) {
            return date.set(unit, 0);
        }
    }
});

var recurCallback = function (processor, parent, values, interval, reset, callback) {
    return function (date) {
        return processor.next(date, values, interval, reset, function (inner) {
            if (parent && parent.stop(date, inner))
                // Allow the parent to keep processing
                // Note that the parent will reset the date correctly
                return false; //keep processing
            else
                return callback(inner);
        });
    }
}

var recurReset = function (parent, child) {
    return function (date) {
        date = parent(date);
        date = child(date);
        return date;
    }
}




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
