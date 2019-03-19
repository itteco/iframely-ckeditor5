	import View from '@ckeditor/ckeditor5-ui/src/view';

export default class InputCheckboxView extends View {

	constructor( locale ) {
		super( locale );

		this.set( 'checked' );
		this.set( 'id' );
		this.set( 'name' );
		this.set( 'value' );
		this.set( 'isReadOnly', false );
		this.set( 'hasError', false );
		this.set( 'ariaDesribedById' );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'input',
			attributes: {
				type: 'radio',
				class: [
					'ck',
					'ck-input',
					'ck-input-radio',
					bind.if( 'hasError', 'ck-error' )
				],
				id: bind.to( 'id' ),
				name: bind.to( 'name' ),
				value: bind.to( 'value' ),
				disabled: bind.to( 'isReadOnly' ),
				'aria-invalid': bind.if( 'hasError', true ),
				'aria-describedby': bind.to( 'ariaDesribedById' )
			},
			on: {
				change: bind.to( () => {
					this.checked = this.element.checked;
				} )
			}
		} );
	}

	render() {
		super.render();

		const setChecked = checked => {
			if (this.element.checked === !checked) {
				this.element.checked = !!checked;
			}
		};

		setChecked( this.checked );

		this.on( 'change:checked', ( evt, name, checked ) => {
			setChecked( checked );
		} );
	}
}
