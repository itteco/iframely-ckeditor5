# Iframely + CKEditor 5 + Preview

Example project shows how Iframely works with CKEditor 5 and preview feature.

Enspired by:

https://ckeditor.com/docs/ckeditor5/latest/framework/guides/quick-start.html

and

https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html

## Instructions

To install it you need:

 * Node.js 6.9.0+
 * npm 4+

Clone repository:

    git clone git@github.com:itteco/iframely-ckeditor5.git

Go to repository folder:

    cd iframely-ckeditor5

Install dependencies:

    npm install

Get your api key from https://iframely.com/profile and put it in `app.js` file:

    var API_KEY = 'Your API key from https://iframely.com/profile';

Start web server:

    npm start

## Important things

Preview is managed by `embed.js` script. It must be included in editor and view pages from Iframely cloud:

    <script src="//cdn.iframe.ly/embed.js" async charset="utf-8"></script>

Or, you can self-host the script. See its [GitHub repository](https://github.com/itteco/embedjs).

API key is mandatory for Iframely usage. You can get it on https://iframely.com/profile and use like in `app.js`.

CKEditor 5 uses `MediaEmbed` plugin for this feature, see `app.js` for mandatory configuration:

    ...
    plugins: [ MediaEmbed ...
    ...
    mediaEmbed: {...
    ...