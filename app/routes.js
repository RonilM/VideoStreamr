

module.exports = (_config,_routeData) => {

	var config = _config;
	var routeData = _routeData?_routeData:{};

	var registerRoute = (_path,_reqType,_callbackName) => {
			var path = _path.toLowerCase();
			var reqType = _reqType.toLowerCase();
			var callbackName = _callbackName;
			routeData[path] = routeData[path]?routeData[path]:{};
			routeData[path][reqType] = routeData[path][reqType]?routeData[path][reqType]:{};
			routeData[path][reqType] = callbackName;
	}

	return {

		registerRoutesFromConfig: () => {
			for(var i in config.routes) {
		  		registerRoute(config.routes[i].path,config.routes[i].requestType,config.routes[i].action);
			}
		},		
		getCallback: (path,reqType) => {
			if(routeData[path] == null) {
				console.log(routeData);
				return null;
			}
			return routeData[path][reqType];
		}

	};


}