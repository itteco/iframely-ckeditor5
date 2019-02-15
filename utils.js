
import parseUrl from 'url-parse';

export function getUrlOptions(url) {
    var parsed = parseUrl(url, true);
    return parsed.query;
}

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

export function updateUrlIframelyOptions(url, command) {
    var parsed = parseUrl(url, true);
    var url_iframely_options;
    if (parsed.query.iframely_options) {
        try {
            url_iframely_options = JSON.parse(parsed.query.iframely_options);
        } catch(ex) {}
    }

    url_iframely_options = url_iframely_options || {};

    if (command.add) {
        url_iframely_options = Object.assign(url_iframely_options, command.add);
    }

    if (command.remove) {
        Object.keys(command.remove).forEach((key) => {
            delete url_iframely_options[key];
        });
    }

    // Leave empty iframely_options to override initial values.
    parsed.query.iframely_options = JSON.stringify(url_iframely_options);

    return parsed.toString();
}