/*! --------------------------- */
/*! Root jQuery JS              */
/*! --------------------------- */
/*! Version: 0.3.8              */
/*! Author: MR0                 */
/*! Author URL: http://mr0.cl   */
/*! --------------------------- */
/*! MR0 © 2018 | MIT license    */
/*! --------------------------- */

/* CHANGELOG */
/*
V 0.2.0 | 2017.08.31
- Start
- Based on Js Utils

V 0.2.2 | 2017.09.26
- Swipe
- After Transition
- Double Tap
- Burger Menu

V 0.2.3 | 2017.09.27
- Print SVG Source
- New Drill Util Function
- Url Util Function
- Get In Util Function 

V 0.2.4 | 2017.09.28
- Sort functions and behaviors
- Add global auto init
- Improve Double Tap
- Improve consistent
- add clearinterval to after transition
- Add pagination to slideshow

V 0.2.5 | 2017.09.29
- Add jQuery Util One Class
- Add Out of View jQuery Behavior

V 0.2.6 | 2017.10.03
- Improve Out of View, add last bottom elements detection
- Add old-ie condition css class to body tag

V 0.2.7 | 2017.10.04
- Add Tabs behavior

V 0.2.8 | 2017.10.11
- Refine Burger behavior
- Map function for Objects
- Sort and optimize auto inicilization
- Add options to all initilizaion

V 0.3.0 | 2017.10.12
- Add jQuery behaviors factory
- Init every behavior with factory
- Breakpoints to all behaviors
- Destroy to all behaviors
- Map function for Objects

V 0.3.1 | 2017.11.21
- Screen Slideshow behavior
- Video behavior
- Util: js_require
- Util: jsp_require
- Waitfor util

V 0.3.1.1 | 2017.11.22
- Pagination for Screen Slideshow behavior

V 0.3.2 | 2017.11.24
- Util: arr
- Util: forint

V 0.3.3 | 2017.12.22
- Behavior: popup
- Behavior: fitBox
- Util: String to Boolean
- Log control body className
- Imporve Log

V 0.3.4 | 2017.12.27
- jQuery Util: Extra easing by GSGD | http://gsgd.co.uk/sandbox/jquery/easing/
- improve sticky behavior

V 0.3.5 | 2018.02.14
- improve collapse behavior
- improve waitfor util
- add cookie util

V 0.3.5 | 2018.02.27
- improve slideshow behavior: no resize when where no slides
- improve scroll-to behabior: normal click when not the same location
- improve parallax behavior: check visible range and start point

V 0.3.6 | 2018.04.21
- add transform jquery extension
- improve slideshow resize: wait for loaded images

V 0.3.7 | 2018.04.25
- add clone anchor behavior

V 0.3.8 | 2018.04.26
- improve slideshow behavior: no swipe and auto transition
- fix transform method, return instance
*/


// =========================================
// JQUERY BEHAVIORS FACTORY
// =========================================

var _control_time = Date.now();
var _has_log = /log/.test(document.body.className);
var _behaviors = {}

var make_behavior = (function(){
	var all = {};
	if (_has_log) console.log('\tName \t\tTime \n——————————————————————————');
	return function(name, attrs, fun){
		var out = {};
		attrs = attrs || [];
		all[name] = all[name] || [];
		out[name] = function(options){
			options = options || {};
			var ins = isobj(options) ? fun.call(this, options) : null;
			return this.each(function(){
				var ind = all[name].indexOf(this);
				if ( isobj(options) && ind < 0 ) {

					if (_has_log) {
						var t = name.length > 6 ? '\t' : '\t\t';
						console.log('->\t' + name + t + (Date.now() - _control_time) + 'ms');
					}

					var that = this;
					var html = this.innerHTML;
					var classes = jQuery(this).attr('class');
					var index = all[name].length;

					if (ins) ins.call(this);
					
					this['_destroy_' + name] = function(){
						jQuery(that).attr('class', classes);
						that.innerHTML = html;
						all[name].splice(index, 1);
						delete that['_destroy_' + name];
					};

					all[name].push(this);
				}
				else if (isstr(options)) {
					this['_'+ options +'_' + name] && this['_'+ options +'_' + name]();
				}
			});
		};

		_behaviors[name] = attrs;

		jQuery.fn.extend(out);

		return out[name];
	};
})();


// =========================================
// JQUERY BEHAVIORS
// =========================================

// —————————————————————————————————————————
// CLONE : GENERATIVE
// —————————————————————————————————————————

make_behavior('clone', [], function(options){
	return function(){
		if (this.hash) {
			var className = this.className.replace('clone', '').trim();
			var id = this.id;
			var hash = this.hash.replace('#', '');
			var clon = document.getElementById(hash).cloneNode(true);
			clon.className = className;
			clon.id = id;
			$(this).replaceWith(clon);
		}
	}
});

