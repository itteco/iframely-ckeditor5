import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputRadioView from './inputradioview';


export default class RadiogroupView extends View {

    constructor( locale ) {
        super( locale );

        this.set( 'value' );

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
            inputRadioView.label = item.label;
            inputRadioView.inputView.name = name;
            inputRadioView.inputView.value = item.value;
            inputRadioView.inputView.checked = item.checked;

            if (item.checked) {
                this.value = item.value;
            }

            this.radiogroupView.add( inputRadioView );

            inputRadioView.inputView.on('change:checked', ( evt, name, value ) => {
                if (value) {
                    this.value = item.value;
                }
            });
        });
    }

    render() {
		super.render();

		const setValue = value => {
            for(var i = 0; i < this.radiogroupView.length; i++) {
                var radioInput = this.radiogroupView.get(i).inputView;
                var needValue = radioInput.value === value;
                if (radioInput.checked != needValue) {
                    radioInput.checked = needValue;
                }
            }
		};

		setValue( this.value );

		this.on( 'change:value', ( evt, name, value ) => {
			setValue( value );
		} );
	}
}