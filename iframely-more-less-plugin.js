
import lessButton from './theme/icons/less-button.svg';
import moreButton from './theme/icons/more-button.svg';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { getUrlIframelyOptions, updateUrlIframelyOptions } from './lib/utils';

class IframelyOptionPlugin extends Plugin {

    baseInit(id, label, icon, iframelyValue) {

        this.iframelyValue = iframelyValue;

        const editor = this.editor;

        editor.ui.componentFactory.add( id, locale => {
            const view = new ButtonView( locale );
    
            view.set( {
                label: label,
                icon: icon,
                tooltip: true,
                isVisible: false
            } );
    
            view.on( 'execute', () => {
                editor.model.change( writer => {
                    var el = this.getCurrentMediaElement();
                    var url = this.getUpdatedUrlParams(el);
                    writer.setAttribute('url', url, el);
                } );
            } );

            editor.model.document.on('change', () => {
                var el = this.getCurrentMediaElement();
                if (el) {
                    view.isVisible = true;

                    if (this.isIframelyOptionOn(el)) {
                        view.isOn = true;
                    } else {
                        view.isOn = false;
                    }
                } else {
                    view.isVisible = false;
                }
            });

            return view;
        } );
    }

    getCurrentMediaElement() {
        var el = this.editor.model.document.selection.getSelectedElement();
        if (el && el.name === 'media') {
            return el;
        }
    }

    isIframelyOptionOnByUrl(url) {
        var iframely_options = getUrlIframelyOptions(url);
        if (iframely_options && iframely_options.iframely && iframely_options.iframely === this.iframelyValue) {
            return true;
        } else {
            return false;
        }
    }

    isIframelyOptionOn(el) {
        var url = el.getAttribute('url');
        return this.isIframelyOptionOnByUrl(url);
    }

    getUpdatedUrlParams(el) {
        var url = el.getAttribute('url');
        var iframely_options = getUrlIframelyOptions(url);
        if (iframely_options && iframely_options.iframely && iframely_options.iframely === this.iframelyValue) {
            return updateUrlIframelyOptions(url, {
                remove: {
                    iframely: 1
                }
            });
        } else {
            return updateUrlIframelyOptions(url, {
                add: {
                    iframely: this.iframelyValue
                }
            });
        }
    }
}

export class IframelyMore extends IframelyOptionPlugin {
    init() {
        this.baseInit('iframelyMore', 'Iframely More', moreButton, 'more');
    }
}

export class IframelyLess extends IframelyOptionPlugin {
    init() {
        this.baseInit('iframelyLess', 'Iframely Less', lessButton, 'less');
    }
}