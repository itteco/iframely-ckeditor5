import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

var IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
var API_KEY = '...'; 
// Your API key from https://iframely.com/profile';

var editorInstance;

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ 

            // Include 'MediaEmbed' plugin among others.
            MediaEmbed

        ],

        toolbar: [ 'mediaEmbed', 'bold', 'italic' ],
        
        // Configure 'mediaEmbed' with Iframely previews.
        mediaEmbed: {

            // Enable previews.
            previewsInData: true,

            providers: [
                {
                    // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                    name: 'iframely previews', 

                    // Match all URLs or just the ones you need:
                    url: /.+/,

                    html: match => {
                        const url = match[ 0 ];
                        
                        var iframeUrl = IFRAME_SRC + '?app=1&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);
                        // alternatively, use &key= instead of &api_key with the MD5 hash of your api_key
                        // more about it: http://dev.iframely.com/docs/allow-origins 

                        return (
                            // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                            '<div class="iframely-embed">' +
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
        // Store editor markup, etc.
    } )
    .catch( error => {
        console.error( error.stack );
    } );