export const getObjectValue = function(obj, index){
	var value = null;
	try{
		value = index.split('.').reduce((o,i)=>o[i], obj);
	}catch(err){}

	return value;
}

export const debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export const arrayIntersection = function(){
	return Array.from(arguments).reduce(function(previous, current){
		return previous.filter(function(element){
			return current.indexOf(element) > -1;
		});
	});
};

export const getInstanceName = function(instance) {
	const file = instance.__file // injected by vue-loader
	if (file) {
		let filename = file.replace(/^.*[\\\/]/, '').replace('.vue', '');
		return classify(filename);
	}
}

var classifyRE = /(?:^|[-_/])(\w)/g;
export const classify = (str) => {
	return str.replace(classifyRE, function (_, c) {
		return c ? c.toUpperCase() : ''
	})
}