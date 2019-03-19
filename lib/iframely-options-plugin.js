
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

import OptionsView from '../ui/optionsview';

// TODO: unused
import { getUrlOptions, updateUrlIframelyOptions } from './utils';

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

            // Store options for model.
            var iframeView = editor.editing.view.domConverter.domToView(widget.iframe, {bind: false});
            var figureView = iframeView.parent;
            var mediaModel = editor.editing.mapper.toModelElement( figureView );
            if (whitelistedIframelyOptions && whitelistedIframelyOptions.length) {
                var whitelistedOptins = {};
                Object.keys(options).forEach(key => {
                    if (whitelistedIframelyOptions.includes(key)) {
                        whitelistedOptins[key] = options[key];
                    }
                });
                options = whitelistedOptins;
            }
            this.storeOptionsForModel(mediaModel, options);

            if (this._balloon.hasView( this.optionsView )) {

                var currentIframe = this.getCurrentIframe();

                if (currentIframe === widget.iframe) {
                    
                    // Update current balloon with current selected values.
                    this.optionsView.setOptions(options, currentIframe.src);
                }
            }
        });

        // Fix baloon position after iframe changed height.
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

        // this.optionsView.on('change:checked', (evt, optionData, value) => {
        //     editor.model.change( writer => {
        //         var mediaEl = this.getCurrentMediaElement();
        //         var url = this.getUpdatedUrlParams(mediaEl.getAttribute('url'), optionData, value);
        //         writer.setAttribute('url', url, mediaEl);
        //     });
        // });
    }

    // getUpdatedUrlParams(url, optionData, value) {
    //     var command = {};
    //     if (optionData.value !== value) {
    //         command.add = {
    //             [optionData.key]: value
    //         };
    //     } else {
    //         command.remove = {
    //             [optionData.key]: 1
    //         };
    //     }
    //     return updateUrlIframelyOptions(url, command);
    // }

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
            
            if (options) {

                var iframe = this.getCurrentIframe();

                this.optionsView.currentMedia = mediaEl;
                this.optionsView.setOptions(options, iframe.src);

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

            } else {

                this.hideOptionsView();
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