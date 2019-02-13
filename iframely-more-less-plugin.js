
import lessButton from './theme/icons/less-button.svg';
import moreButton from './theme/icons/more-button.svg';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import parseUrl from 'url-parse';

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

    isIframelyOptionOn(el) {
        var url = el.getAttribute('url');
        var parsed = parseUrl(url, true);
        if (parsed.query.iframely && parsed.query.iframely === this.iframelyValue) {
            return true;
        } else {
            return false;
        }
    }

    getUpdatedUrlParams(el) {
        var url = el.getAttribute('url');
        var parsed = parseUrl(url, true);
        if (parsed.query.iframely && parsed.query.iframely === this.iframelyValue) {
            delete parsed.query.iframely;
        } else {
            parsed.query.iframely = this.iframelyValue;
        }
        return parsed.toString();
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