/*
* Engine Presentations Sockets Notes : Remote App V2.0.0
*
*/
'use strict';

(function (){

	function pageLoad(){
		document.querySelector(".mdl-button--notifications").addEventListener("click", _ => {
			document.querySelector(".mdl-layout__drawer-right").classList.add("active");
			document.querySelector(".mdl-layout__obfuscator-right").classList.add("ob-active");
		});

		document.querySelector(".mdl-layout__obfuscator-right").addEventListener("click",  _ => {
			document.querySelector(".mdl-layout__drawer-right").classList.remove("active");
			document.querySelector(".mdl-layout__obfuscator-right").classList.remove("ob-active");
		});
	}

	window.addEventListener('load', pageLoad);

})();