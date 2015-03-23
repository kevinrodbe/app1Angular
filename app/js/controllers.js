(function(){
	/* creamos el módulo blog.controlles incluyéndole la dependencia blog.services */
	angular.module('blog.controllers',['blog.services'])
		.controller('PostListController',PostListController)
		.controller('PostCreateController',PostCreateController)
		.controller('PostDetailController',PostDetailController)
	/* controlador para listar todos las "entradas del blog" */
	function PostListController(Post){
		/* hacemos una llamada ajax a la uri (placeholderbla bla bla) y el resultado
		se almacena en la variable "posts*/
		this.posts=Post.query();
	}
	/* controlador para crear una nueva entrada */
	function PostCreateController(Post){
		var self=this;
		this.create=function(){
			/* gacias al recurso Post podemos usar el método save(), que se encarga de
			realizar una petición POST a la API, para luego almacenarla*/
			Post.save(self.post);
		};
	}
	/* controlador para ver el contenido de una "entrada del blog" */
	function PostDetailController($routeParams, Post, Comment, User){
		/* para guardar la referencia */

		this.post={};
		this.comments={};
		this.user={};
var self=this;
		Post.query({id:$routeParams.postId})
		.$promise.then(
			/* success */
			function (data){
				self.post=data[0];
				self.user=User.query({id:self.user.userId});
			},
			/* error */
			function (error){
				console.log(error);
			}
		);

		this.comments=Comment.query({postId:$routeParams.postId});
	}


})();
