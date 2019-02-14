
import parseUrl from 'url-parse';

export function getUrlIframelyOptions(url) {
    var parsed = parseUrl(url, true);
    var url_iframely_options;
    if (parsed.query.iframely_options) {
        try {
            url_iframely_options = JSON.parse(parsed.query.iframely_options);
        } catch(ex) {}
    }
    return url_iframely_options || {};
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

    if (Object.keys(url_iframely_options).length === 0) {
        delete parsed.query.iframely_options;
    } else {
        parsed.query.iframely_options = JSON.stringify(url_iframely_options);
    }

    return parsed.toString();
}