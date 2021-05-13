
//global variables
var gameWidth = 1280,
    gameHeight = 720,
    border = 30,
    gap = 260,
    paddleRadius = 35,
    puckRadius = 25;
compPts = 0,
    playerPts = 0,
    turn = "player",
    compSpeed = 4,
    puckSpeed = 15,
    shot = 0;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Pixi = Matter.RenderPixi,
    context = Render.context,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Mouse = Matter.Mouse
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

// create an engine
var engine = Engine.create();
var mouse = Mouse.create(document.body);

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: gameWidth,
        height: gameHeight,
        pixelRatio: 1,
        background: '#000000',
        wireframeBackground: '#000000',
        hasBounds: false,
        enabled: true,
        wireframes: false,
        showSleeping: false,
        showDebug: true,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
    }
});

//gravity
engine.world.gravity.x = 0;
engine.world.gravity.y = 0;

var mouseConstraint = MouseConstraint.create(engine, {
    element: render.canvas
});

//events
// Events.on(mouseConstraint, "mousemove", event_mousemove);
// Events.on(render, "beforeRender", computerMovement);
Events.on(engine, 'collisionStart', collision_detection);

//declare objects
var paddlePlayer = Bodies.circle(650, 200, paddleRadius, { restitution: 0.9, isStatic: true ,render:
    {
        strokeStyle: '#ffffff',
        sprite: {
                texture: './images/gracz.png'
        }
    }}, 40);
Body.setMass(paddlePlayer, 10);
paddlePlayer.label = "paddlePlayer";

var paddleComputer = Bodies.circle(100, 350, paddleRadius, { restitution: 0.9, isStatic: true ,
render:
    {
        strokeStyle: '#ffffff',
        sprite: {
                texture: './images/komp.png'
        }
    }}, 40);
paddleComputer.label = "paddleComputer";

var puck = Bodies.circle(600, 350, puckRadius, { friction: 0, restitution: 0.6, frictionAir: 0 , 
render:
    {
        strokeStyle: '#ffffff',
        sprite: {
                texture: './images/pilka.png'
        }
    }
});
Body.setMass(puck, 0.008);
Body.setInertia(puck, 1);


var leftBorderTop = Bodies.rectangle(border / 2, (gameHeight - gap) / 4 + border, border, (gameHeight - gap) / 2, { isStatic: true , render:
    {
	fillStyle: 'black',
    }});
var leftBorderBottom = Bodies.rectangle(border / 2, gameHeight - (gameHeight - gap) / 4 - border, border, (gameHeight - gap) / 2, { isStatic: true,render:
    {
	fillStyle: 'black',
    } });
var leftGap = Bodies.rectangle(border / 4, (gameHeight / 2), border / 2, gap - 2 * border, { isStatic: true ,render:
    {
	fillStyle: 'red',
    }});
leftGap.label = "bramkaKomputera";

var rightBorderTop = Bodies.rectangle(gameWidth - border / 2, (gameHeight - gap) / 4 + border, border, (gameHeight - gap) / 2, { isStatic: true,render:
    {
	fillStyle: 'black',
    } });
var rightBorderBottom = Bodies.rectangle(gameWidth - border / 2, gameHeight - (gameHeight - gap) / 4 - border, border, (gameHeight - gap) / 2, { isStatic: true,render:
    {
	fillStyle: 'black',
    } });
var rightGap = Bodies.rectangle(gameWidth - border / 4, (gameHeight / 2), border / 2, gap - 2 * border, { isStatic: true,render:
    {
	fillStyle: 'green',
    } });
rightGap.label = "bramkaGracza";

var topBorder = Bodies.rectangle(gameWidth / 2, border / 2, gameWidth, border, { isStatic: true, render:
    {
	fillStyle: 'black',
    } });
var bottomBorder = Bodies.rectangle(gameWidth / 2, gameHeight - border / 2, gameWidth, border, { isStatic: true, render:
    {
	fillStyle: 'black',
    } });

// add all of the bodies to the world
World.add(engine.world, [topBorder, bottomBorder, leftBorderTop, leftBorderBottom, rightBorderTop, rightBorderBottom, leftGap, rightGap]);
World.add(engine.world, [paddlePlayer, paddleComputer, puck]);

restartPositions();

// run the engine
Engine.run(engine);

//limit mouse movements
function event_mousemove(e) {
    if (e.mouse.position.x >= gameWidth / 2 && e.mouse.position.x <= gameWidth && e.mouse.position.y >= 0 && e.mouse.position.y <= gameHeight) {
        Body.setPosition(paddlePlayer, e.mouse.position);
    }
}