// —————————————————————————————————————————
// BURGER
// —————————————————————————————————————————

make_behavior('burger', [], function(options){
	return function(){
		var that = this;
		var body = $('body');
		var mobi_menu = $(this.hash).addClass('mobi-menu hidden');
		var mobi_menu_close = $(this.hash).find('.mobi-menu-close');
		var mobi_menu_anchors = $(this.hash).find('a');
		
		$(this).click(function(e){
			e.preventDefault();
			toggle();
		});

		mobi_menu_anchors.click(toggle);
		
		function toggle(){
			var open = $(that).toggleClass('open').hasClass('open');
			
			if (open) mobi_menu.removeClass('hidden');
			else mobi_menu.afterTransition(function(){
				$(this).addClass('hidden');
			});
			setTimeout(function(){
				body.toggleClass('in-mobile-menu', open);
				mobi_menu.toggleClass('open', open);
			}, 0);
		}
	}
});

// —————————————————————————————————————————
// FIT BOX
// —————————————————————————————————————————

make_behavior('fitBox', [], function(options){
	return function(){
		var html = this.innerHTML;
		var is_fit = $(this).css('white-space', 'nowrap').height() != $(this).css('white-space', '').height();
		if (is_fit) {
			var width = check.call(this, $(this).width());
			$(this).html(html).width(width);
		}
	}
	function check(width, i){
		i = i || 0;
		var w = $(this).width();
		var arr = this.innerHTML.split(' ');
		if (arr.length > 1) { 
			this.innerHTML = arr.slice(0, -1).join(' ');
			if (w < width) return w;
			else if(i < 200) return check.call(this, width, ++i);
			else return null;
		}
		return null;
	}
});

// —————————————————————————————————————————
// POPUP
// —————————————————————————————————————————

make_behavior('popup', [], function(options){
	return function(){
		$(this).on('click.popup', function(e){
			e.preventDefault();
			var args = [
				'directories=no',
				'menubar=no',
				'titlebar=no',
				'status=no',
				'location=no',
				'toolbar=no',
				'resizable=yes',
				'scrollbars=yes',
				'height=400',
				'width=600',
				'left=' + (window.innerWidth * 0.5 - 300),
				'top=' + (window.innerHeight * 0.5 - 200)
			].join(',');
			window.open(this.href, '', args);
		});
		return this;
	}
});


// —————————————————————————————————————————
// PRINT SVG
// —————————————————————————————————————————

make_behavior('printSvg', [], function(options){
	return function(){
		var that = this;
		var classes = $(this).removeClass('print-svg').attr('class');
		$.get(this.src, function(d){
			var svg = $(d).siblings('svg');
			svg = svg.length ? svg : $(d);
			svg.attr('class', classes);
			$(that).replaceWith(svg);
		}, 'text');
	}
});


// —————————————————————————————————————————
// VIDEO
// —————————————————————————————————————————

