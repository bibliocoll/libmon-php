/*!
 * jQuery getcontents.js 
 * 
 * Scope: Displaying an RSS(like) JSON feed 
 *
 * Time-stamp: "2014-10-09 11:04:51 zimmel"
 * 
 * @author Daniel Zimmel <zimmel@coll.mpg.de>
 * @copyright 2014 MPI for Research on Collective Goods, Library
 * @license http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 */

$(document).ready(function() {
		
		var myURL = 'http://www.coll.mpg.de/lib/alephAPI/rsslike.php?myquery=wab=newfeaturedbooks&mybase=rdg01&output=json&callback=featured';

		/* get contents */
		(function getFeedContents(url) {
				$('#response').children().remove();
				
				$('#content-box').children().fadeOut('fast');
				$('#main-content-switcher').fadeIn('slow');
				
				$('#main-content .preloader').fadeIn();
				
				$.ajax({
						url: myURL,
						dataType: 'jsonp',
						jsonp: false,
						jsonpCallback: "featured"
				}).done(function(returnData) {
						$('#main-content .preloader').fadeOut();
						var itemData = returnData.channel.item;
						$.each(itemData, function (index, value) {
								var no = index+1; 
								var sysno = value.link.substr(value.link.length - 6);

								 $('#response').append('<div class="newitem" id="item-'+no+'">'+
																			 '<div class="pubdate row">'+value.pubDate.replace("00:00:00 CEST","")+'</div>'+
																			 '<div class="row">'+
																			 '<div class="columns small-12 medium-8 large-8"><a class="title" href="'+value.link+'" title="">'+value.title+'</a></div>'+
																			 '</div>'+
																			 '<div class="row">'+
																			 '<div class="columns small-12 medium-8 large-8">'+
																			 '<div class="authors"></div>'+
																			 '<div class="source">'+value.aleph_source+'</div>'+
																			 '<div class="description">'+value.description+'</div>'+
																			 '</div>'+
																			 '<div class="cover columns small-0 medium-4 large-4">'+
																			 '<img id="'+sysno+'" src="img/cover/'+sysno+'.jpg" width="150px"></img>'+
																			 '</div></div>').fadeIn();
								
								$.each(value.authors, function(i, author) {
										//console.log(author);
										var authorImg = author.substr(0, author.indexOf(',')).toLowerCase();
										$('#item-'+no+' div.authors').append('<span class="author">'+author+'</span><br/></div>');
								});

								// when an error happens on image loading:
								$('#'+sysno).error(function() { 
										// remove img:
										// $(this).remove(); 
										// load dummy img:
										$(this).attr('src','img/bgcoll-logo.png');
								});
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
								//easing: 'easeOutBack',
								vertical: false,
								autoplaySpeed: 10000
						});

				})
						.fail(function() {
								$('#response').append('<div class="error">there was an error!</div>');
						});
		}());

});





