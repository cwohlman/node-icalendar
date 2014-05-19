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
    var start = this.start;

    after = moment(after || this.start.valueOf() - 1);
    until = until ? moment(until) : null;

    var results = [];

    // XXX we could optimize this to only start generating recurunces after the after date,
    // but we need to be sure we have everything normallized first.

    var next = this.start.clone();
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

    if (resultCount >= 10000 || count >= 10000)
        throw new Error("Argument out of range, did you mean to specify 10000+ occurences?")

    if (resultCount && typeof resultCount != 'number') 
        throw new Error("Invalid argument, please specify a date or number.")

    if (this.start > after && (!until || this.start <= until)) results.push(this.start.clone());

    var length = 1;
    var i = 0;

    var exceptions = {};

    this.exceptions.forEach(function (a) {
        exceptions[a.valueOf()] = true;
    });

    var processors = byUnits.filter(function (a) {
        return rule['by' + a] || rule.freq == a;
    });

    var parentStop = function (date) {
        i++;

        // Ensure until date respects date parts, (check spec first)
        // ie. until(12/12/12) should include (12/12/12 3:15 pm)
        if (until && date > until) return new StopFlag();

        if (count && length >= count) return new StopFlag();
        if (resultCount && results.length >= resultCount) return new StopFlag();

        if (i > 10000) throw new Error('Excessive iterations, reccurence set produced ' + length + ' results. Please narrow the date window or specify a count.');
    }
    var noop = function (a) {return a;};
    var child = {
        reset: noop,
        next: function (date) {
            // This function should always be called immediately after
            // a processor calls the stop function, do we want to call stop anyway?

            // Handle exdate
            if (exceptions[date.valueOf()]) return;

            if (exceptions[date.clone().startOf('day').valueOf()]) return;

            // we explicitly add start, in case it doesn't fit the reccurence set,
            // don't add it twice.
            if (date.valueOf() == start.valueOf()) return;

            if (date > after) results.push(date);
            length++                ;
            

        }
    }, parent = {};
    // This loop is backwards on purpose
    for (var i = processors.length - 1; i >= 0; i--) {
        var a = processors[i];

        var values = rule['by' + a];
        var interval = rule.freq == a ? rule.interval : 0; // this serves double duty as a flag.

        values = values && [].concat(values);

        parent = new byUnitHandlers[processors[i]](
                values,
                interval,
                child
            );

        child.parent = parent;
        child = parent;
    };
    // next is set inside the processors loop, that way it can be run with the correct settings.
    child.next(next, parentStop);
    return results.map(function (a) {return a.toDate();});
}

var byUnitHandlers = {};
var byUnits = ["year", "month","week","yearday","dayOfYear","monthday","date","day","hour","minute","second"];

var StopFlag = function (unit) {this.unit = unit;};


