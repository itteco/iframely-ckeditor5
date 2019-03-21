import View from '@ckeditor/ckeditor5-ui/src/view';

import parseUrl from 'url-parse';

import '../theme/optionsview.css';

export default class OptionsView extends View {

    constructor( locale ) {
        super( locale );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: ['ck-iframely-options']
            },
            text: ''
        } );
    }

    setOptions( options, iframeSrc ) {

        var parsed = parseUrl(iframeSrc, true);
        if (parsed.query.url) {
            // Id is 3rd party url.
            this.id = parsed.query.url;
        } else {
            // Id is short url id.
            this.id = parsed.pathname;
        }

        this.options = options;

        if (this.isRendered) {
            this.renderForm();
        }
    }

    render() {
        super.render();
        this.renderForm();
    }

    renderForm() {
        if (this.id && this.options) {
            iframely.buildOptionsForm({
                id:             this.id,
                formContainer:  this.element,
                options:        this.options
            });
        }
    }
}