make_behavior('video', [], function(options){

	function create_player(that, fun){
		var href = that.href;
		var youtube = href.match(/(?:watch\?v=|youtu\.be\/)([^&#?]+)/);
		var vimeo = href.match(/vimeo\.com\/([^&#?]+)/);
		var id = youtube ? youtube[1] : vimeo ? vimeo[1] : null;
		var player;

		if (options.inmodal) $('body').append('<div id="video-modal">');

		var container = options.inmodal? $('#video-modal').get(0) : player.getIframe();
		
		if (youtube) {
			var div = options.inmodal ?
				$('<div class="wrapper"><div></div></div>')
					.appendTo('#video-modal')
					.children()
					.get(0) :
				$('<div>').appendTo(that).get(0);
			var args =  {
				'videoId': id,
				'playerVars': {
					'autoplay': 1,
					'controls': 0,
					'showinfo': 0,
					'modestbranding': 1,
					'iv_load_policy': 3,
					'cc_load_policy': 0,
					'rel': 0
				},
				'events': {
					'onReady': function(){
						appear(that, container);
					},
					'onStateChange': function(e){
						if (e.data == 0) { // end
							$(container)
								.removeClass('in')
								.addClass('out')
								.afterTransition(function(){
									$(this).addClass('hidden');
								});
						}
					}
				}
			};
			waitfor(function(){
				if (YT.Player) {
					player = new YT.Player(div, args);
					$(container).addClass('hidden');
					fun.call(player);
					return true;
				}
				else return false;
			});
		}
		else if(vimeo) {
			player = document.createElement('iframe');
			player.frameborder = 0;
			player.allowfullscreen = 1;
			player.src = ''+
				'https://player.vimeo.com/video/'+
				id+
				'?autoplay=1'+
				'&title=0'+
				'&byline=0'+
				'&portrait=0';	
		}

		if (options.inmodal){
			$('#video-modal').click(function(){
				$(this)
					.removeClass('in')
					.addClass('out')
					.afterTransition(function(){
						$(this).addClass('hidden');
					});
				if (youtube) player.stopVideo();
			});
		}
	}

	function appear(that, container) {
		var top = $(container).offset().top;
		if (options.scroll) {
			$('html, body').animate({ 'scrollTop': top }, 333);
		}
		$(container)
			.removeClass('hidden');

		setTimeout(function(){
			$(that)
				.removeClass('loading');
			$(container)
				.removeClass('out')
				.addClass('in');
		}, 33);
	}

	js_require('https://www.youtube.com/iframe_api');

	return function(){
		if (this.href) {
			$('<button class="play">').appendTo(this);

			var _player;
			var cover = $(this).children();
			var youtube = this.href.match(/(?:watch\?v=|youtu\.be\/)([^&#?]+)/);
			var vimeo = this.href.match(/vimeo\.com\/([^&#?]+)/);
			var id = youtube ? youtube[1] : vimeo ? vimeo[1] : null;

			if (!cover.length) {
				$(this)
					.append('img')
					.addClass('cover')
					.attr('src', 'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg');
			}
			else if(!cover.attr('src')) {
				cover
					.attr('src', 'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg');
			}
			
			$(this).on('click.video', function(e){
				e.preventDefault();

				$(this).addClass('loading played');
				
				var that = this;
				var container = options.inmodal ? $('#video-modal').get(0) : $(this).children('iframe').get(0);
				
				if (_player) {
					appear(that, container);
					_player.playVideo();
				}
				else create_player(this, function(){
					_player = this;
				});
			});
		}
	};
});


// —————————————————————————————————————————
// STICKY
// —————————————————————————————————————————

make_behavior('sticky', [], function(options){
	var all = [];
	var check = (function(){
		var top = Infinity;

		function doCheck(scroll, that){
			var enable = that._sticky_enable_state;
			if (enable) {
				if (scroll >= top) $(that).addClass('fixed');
				else {
					$(that).removeClass('fixed');
					top = $(that).offset().top;
				}
			}
		}

		return doCheck;
	})();

	function check_all(){
		var scroll = $(window).scrollTop();
		all.map(function(that){ check(scroll, that); });
	}

	$(window)
		.on('scroll.sticky', check_all)
		.on('resize.sticky', check_all)
		.on('load.sticky', check_all);

	return function(){
		var that = this;

		that._sticky_enable_state = true;
		
		if (all.indexOf(this) < 0) all.push(this);
		check_all();

		this._disable_sticky = function() {
			that._sticky_enable_state = false;
			$(that).removeClass('fixed');
		};

		this._enable_sticky = function() {
			that._sticky_enable_state = true;
			check_all();
		};
	}
});


// —————————————————————————————————————————
// SCROLL SPY
// —————————————————————————————————————————

make_behavior('scrollSpy', [], function(options){
	var presets = {
		'snap': false
	};

	function spy(options){
		var elements = [];
		var parent = this;
		var current;
		var snap_time;
		var old = Date.now();
		var old_scroll = $(window).scrollTop();
		
		if (this.nodeName == 'A') {
			elements.push(this);
		}
		else {
			$(this)
				.children('a')
				.each(function(){
					if (this.hash) elements.push(this);
				});
		}
		
		function check(){
			var scroll = $(window).scrollTop();
			elements.map(function(e){
				var top = $(e.hash).offset().top - window.innerHeight*0.5;
				var height = $(e.hash).height();
				var is_current = scroll >= top && scroll < top + height;
				if (is_current) {
					$(e).addClass('current');
					if (e != current) {
						current = e;
						$(parent).trigger('scrollSpy:change', [e]);
					}
				}
				else {
					$(e).removeClass('current');
				}
			});

			if (
				(isbol(options.snap) && options.snap) ||
				(isstr(options.snap) && options.snap == current.hash)
				) {
				var velocity = Math.abs((scroll - old_scroll)*1000 / (Date.now() - old));
				clearTimeout(snap_time);
				snap_time = setTimeout(function(){
					var top = $(current.hash).offset().top;
					var duration = Math.abs((top - scroll)/velocity)*0.33;
					$('html, body')
						.stop(true)
						.animate({ 'scrollTop': top }, duration);
				}, 33);
				old_scroll = scroll;
			}
		}
		
		check();
		$(window).on('scroll.scrollSpy', check);
	}

	return function(){
		options = $.extend({}, presets, options || {});
		spy.call(this, options);
	}
});


// —————————————————————————————————————————
// SCROLL TO
// —————————————————————————————————————————

make_behavior('scrollTo', [], function(options){
	var speed = options.speed || 666;
	return function(){
		$(this).on('click.scroll-to', function(e){
			var href = this.href.split('#')[0];
			var location = window.location.href.split('#')[0];
			var burger = $('.burger').get(0);
			var in_mobile_menu = $('body').hasClass('in-mobile-menu') && burger && burger.hash;
			var target = $(this.hash);
			
			if (target.length) {
				if (location == href) e.preventDefault();
				var top = target.offset().top;
				if (in_mobile_menu) $(burger.hash).afterTransition(function(){
					go(top);
				});
				else go(top);
			}
		});
	}
	function go(top){
		$('html, body').animate({ 'scrollTop': top }, speed, 'easeInOutExpo');
	}
});


// —————————————————————————————————————————
// SCROLL ON
// —————————————————————————————————————————

make_behavior('scrollOn', [], function(options){
	function scroll_check(that){
		var scroll = $(window).scrollTop();
		that.map(function(d,i){
			var top = $(d).offset().top - scroll - window.innerHeight * 0.75;
			var last = scroll + window.innerHeight + 1 > document.body.clientHeight;
			if (top < 0 || last) {
				that.splice(i,1);
				$(d).removeClass('scroll-off');
			}
		});
	}

	return function(){
		var that = $(this).addClass('scroll-off').toArray();
		$(window).on('scroll.scroll-on', function(){
			scroll_check(that);
		});
		$('html, body').on('scroll.scroll-on',function(){
			scroll_check(that);
		});
		scroll_check(that);
	}
});


// —————————————————————————————————————————
// SLIDESHOW
// —————————————————————————————————————————

make_behavior('slideshow', [], function(options){
	if (isobj(options)) {
		options = $.extend({
			'delay': 6666,
			'arrows': false,
			'autoplay': true,
			'dots': false
		}, options);
	}
	else this.each(function(){
		this._stop_slideshow && this._stop_slideshow();
	});

	return function(){
		var that = this;
		var ind = 0;
		var max = 1;
		var in_swipe = false;
		var tim;
		var slides = $(this)
			.addClass('slideshow')
			.children()
			.addClass('slide')
			.wrapAll('<div class="slides">');
		var container = $(this).children('.slides');
		var resize = (function(container){
			var _height = 0;
			return function(height) {
				if (_height != height) {
					_height = height
					if (slides.length < 2) container.css('height', 'auto');
					else container.height(height);
				}
			};
		})(container);

		if (options.arrows) {
			var next = $('<a class="slideshow-next">&gt;</a>');
			var prev = $('<a class="slideshow-prev">&lt;</a>');
			
			$(this).append([prev, next]);

			next.click(fnext);
			prev.click(fprev);
		}

		if (slides.length > 1) {
			$(this)
				.swipe()
				.on('inSwipe', function(){
					in_swipe = true;
				})
				.on('swipe', function(e, ee, x){
					in_swipe = false;
					if (x > 0) fprev();
					if (x < 0) fnext();
				});
				
			if (options.pagination || options.numbers || options.znumbers) {
				var pagination = $('<nav class="slideshow-pagination">');
				var dots = slides.map(function(i){
					var dot = '&#x25cf;';
					if (options.numbers) dot = i + 1;
					if (options.znumbers) dot = ('0' + (i + 1)).slice(-2);
					return $('<a>'+ dot +'</a>').click(function(){
						if (options.autoplay && tim) clearTimeout(tim);
						ind = i; go();
					});
				}).get(); 
				
				$(this).append(pagination.append(dots));
			}
		}

		max = slides.length > max ? slides.length : max;
		
		if (!tim) go();

		this._stop_slideshow = function(){
			clearTimeout(tim);
		};

		function fnext(){
			if (options.autoplay && tim) clearTimeout(tim);
			++ind; go();
		}

		function fprev(){
			if (options.autoplay && tim) clearTimeout(tim);
			--ind; go();
		}

		function go(){
			var i = ind % slides.length;
			var ni = i + 1 >= slides.length ? 0 : i + 1;
			var pi = i - 1 < 0 ? slides.length - 1 : i - 1;
			var current = slides.eq(i);
			var imgs = current.get(0).tagName === 'img' ? current : current.find('img');

			if (imgs.length) {
				imgs.each(function(){
					if (this.complete) resize(current.outerHeight(true));
					else $(this).on('load', function(){
						resize(current.outerHeight(true));
					});
				});
			}
			else {
				resize(current.outerHeight(true));
			}
			
			container
				.afterTransition(function(){
					current.oneClass('current');
					slides.eq(ni).oneClass('next');
					slides.eq(pi).oneClass('prev');
				});

			if (slides.length > 1) {
				if (options.pagination || options.numbers || options.znumbers) {
					pagination.children('a').eq(i).oneClass('current');
				}
			}

			if (options.autoplay) {
				tim = setTimeout(function(){
					if (!in_swipe) {
						ind = (ind + 1) < max ? ind + 1 : 0;
					}
					go();
				}, options.delay);
			}
		}

		$(window)
			.resize(function(){
				resize(slides.filter('.current').outerHeight(true));
			});
	};
});

// —————————————————————————————————————————
// STICKY SLIDESHOW
// —————————————————————————————————————————

make_behavior('stickySlideshow', [], function(options){
	var all = [];

	function check(){
		var scroll = $(window).scrollTop();
		all.map(function(that, i){
			var o = that._sticky_slideshow;
			var in_scroll = scroll >= o.top && scroll < o.offHeight;

			if (in_scroll) {
				$(that)
					.addClass('fixed')
					.css({ 'top': '0', 'left': o.left, 'width': o.width });
			}
			else {
				$(that)
					.removeClass('fixed')
					.css({ 'top': '', 'left': '', 'width': '' });
			}
		});
	}

	function set(that){
		var is_fixed = $(that).hasClass('fixed');
		
		if (is_fixed) $(that).removeClass('fixed');

		var top = $(that).offset().top; 
		
		that._sticky_slideshow = {
			'top': top,
			'left': $(that).offset().left,
			'width': $(that).outerWidth(),
			'offHeight': top + $(that).outerHeight()
		};
		
		if (is_fixed) $(that).addClass('fixed');
	}

	$(window)
		.on('scroll.stickySlideshow', check)
		.on('resize.stickySlideshow', function(){
			all.map(function(that){ set(that); });
		})
		.on('load.stickySlideshow', function(){
			all.map(function(that){ set(that); });
		});

	return function(){
		set(this);
		if (all.indexOf(this) < 0) all.push(this);
		check();
	}
});


// —————————————————————————————————————————
// COLLAPSE
// —————————————————————————————————————————

make_behavior('collapse', [], function(options){
	return function(){
		var that = this;
		var headline = $(this).children('h2, h3, h4, h5, h6, .collapse-head');
		var panel = $(this).children('.panel, .holder');
		panel = panel.length ? panel : headline.siblings().wrapAll('<div class="panel">');
		var top = panel.position().top;
		var height = panel.outerHeight();
		$(this).height(top);
		headline.on('click.collapse', function(e){
			e.preventDefault();
			var is_open = $(that)
				.toggleClass('open')
				.hasClass('open');
			$(that).height((is_open ? top + height : top));
		});
	};
});


// —————————————————————————————————————————
// TABS
// —————————————————————————————————————————

make_behavior('tabs', [], function(options){
	return function(){
		var panels = $(this).children('.panel, .holder').wrapAll('<div class="panels">');
		var nav = $('<nav class="tabs-nav">').prependTo(this);
		var ind = 0;
		var items = panels.map(function(i){
			var title = $(this).children('h2, h3, h4, h5, h6, .tab-head').eq(0).html();
			var anchor = $('<a>'+title+'</a>');
			if ($(this).hasClass('current')) ind = i;
			anchor.on('click.tabs', function(e){
				e.preventDefault();
				$(this).oneClass('current');
				panels.eq(i).oneClass('current');
			});
			return anchor;
		}).get();
		
		nav.append(items);
		items[ind].trigger('click.tabs');
	};
});


// —————————————————————————————————————————
// PARALLAX
// —————————————————————————————————————————

make_behavior('parallax', [], function(options){
	var all = [];
	var now = Date.now();
	var factor = 10;

	$(window)
		.on('scroll.parallax', scroll_check)
		.on('load.parallax', scroll_check);
	$('html, body')
		.on('scroll.parallax', scroll_check);

	scroll_check();

	function scroll_check(){
		if (now + 12 < Date.now()){
			var scroll = $(window).scrollTop() || $('html, body').scrollTop();
			all.map(function(that, i){
				var top = $(that).offset().top;
				var dif = scroll - top;
				if (dif + window.innerHeight > 0 && dif < window.innerHeight) {
					var y = that._parallax_z * dif / factor;
					$(that).css('transform', that._parallax_transform + ' translateZ(0) translateY('+ y +'px)');
				}
			});
			now = Date.now();
		}
	}
	
	return function(){
		var transform = $(this).css('transform');
		$(this).each(function(){
			this._parallax_transform = transform == 'none' ? '' : transform;
			this._parallax_z = $(this).attr('data-parallax-z') * 1;
		});
		all.push(this);
	};
});

// =========================================
// JQUERY LISTENERS
// =========================================

// —————————————————————————————————————————
// TRANSFORM
// —————————————————————————————————————————

!function($){
$.fn.extend({
	'transform': function(d){
		this.each(function(){
			var t = $(this).css('transform');
			if ( typeof this._transform == 'undefined' ) {
				this._transform = t == 'none' ? '' : t;
			}
			$(this).css('transform', this._transform + ' ' + d);
		});
		return this;
	}
})
}(jQuery);

// —————————————————————————————————————————
// AFTER TRANSITION
// —————————————————————————————————————————

!function($){
	$.fn.extend({
		'afterTransition' : function(fun){
			var that = this;
			var times = this.map(function(){
				var durations = $(this).css('transition-duration').split(',').map(mseconds);
				var delays = $(this).css('transition-delay').split(',').map(mseconds);
				var totals = durations.map(function(t,i){ return t + delays[i]; });
				return Math.max.apply(null, totals);
			}).get();
			var time = Math.max.apply(null, times);
			if (this._after_transition_timer) clearTimeout(this._after_transition_timer);
			if (typeof fun == 'function') {
				this._after_transition_timer = setTimeout(function(){
					fun.call(that);
					delete that._after_transition_timer;
				}, time);
			}
			return time;
		}
	});
	function mseconds(t){
		t = t.trim();
		return t.search(/ms/i) < 0 ?
			t.replace(/s/i, '') * 1000 :
			t.replace(/ms/i, '') * 1 ||
			0;
	}
}(jQuery);


// —————————————————————————————————————————
// DOUBLE TAP
// —————————————————————————————————————————

!function($){
	$.fn.extend({
		'doubleTap': function(first, second, delay){
			var that = this;
			var current = null;
			var doble_tap_time = 0;
			delay = delay || 5000;
			
			$(this).on('click.double-tap', function(event){
				if (Date.now() < doble_tap_time && current == this) {
					second.call(this, event);
					current = null;
				}
				else {
					first.call(this, event);
					doble_tap_time = Date.now() + delay;
					current = this;
				}
			});
		}
	});
}(jQuery);


// —————————————————————————————————————————
// SWIPE
// —————————————————————————————————————————

!function($){
	$.fn.extend({
		'swipe' : function(amount, speed){
			amount = amount || 10;
			speed = speed || 10;
			var distance = window.innerWidth * amount / 40;
			
			this.each(function(){
				var that = this;
				var old;
				var difx;
				var dify;
				var x;
				var y;
				
				this.addEventListener('touchmove', function(e){
					var now = Date.now();
					if (old + 30 < now) {
						var state = Math.abs(difx) > distance;
						difx = e.touches[0].clientX - x;
						dify = e.touches[0].clientY - y;
						$(this).trigger('inSwipe', [e, difx, state]);
						old = now;
					}
				}, false);

				this.addEventListener('touchstart', function(e){
					$(that).addClass('in-swipe');
					old = Date.now();
					difx = 0;
					dify = 0;
					x = e.touches[0].clientX;
					y = e.touches[0].clientY;
				}, false);
				
				this.addEventListener('touchend', function(e){
					$(that).removeClass('in-swipe');
					if (Math.abs(dify) < distance * 0.5) {
						var in_speed = Date.now() - speed < old && Math.abs(difx) > amount * 0.5;
						var in_distance = Math.abs(difx) > distance;
						var state = in_speed || in_distance;
						if (state) $(this).trigger('swipe', [e, difx, state]);
					}
					$(this).trigger('outSwipe', [e, difx, state]);
				}, false);
			});
			return this;
		}
	});
}(jQuery);


// —————————————————————————————————————————
// ONE CLASS
// —————————————————————————————————————————

!function($){
	$.fn.extend({
		'oneClass' : function(d){
			this.addClass(d).siblings().removeClass(d);
			return this;
		}
	});
}(jQuery);


// —————————————————————————————————————————
// EXTRA EASING
// —————————————————————————————————————————

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});


// =========================================
// AUTO INIT JQUERY BEHAVIORS
// =========================================

var no_auto_init_base_js;
function init_base_js(init, $){
	init = isset(init) ? init : true;
	$ = $ || jQuery;
	if (init){
		$.fn.extend({
			'initBehavior' : function(name, attrs, range){
				if (this.length) {
					var arr = name.split('-');
					var fun = arr.shift() + arr.map(capitalize).join();

					this.each(function(){
						var that = this;
						var options = attrs.reduce(function(a, b){
							var arg = $(that).attr('data-'+ name +'-'+ b);
							if (arg) a[b] = /^true$/i.test(arg) || (isnum(arg*1) ? arg*1 : false);
							return a;
						}, {});

						$(window).resize(check_resize);
						check_resize();
						
						function check_resize() {
							var width = window.innerWidth;
							if (width >= range[0] && width < range[1]) $(that)[fun](options);
							else $(that)[fun]('destroy');
						}
					});
					return this;
				}
				else return null;
			}
		});

		map.call({
			'clone': [], // <-- first because generate new element
			'burger': [],
			'collapse': [],
			'fit-box': [],
			'parallax': ['z'],
			'print-svg': [],
			'scroll-on': [],
			'scroll-spy': ['start', 'end'],
			'scroll-to': ['speed'],
			'slideshow': ['delay', 'arrows', 'autoplay', 'pagination', 'numbers', 'znumbers'],
			'sticky': [],
			'sticky-slideshow': [],
			'tabs': [],
			'video': ['inmodal'],
			'popup': ['width', 'height']
		}, init_behavior);
	}
}

function init_behavior(name, attrs){
	jQuery('.tblt-' + name + '.desk-' + name).initBehavior(name, attrs, [600, Infinity]);
	jQuery('.mobi-' + name + '.tblt-' + name).initBehavior(name, attrs, [0, 900]);
	jQuery('.desk-' + name).initBehavior(name, attrs, [900, Infinity]);
	jQuery('.tblt-' + name).initBehavior(name, attrs, [600, 900]);
	jQuery('.mobi-' + name).initBehavior(name, attrs, [0, 600]);
	jQuery('.' + name).initBehavior(name, attrs, [0, Infinity]);
}

!function(d){
	var script = d.createElement('script');
	no_auto_init_base_js = function(){
		script.innerHTML = 'init_base_js(false, jQuery);'
	};
	script.innerHTML = 'init_base_js(true, jQuery);';
	jQuery(function($){
		var is_ie = /msie [10|9|8|7]/.test(navigator.userAgent) ? 'old-ie' : '';
		$(d.body).addClass(is_ie);
		d.body.appendChild(script);
	});
}(document);


// =========================================
// JS UTILS
// =========================================

// —————————————————————————————————————————
// JSON CSS
// —————————————————————————————————————————

var json_css = (function(){
	return function(json){
		var css_string = '';

		json = flat(json);

		for(var selector in json){
			css_string += selector + ' {\n';
			for(var property in json[selector]){
				var value = json[selector][property];
				css_string += '\t' + property + ': ' + value +';\n';
			}
			css_string += '}\n';
		}
		return css_string;
	}
	function flat(d, s, p, o){
		s = s || ''; o = o || {};
		
		if(s) s += p.slice(0,1) == '&'? p.slice(1) : ' '+p;	
		else if(p) s = p;
		
		if(!o[s] && s) o[s] = {};
	
		for(var k in d){
			if(typeof d[k] == 'object'){
				if(s.search(',') > 0) s.split(',').map(function(ss){
					ss = ss.replace(/^\s|\s$/g, '');
					flat(d[k], ss, k, o);
				});
				else flat(d[k], s, k, o);
			}
			else o[s][k] = d[k];
		}
		
		if(o[s] && !Object.keys(o[s]).length) delete o[s];
		return o;
	}
})();

// —————————————————————————————————————————
// UTILS
// —————————————————————————————————————————

function url(){
	var url_search = window.location.search.slice(1).split('&').reduce(function(a,b){
		var arr = b.split('=');
		a[arr[0]] = arr[1];
		return a;
	}, {});
	var url_path = window.location.pathname;
	url_path = url_path.slice(-1) == '/' ? url_path : url_path + '/';
	url_path = url_path.split('/').slice(1, -1);
	return {
		'search': url_search,
		'path': url_path
	}
}

function arr(n) { return Array.apply(null, {length: n}); }

function capitalize(d){ return d.charAt(0).toUpperCase()+d.slice(1); }

function clone(d){
	var cache = [];
	var obj = JSON.parse(JSON.stringify(d, function(k,v){
		if (typeof v == 'object' && v != null) {
			var i = cache.indexOf(v);
			if (i > -1) return '__CACHE__'+i;
			else cache.push(v);
		}
		return v;
	}));

	function check(o){
		for (var k in o) {
			var v = o[k];
			if (typeof v == 'object') check(v);
			else if (typeof v == 'string') {
				var match = v.match(/^__CACHE__(\d+)/);
				v = match ? cache[match[1]] : v;
			}
		}
	}

	check(obj);

	return obj;
}

function cookie(d) {
	if (typeof d == 'object') {
		var keys = Object.keys(d);
		keys.map(function(k){
			var v = d[k];
			if (v) document.cookie = k+'='+v+';';
			else document.cookie = k+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		});
	}
	else if (typeof d == 'string') {
		var regx = new RegExp(d+'=([^;]*);');
		var match = document.cookie.match(regx);
		return match ? match[1] : null;
	}
}

function drill(acc, fun, out){
	if (!fun) {
		fun = acc;
		acc = null;
	}
	out = out || [];
	if (this) {
		for(var i in this){
			var d = acc ? acc(this[i]) : isobj(this[i]) ? this[i] : null;
			if (d) drill.call(d, acc, fun, out);
			else {
				if (fun) this[i] = fun(this[i]);
				out.push({ 'key': i, 'value': this[i] });
			}
		}
	}
	return out;
}

function extend(){
	var i = this == window? 1 : 0;
	var out = this == window? arguments[0] : this;
	while(arguments[i]){
		for(var k in arguments[i]){
			if(arguments[i].hasOwnProperty(k)) out[k] = arguments[i][k];
		}
		i++;
	}
	return out;
}

function forint(n, fun){ return arr(n).map(fun); }

function getobj(k,d){
	for(var i in this){ if(this[i][k] == d) return this[i]; }
		return null;
}

function getin(fun){
	for (var i in this) {
		if (fun(this[i])) return this[i];
	}
	return null;
}

function hexrgb(hex){
	hex = hex.replace('#','').split('');
	hex = hex.length > 3?
		hex.join(''):
		hex.reduce(function(o,d){ return o += d+d; },'');
	return [
		parseInt(hex.substring(0,2), 16),
		parseInt(hex.substring(2,4), 16),
		parseInt(hex.substring(4,6), 16)
	];
}

function inarr(d,e){
	for(var i in e){ if(e[i] == d) return true; }
	return false;
}

function isarr(d){ return Array.isArray(d); }

function isbol(d){ return typeof d == 'boolean'; }

function isfun(d){ return typeof d == 'function'; }

function isnum(d){ return typeof d == 'number'; }

function isobj(d){ return typeof d == 'object'; }

function isset(d){ return typeof d != 'undefined' && d != null; }

function isstr(d){ return typeof d == 'string'; }

var js_require = (function(){
	var scripts = [];
	var srcs = [];
	return function(src, callback){
		var ind = srcs.indexOf(src);
		if (ind < 0) {
			var script = document.createElement('script');
			script.src =  src;
			script.id = 'js-require-script-'+scripts.length;
			scripts.push(script);
			srcs.push(src);
			document.body.appendChild(script);
		}
		var current = script || scripts[ind];
		current.addEventListener('load', function(e){
			this.loaded = true;
			if (callback) callback.call(this, e);
		});
		if (current.loaded && callback) callback.call(current, null);
	};
})();

var jsp_require = (function(){
	var srcs = [];
	var xhrs = [];
	return function(src, padding, callback){
		var ind = srcs.indexOf(src);
		var xhr = new XMLHttpRequest();
		if (ind < 0){
			srcs.push(src);
			xhrs.push(xhr);
			xhr.addEventListener('load', function(){
				var script = document.createElement('script');
				script.text = 'function '+ padding +'(callback){\n'+this.responseText+'\n}\n';
				document.body.appendChild(script);
				callback.call(this, window[padding]);
			});
			xhr.open('GET', src, true);
			xhr.send();
		}
		else {
			if (xhrs[ind].status != 200) {
				xhrs[ind].addEventListener('load', function(){
					callback.call(this, window[padding]);
				});
			}
			else {
				callback.call(xhrs[ind], window[padding]);
			}
		}
	};
})();

function map(fun){
	for( var k in this ){
		fun.call(this, k, this[k]);
	}
	return this;
}

function mapobj(d,o={}){
	for(var k in this){ o[k] = d(this[k],k); }
	return o;
}

function parse_date(d){
	var match = d.match(/(\d*)-(\d*)-(\d*)T(\d*):(\d*):(\d*)Z(-?\+?\d:?\d)?/);
	if (match) return {
		'year' :   match[1],
		'month' :  match[2],
		'day' :    match[3],
		'hour' :   match[4],
		'min' :    match[5],
		'seg' :    match[6],
		'offset' : match[7]
	};
	return null;
}

function slug(d){
	return d
		.toLowerCase()
		.replace(/\s/g, '-')
		.replace(/[àáâä\xE1]/g, "a")
		.replace(/[èéêë\xE9]/g, "e")
		.replace(/[ìíîï\xED]/g, "i")
		.replace(/[òóôö\xF3]/g, "o")
		.replace(/[ùúûü\xFA]/g, "u")
		.replace(/[ñ\xF1]/g, 'n')
		.replace(/[^a-z0-9\-]/g,'');
}

function str_bool(d){
	return !!(d * 1 == 0 || d * 1 ? d * 1 : d != 'false' && d);
}

var throttle = (function(){
  var t = null;
  return function(a, b){
    if(t) clearTimeout(t);
    t = setTimeout(a, b);
  };
})();

function uniq(d,e){
	if(isfun(d)){
		var temp = [];
		var out = [];
		this.map(function(dd){
			var v = d(dd);
			if(temp.indexOf(v) < 0){
				temp.push(v);
				out.push(e(dd));
			}
		});
		return e? out : temp;
	}
	else return d.filter(function(dd, i){ return d.indexOf(dd) == i; });
}

function uniqobj(f){
	var temp = [];
	return this.map(function(d){
		var o = f(d);
		if(temp.indexOf(o) < 0){
			temp.push(o);
			return d;
		}
		return null;
	}).filter(function(d){
		return d;
	});
}

function waitfor(fun) {
	setTimeout(function () {
		if (!fun()) waitfor(fun);
	}, 33);
}

function find(arr, obj) {
	obj = obj || window;
	var out = obj[arr.shift()];
	if (arr.length) return find(arr, out);
	else return out;
}

/*! --------------------------- */
/*! End Root jQuery JS          */
/*! --------------------------- */