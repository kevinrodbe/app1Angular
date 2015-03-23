(function(){
	'use strict';
	/* configuramos el módulo "blog" al que le incluimos la dependencia "ngRoute" de
	la lib angular-route*/
	/* los controladores (PostListController, PostdetailController, etc) será declaradas en un
	fichero y módulo aparte, por lo que para hacer uso de ellas en este archivo, debemos incluirlo
	como dependencia al declarar el módulo como lo hicimos con ngRoute */
	angular.module('blog',['ngRoute','blog.controllers','blog.templates'])
		.config(config);
	/**/
	function config($locationProvider,$routeProvider){
		/* html5Mode(true) permite que las urls no lleven # al inicio, ya que por defecto angular
		lo utiliza */
		$locationProvider.html5Mode(true);
		/* el atributo controllerAs nos permite usar variables de controlador dentro de la
		plantilla html sin necesidad de usar la directiva $scope . es como un alias */

		$routeProvider
			.when('/',{
				templateUrl:'views/post-list.tpl.html',
				controller:'PostListController',
				controllerAs:'postlist'
			})
			.when('/post/:postId',{
				templateUrl: 'views/post-detail.tpl.html',
				controller:'PostDetailController',
				controllerAs:'postdetail'
			})
			.when('/new',{
				templateUrl:'views/post-create.tpl.html',
				controller:'PostCreateController',
				controllerAs:'postcreate'
			});

	}

})();
