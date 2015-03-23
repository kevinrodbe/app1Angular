(function(){
	'use strict';
	/* creamos el módulo blog.services al cual le incluimos la dependencia ngResource*/
	angular.module('blog.services',['ngResource']);

	/* creamos 3 funciones, una para cada factory que apuntarán a una URL.
	La url base del servidor se pasará como constante */
	function Post($resource, BaseUrl){
		return $resource(BaseUrl + '/posts/:postId', {postId:'@_id'});
	}
	function Comment($resource, BaseUrl){
		return $resource(BaseUrl + '/comments/:commentId',{commentId:'@_id'});
	}
	function User($resource,BaseUrl){
		return $resource(BaseUrl+'/users/:userId',{userId:'@_id'});
	}
	/* asociamos las factorias al módulo creado, y creamos una constante BaseUrl que apunte a
	la url de la api */
	angular
		.module('blog.services')
		.constant('BaseUrl','http://jsonplaceholder.typicode.com')
		.factory('Post',Post)
		.factory('Comment',Comment)
		.factory('User',User);
})();
