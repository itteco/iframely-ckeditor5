
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

import OptionsView from './ui/optionsview';
import { getUrlIframelyOptions, getUrlOptions, updateUrlIframelyOptions } from './utils';

export default class IframelyOptions extends Plugin {

	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'IframelyOptions';
    }

    init() {

        const editor = this.editor;

        this.optionsStorage = [];

        this._balloon = editor.plugins.get( ContextualBalloon );

        this.optionsView = new OptionsView( editor.locale );

        editor.model.document.on('change', () => {
            var mediaEl = this.getCurrentMediaElement();
            if (mediaEl) {
                // Show.
                this.showOptionsView();
            } else {
                // Hide.
                this.hideOptionsView();
            }
        });

        var whitelistedIframelyOptions = editor.config.get( 'whitelistedIframelyOptions' );

        iframely.on('options', (widget, options) => {

            var iframeView = editor.editing.view.domConverter.domToView(widget.iframe, {bind: false});
            // TOOD: not sure if parrent is always figure.
            var figureView = iframeView.parent;
            var mediaModel = editor.editing.mapper.toModelElement( figureView );

            if (whitelistedIframelyOptions && whitelistedIframelyOptions.length) {
                options = options.filter && options.filter(item => {
                    return whitelistedIframelyOptions.includes(item.key)
                });
            }

            this.storeOptionsForModel(mediaModel, options);

            if (this._balloon.hasView( this.optionsView )) {

                var currentIframe = this.getCurrentIframe();

                if (currentIframe === widget.iframe) {
                    var current_iframely_options = getUrlOptions(widget.iframe.src);
    
                    // Update current balloon.
                    this.optionsView.setOptions(options, current_iframely_options, true);
                }
            }
        });

        iframely.on('heightChanged', iframe => {
            if (this._balloon.hasView( this.optionsView )) {
                var currentIframe = this.getCurrentIframe();
                if (currentIframe === iframe) {
                    this._balloon.updatePosition({
                        target: iframe
                    });
                }
            }
        });

        this.optionsView.on('change:checked', (evt, optionData, checked) => {
            editor.model.change( writer => {
                var mediaEl = this.getCurrentMediaElement();
                var url = this.getUpdatedUrlParams(mediaEl.getAttribute('url'), optionData, checked);
                writer.setAttribute('url', url, mediaEl);
            });
        });
    }

    getDataForEl(el) {
        return this.optionsStorage.find((item) => {
            return item.el === el;
        });
    }

    storeOptionsForModel(el, options) {
        var item = this.getDataForEl(el);
        if (item) {
            item.options = options;
        } else {
            this.optionsStorage.push({
                el: el,
                options: options
            });
        }
    }

    getOptionsForModel(el) {
        var item = this.getDataForEl(el);
        return item && item.options;
    }

    getUpdatedUrlParams(url, optionData, checked) {
        var command = {};
        if (checked) {
            command.add = {
                [optionData.key]: optionData.value
            };
        } else {
            command.remove = {
                [optionData.key]: 1
            };
        }
        return updateUrlIframelyOptions(url, command)
    }

    getCurrentMediaElement() {
        var el = this.editor.model.document.selection.getSelectedElement();
        if (el && el.name === 'media') {
            return el;
        }
    }

    getCurrentIframe() {
        var mediaEl = this.editor.model.document.selection.getSelectedElement();
        var figureView = this.editor.editing.mapper.toViewElement(mediaEl);
        var figureElement = this.editor.editing.view.domConverter.viewToDom(figureView);
        var iframe = figureElement.querySelector('iframe');
        return iframe;
    }

    showOptionsView() {

        var mediaEl = this.editor.model.document.selection.getSelectedElement();

        var optionsViewInBallon = this._balloon.hasView( this.optionsView );

        if (optionsViewInBallon && this.optionsView.currentMedia === mediaEl) {
            return;
        }
        
        if (mediaEl) {

            var options = this.getOptionsForModel(mediaEl);
            
            if (options && options.length) {

                var iframe = this.getCurrentIframe();

                var current_iframely_options = getUrlOptions(iframe.src);

                this.optionsView.currentMedia = mediaEl;
                this.optionsView.setOptions(options, current_iframely_options);

                if (optionsViewInBallon) {
                    this._balloon.updatePosition({
                        target: iframe
                    });
                } else {
                    this._balloon.add( {
                        view: this.optionsView,
                        position: {
                            target: iframe
                        }
                    });
                }
            }
        }
    }

    hideOptionsView() {

		if ( !this._balloon.hasView( this.optionsView ) ) {
			return;
		}

		
		this._balloon.remove( this.optionsView );
    }
}