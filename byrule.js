var UNITS = ["year","month","week","day","hour","minute","second"]

var getDates = function (next, rule, units, callback) {
	units = units.concat();
	var unit = units.pop();
	var byRule = rule['by' + unit];
	var results = []
	if (byRule) {
		byRule = [].concat(byRule);
		var expand = UNITS.indexOf(unit) > UNITS.indexOf(rule.freq);
		if (expand) {
			next.set(unit, 0);
		}
		for (var i = 0; i < byRule.length; i++) {
			var a = byRule[i]; // a is an index
			if (next.get(unit) <= a) {
				next.set(unit, a);
				var result = getDates(next.clone(), rule, units, callback);
				if (!expand)
					return result;
				if (!result) // if the call back returns false, we've reached the limit.
					return result;

			} // handle negative by rules
		};
	} else if (units.length) {
		return getDates(next, rule, units, callback);
	} else {
		return callback(next);
	}
	return true;
}