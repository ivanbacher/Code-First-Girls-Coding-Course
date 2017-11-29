import * as d3 from 'd3';
import $ from 'jquery';

var reddit_url = 'https://www.reddit.com/r/perfectloops/top.json?sort=top&t=month';
var gif_urls = [];
var gif_index = 0;

$.ajax(reddit_url).done(function(response) {

    let gifs = { children: [], score:0 };

    gifs.children = response.data.children.filter( function(post) { return !post.data.over_18 })

    gifs.children = gifs.children.map( function(post) { 
        
        let url = post.data.url;
        let score = post.data.score;

        if(url.endsWith('.gifv')) {
            url = url.replace(/v$/,'')
        }
        
        return {url:url, score:score};
    } );

    gifs.children = gifs.children.filter( function(el) { return  el.url.endsWith('.gif') });



    //console.log(gifs.children)

    drawVis(gifs)

    
});


function drawVis(tree) {

    var width = 900;
    var height = 900;

    var svg = d3.select('body').append('div')
        .style("width", width + 'px')
        .style("height", height + 'px')
        .style("border", "1px solid back")
        .style('position', 'absolute')
        .style('left', function(d) { return (document.body.clientWidth/2)-(width/2) + "px" })
        .style('top', function(d) { return 50 + "px" })


    var pack = d3.pack()
        .size([width,height])
        .padding(10);

    var treemap = d3.treemap()
        .size([width, height])
        .padding(10)
        .round(true);

    var root = d3.hierarchy(tree)
        .sum( function(d) { return d.score; } )
        .sort(function(a, b) { return b.height - a.height || b.score - a.score; });

    treemap(root);

    let nodes = svg.selectAll('div')
        .data(root.descendants())
        .enter().append('div')
            .style('width', function(d) { return d.x1 - d.x0 + 'px' } )
            .style('height', function(d) { return d.y1 - d.y0 + 'px' } )
            .style('border', '1px solid black')
            .style('position', 'absolute')
            .style('left', function(d) { return d.x0 + "px" })
            .style('top', function(d) { return d.y0 + "px" })
            .style('overflow', 'hidden')
                .append('a')
                    .attr('href', function(d) { return d.data.url })
                .append('img')
                    .attr('src', function(d) { return d.data.url })
                    .attr('width', function(d) { return d.x1 - d.x0 } )
                    .attr('height', function(d) { return d.y1 - d.y0  } )
                    .select(function(d) { return this.parentNode; })    
    /*    
    pack(root);
    
    let nodes = svg.selectAll('div')
        .data(root.descendants())
        .enter().append('div')
            //.style("transform", function(d) { console.log(d.x); return "translate(" + d.x + "px," + d.y + "px)"; })
            .style('width', function(d) { return d.r*2 + 'px' } )
            .style('height', function(d) { return d.r*2 + 'px' } )
            .style('border-radius', '50%')
            .style('border', '1px solid black')
            .style('position', 'absolute')
            .style('left', function(d) { return (d.x - d.r) + "px" })
            .style('top', function(d) { return (d.y - d.r) + "px" })
            .style('overflow', 'hidden')
                .append('a')
                    .attr('href', function(d) { return d.data.url })
                .append('img')
                    .attr('src', function(d) { return d.data.url })
                    .attr('width', function(d) { return d.r*2 } )
                    .attr('height', function(d) { return d.r*2  } )
                    .select(function(d) { return this.parentNode; })
    */
}
