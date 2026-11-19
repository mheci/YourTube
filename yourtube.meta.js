// ==UserScript==
// @name         YourTube
// @namespace    https://github.com/mheci/YourTube
// @version      1.12.8
// @description  Clean, lightweight, and customizable client-side interface for YouTube with SponsorBlock integration, session history, playback controls, feed filtering, and a full settings dashboard.
// @author       mheci
// @license      MIT
// @homepageURL  https://github.com/mheci/YourTube
// @supportURL   https://github.com/mheci/YourTube/issues
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @run-at       document-start
// @sandbox      JavaScript
// @inject-into  content
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @grant        unsafeWindow
// @connect      sponsor.ajay.app
// @connect      returnyoutubedislikeapi.com
// @connect      www.youtube.com
// @connect      s.youtube.com
// @connect      self
// @connect      github.com
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js#sha256=95f4d1cbf099f57161b664bc048426ec3df92637801a4c79116e83315aa787e7
// @require      https://cdn.jsdelivr.net/npm/culori@3.2.0/bundled/culori.min.js#sha256=5888eafd4c248c81cedbb45d451cc55af48e995c25d9a082f5d4a03d670ee7ea
// @icon         https://raw.githubusercontent.com/mheci/YourTube/main/icon.png
// @noframes
// @updateURL    https://github.com/mheci/YourTube/releases/latest/download/yourtube.meta.js
// @downloadURL  https://github.com/mheci/YourTube/releases/latest/download/yourtube.user.js
// ==/UserScript==