byUnits.forEach(function (unit) {
    var handler = byUnitHandlers[unit] = function (values, interval, child) {
        this.values = values;
        this.interval = interval;
        this.child = child;
    };
    handler.prototype.zeroIndex = 0;
    handler.prototype.unit = unit;
    handler.prototype.addUnit = unit;
    handler.prototype.increment = function (date, parentStop) {
        var interval = this.interval || 1;
        var oldDate = date.clone();
        date = date.add(this.addUnit, interval);
        date = this.doChildReset(date, oldDate);
        return parentStop(date);
    }
    handler.prototype.reverseMatch = function (date, byPos, parentPos) {
        // Slow for now, we'll implement a function called 'jump' which will speed things up.
        if (!this.parentUnit) throw new Error("Can't get negative pos, no parent unit specified.");
    }
    handler.prototype.match = function (date, i) {
        var datePart = date.get(this.unit);
        var values = this.values;
        for (var ii = 0; ii < values.length; ii++) {
            var byRule = values[ii];
            var byPos, parentPos;
            if (byRule instanceof Array) {
                byPos = byRule[1];
                parentPos = byRule[0];
            } else {
                byPos = byRule;
            }
            if (byPos < 0 || parentPos < 0) return this.reverseMatch(date, byPos, parentPos);
            else if (datePart == byPos) {
                i[byPos] = i[byPos] || 0;
                i[byPos] += 1;
                if (parentPos) {
                    if (i[byPos] == parentPos) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        };
    }
    handler.prototype.next = function (date, parentStop) {
        var self = this;
        date = date.clone();
        var i = {},
            stop;
        while (true) {
            if (this.values instanceof Array) {
                // XXX more efficient incrementer, ie
                // bymonth=1 should increment by a year each time.
                // values should be an array of arrays,
                
                // TODO: implement a jump function,
                // should look at a date like Mar 15, and rule like 1SU
                // and should skip to the next 1SU

                while (!this.match(date, i)) {
                    stop = this.increment(date, parentStop);
                    if (this.doStop(stop)) return stop;
                }
            }
            date = date.clone(); // just in case :)
            
            stop = this.child.next(date, function (next) {
                return self.stop(date, next) || parentStop(next);
            });
            if (this.doStop(stop)) return stop;

            date = date.clone();

            stop = this.increment(date, parentStop);
            if (this.doStop(stop)) return stop;
        }
    }
    handler.prototype.doStop = function (stop) {
        return stop instanceof StopFlag && stop.unit != this.unit
    }
    handler.prototype.stop = function (start, date) {
        if (start.get(this.unit) != date.get(this.unit)) {
            return new StopFlag(this.unit);
        }
    }
    handler.prototype.doChildReset = function (date, oldDate) {
        // This function ensures that multiple children do not reset eachother.
        // this happens with days, ie day of week would increment, then call reset on day of month
        // which would bump the day back to 1/0
        if (this.child.addUnit != this.addUnit) {
            date = this.child.reset(date, oldDate);
        }
        return date;
    }
    handler.prototype.reset = function (date, oldDate) {
        date = date.set(this.unit, this.zeroIndex);
        date = this.doChildReset(date, oldDate);
        return date;
    }
});
var resetDayOfWeek = function (date, oldDate) {
    var parentUnit = this.parent.unit;
    var resetUnit = this.parent.resetDayUnit || 'date';
    var month = date.get(parentUnit);
    date = date.set(resetUnit, byUnitHandlers[resetUnit].prototype.zeroIndex);
    if (!this.values || this.addUnit != 'day') {
        // addUnit = day and values, will set correct day of week on it's own
        // no values, or add unit != day and the incrementer will not correctly set the day
        // of the week.
        date = date.set('day', oldDate.get('day'));
        if (month != date.get(parentUnit)) {
            date.add('week', 1);
        }
    }
    date = this.doChildReset(date, oldDate);
    return date;

};

(function (proto) {
    proto._match = proto.match;
    proto.match = function (date, i) {
        if (date.date() == 1) {
            for (var prop in i) {
                i[prop] = 0;
            }
        }
        return this._match(date, i);
    }
})(byUnitHandlers.day.prototype);

// resetDayUnit is used bay child reset function, ie week.resetDayUnit will only 
// be used by the byday property, not the byweek or weekly property
byUnitHandlers.year.prototype.resetDayUnit = 'dayOfYear';
byUnitHandlers.month.prototype.resetDayUnit = 'date';
byUnitHandlers.week.prototype.resetDayUnit = 'day';

byUnitHandlers.week.prototype.reset = resetDayOfWeek;
byUnitHandlers.day.prototype.reset = resetDayOfWeek;

byUnitHandlers.date.prototype.addUnit = 'day';
byUnitHandlers.dayOfYear.prototype.addUnit = 'day';

byUnitHandlers.date.prototype.zeroIndex = 1;

byUnitHandlers.month.prototype.parentUnit = 'year';
byUnitHandlers.week.prototype.parentUnit = 'year';
byUnitHandlers.day.prototype.parentUnit = 'month';
byUnitHandlers.date.prototype.parentUnit = 'month';
byUnitHandlers.hour.prototype.parentUnit = 'day';
byUnitHandlers.minute.prototype.parentUnit = 'hour';
byUnitHandlers.second.prototype.parentUnit = 'minute';

byUnitHandlers.monthday = byUnitHandlers.date;
byUnitHandlers.yearday = byUnitHandlers.dayOfYear; // prefer the moment js name of the value

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
    DAILY: 'date'
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
