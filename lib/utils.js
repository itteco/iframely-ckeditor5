
import parseUrl from 'url-parse';


export function getUrlIframelyOptions(url) {
    var parsed = parseUrl(url, true);
    var url_iframely_options;
    if (parsed.query.iframely_options) {
        try {
            url_iframely_options = JSON.parse(parsed.query.iframely_options);
        } catch(ex) {}
    }
    return url_iframely_options;
}

export function setUrlIframelyOptions(url, query) {
    var parsed = parseUrl(url, true);
    parsed.query.iframely_options = JSON.stringify(query || {});
    return parsed.toString();
}