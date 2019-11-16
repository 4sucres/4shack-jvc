// ==UserScript==
// @name         Remplacement de Noelshack par 4shack
// @namespace    https://github.com/4sucres/4shack-jvc/
// @author		 4sucres.org
// @version      1.0
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @match        http://www.jeuxvideo.com/messages-prives/*
// ==/UserScript==

(function() {
  'use strict';

  const debug = false;
  const safe = false;

  function exists(url) {
      if (!safe) return true;

      try {
          var http = new XMLHttpRequest();
          http.open('HEAD', url, false);
          http.send();
      return 404 !== http.status;
      } catch (e) {
          return false;
      }
  }

  document.querySelectorAll('.bloc-contenu').forEach((el) => {
      const content = el.innerHTML;
      const regex = /<a href="(https?:\/\/image\.noelshack\.com\/fichiers\/((?:\w+\/){2,3}(?:(?:\d+-?){1,})((?:\w+-?){1,})(?:.([0-9a-z]+))))".*?>.+?<\/a>/gm;
      const match = regex.exec(content);

      if (match) {
          const deprecated = match[1]; // Old URL
          const source = `https://4shack.org/${match[2]}`; // New URL
          const page = source; // TODO ; 4shack's actual image page
          const filename = match[3]; // File name
          const replacement = `
            <a href="${page}" target="_blank">
              <img class="img-shack" width="68" height="51"
                src="${source}"
                alt="${filename}">
            </a>
          `;

          if (debug) {
              console.log(`Using ${source} instead of ${deprecated}. File name is ${filename}.`);
          }

          if (exists(source)) {
             el.innerHTML = content.replace(match[0], replacement);
          }
      }
  });
})();
