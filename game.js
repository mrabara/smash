const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let remainingBall = 3;
const brickRowCount = 5;
const brickColumnCount = 12;
const hitBrick = new Audio('./sound/break_brick.mp3');
const hitPaddle = new Audio('./sound/paddle_sound.mp3');
const hitBottom = new Audio('./sound/buzz-sound-effect.mp3');
const gameOverSound = new Audio('./sound/game_over.mp3');
const gameWinSound = new Audio('./sound/Stage Win.mp3');
let onPlay = true;


//Create paddle properties
const paddle = {
    x: canvas.width / 2 - 12.5,
    y: canvas.height  - 8,
    w: 25,
    h: 3,
    speed: 3,
    x_direction: 0
}

// Create ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 11,
    size: 3,
    speed: 1,
    x_direction: 1.75,
    y_direction: -1.75,
}


//Create bricks properties
const brickProps = {
    w: 20,
    h: 5,
    padding: 3,
    offsetX: 15,
    offsetY: 25,
    visible: true
}


//Create bricks
const bricks = [];

for (let i = 0; i < brickColumnCount; i++){
    bricks[i] = [];
    for(let j = 0; j < brickRowCount; j++){
        const x = i * (brickProps.w + brickProps.padding) + brickProps.offsetX;
        const y = j * (brickProps.h + brickProps.padding) + brickProps.offsetY;
        bricks[i][j] = {x, y, ...brickProps}
    }
}

//Draw ball on canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y,ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(55, 255, 255)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.stroke();
    ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'rgba(55, 255, 255)';
    ctx.border = 
    ctx.fill();
    ctx.closePath();
}


function drawReady(){
    ctx.font = '15px Arial';
    ctx.fillText(`Ready!`, (canvas.width / 2) - 30 , 100);    
    setTimeout(function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000) 
}

//Draw score on canvas
function drawScore(){
    ctx.font = '10px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 50, 10);   
}


//Draw remaining ball on canvas
function drawRemainingBall(){
    ctx.font = '10px Arial';
    ctx.fillText(`Ball: ${remainingBall}`, canvas.width - 100, 10);   
}

//Draw You win on canvas
function drawYouWin(){
    ctx.font = '15px Arial';
    ctx.fillText(`You Win!`, (canvas.width / 2) - 30 , 100);     
}

//Draw game over on canvas
function drawGameOver(){
    ctx.font = '15px Arial';
    ctx.fillText(`Game Over!`, (canvas.width / 2) - 40 , 100);   
}


//Draw bricks on canvas
function drawBricks(){
    bricks.forEach(column =>{
        column.forEach(brick =>{
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? 'rgba(55, 255, 255, 0.5)' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}


//Move the paddle
function movePaddle(){
    paddle.x += paddle.x_direction;

    //wall detection
    if((paddle.x + paddle.w) > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x <= 0){
        paddle.x = 0;
    }
}


//Move ball on canvas
function moveBall(){
    ball.x += ball.x_direction;
    ball.y += ball.y_direction;


    //Wall collision  on sides
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.x_direction *= -1; 
    }

    //Wall collision on top and bottom
    if(ball.y - ball.size < 0){
        ball.y_direction *= -1;
    }


    //For Paddle Collision
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        ball.y_direction = -ball.speed;
        hitPaddle.play();
    }

    //Brick collision
    bricks.forEach(column =>{
        column.forEach(brick =>{
            if(brick.visible){
                if(
                    ball.x - ball.size > brick.x && //check brick on left of ball
                    ball.x + ball.size < brick.x + brick.w && //check brick on right of ball 
                    ball.y + ball.size > brick.y && //check brick on top of ball
                    ball.y - ball.size < brick.y + brick.h // check brick below the ball
                ){
                    ball.y_direction *= -1;
                    hitBrick.play();
                    brick.visible = false;
                    score++;
                }
            }
        });
    });

    //loose a ball if hit the bottom 
    if(ball.y + ball.size > canvas.height){
        resetBall()
    }

}

//reset ball and paddle
function resetBall(){
    hitBottom.play();
    remainingBall--;
    ball.y = paddle.y - ball.size;
    ball.x = paddle.x + (paddle.w / 2);
}

//Game Status
function gameStatus(){
    if(score === 60){
        gameWinSound.play();
        resetBricks();
        drawYouWin();
        cancelAnimationFrame(update());
       
    }else if(remainingBall === 0){
        gameOverSound.play();
        resetBricks();
        drawGameOver();
        cancelAnimationFrame(update());
        
    }
}


 //reset bricks 
function resetBricks(){
    bricks.forEach(column =>{
        column.forEach(brick =>{
            brick.visible = true;
        });
    });
    ball.y = paddle.y - ball.size;
    ball.x = paddle.x + (paddle.w / 2);
    paddle.x = canvas.width / 2 - 12.5,
    paddle.y = canvas.height  - 8,
    paddle.x_direction = 0;
}


//Update canvas using request animation frame
function update(){
    //Draw all
    draw();

    //call moveBall function
    moveBall();

    //call movePaddle function
    movePaddle();

    //Determine game status (win/lose)
    if(gameStatus()) return; 
    
    // update animation frame
    requestAnimationFrame(update);
}



//keydown event
function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.x_direction = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.x_direction = -paddle.speed;
    }
}


//keyup event
function keyUp(e){
    if(
        e.key === 'Right' || 
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ){
        paddle.x_direction = 0;
    }
}

//keyboard events handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener('keydown', startGame);

//Call all draw function here
function draw(){
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawRemainingBall();
    drawScore();
    drawBricks();
  
    
}

draw();


function startGame(e){
    if(e.key === 'Enter'){
        if(onPlay){
            drawReady();
            setTimeout(function (){
                update();
            }, 3000);  
            onPlay = false;    
        }else{
           window.location.reload(function(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                onPlay = true;
           });
        }
    }
}   







