!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=3)}([function(t,e){t.exports='<div id=analyticsbutton class="gamebutton analytics" style=display:inline-block;margin-right:5px onclick=""> $ </div>'},function(t,e){t.exports='<div id=inventorysortb class="gamebutton clickable" style="width:18px;height:0;line-height:4px;margin:0 4px 0 4px;padding:10px 4px 10px 4px;float:right" title="Sort Inventory"> ⇅ </div>'},function(t,e){t.exports='<div id=analyticsmeters style=display:inline-block;margin-right:4px> <div id=stats_xph style="color:#5dac40;background:#000;border:2px solid gray;width:56px;margin-bottom:4px;padding:2px;display:block;text-align:left"> 0 </div> <div id=stats_dps style="background:#000;border:2px solid gray;width:56px;margin-bottom:4px;padding:2px;display:block;text-align:left"> 0 </div> <div id=stats_gph style="color:gold;background:#000;border:2px solid gray;width:56px;margin-bottom:4px;padding:2px;display:block;text-align:left"> 0 </div> </div>'},function(t,e,r){"use strict";function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){i(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function a(){var t=[/mpot[0-9]/i,/hpot[0-9]/i,"tracker",/stand[0-9]/i,/scroll[0-9]/i,/fiery.*/i,"handofmidas"],e=parent.character,r=0;return Object.values(e.items).map((function(t,e){return o({id:t?t.name:void 0},t,{},t?G.items[t.name]:[],{index:e})})).filter((function(t){return t.name})).sort((function(e,r){var n=t.findIndex((function(t){return t.test?t.test(e.id):e.id===t})),o=t.findIndex((function(t){return t.test?t.test(r.id):r.id===t}));if(n>=0)return o>=0?n<o?-1:n>o?1:0:-1;if(o>=0&&-1===n)return 1;if(e.set){if(!r.set)return-1;if(e.set<r.set)return-1;if(e.set>r.set)return 1}if(r.set&&!e.set)return 1;if(e.name<r.name)return-1;if(e.name>r.name)return 1;if(e.level){if(!r.level)return-1;if(e.level>r.level)return-1;if(e.level<r.level)return 1}if(e.q&&r.q){if(e.q<r.q)return-1;if(e.q>r.q)return 1}return 0})).forEach((function(t,e,n){if(t.index!==e){setTimeout((function(t,e){parent.socket.emit("imove",{a:t,b:e})}),25*r,t.index,e);var o=n.findIndex((function(t){return t.index===e}));o>=0&&(n[o].index=t.index),t.index=e,r+=1}})),r}function c(){var t=0;return Object.values(character.items).map((function(t,e){return o({},t,{index:e})})).filter((function(t){return t.name})).forEach((function(e,r){var n,o;setTimeout((function(t,e){parent.socket.emit("imove",{a:t,b:e})}),25*t,r,(n=0,o=character.items.length-1,n=Math.ceil(n),o=Math.floor(o),Math.floor(Math.random()*(o-n))+n)),t+=1})),t}r.r(e);var l=r(0),u=r.n(l),s=r(1),d=r.n(s),f=r(2),p=r.n(f);function y(t){return function(t){if(Array.isArray(t))return b(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return b(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return b(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function v(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function m(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}!function(t){var e=t.$,r=t.socket,n=t.entities,o={sorting:!1},i=[],l=[];function s(){e("[class$=theinventory]").find("[class=goldnum]").parent().before(d.a),e("#inventorysortb").hover((function(){e("#inventorysortb").css({"background-color":"gray","border-color":"lightgray"})}),(function(){e("#inventorysortb").css({"background-color":"","border-color":""})})),e("#inventorysortb").click((function(){if(o.sorting)return-1;o.sorting=!0;var t=a(),r=setInterval((function(){e("#inventorysortb").text(["-","\\","|","/"][Math.floor(Date.now()%500/125)])}),25);setTimeout((function(){o.sorting=!1,clearInterval(r),e("#inventorysortb").text("⇅")}),25*t+500)})),e("#inventorysortb").mousedown((function(t){return 3===t.which&&function(){if(o.sorting)return-1;o.sorting=!0;var t=c(),r=setInterval((function(){e("#inventorysortb").text(["-","\\","|","/"][Math.floor(Date.now()%500/125)])}),25);setTimeout((function(){o.sorting=!1,clearInterval(r),e("#inventorysortb").text("⇅")}),25*t+500)}()}))}window.addEventListener("unload",(function(){e("#analyticsbutton").remove(),e("#chancefulldiv").remove(),e("[id^=partyframe_]").remove(),e("[id^=analyticsmeters]").remove(),e("#inventorysortb").remove(),t.combatLogSocket&&r.off.apply(r,y(t.combatLogSocket));t.chestLootSocket&&r.off.apply(r,y(t.chestLootSocket));t.dpsInterval&&clearInterval(t.dpsInterval);t.renderInventory&&(t.render_inventory=t.renderInventory)})),t.renderParty||(t.renderParty=t.render_party),t.render_party=function(){t.renderParty(),t.party_list.forEach((function(t){var r=e('[onclick$=\\(\\"'.concat(t,'\\"\\)]'));r.length&&(r.find("[id^=partyframe_".concat(t,"]")).length||(r.wrap('<div id="partyframe_'.concat(t,'" style="display: inline-block; margin-right: 4px;"></div>')),r.after('\n            <div id="analyticsmeters" style="position: absolute; margin: -24px 0px 0px 0px">\n              <div id="dps_'.concat(t,'" style="background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px;padding: 2px; display: block; text-align: left;">0</div>\n              <div id="hps_').concat(t,'" style="color: #FF2E46; background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px; margin-top: -6px; padding: 2px; display: block; text-align: left;">0</div>\n            </div>\n          '))))})),t.showAnalytics||e("[id^=analyticsmeters]").hide()},t.render_party(),t.renderInventory||(t.renderInventory=t.render_inventory),t.render_inventory=function(e){t.renderInventory(e),e||s()},t.combatLogSocket=["hit",function(t){var e;return i.push(function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?v(Object(r),!0).forEach((function(e){m(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):v(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},t,{xp:t.kill&&((null===(e=n[t.id])||void 0===e?void 0:e.xp)||0),time:Date.now()}))}],r.on.apply(r,y(t.combatLogSocket)),t.chestLootSocket=["chest_opened",function(t){return l.push({time:Date.now(),gold:t.gold})}],r.on.apply(r,y(t.chestLootSocket)),e("#newparty").before(p.a),e("#toprightcorner").find("span.codebuttons").after(u.a),e("#analyticsbutton").click((function(){t.showAnalytics=!t.showAnalytics,t.showAnalytics?e("[id^=analyticsmeters]").show():e("[id^=analyticsmeters]").hide()})),t.showAnalytics||e("[id^=analyticsmeters]").hide(),e("#bottomleftcorner").find("[class$=theinventory]").length&&(e("#inventorysortb").length||s()),t.dpsInterval=setInterval((function(){if(t.showAnalytics){var r=Date.now(),n=r-3e5;i=i.filter((function(t){return t.time>n})),l=l.filter((function(t){return t.time>n})),t.dps=0,(t.party_list.length?y(t.party_list):[t.character.name]).forEach((function(n){var o=i.filter((function(t){return t.hid===n})),a=o.reduce((function(t,e){return t+(e.damage||0)}),0),c=o.reduce((function(t,e){return t+(e.heal||0)+(e.lifesteal||0)}),0),l=r-o.reduce((function(t,e){var r=e.time;return r<t?r:t}),r);a=Math.round(a/(l/1e3)),c=Math.round(c/(l/1e3)),t.dps+=a,e("#dps_".concat(n)).text("".concat(to_pretty_num(a||0))),e("#hps_".concat(n)).text("".concat(to_pretty_num(c||0)))}));var o=i.filter((function(e){var r=e.hid;return t.party_list.some((function(t){return t===r}))})),a=r-o.reduce((function(t,e){var r=e.time;return r<t?r:t}),r),c=o.reduce((function(t,e){var r=e.xp;return t+(r||0)}),0);c=Math.round(c*(1/(a/36e5)));var u=l.reduce((function(t,e){return t+(e.gold||0)}),0);u=Math.round(u*(1/(a/36e5))),e("#stats_xph").text("".concat(to_pretty_num(c||0))),e("#stats_dps").text("".concat(t.to_pretty_num(t.dps||0))),e("#stats_gph").text("".concat(to_pretty_num(u||0)))}}),250)}(parent)}]);