import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

class OptionView extends View {
	constructor( locale ) {
		super( locale );

		this.set( 'value' );
		this.set( 'text' );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'option',
			attributes: {
				class: [
					'ck',
					'ck-option'
				],
				value: bind.to( 'value' )
			},
			children: [
				{
					text: bind.to( 'text' )
				}
			]
		} );
	}
}

export default class SelectView extends View {

	constructor( locale ) {
		super( locale );

		this.set( 'id' );
		this.set( 'name' );
		this.set( 'value' );
		this.set( 'isReadOnly', false );
		this.set( 'hasError', false );
		this.set( 'ariaDesribedById' );

		// TODO: use this.createCollection() ?
		this.optionsView = new ViewCollection( editor.locale );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'select',
			attributes: {
				class: [
					'ck',
					'ck-select',
					bind.if( 'hasError', 'ck-error' )
				],
				id: bind.to( 'id' ),
				name: bind.to( 'name' ),
				disabled: bind.to( 'isReadOnly' ),
				'aria-invalid': bind.if( 'hasError', true ),
				'aria-describedby': bind.to( 'ariaDesribedById' )
			},
			children: this.optionsView,
			on: {
				change: bind.to( () => {
					this.value = this.element.value;
				} )
			}
		} );
	}

	setOptions( items ) {
		this.optionsView.clear();
        
        items && items.forEach(item => {
			var optionView = new OptionView(this.locale);
			optionView.text = item.label;
			optionView.value = item.value;

			this.optionsView.add( optionView );
		});
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
