
//https://learn.jquery.com/using-jquery-core/document-ready/
// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "Dom is ready!" );

    var reddit_url = 'https://www.reddit.com/r/perfectloops/top.json?sort=top&t=week';
    var gif_urls = [];
    var gif_index = 0;

    $.ajax(reddit_url).done(function(response) {
        //console.log(response);

        gif_urls = response.data.children.filter( function(post) { return !post.data.over_18 })

        gif_urls = gif_urls.map( function(post) { 
            
            var url = post.data.url;

            if(url.endsWith('.gifv')) {
                url = url.replace(/v$/,'')
            }

            return url;
        } );

        gif_urls = gif_urls.filter( function(url) { return  url.endsWith('.gif') });

        console.log(gif_urls)

        $("#gif_goes_here").attr('src', gif_urls[0]);
    });

    $("#gif_goes_here").on('load', done_loading)

    function loading() {
        $("#loading_text").html("loading ...")
    }

    function done_loading() {
        $("#loading_text").html("")
    }

    //prev
    $("#button1").click(function() {
        gif_index--;

        if(gif_index < 0) {
            gif_index = gif_urls.length;
        }

        loading();
        $("#gif_goes_here").attr('src', gif_urls[gif_index]);
    });

    //next
    $("#button2").click(function() {
        gif_index++;

        if(gif_index > gif_urls.length) {
            gif_index = 0;
        }

        loading();
        $("#gif_goes_here").attr('src', gif_urls[gif_index]);
    });

});