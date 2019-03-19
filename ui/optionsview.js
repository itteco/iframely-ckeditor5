import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import InputCheckboxView from './inputs/inputcheckboxview';
import SelectView from './inputs/selectview';
import InputRangeView from './inputs/inputrangeview';
import RadiogroupView from './inputs/radiogroupview';
import parseUrl from 'url-parse';

import '../theme/optionsview.css';

var defaultQueryById = {};

var ElementsUI = {
    checkbox: {
        createView: function(context) {
            var inputView = new LabeledInputView(this.locale, InputCheckboxView);
            inputView.label = context.label;
            inputView.inputView.checked = context.checked;
            return inputView;
        }
    },
    group: {
        createView: function(context) {
            var groupView = new OptionsView(this.locale);
            groupView.renderElements(context.elements);
            return groupView;
        }
    },
    option: {
        createView: function(context) {
            var selectView = new LabeledInputView(this.locale, SelectView);
            selectView.label = context.label;
            selectView.inputView.setItems( context.id, context.items );
            return selectView;
        }
    },
    radio: {
        createView: function(context) {
            var radiogroupView = new LabeledInputView(this.locale, RadiogroupView);
            radiogroupView.label = context.label || '';
            radiogroupView.inputView.setItems( context.id, context.items );
            return radiogroupView;
        }
    },
    range: {
        createView: function(context) {
            var inputView = new LabeledInputView(this.locale, InputRangeView);
            inputView.label = context.label;
            inputView.inputView.value = context.value;
            inputView.inputView.max = context.max;
            inputView.inputView.min = context.min;
            return inputView;
        }
    },
    text: {
        createView: function(context) {
            var inputView = new LabeledInputView(this.locale, InputTextView);
            inputView.label = context.label;
            inputView.inputView.value = context.value;
            inputView.inputView.placeholder = context.placeholder;
            return inputView;
        }
    }
};

export default class OptionsView extends View {

    constructor( locale ) {
        super( locale );

        // TODO: use this.createCollection() ?
        this.optionsView = new ViewCollection( locale );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: ['ck-iframely-options']
            },
			children: this.optionsView
        } );
    }

    renderElements( elements ) {
        elements.forEach(element => {
            var elementUI = ElementsUI[element.type];
            var elemenView = elementUI.createView(element.context);
            this.optionsView.add( elemenView );
        });
    }

    setOptions( options, iframeSrc ) {

        this.optionsView.clear();

        var elements = iframely.getFormElements(options);

        var parsed = parseUrl(iframeSrc, true);
        var id;
        if (parsed.query.url) {
            // Id is 3rd party url.
            id = parsed.query.url;
        } else {
            // Id is short url id.
            id = parsed.pathname;
        }

        var defaultQuery = defaultQueryById[id] = defaultQueryById[id] || {};
        // Exclude default values.
        Object.keys(options).forEach(function(key) {
            if (!options.query || options.query.indexOf(key) === -1) {
                // Store default value.
                defaultQuery[key] = options[key].value;
            }
        });
        
        this.renderElements(elements);
        
        // Object.keys(options).forEach(key => {

        //     var optionData = options[key];

        //     optionData.key = key;

        //     if (typeof optionData.value === 'boolean') {

                

                
        //         optionView.inputView.on('change:checked', () => {
        //             this.fire('change:checked', optionData, optionView.inputView.checked ? 'true' : 'false');
        //         });

        //     } else if (optionData.values) {

                

                
        //         optionView.inputView.on('change:checked', (evt, name, value, checked) => {
        //             this.fire('change:checked', optionData, value);
        //         });
        //     }
        // });
    }
}