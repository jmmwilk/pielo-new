export function updateHistory(curr) {
	window.location.history.push(curr);
	window.location.historyIndex = window.location.historyIndex + 1;
    window.location.hash = curr;
}

// export function updateTotalHistory(curr) {
// 	window.location.history.push(window.location.hash);
// }