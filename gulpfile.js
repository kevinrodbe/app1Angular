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
	browserSync = require('browser-sync');
/* Configuración global */
var path={
	inputStylus:'./desarrollo/css/*.styl',
	inputCss:'./desarrollo/css/*.css',
	nameCss:'style.min.css',
	outputStylus:'./desarrollo/css/',
	outputCss:'./produccion/css/',

	inputSass:'./desarrollo/sass/**/*.scss',
	nameSass:'materialize.min.css',
	ouputSass:'./desarrollo/css/',

	inputJsGeneral:'./desarrollo/js/general/*.js',
	nameJsGeneral:'jsgeneral.min.js',
	outputJsGeneral:'./produccion/js/general/',

	inputMyapp:'./desarrollo/js/myapp/*.js',
	nameMyapp:'myapp.min.js',
	outputMyapp:'./produccion/js/myapp/',

	inputJsFramework:'./desarrollo/js/lib/framework/*.js',
	nameJsFramework:'framework.js',
	outputJsFramework:'./produccion/js/lib/framework/',

	inputJsLibreria:'./desarrollo/js/lib/utilitario/*.js',
	outputJsLibreria:'./produccion/js/lib/utilitario/',

	inputImg:'./desarrollo/img/*.{gif,png,jpg,svg,jpeg}',
	outputImg:'./produccion/img/'
};
var myFiles=[path.outputCss,path.ouputSass,path.outputJsGeneral,path.outputMyapp,path.outputJsFramework,path.outputJsLibreria];
/* Server: Variables de desarrollo
	var host = 'kevin.dhdinc.com',
    user = 'kevindhd',
    pass = 'kevrod100'
    port = '2082',
    remotePathp = '/public_html/guru/' */
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
        .pipe(gulp.dest(path.outputStylus));
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
		.pipe(gulp.dest(path.outputCss));
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
/*
js/source/alone.js
js/source/[asterisco].js
js/[Asterisco][Asterisco]/[Asterisco].js coincide con los archivos que terminen en .js dentro de la carpeta js y dentro de todas sus sub-carpetas
!js/source/3.js Excluye especificamente el archivo 3.js.
static/*.+(js|css) coincide con los archivos que terminen en .js ó .css
/* 
Se define la tarea estaticos, la cual corra otras 3 tareas
gulp.task('estaticos', ['imagenes', 'css', 'js']);
*/

/*
Ejecutar la tarea css cuando la tarea imagenes haya terminado
gulp.task('css', ['imagenes'], function () {...});
*/

/*
definimos una tarea por defecto
gulp.task('default', function () {...});
o que una tarea por defecto sea una lista de tareas
gulp.task('default', ['css', 'js']);
para ejecutar ponemos en la terminal: gulp
*/

/*Cada vez que se modifique un file dentro de source se ejecutará la tarea js*/
//gulp.watch('js/source/*.js', ['js']);
 /*gulp.watch('js/source/*.js', function(){
 aquí va el cod a ejecutar, o también se podría ejecutar una tarea mediante el metodo gulp.start('miTarea')}); */


