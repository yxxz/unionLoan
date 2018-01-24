changeWindow();
function changeWindow() {
	var clientWidth = document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth;
	document.documentElement.style.fontSize = clientWidth / 750 * 100 + 'px';
};
window.onresize = function() {
	changeWindow();
};