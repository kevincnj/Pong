


let player1c = document.querySelector(".player1");
let player2c = document.querySelector(".player2");
let touch1 = document.querySelector(".touch");

player1c.addEventListener("touchstart", start1handler);
player1c.addEventListener("touchmove", move1handler);
player1c.addEventListener("touchcancel", cancel1handler);
player1c.addEventListener("touchend", end1handler);

player2c.addEventListener("touchstart", start2handler);
player2c.addEventListener("touchmove", move2handler);
player2c.addEventListener("touchcancel", cancel2handler);
player2c.addEventListener("touchend", end2handler);

let context1 = document.querySelectorAll("canvas")[0];
console.log(context1.width);

function start1handler(event){
}
function move1handler(event){
    console.log("1");
    console.log(event);
    Body.setPosition(paddleComputer, {x: event.clientX, y: event.clientY});
    
}
function cancel1handler(event){

}
function end1handler(event){

}

function start2handler(event){

}
function move2handler(event){
    console.log("2");
    // console.log({x: event.clientX, y: event.clientY});
    Body.setPosition(paddlePlayer, {x: event.changedTouches[0].clientX-context1.offsetLeft, y: event.changedTouches[0].clientY-context1.offsetTop});
}
function cancel2handler(event){

}
function end2handler(event){
    
}