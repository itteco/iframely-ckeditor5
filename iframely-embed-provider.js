import parseUrl from 'url-parse';

import { getUrlIframelyOptions } from './utils';

export default function IframelyEmbedProvider(options) {

    return {
    
        name: 'iframely',
    
        // A URL regexp or an array of URL regexps:
        url: /.+/,
    
        html: match => {
            var url = match[ 0 ];
    
            // TODO: extract callback
    
            // Get iframely_options.
            var iframely_options = getUrlIframelyOptions(url);
    
            // Remove iframely_options from url.
            var parsed = parseUrl(url, true);
            delete parsed.query.iframely_options;
            url = parsed.toString();

            // Generate api call url.
            var parsedApiCall = parseUrl(options.iframe_path, true);

            // User will override initial options.
            var api_options = Object.assign({}, iframely_options || options.initial_iframely_options);
            var api_options_whitelisted = {};

            if (options.whitelisted_iframely_options && options.whitelisted_iframely_options.length) {
                // Use non empty whitelist.
                options.whitelisted_iframely_options.forEach(key => {
                    if (key in api_options) {
                        api_options_whitelisted[key] = api_options[key];
                    }
                });
            }

            parsedApiCall.query = Object.assign({
                app: 1,
                api_key: options.api_key,
                url: url
            }, api_options_whitelisted);
            
            var iframeUrl = parsedApiCall.toString();
    
            return (
                '<div>' +
                    '<div class="iframely-responsive">' +
                        `<iframe src="${ iframeUrl }" ` +
                            'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                        '</iframe>' +
                    '</div>' +
                '</div>'
            );
        }
    };
}