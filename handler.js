
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

var getNext = function (start, rule) {
	var processors = byUnits.filter(function (a) {
		return rule['by' + a] || rule.freq == a;
	});
	var results = [];
	var n = 0;
	var callback = function (date) {
		// until, count, user_until, user_after and exdate should be handled here
		results.push(date);
		n++;
		if (n > 10) return true;
	};
	var reset = function (a) {return a};
	// This loop is backwards on purpose
	for (var i = processors.length - 1; i >= 0; i--) {
		var a = processors[i];
		var parent = byUnitHandlers[processors[i-1]];
		var processor = byUnitHandlers[a];
		var values = rule['by' + a];
		values = values && [].concat(values);
		var interval = rule.freq == a ? rule.interval : 0; // this serves double duty as a flag.
		callback = recurCallback(processor, parent, values, interval, reset, callback);
		reset = recurReset(reset, processor.reset);
	};
	callback(start);
	return results;
}
