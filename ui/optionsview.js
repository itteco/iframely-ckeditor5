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
            var view = new LabeledInputView(this.locale, InputCheckboxView);
            view.label = context.label;
            view.inputView.checked = context.checked;
            return view;
        },
        getValue: function(view) {
            return view.inputView.checked;
        },
        bindEvents: function(view, submitOptionsCb) {
            view.inputView.on('change:checked', submitOptionsCb);
        }
    },
    group: {
        createView: function(context) {
            var groupView = new OptionsView(this.locale);
            groupView.renderElements(context.elements);
            return groupView;
        },
        extendQuery: function(view, query) {
            view.extendQuery(query);
        },
        bindEvents: function(view, submitOptionsCb) {
            view.bindEvents(submitOptionsCb);
        }
    },
    option: {
        createView: function(context) {
            var selectView = new LabeledInputView(this.locale, SelectView);
            selectView.label = context.label;
            selectView.inputView.setOptions( context.items );
            return selectView;
        },
        getValue: function(view) {
            return view.inputView.value;
        },
        bindEvents: function(view, submitOptionsCb) {
            view.inputView.on('change:value', submitOptionsCb);
        }
    },
    radio: {
        createView: function(context) {
            // TODO: inline
            var radiogroupView = new LabeledInputView(this.locale, RadiogroupView);
            radiogroupView.label = context.label || '';
            radiogroupView.inputView.setItems( context.id, context.items );
            return radiogroupView;
        },
        getValue: function(view) {
            return view.inputView.value;
        },
        bindEvents: function(view, submitOptionsCb) {
            view.inputView.on('change:value', submitOptionsCb);
        }
    },
    range: {
        createView: function(context) {
            var view = new LabeledInputView(this.locale, InputRangeView);
            view.label = context.label;
            view.inputView.value = context.value;
            view.inputView.max = context.max;
            view.inputView.min = context.min;
            return view;
        },
        getValue: function(view) {
            return view.inputView.value;
        },
        bindEvents: function(view, submitOptionsCb) {
            view.inputView.on('change:value', submitOptionsCb);
        }
    },
    text: {
        createView: function(context) {
            var view = new LabeledInputView(this.locale, InputTextView);
            view.label = context.label;
            view.inputView.value = context.value;
            view.inputView.placeholder = context.placeholder;
            return view;
        },
        getValue: function(view) {
            return view.inputView.element.value;
        },
        bindEvents: function(view, submitOptionsCb) {
            var input = view.inputView.element;

            iframely.addEventListener(input, 'click', function() {
                input.select();
            });
            iframely.addEventListener(input, 'blur', submitOptionsCb);
            iframely.addEventListener(input, 'keyup', function(e) {
                // Apply on enter.
                if (e.keyCode === 13) {
                    submitOptionsCb();
                }
            });
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
        this.elements = elements;
        this.elements.forEach(element => {
            var elementUI = ElementsUI[element.type];
            var elementView = elementUI.createView(element.context);
            element.view = elementView;
            this.optionsView.add(elementView);
        });
    }

    bindEvents( submitOptionsCb ) {
        this.elements.forEach(element => {
            var elementUI = ElementsUI[element.type];
            var elementView = element.view;
            elementUI.bindEvents(elementView, submitOptionsCb);
        });
    }

    extendQuery( query ) {
        this.elements.forEach(element => {
            var elementUI = ElementsUI[element.type];
            var view = element.view;
            if (elementUI.getValue) {
                var inputValue = elementUI.getValue(view);
                Object.assign(query, element.getQuery(inputValue));
            } else if (elementUI.extendQuery) {
                elementUI.extendQuery(view, query);
            }
        });
    }

    getAndSubmitOptions() {
        var query = {};

        this.extendQuery(query);

        var defaultQuery = this.defaultQuery;

        Object.keys(defaultQuery).forEach(function(key) {
            if (defaultQuery[key] === query[key] 
                || query[key] === undefined) { // remove undefined so it's not included while JSON.stringify
                delete query[key];
            }
        });

        this.fire('change:query', query);
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
        this.defaultQuery = defaultQuery;
        
        this.renderElements(elements);
        this.bindEvents(() => {
            this.getAndSubmitOptions();
        });
    }
}