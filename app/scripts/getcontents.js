/*!
 * jQuery getcontents.js
 *
 * Scope: Displaying a JSON feed
 *
 * Time-stamp: "2015-05-21 10:48:10 krug"
 *
 * @author Daniel Zimmel <zimmel@coll.mpg.de>, minor edits by Alexander Krug <krug@coll.mpg.de>
 * @copyright 2014 MPI for Research on Collective Goods, Library
 * @license http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 */

/* get contents */
function getcontents(myquery) {
    var myURL = '../alephAPI/getlatest.php?query='+ myquery +'&callback=featured';

    var imgPath = 'http://www.coll.mpg.de/DOWNLOAD/_Fotos/';

    $('#response').children().remove();

    $('#main-content-switcher').fadeIn('slow');

    $('#main-content .loader').fadeIn();

    $.ajax({
        url: myURL,
        dataType: 'jsonp',
        jsonp: false,
        jsonpCallback: "featured"
    }).done(function(returnData) {
        $('#main-content .loader').fadeOut();
        $.each(returnData, function (index, value) {
            var no = index+1;
            var sysno = value.link.substr(value.link.length - 6);

            $cl = $('#newitemTemplate div.newitem').clone();
            $($cl).attr('id','item-'+no);
            $('.pubdate.row', $cl).text(value.pubDate.replace("00:00:00 CEST","").replace("00:00:00 CET",""));
            $('a.title', $cl).attr('href',value.link);
            $('a.linkToCORE', $cl).attr('href',value.link);
            $('a.title', $cl).text(value.title);
            //var source = $('source', $cl)
            //if (source) {
                $('.source', $cl).text(value.aleph_source)
            //}
            $('.description', $cl).html(value.description);
            $('.cover img', $cl).attr('id',sysno);
            $('.cover img', $cl).attr('src','../images/cover/'+sysno+'.jpg');
            $cl.appendTo('#response').fadeIn();

            $.each(value.authors, function(i, author) {
                //console.log(author);
                var authorSepIndex = author.indexOf(',');
                var authorFirstName = author.substr(authorSepIndex + 1, author.length - authorSepIndex);
                var authorLastName = author.substr(0, authorSepIndex);
                var authorNormal = authorFirstName + ' ' + authorLastName;
                var authorImg = authorFirstName.replace(/[\.\s]/g,'').toLowerCase() + '_' + authorLastName.toLowerCase();

                $('#item-'+no+' div.authors').append('<a class="author" href="">'+authorNormal+'</a><br/></div>');
                $('#item-'+no+' div.authorpics').append('<img class="author" title="'+authorImg+'" src="'+imgPath + authorImg+'.jpg"></img>');
            });
            // when an error happens on image loading:
            $('#'+sysno).error(function() {
                $(this).attr('src','../images/bgcoll-logo.png');
            });
            $('img.author').error(function() {
                // remove img:
                $(this).remove();
            });
        });

        /* attach slick slider */
        $('#response').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            speed: 600,
            fade: false,
            useCSS: true,
            //easing: 'easeOutBack',
            vertical: false,
            autoplaySpeed: 10000
        });

    })
    .fail(function() {
        $('#response').append('<div class="error">there was an error!</div>');
    });
}