//computer AI
function computerMovement() {
    var compX = paddleComputer.position.x;
    var compY = paddleComputer.position.y;

    var rand = Math.floor((Math.random() * 4) + 1) - 3;
    //puck at player side. Go back to gap
    if (puck.position.x > gameWidth / 2) {
        if (compX > border + paddleRadius * 2)
            compX = compX - compSpeed / 2;
    }
    else {
        if (compX !== Math.round(puck.position.x)) {
            if (compX - puck.position.x < 70 && compY < 150)
                compX = compX + compSpeed + rand;
            else if (compX - puck.position.x < 70 && compY > gameHeight - 150)
                compX = compX + compSpeed + rand;
            else {
                if (compX > Math.round(puck.position.x) && compX > border + paddleRadius * 2) {
                    //console.log(border + paddleRadius*2);
                    if (compY >= 150)
                        compX = compX - compSpeed + rand;
                    else
                        compY = compY + 10;
                }

                if (compX < Math.round(puck.position.x) + rand && compX < gameWidth / 2 - paddleRadius * 2) {
                    compX = compX + compSpeed + rand;
                }
            }
        }
    }
    if (puck.position.x > gameWidth / 2) {
        if (compY < gameHeight / 2) {
            compY = compY + compSpeed;
        }
        else if (compY > gameHeight / 2) {
            compY = compY - compSpeed;
        }
    }
    else {
        if (compY !== Math.round(puck.positiony)) {
            if (compY > Math.round(puck.position.y) + rand && compY > border + paddleRadius * 2) {
                compY = compY - compSpeed + rand;
            }

            if (compY < Math.round(puck.position.y) && compY < gameHeight - border - paddleRadius * 2) {
                compY = compY + compSpeed + rand;
            }
        }
    }
    if (compX < 105 && compY < 105) {
        //compX = compX + 4* + rand;
        //compy = compY + 4* rand;
    }
    Body.setPosition(paddleComputer, { x: compX, y: compY });
}

//restart to initial positions
function restartPositions() {
    shot = 0;
    
    if (turn == "computer") {
        Body.setAngularVelocity(puck, 0.00);
        Body.setVelocity(puck, { x: 0, y: 0 });
        Body.setPosition(puck, { x: gameWidth * 0.20, y: gameHeight / 2 });
        Body.setPosition(paddleComputer, { x: gameWidth * 0.12, y: gameHeight / 2 });
    }
    else {
        Body.setAngularVelocity(puck, 0.00);
        Body.setVelocity(puck, { x: 0, y: 0 });
        Body.setPosition(puck, { x: gameWidth * 0.80, y: gameHeight / 2 });
        Body.setPosition(paddleComputer, { x: gameWidth * 0.12, y: gameHeight / 2 });
    }
    console.log(puck);
}

//collisions
function collision_detection(event) {
    var i, pair,
        length = event.pairs.length;
        console.log(shot);
    for (i = 0; i < length; i++) {
        pair = event.pairs[i]
        if (pair.bodyA.label === 'paddlePlayer' || pair.bodyB.label === 'paddlePlayer') {
            var vecNorm = Matter.Vector.normalise(Matter.Vector.sub(paddlePlayer.position, puck.position));
            shot = shot + 1;
            Body.setVelocity(puck, { x: vecNorm.x * -puckSpeed, y: vecNorm.y * -(puckSpeed + shot*0.3) });
        }

        if (pair.bodyA.label === 'paddleComputer' || pair.bodyB.label === 'paddleComputer') {
            var vecNorm = Matter.Vector.normalise(Matter.Vector.sub(paddleComputer.position, puck.position));
            shot = shot + 1;
            Body.setVelocity(puck, { x: vecNorm.x * -puckSpeed, y: vecNorm.y * -(puckSpeed + shot*0.3)});
        }
        if (pair.bodyA.label === 'bramkaGracza' || pair.bodyB.label === 'bramkaGracza') {
            console.log("gol dla komputera");
            compPts++;
            //console.log(compPts);
            turn = "player";
            restartPositions();
        }

        if (pair.bodyA.label === 'bramkaKomputera' || pair.bodyB.label === 'bramkaKomputera') {
            console.log("gol dla gracza");
            playerPts++;
            turn = "computer";
            restartPositions();

        }
	document.getElementById("results").textContent = compPts + " - " + playerPts;
    }
}

var renderOptions = render.options;
renderOptions.background = "./images/background.png";


Render.run(render);
