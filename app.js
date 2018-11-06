import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

var IFRAME_SRC = '//cdn.iframe.ly/api/iframe'

var API_KEY = 'Your API key from https://iframely.com/profile';

var editorInstance;

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ 

            // 'MediaEmbed' plugin required for ebmedding feature.
            MediaEmbed, 

            Essentials, Paragraph, Bold, Italic ],

        toolbar: [ 'mediaEmbed', 'bold', 'italic' ],
        
        // 'mediaEmbed' configuration is required for Iframely preview setup.
        mediaEmbed: {

            // Enable previews.
            previewsInData: true,

            providers: [
                {
                    name: 'iframely',

                    // A URL regexp or an array of URL regexps:
                    url: /.+/,

                    html: match => {
                        const url = match[ 0 ];
                        
                        var iframeUrl = IFRAME_SRC + '?app=1&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);

						return (
                            '<div>' +
                                '<div class="iframely-responsive">' +
                                    `<iframe src="${ iframeUrl }" ` +
                                        'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                                    '</iframe>' +
                                '</div>' +
                            '</div>'
						);
}
                }
            ]
        }
    } )
    .then( editor => {
        console.log( 'Editor was initialized', editor );
        // Store editor to getData later.
        editorInstance = editor;
    } )
    .catch( error => {
        console.error( error.stack );
    } );


document.querySelector( '#resultButton' ).addEventListener( 'click' , function() {
    console.log(editorInstance.getData());
    document.querySelector( '#result' ).innerHTML = editorInstance.getData();
})


