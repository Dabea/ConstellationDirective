/**
 * Created by aanderson on 9/1/2015.
 */
/*
* side note when seperateing directives in to their own file since ver 1.3 they must now be their own module where in pervious versions they needed to be the same module
*   and you would add the directive name as a dependecny of main module. In 1.3+ You add the the new modle as the dependency
 */
angular.module('starModule', [] ).directive('canvasTest', function(){
    return{
        restrict: 'AC' ,
        templateUrl: 'angularTemplates/languageTemplate.html',

        link: function(scope,element, attrs){

            //var canvas =  document.getElementsByClassName('stars');  //<-- There must be a way in angualr to acces this element though I am not sure if it matters
            var canvasobj = angular.element($('.stars'));
            var canvas = canvasobj[0];
            console.log(canvas);
            var ctx = canvas.getContext('2d');
            var starCount = 150;
            var stars = [];
            var mouse = {};


            /*
             *Mouse tracking function
             */
            canvas.addEventListener('mousemove', track_mouse, false);

            function track_mouse(event) {
                var rect = canvas.getBoundingClientRect();
                mouse.x = event.clientX - rect.left;
                mouse.y = event.clientY - rect.top;
            }
            /*
             * construcs a Star Object
             */
            var star = function(){
                this.x = parseInt(Math.random() * canvas.width);
                this.y = parseInt(Math.random() * canvas.height);
                this.velocityX = (Math.random() * 0.4) -0.2;
                this.velocityY = (Math.random() * 0.4) - 0.2;
                this.radius = Math.random() * 0.5;

                this.alpha = (Math.random() * 0.4);
            };

            /*
             * creats all the stars and places them in the star  array
             */
            star.prototype.create = function(){
                for(var i = 0; starCount > i ; i++){
                    stars.push(new star());
                }
            };

            star.prototype.draw = function(){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 0, .85)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for(var i = 0; i < stars.length; i++) {
                    var currentStar = stars[i];
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + currentStar.alpha + ')';
                    ctx.arc(currentStar.x, currentStar.y, currentStar.radius, 0, Math.PI * 2, false);
                    ctx.stroke();
                }

            };

            star.prototype.update = function() {
                for(var i = 0; i < stars.length; i++) {
                    var currentStar = stars[i];

                    if(  currentStar.x >= 500 || currentStar.x <= 0 ){
                        currentStar.velocityX = currentStar.velocityX * -1;
                    }
                    if(  currentStar.y >= 500 || currentStar.y <= 0 ){
                        currentStar.velocityY = currentStar.velocityY * -1;
                    }
                    currentStar.x += currentStar.velocityX;
                    currentStar.y += currentStar.velocityY;
                }
            };
            /*
             * Sets up the connector line object
             */
            var starConnectingLines = function(){
                //This is the radius of the included stars from the mouse location
                var starCount = stars.length;
                var  constlationRadius = 50;
                var lineLength = 50;
                var color = $('#lineColor').val();
                if(color){
                    lineColor = color;
                }else{
                    var lineColor = '#FF1E1E';
                }


                // Not sure if it would be better to use centerStarIncrementor and outterStarIncrementor  with more meaningfull names or i and j just so it quicker to read
                for( var i = 0; i < starCount; i++ ){

                    for( var j = 0; j < starCount; j++ ){
                        // Not sure if this is just extra bloat or if this increases readability
                        var x1 = stars[i].x;
                        var x2 = stars[j].x;
                        var y1 = stars[i].y;
                        var y2 = stars[j].y;
                        var mouseX = mouse.x ;
                        var mouseY = mouse.y;
                        var starDistance = distanceFormula( x1, x2, y1, y2 );
                        var mouseRadius = distanceFormula( x1, mouseX, y1, mouseY );

                        if ((starDistance < lineLength)&& (mouseRadius < constlationRadius)  ){
                            ctx.beginPath();
                            ctx.strokeStyle = lineColor;
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            };
            /*
             * Math Helpter Functions
             */
            var distanceFormula = function( x1, x2, y1, y2 ){
                return Math.abs(Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ));
            };

            /*
             * Prepares eveything that the animation needs and starts the animation function
             */
            function initilize(){
                star.prototype.create();
                animate() ;
            }
            /*
             *  This is the animation loop
             */
            function animate(){
                //this will loop the animation
                requestAnimationFrame(animate);

                star.prototype.draw();
                starConnectingLines();
                star.prototype.update();
            }

            window.onload = initilize();
        }

    };
});

