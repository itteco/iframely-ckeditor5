import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import IframelyEmbedProvider from './iframely-embed-provider';
import { IframelyMore, IframelyLess } from './iframely-more-less-plugin';
import IframelyOptions from './iframely-options-plugin';
import { updateUrlIframelyOptions } from './utils';
import parseUrl from 'url-parse';

var IFRAME_SRC = '//cdn.iframe.ly/api/iframe'

var API_KEY = 'Your API key from https://iframely.com/profile';

var editorInstance;

function buildEditor() {
    ClassicEditor
        .create( document.querySelector( '#editor' ), {
            plugins: [ 
    
                // 'MediaEmbed' plugin required for ebmedding feature.
                MediaEmbed, 
    
                IframelyLess,
                IframelyMore,
    
                IframelyOptions,
    
                Essentials, Paragraph, Bold, Italic ],
    
            toolbar: [ 
                'mediaEmbed', 'bold', 'italic',
                
                'iframelyLess',
                'iframelyMore'
            ],
            
            // 'mediaEmbed' configuration is required for Iframely preview setup.
            mediaEmbed: {
    
                // Previews are always enabled if there’s a provider for a URL (below regex catches all URLs)
                // By default `previewsInData` are disabled, but let’s set it to `false` explicitely to be sure
                previewsInData: false,
    
                providers: [IframelyEmbedProvider({
                    iframe_path: IFRAME_SRC,
                    api_key: API_KEY
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

var parsed = parseUrl(document.location.href, true);

document.querySelectorAll( 'oembed' ).forEach(item => {
    var url = updateUrlIframelyOptions(item.getAttribute('url'), {
        add: parsed.query
    });
    item.setAttribute('url', url);
});

buildEditor();