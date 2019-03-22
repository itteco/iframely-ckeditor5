import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import IframelyEmbedProvider from './lib/iframely-embed-provider';
import IframelyOptions from './lib/iframely-options-plugin';
import parseUrl from 'url-parse';

var IFRAME_SRC = '//cdn.iframe.ly/api/iframe'

var API_KEY = 'Your API key from https://iframely.com/profile';

var parsedLocation = parseUrl(document.location.href, true);

var editorInstance;

function buildEditor() {
    ClassicEditor
        .create( document.querySelector( '#editor' ), {
            plugins: [ 
    
                // 'MediaEmbed' plugin required for ebmedding feature.
                MediaEmbed, 
    
                IframelyOptions,
    
                Essentials, Paragraph, Bold, Italic ],
    
            toolbar: [ 
                'mediaEmbed', 'bold', 'italic'
            ],

            // 'mediaEmbed' configuration is required for Iframely preview setup.
            mediaEmbed: {
    
                // Previews are always enabled if there’s a provider for a URL (below regex catches all URLs)
                // By default `previewsInData` are disabled, but let’s set it to `false` explicitely to be sure
                previewsInData: false,
    
                providers: [IframelyEmbedProvider({
                    iframe_path: IFRAME_SRC,
                    api_key: API_KEY,
                    initial_iframely_options: parsedLocation.query,
                    whitelisted_iframely_options: Object.keys(parsedLocation.query)
                })]
            }
        } )
        .then( editor => {
            console.log( 'Editor was initialized', editor );
            // Store editor to getData later.
            window.editorInstance = editor;
            editorInstance = editor;
        } )
        .catch( error => {
            console.error( error.stack );
        } );
}

document.querySelector( '#resultButton' ).addEventListener( 'click' , function() {
    if (editorInstance) {
        console.log(editorInstance.getData());
        document.querySelector( '#result' ).innerHTML = editorInstance.getData();
    }
} );

buildEditor();