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
            parsedApiCall.query = Object.assign({
                app: 1,
                api_key: options.api_key,
                url: url
            }, iframely_options)
            
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