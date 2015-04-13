/* Dependencias */
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	sass= require('gulp-sass'),
	nib = require('nib'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	gutil = require('gulp-util'),
	//ftp = require('gulp-ftp'), //Subida de archivos
	imagemin    = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	jpegoptim = require('imagemin-jpegoptim'),
	rename    = require('gulp-rename'),
	Filter = require('gulp-filter'), //Concatenar stylus al css
	newer = require('gulp-newer'),
	connect = require('gulp-connect-php'),
	conecta=require('gulp-connect'),/* otra alternativa al gulp-connect-php. solo que con html */
	useref=require('gulp-useref'),
	stylish=require('jshint-stylish'), /* mejorar la lectura de errores js en la terminal */
	historyApiFallback=require('connect-history-api-fallback'),
	inject=require('gulp-inject'),
	browserSync = require('browser-sync'),
	templateCache=require('gulp-angular-templatecache'),
	//uncss=require('gulp-uncss'),
	wiredep=require('wiredep').stream;
/* Configuración global */
var path={
	inputStylus:'./app/css/*.styl',
	inputCss:'./app/css/*.css',
	nameCss:'style.min.css',
	outputStylus:'./app/css/',
	outputCss:'./dist/css/',

	inputSass:'./app/sass/**/*.scss',
	nameSass:'materialize.min.css',
	ouputSass:'./app/css/',

	inputJsGeneral:'./app/js/general/*.js',
	nameJsGeneral:'jsgeneral.min.js',
	outputJsGeneral:'./dist/js/general/',

	inputMyapp:'./app/js/myapp/*.js',
	nameMyapp:'myapp.min.js',
	outputMyapp:'./dist/js/myapp/',

	inputJsFramework:'./app/js/lib/framework/*.js',
	nameJsFramework:'framework.js',
	outputJsFramework:'./dist/js/lib/framework/',

	inputJsLibreria:'./app/js/lib/utilitario/*.js',
	outputJsLibreria:'./dist/js/lib/utilitario/',

	inputImg:'./app/img/*.{gif,png,jpg,svg,jpeg}',
	outputImg:'./dist/img/',

	inputHtml:'./app/**/*.html',
	inputJs:'./app/js/**/*.js'
};
var myFiles=[path.outputCss,path.ouputSass,path.outputJsGeneral,path.outputMyapp,path.outputJsFramework,path.outputJsLibreria];
/* Server: Variables de desarrollo para FTP
	var host = 'kevin.dhdinc.com',
    user = 'kevindhd',
    pass = 'kevrod100'
    port = '2082',
    remotePathp = '/public_html/guru/' */
/* Crear server */
gulp.task('server',function(){
	conecta.server({
		root: './app',
		hostname: '0.0.0.0',
		port: 8082,
		livereload: true,
		middleware: function(connect,opt){
			return [ historyApiFallback ];
		}
	});
});
/* recargar navegador cuando cambia html */
gulp.task('html',function(){
	gulp.src(path.inputHtml)
	.pipe(conecta.reload());
});
gulp.task('jshint',function(){
	gulp.src(path.inputJs)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});
/* Busca en las carpeta de css y js los archivos que hayamos creado
para inyectarlos en el index.html */
gulp.task('inject',function(){
	var sources=gulp.src([path.inputJs,'./app/css/**/*.css']);
	return gulp.src('index.html',{cwd:'./app'})
	.pipe(inject(sources,{
		read:false,
		ignorePath:'/app'
	}))
	.pipe(gulp.dest('./app'));
});
gulp.task('templates', function() {
	gulp.src('./app/views/**/*.tpl.html')
		.pipe(templateCache({
			root: 'views/',
			module: 'blog.templates',
			standalone: true
		}))
		.pipe(gulp.dest('./app/js'));
});
//	Elimina	el	CSS	que	no	es	utilizado	para	reducir	el	peso	del	archivo
/*gulp.task('uncss', function() {
  gulp.src('./dist/css/style.min.css')
    .pipe(uncss({
      html: ['./app/index.html', './app/views/*.tpl.html']
    }))
    .pipe(gulp.dest('./dist/css'));
});*/

/* inyecta las librerias que instalemos via bower -- sale error
gulp.task('wiredep',function(){
	gulp.src('./app/index.html')
	.pipe(wiredep({
		directory:'./app/lib'
	}))
	.pipe(gulp.dest('./app'));
}); */
/* server php
gulp.task('connect', function() {
	connect.server();
}); */
/* server php with browser sync */
gulp.task('cbs', function() {
  connect.server({}, function (){
    browserSync({
      proxy: 'localhost:80/Copy/manya%20proyectos/puntoHogar/'
    });
  });

  gulp.watch('**/*.php').on('change', function () {
    browserSync.reload();
  });
});
/* broser sync */
gulp.task('browser', function() {
    browserSync.init(/*files,*//*["./*.css","./*.js","./*.html"],*/{
        /*port:8000,*/
        server: {
            baseDir: "./",
            index: "1index.html"
        }
        /*proxy: "kevin.dhdinc.com"*/
		/*files: myFiles, estos serán vigilados
		ghostMode: {
			clicks: true,
			location: true,
			forms: true,
			scroll: true
		},
		notify: false,
		open: false*/
    });
});
/* Reload task */
gulp.task('bsReload', function () {
	browserSync.reload();
});
/* compilando stylus - No necesario, ya que lo implementamos en el task css */
gulp.task('nib', function(){
    gulp.src(path.inputStylus)
        .pipe(stylus({ use: [nib()], compress: true }))
        .pipe(gulp.dest('./app/css/'))
        .pipe(conecta.reload());
});
/* compilando stylus, concatenando y minificando todos los css */
gulp.task('css', function () {
	var filter=Filter('**/*.styl');
	gulp.src([path.inputStylus,path.inputCss])
		.pipe(newer(path.outputCss))
		.pipe(filter)
		.pipe(stylus({ use: [nib()], compress: true }))
		.pipe(filter.restore())
		.pipe(concat(path.nameCss))
		.pipe(minifyCSS())
		.pipe(gulp.dest(path.outputCss))
		.pipe(conecta.reload());
});
/* compilar sass */
gulp.task('sass', function () {
    gulp.src(path.inputSass)
        .pipe(sass())
        .pipe(minifyCSS())
        //.pipe(compressor())
        .pipe(rename(path.nameSass))
        .pipe(gulp.dest(path.ouputSass))
		/* Reload the browser CSS after every change */
		.pipe(reload({stream:true}));
});
/* Configuración de la tarea 'jsgeneral' */
gulp.task('jsgeneral', function () {
	gulp.src(path.inputJsGeneral)
		//.pipe(jshint())
		.pipe(concat(path.nameJsGeneral))
		.pipe(uglify())
		.pipe(gulp.dest(path.outputJsGeneral))
		//.on('error', gutil.log)
});
/* Comprimir frameworks */
gulp.task('jsframework', function () {
	gulp.src(path.inputJsFramework)
		//.pipe(jshint())
		.pipe(concat(path.nameJsFramework))
		.pipe(uglify())
		.pipe(gulp.dest(path.outputJsFramework))
		//.on('error', gutil.log)
});

/* Comprimir myApp */
gulp.task('jsMyapp', function () {
	gulp.src(path.inputMyapp)
		//.pipe(jshint())
		.pipe(concat(path.nameMyapp))
		.pipe(uglify())
		.pipe(gulp.dest(path.outputMyapp))
		//.on('error', gutil.log)
});
/* Copiar los utilitarios a produccion */
gulp.task('copyLibreria', function() {
	gulp.src(path.inputJsLibreria).pipe(uglify()).pipe(gulp.dest(path.outputJsLibreria));
});
/* optimizar img jpg,svg y png */
gulp.task('img', function() {
    gulp.src(path.inputImg)
		.pipe(newer(path.outputImg))
		.pipe(imagemin({
			progressive: true ,
			interlaced: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [
				pngquant({quality: '60-80', speed: 4})
				//jpegoptim({max: 70})
			]
		}))
		.pipe(gulp.dest(path.outputImg));
});
gulp.task('ver', function () {
	/* watch para stylus */
	gulp.watch(path.inputStylus, ['css','bsReload']);
	/* watch para css */
	gulp.watch(path.inputCss, ['css','bsReload']);
	/* watch para js */
	gulp.watch(path.inputJsGeneral, ['jsgeneral','bsReload']);
	/* watch para jsframework */
	gulp.watch(path.inputJsFramework, ['jsframework','bsReload']);
	/* watch para jsMyapp */
	gulp.watch(path.inputMyapp, ['jsMyapp','bsReload']);
	/* watch para sass */
	gulp.watch(path.inputSass, ['sass','css','bsReload']);
	/* watch para img */
	gulp.watch(path.inputImg, ['img','bsReload']);
	/* watch para js libreria */
	gulp.watch(path.inputJsLibreria, ['copyLibreria','bsReload']);
});

gulp.task('checa',function(){
	gulp.watch(path.inputHtml,['html']);
	gulp.watch(path.inputStylus, ['nib']);/*
	gulp.watch([path.inputJs,'./Gulpfile.js'], ['inject']);*/
});
gulp.task('default',['server','templates','checa']);
