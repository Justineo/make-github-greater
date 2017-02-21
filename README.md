# Make GitHub Greater

> Inspired by [MakeGitHubGreatAgain](https://github.com/DennisSnijder/MakeGithubGreatAgain).

Double click the empty space on the site header and choose your own background color! The text color will automatically switch (between black and white) according to the calculated contrast ratio.

![Double click to change the color.](https://raw.githubusercontent.com/Justineo/make-github-greater/master/screenshots/demo.png)


## Installation

### Published versions

* [Chrome extension](https://chrome.google.com/webstore/detail/make-github-greater/emijicijbkhnobkceaeaekiiapnkdnlp)
* [Firefox add-on](https://addons.mozilla.org/zh-CN/firefox/addon/make-github-greater/)
* [Opera extension](https://addons.opera.com/zh-cn/extensions/details/make-github-greater/)
* [Userscript](https://justineo.github.io/make-github-greater/userscript/dist/make-github-greater.user.js)

### Manual installation

* [Edge extension](https://github.com/Justineo/make-github-greater/raw/master/extensions/packed/make-github-greater.edge.zip)

  See [Adding and removing extensions for Microsoft Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/adding-and-removing-extensions).

* [Safari extension](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/Justineo/make-github-greater/tree/master/extensions/make-github-greater.safariextension)

  See [Using Extension Builder](https://developer.apple.com/library/content/documentation/Tools/Conceptual/SafariExtensionGuide/UsingExtensionBuilder/UsingExtensionBuilder.html#//apple_ref/doc/uid/TP40009977-CH2-SW10) to learn how to activate the Extension Builder. And then:

  1. Use “Add Extension” instead of “Create Extension”.
  2. Choose the downloaded directory.
  3. Click “install” to load the extension.

## FAQ

* Why Chrome warns me the extension might read my browser history?

    It's because Make GitHub Greater uses `webNavigation` module to dynamically inject content scripts (to support GitHub Enterprise). Make GitHub Greater won't track or record any of these private data.

* Why can Make GitHub Greater's demo page find out I have installed the extension or not?

    In Chrome/Opera it's allowed to get this information through the API so that the demo page can find out if the user has installed Make GitHub Greater. It's all about user experience and the extension itself won't track or record these data.

* Why access token isn't working for me?

    Now Make GitHub Greater is saving user's private access token into `localStorage`. `localStorage` has a limit of 5MB and the problem might be other extensions have consumed too much storage that Make GitHub Greater failed to save access tokens.

## Options

For browser extension versions (excluding Safari version), Make GitHub Greater now provide following option:

* Domain

    Use this option to set custom domains for your GitHub Enterprise service. Note that you don't need to set `github.com` because it's always included. You may be asked to grant additional permissions for those domains.
