
// export let eventBus = {
// 	subscribe: function() {
// 		subscribeFunction(this);
// 	},
// 	trigger: function(){
// 		function2(this.user)
// 	},
// 	user: undefined,
// 	userRole: undefined,
// }

//prezes.js
// eventBus.subscribe(dzwoniZona, mowiezegoniema)
// eventBus.subscribe(dzwoniZona, niechprzyniesieobiad)


export let eventBus = {
	subscribe: function(eventName, eventHandler) {
		if (!this.eventList[eventName]) {
			this.eventList[eventName] = [];
		}
		this.eventList[eventName].push(eventHandler)
	},
	trigger: function(eventName, data){
		let eventHandlers = this.eventList[eventName];
		console.log('eventName', eventName)
		console.log('this.eventList', this.eventList)
		console.log('eventHandlers', eventHandlers)
		for (let i=0; i<eventHandlers.length; i++) {
			eventHandlers[i](data);
		}
	},
	eventList: {
//		dzwonizona: [mowiezegoniema, niechprzyniesieobiad],
	}
}