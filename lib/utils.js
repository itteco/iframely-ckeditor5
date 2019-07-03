
import parseUrl from 'url-parse';

export function getUrlWithoutIframelyOptions(url) {
    var parsed = parseUrl(url, true);
    delete parsed.query.iframely;
    return parsed.toString();
}

export function getUrlIframelyOptions(url) {
    var parsed = parseUrl(url, true);
    var url_iframely_options;
    if (parsed.query.iframely) {
        try {
            url_iframely_options = JSON.parse(parsed.query.iframely);
        } catch(ex) {}
    }
    return url_iframely_options;
}

export function setUrlIframelyOptions(url, query) {
    var parsed = parseUrl(url, true);
    parsed.query.iframely = JSON.stringify(query || {});
    return parsed.toString();
}