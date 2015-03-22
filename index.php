<!DOCTYPE html>
<!--[if lt IE 7]>  <html class="no-js ie6" lang="es">   <![endif]-->
<!--[if IE 7]>     <html class="no-js ie7" lang="es">   <![endif]-->
<!--[if IE 8]>     <html class="no-js ie8" lang="es">   <![endif]-->
<!--[if IE 9 ]>    <html class="no-js ie9" lang="es">   <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="" lang="es"> <!--<![endif]-->
<head>
<title></title>
<?php include('include/head.html'); ?>
<?php include('include/meta-social.html'); ?>
</head>
<body id="ip-container">
	<header class="ip-header" style="/*display:none;*/">
  		<div class="ip-logo">
  			<figure>
              <img src="produccion/img/logo.png" alt="K2 Inmobiliaria" title="K2 Inmobiliaria">
           </figure>
  		</div>
  		<div class="ip-loader">
  			<svg class="ip-inner" width="60px" height="60px" viewBox="0 0 80 80">
  				<path class="ip-loader-circlebg" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
  				<path id="ip-loader-circle" class="ip-loader-circle" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
  			</svg>
  		</div>
    </header>
    <!-- .ipUp-->
    <section class="ipUp">
    	<div class="tituloBox">
			<div class="tituloTexto">
				<h2>Ubícanos</h2>
			</div>
		</div>
    </section>
    <?php include('include/menu.html'); ?>
<?php include('include/js-general.html'); ?>
<?php include('include/footer.html'); ?>
<script>
	/* Loading */
		(function() {
			var support = { animations : Modernizr.cssanimations },
				container=document.getElementById( 'ip-container' ),
				header = container.querySelector( '.ip-header' ),
				loader = new PathLoader(document.getElementById( 'ip-loader-circle' ) ),
				animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' };
			// animation end event name
			var animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
			function init() {
				var onEndInitialAnimation = function() {
					if( support.animations ) {
						this.removeEventListener( animEndEventName, onEndInitialAnimation );
					}
					startLoading();
				};
				// disable scrolling
					window.addEventListener( 'scroll', noscroll );
				// initial animation
					$('#ip-container').addClass('loading');
					if( support.animations ) {
						container.addEventListener( animEndEventName, onEndInitialAnimation );
					}else {
						onEndInitialAnimation();
					}
			}
			function startLoading() {
				// simulate loading something..
					var simulationFn = function(instance) {
						var progress = 0,
							interval = setInterval( function() {
								progress = Math.min( progress + Math.random() * 0.1, 1 );
								instance.setProgress( progress );
								// reached the end
									if( progress === 1 ) {
										$('#ip-container').removeClass('loading');
										$('#ip-container').addClass('loaded');
										clearInterval( interval );
										var onEndHeaderAnimation = function(ev) {
											if( support.animations ) {
												if( ev.target !== header ) return;
												this.removeEventListener( animEndEventName, onEndHeaderAnimation );
											}
											$('body').addClass('layout-switch');
											window.removeEventListener( 'scroll', noscroll );
										};
										if( support.animations ) {
											header.addEventListener( animEndEventName, onEndHeaderAnimation );
										}else {
											onEndHeaderAnimation();
										}
									}
							}, 50 );
					};
				loader.setProgressFn( simulationFn );
			}
			function noscroll() {
				window.scrollTo( 0, 0 );
			}
			init();
		})();
</script>
</body>
</html>