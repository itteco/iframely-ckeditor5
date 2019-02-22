import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputRadioView from './inputradioview';


export default class RadiogroupView extends View {

    constructor( locale ) {
        super( locale );

        this.radiogroupView = new ViewCollection( editor.locale );

        this.setTemplate( {
            tag: 'div',
            attributes: {
                class: ['ck-input-radio-group']
            },
			children: this.radiogroupView
        } );
    }

    setKeyValues( name, keyValues, selectedValue ) {

        this.radiogroupView.clear();

        Object.keys(keyValues).forEach(key => {

            var value = keyValues[key];

            var inputRadioView = new LabeledInputView(this.locale, InputRadioView);
            inputRadioView.label = value;
            inputRadioView.inputView.name = name;
            inputRadioView.inputView.checked = key === selectedValue;

            this.radiogroupView.add( inputRadioView );

            inputRadioView.inputView.on('change:checked', () => {
                this.fire('change:checked', name, key, inputRadioView.inputView.checked);
            });
        });
    }
}