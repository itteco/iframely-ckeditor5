import View from '@ckeditor/ckeditor5-ui/src/view';

export default class InputRangeView extends View {

	constructor( locale ) {
		super( locale );

        this.set( 'value' );
        this.set( 'max' );
        this.set( 'min' );
        this.set( 'id' );
        this.set( 'isReadOnly', false );
        this.set( 'hasError', false );
        this.set( 'ariaDesribedById' );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'input',
			attributes: {
				type: 'range',
				class: [
					'ck',
					'ck-input',
					'ck-input-range',
					bind.if( 'hasError', 'ck-error' )
				],
                id: bind.to( 'id' ),
                value: bind.to( 'value' ),
                max: bind.to( 'max' ),
                min: bind.to( 'min' ),
				disabled: bind.to( 'isReadOnly' ),
				'aria-invalid': bind.if( 'hasError', true ),
				'aria-describedby': bind.to( 'ariaDesribedById' )
			},
			on: {
				change: bind.to( () => {
					this.value = this.element.value;
				} )
			}
		} );
	}

	render() {
		super.render();

		const setValue = value => {
			if (this.element.value === !value) {
				this.element.value = value;
			}
		};

		setValue( this.value );

		this.on( 'change:value', ( evt, name, value ) => {
			setValue( value );
		} );
	}
}
