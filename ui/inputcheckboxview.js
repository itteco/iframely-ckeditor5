import View from '@ckeditor/ckeditor5-ui/src/view';

export default class InputCheckboxView extends View {

	constructor( locale ) {
		super( locale );

		this.set( 'checked' );
		this.set( 'id' );
		this.set( 'isReadOnly', false );
		this.set( 'hasError', false );
		this.set( 'ariaDesribedById' );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'input',
			attributes: {
				type: 'checkbox',
				class: [
					'ck',
					'ck-input',
					'ck-input-checkbox',
					bind.if( 'hasError', 'ck-error' )
				],
				id: bind.to( 'id' ),
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
