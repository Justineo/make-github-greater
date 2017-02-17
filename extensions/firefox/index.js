let data = require('sdk/self').data;
let prefs = require('sdk/simple-prefs').prefs;
let pageMod = require('sdk/page-mod');

let domains = prefs.domains || '';
domains = domains.split(/[,\s]/)
  .map((domain) => [`http://${domain}/*`, `https://${domain}/*`])
  .reduce((prev, current) => prev.concat(current), [
    'http://github.com/*', 'https://github.com/*'
  ]);

pageMod.PageMod({
  include: domains,
  contentScriptFile: [
    data.url('kolor.js'),
    data.url('main.js')
  ],
  contentScriptOptions: {
    prefs: prefs
  }
});
