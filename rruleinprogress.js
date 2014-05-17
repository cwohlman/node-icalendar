var WKDAYS = ['SU','MO','TU','WE','TH','FR','SA'];
var UNITS = ["year","month","week","day","hour","minute","second"]

var getDates = function (next, rule, units, callback) {
	units = units.concat();
	var unit = units.pop();
	var byRule = rule['by' + unit];
	var results = []
	if (byRule) {
		for (var i = 0; i < byRule.length; i++) {
			var a = byRule[i]; // a is an index
			if (next.get(unit) <= a) {
				next.set(unit, a);
				var result = getDates(next.clone(), rule, units, callback);
				if (UNITS.indexOf(unit) > UNITS.indexOf(rule.freq))
					return result;
				else
					results.push(result);
			} // handle negative by rules
		};
	} else if (units.length) {
		return getDates(next, rule, units, callback);
	} else {
		return callback(next);
	}
	return results;
}

Start date

Year = Start.Year
Month = ByMonth(Start.Month) {
	throw if rule.byweek or rule.byyearday
	if (rule.bymonth && Start.Month not in rule.bymonth)
		return next viable month
	else
		return Start.Month
}
Week = ByWeek(Start.Week) {
	// Week of year
	throw if rule.bymonth or rule.byyear
	if (rule.byweek && Start.Week not in rule.byweek)
		return next viable week
	else
		return Start.Week
}

var next = function (rule, start, callback) {
	var ruleTop = UNITS.indexOf(rule.freq);
	var freq = rule.freq;
	var next = start.clone();
	for (var i = 0; i < 10; i++) {
		var next = next.clone();
		var result = next.clone();

		byRule(next, rule, UNITS, function (next) {
			result = next;
		});

		for (var ii = 0; ii < UNITS.length; ii++) {
			var unit = UNITS[ii];
			var byRule = rule['by' + unit];
			if (byRule) {
				if (next.get(unit))
			}
		};
	};
}