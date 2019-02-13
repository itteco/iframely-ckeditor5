
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

import OptionsView from './ui/optionsview';

function parseUrlData(url) {
    var parsedQuery = {};
    var m = url && url.match && url.match(/(.+)\?(.+)/);
    var base = url;
    if (m) {
        var query = m[2];
        base = m[1];
        var data = query.split("&");
        for(var i = 0; i < data.length; i++) {
            var item = data[i].split("=");
            parsedQuery[item[0]] = decodeURIComponent(item[1]);
        }
    }
    return {
        path: base,
        query: parsedQuery
    };
}

function renderUrlData(urlData) {

    var paramsStr = Object.keys(urlData.query).map(function(key) {
        return key + '=' + encodeURIComponent(urlData.query[key]);
    }).join('&');

    if (paramsStr) {
        return urlData.path + '?' + paramsStr
    } else {
        return urlData.path;
    }
}

function trySendOptionForUrlData(urlData, optionData, enabled) {
    if (enabled) {
        urlData.query[optionData.key] = optionData.value;
    } else {
        delete urlData.query[optionData.key];
    }
}

function trySetOption(src, optionData, enabled) {
    var urlData = parseUrlData(src);
    trySendOptionForUrlData(urlData, optionData, enabled);
    return renderUrlData(urlData);
}

export default class IframelyOptions extends Plugin {

	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'IframelyOptions';
    }

    init() {

        const editor = this.editor;

        this._balloon = editor.plugins.get( ContextualBalloon );

        this.optionsView = new OptionsView( editor.locale );

        editor.model.document.on('change', () => {
            var el = this.getCurrentMediaElement();
            if (el) {
                // Show.
                this.showOptionsView();
            } else {
                // Hide.
                this.hideOptionsView();
            }
        });

        iframely.on('options', (widget, options) => {

            // TODO: no options - hide baloon? or disable old inputs?

            // TODO: bad strategy. iframe will be regenerated.
            widget.iframe.setAttribute('data-options', JSON.stringify(options));

            if (this._balloon.hasView( this.optionsView ) && this.optionsView.currentIframe === widget.iframe) {

                // Update current balloon.
                var urlData = parseUrlData(widget.iframe.src);
                this.optionsView.setOptions(options, urlData.query, true);

                // TODO: bad timeout (need actual resize event?)
                setTimeout(() => {
                    this._balloon.updatePosition();
                }, 100);
            }
        });

        this.optionsView.on('change:checked', (evt, optionData, checked) => {
            var oldSrc = this.optionsView.currentIframe.src;
            var newSrc = trySetOption(oldSrc, optionData, checked);
            if (newSrc !== oldSrc) {
                // TOOD: store options values in model.
                this.optionsView.currentIframe.src = newSrc;
            }
        });
    }

    getCurrentMediaElement() {
        var el = this.editor.model.document.selection.getSelectedElement();
        if (el && el.name === 'media') {
            return el;
        }
    }

    showOptionsView() {

        // TODO: bad timeout: how to get real selected iframe?
        setTimeout(() => {

            var media = document.querySelector( '.ck-widget_selected' );
            var iframe = media && media.querySelector('iframe');

            var optionsViewInBallon = this._balloon.hasView( this.optionsView );

            if (optionsViewInBallon && this.optionsView.currentIframe === iframe) {
                return;
            }
            
            if (media && iframe) {

                try {
                    // TODO: bad strategy. iframe will be regenerated.
                    // TODO: keep one optionsView for each iframe?
                    var options = JSON.parse(iframe.getAttribute('data-options'));
                } catch(ex) {}

                if (options && options.length) {

                    this.optionsView.currentIframe = iframe;
                    var urlData = parseUrlData(iframe.src);
                    this.optionsView.setOptions(options, urlData.query);

                    if (optionsViewInBallon) {
                        this._balloon.updatePosition({
                            target: media
                        });
                    } else {
                        this._balloon.add( {
                            view: this.optionsView,
                            position: {
                                target: media
                            }
                        });
                    }
                }
            }

        }, 100);
    }

    hideOptionsView() {

		if ( !this._balloon.hasView( this.optionsView ) ) {
			return;
		}

		
		this._balloon.remove( this.optionsView );
    }
}