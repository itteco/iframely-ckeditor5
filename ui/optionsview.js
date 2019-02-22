import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputCheckboxView from './inputcheckboxview';
import RadiogroupView from './radiogroupview';

import '../theme/optionsview.css';

export default class OptionsView extends View {

    constructor( editor ) {
        super( editor.locale );

        this.optionsView = new ViewCollection( editor.locale );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: ['ck-iframely-options']
            },
			children: this.optionsView
        } );
    }

    setOptions( options ) {

        this.optionsView.clear();
        
        Object.keys(options).forEach(key => {

            var optionData = options[key];

            optionData.key = key;

            if (typeof optionData.value === 'boolean') {

                var optionView = new LabeledInputView(this.locale, InputCheckboxView);
                optionView.label = optionData.label;
                optionView.inputView.checked = optionData.value;

                this.optionsView.add( optionView );

                optionView.inputView.on('change:checked', () => {
                    this.fire('change:checked', optionData, optionView.inputView.checked ? 'true' : 'false');
                });

            } else if (optionData.values) {

                var optionView = new LabeledInputView(this.locale, RadiogroupView);
                optionView.label = optionData.label;
                optionView.inputView.setKeyValues( key, optionData.values, optionData.value );

                this.optionsView.add( optionView );

                optionView.inputView.on('change:checked', (evt, name, value, checked) => {
                    this.fire('change:checked', optionData, value);
                });
            }
        });
    }
}