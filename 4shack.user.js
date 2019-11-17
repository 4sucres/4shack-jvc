// ==UserScript==
// @name         Remplacement de NoelShack par 4shack
// @namespace    https://github.com/4sucres/4shack-userscript/
// @author		   4shack.org
// @version      1.1
// @match        *://*/*
// @match        *://noelshack.com/*
// @match        *://*.noelshack.com/*
// @exclude      *://jeuxvideo.com/forums/*
// @exclude      *://*.jeuxvideo.com/forums/*
// @exclude      *://*.jeuxvideo.com/messages-prives/*
// ==/UserScript==

(function() {
  'use strict';

  const debug = false;
  const regex = /https?:\/\/image\.noelshack\.com\/fichiers\/((?:\w+\/){2,3}(?:(?:\d+-?){1,})((?:\w+-?){1,})(?:.([0-9a-z]+)))/gm;
  const map = {
    img: ['src', 'title', 'data-original-title'],
    a: ['href', 'title', 'data-original-title'],
  };

  function apply(element, attributes = []) {
    Array.prototype.forEach.call(attributes, attribute => {
      document.querySelectorAll(`${element}[${attribute}]`).forEach(element => {
        const match = regex.exec(element[attribute]);

        if (debug) {
          console.log(`Trying on a '${element}[${attribute}]' selector.`);
        }

        if (match) {
          const deprecated = match[0]; // Old URL
          const source = `https://4shack.org/${match[1]}`; // New URL
          const filename = match[2]; // File name

          if (debug) {
            console.log(`Using ${source} instead of ${deprecated} on '${element}[${attribute}].'`);
          }

          element[attribute] = element[attribute].replace(deprecated, source);
        }
      });
    });
  }

  function execute() {
    Object.keys(map).map(element => {
      const attributes = map[element];

      if (debug) {
        console.log(`Looking for '${element}' (trying ${attributes.length} attributes)`);
      }

      apply(element, attributes);
    });
  }

  execute(); // applies on load
  setTimeout(execute, 1000); // applies a second time after everything is loaded
})();
