/*!
 * jQuery getcontents.js 
 * 
 * Scope: Displaying an RSS(like) JSON feed 
 *
 * Time-stamp: "2014-11-25 16:56:14 zimmel"
 * 
 * @author Daniel Zimmel <zimmel@coll.mpg.de>
 * @copyright 2014 MPI for Research on Collective Goods, Library
 * @license http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 */

$(document).ready(function() {

		/* where is the JSON? */
		var myURL = 'http://www.coll.mpg.de/lib/alephAPI/rsslike.php?myquery=wab=newpublications&mybase=rdg01&output=json&callback=newpublications';

		/* where are the images? */
		var imgPath = 'http://www.coll.mpg.de/DOWNLOAD/_Fotos/';

		/* get contents */
		(function() {
				$('#response').children().remove();
				
				$('#main-content-switcher').fadeIn('slow');
				
				$('#main-content .loader').fadeIn();
				
				$.ajax({
						url: myURL,
						dataType: 'jsonp',
						jsonp: false,
						jsonpCallback: "newpublications"
				}).done(function(returnData) {
						$('#main-content .loader').fadeOut();
						var itemData = returnData.channel.item;
						$.each(itemData, function (index, value) {
								var no = index+1; 
								var sysno = value.link.substr(value.link.length - 6);

								$cl = $('#newitemTemplate div.newitem').clone();
                $($cl).attr('id','item-'+no);
								$('.pubdate.row', $cl).text(value.pubDate.replace("00:00:00 CEST","").replace("00:00:00 CET",""));
								$('a.title', $cl).attr('href',value.link);
								$('a.title', $cl).text(value.title);
								$('.description', $cl).html(value.description);
								$('.source', $cl).html(value.aleph_source);
								$('.cover img', $cl).attr('id',sysno);
								//$('.cover img', $cl).attr('src','../img/cover/'+sysno+'.jpg');
								$('.cover img', $cl).attr('src','../img/bgcoll-logo.png');
								$cl.appendTo('#response').fadeIn();

								$.each(value.authors, function(i, author) {
										var authorSepIndex = author.indexOf(',');
										var authorFirstName = author.substr(authorSepIndex + 1, author.length - authorSepIndex);
									  var authorLastName = author.substr(0, authorSepIndex);
										var authorNormal = authorFirstName + ' ' + authorLastName;
										var authorImg = authorFirstName.replace(/[\.\s]/g,'').toLowerCase() + '_' + authorLastName.toLowerCase();

										$('#item-'+no+' div.authors').append('<a class="author" href="">'+authorNormal+'</a><br/></div>');
										$('#item-'+no+' div.authorpics').append('<img class="author" title="'+authorImg+'" src="'+imgPath + authorImg+'.jpg"></img>');
								});

								// when an error happens on image loading:
								// $('#'+sysno).error(function() { 
								// 		// load dummy img:
								// 		$(this).attr('src','img/bgcoll-logo.png');
								// });
								$('img.author').error(function() { 
										// remove img:
										$(this).remove(); 
										// load dummy img:
//										$(this).attr('src','img/bgcoll-logo.png');
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
								pauseOnHover: false,
								//easing: 'easeOutBack',
								vertical: false,
								autoplaySpeed: 10000
						});
						
				})
						.fail(function() {
								$('#response').append('<div class="error">there was an error!</div>');
						});
		}())

		/* get content from click on author */
		/* TODO: fails if only one item in response */
		function getAuthorContents(event, author) {
				event.preventDefault();
				$('#responseBox').children('div.newitem, div.error').remove();
				$('#responseBox').foundation('reveal', 'open');				
				$('#responseBox .preloader').fadeIn();

				$.ajax({
						url: 'http://bib.coll.mpg.de/newpublications/services/rsslike.php?myquery=wpe='+author+'&mybase=rdg01&output=json&callback=author',
						dataType: 'jsonp',
						jsonp: false,
						jsonpCallback: "author"
				}).done(function(returnData) {
						$('#main-content .preloader').fadeOut();
						var itemData = returnData.channel.item;
						if (itemData.length) { // if array = if more than one match in the catalog
						 $.each(itemData, function (index, value) {
								var no = index+1; 
								var sysno = value.link.substr(value.link.length - 6);

								$cl = $('#newitemTemplateModal div.newitem').clone();
                $($cl).attr('id','itemR-'+no);
								$('.pubdate.row', $cl).text(value.pubDate.replace("00:00:00 CEST",""));
								$('a.title', $cl).attr('href',value.link);
								$('a.title', $cl).text(value.title);
								$('.description', $cl).html(value.description);
								$('.source', $cl).html(value.aleph_source);
								$('.cover img', $cl).attr('id',sysno);
								//$('.cover img', $cl).attr('src','img/cover/'+sysno+'.jpg');
								$('.cover img', $cl).attr('src','img/bgcoll-logo.png');
								$cl.appendTo('#responseBox').fadeIn();

								$.each(value.authors, function(i, author) {

										var authorSepIndex = author.indexOf(',');
										var authorFirstName = author.substr(authorSepIndex + 1, author.length - authorSepIndex);
									  var authorLastName = author.substr(0, authorSepIndex);
										var authorNormal = authorFirstName + ' ' + authorLastName;

										$('#itemR-'+no+' div.authors').append('<a class="author" href="">'+authorNormal+'</a><br/></div>');
								});

								// remove images when 404
								//$('#'+sysno).error(function() { $(this).remove();  });
								$('#responseBox .preloader').fadeOut();
						});
						} else { // if no array = if only one match in the catalog
								$('#responseBox .preloader').fadeOut();
								$('#responseBox').append('<div class="error">Sorry, I could not find more articles by <strong>'+author+'</strong> in the catalog.</div>');
						}

				})
						.fail(function() {
								$('#responseBox').append('<div class="error">there was an error!</div>');
						});
				

		}


		/* click on author */
		$(document).on('click','a.author',function(event) {
				var author = $(this).text();
				getAuthorContents(event, author);
		});


});





