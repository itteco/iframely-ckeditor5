import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputCheckboxView from './inputcheckboxview';

import '../theme/optionsview.css';

export default class OptionsView extends View {

    constructor( editor ) {
        super( editor.locale );

        this.optionsDict = {};

        this.optionsView = new ViewCollection( editor.locale );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: ['ck-iframely-options']
            },
			children: this.optionsView
        } );
    }

    setOptions( options, initialValues, update ) {

        if (!update) {
            this.optionsView.clear();
            this.optionsDict = {};
        }
        
        for (var optionView of this.optionsView) {
            // TODO: why not binded?
            optionView.isReadOnly = true;
            optionView.inputView.isReadOnly = true;
        }

        options && options.forEach(optionData => {

            var key = optionData.key + '-' + optionData.value;
            var optionView;

            if (key in this.optionsDict) {
                optionView = this.optionsDict[key];
                // TODO: why not binded?
                optionView.isReadOnly = false;
                optionView.inputView.isReadOnly = false;
                optionView.inputView.checked = initialValues && initialValues[optionData.key] === optionData.value;
            } else {
                optionView = new LabeledInputView(this.locale, InputCheckboxView);
                optionView.label = optionData.label;
                optionView.inputView.checked = initialValues && initialValues[optionData.key] === optionData.value;
                this.optionsDict[key] = optionView;
                this.optionsView.add( optionView );
                optionView.inputView.on('change:checked', () => {
                    this.fire('change:checked', optionData, optionView.inputView.checked);
                });
            }
        });
    }
}