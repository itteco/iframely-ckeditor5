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

    setItems( name, items ) {

        this.radiogroupView.clear();

        items && items.forEach(item => {

            var inputRadioView = new LabeledInputView(this.locale, InputRadioView);
            inputRadioView.value = item.value;
            inputRadioView.label = item.label;
            inputRadioView.inputView.name = name;
            inputRadioView.inputView.checked = item.checked;

            this.radiogroupView.add( inputRadioView );

            inputRadioView.inputView.on('change:checked', () => {
                this.fire('change:checked', name, item.value, inputRadioView.inputView.checked);
            });
        });
    }
}