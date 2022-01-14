//Jogo plinko para dois jogadores.
//Cada jogador clica uma vez para jogar uma bolinha.
//O jogo termina quando os dois jogadores jogam as bolas 5 vezes

var Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Bodies = Matter.Bodies;
var balls = [];
var plinkos = [];
var divisions = [];

var divisionHeight = 300;
var score1 = 0;
var score2 = 0;
var count = 0;
var player;
var jogoTerminou = false;
let vez = 1;
var baldesConfig = [
  { size: 80, score: 500 },
  { size: 80, score: 50 },
  { size: 80, score: 300 },
  { size: 80, score: 200 },
  { size: 80, score: 100 },
  { size: 80, score: 100 },
  { size: 80, score: 200 },
  { size: 80, score: 300 },
  { size: 80, score: 50 },
  { size: 80, score: 500 },
];
var baldes = [];
gameState = "start";

function setup() {
  createCanvas(800, 800);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(width / 2, height, width, 20);

  player = new Player(10, 10, 40, color(255, 0, 0))

  criarPlinkos();
  criarBaldes();
}

function draw() {
  background("black");

  criarPontuacaoPlayerTexto();
  criarPontosTextos();

  Engine.update(engine);
  ground.display();

  if (count >= 10 && jogoTerminou) {
    gameState = "end"
  }

  if (gameState == "end") {
    textSize(100);
    text("GameOver", 150, 250)
    textSize(50)
    fill("yellow")
    if (score1 > score2) {
      text("Jogador 1 venceu!", 180, 340)
    } else if (score1 < score2) {
      text("Jogador 2 venceu!", 180, 340)
    } else {
      text("Os jogadores empataram", 140, 340)
    }
  }

  setaPontuacao();



  desenharPlinkos();
  desenharBaldes();
  desenharBolas();

  desenharPlayer();
}

function desenharPlayer() {
  player.display();

  player.x = mouseX;
  player.y = 8;
}

function setaPontuacao() {
  let terminou = balls.length > 0;
  for (var g = 0; g < balls.length; g += 1) {
    const item = balls[g];
    if (item.balde == null && item.body.speed < 0.28 && item.body.position.y > 650) {
      for (var j = 0; j < baldes.length; j += 1) {
        const balde = baldes[j];
        if (item.body.position.x > balde.xStart && item.body.position.x < balde.xEnd) {
          item.balde = balde;
        }
      }
      if (item.jogador == 1) {
        score1 += item.balde.score;
      } else {
        score2 += item.balde.score;
      }
    }

    if (item.balde == null && item.body.position.y < height) {
      terminou = false;
    }
  }

  if (terminou)
    jogoTerminou = terminou;
}

function desenharPlinkos() {
  for (var i = 0; i < plinkos.length; i++) {
    plinkos[i].display();
  }
}

function desenharBolas() {
  for (var k = 0; k < balls.length; k++) {
    balls[k].display();
  }
}

function desenharBaldes() {
  for (var k = 0; k < divisions.length; k++) {
    divisions[k].display();
  }
}

function mousePressed() {
  if (count >= 10)
    return;

  if (gameState === "end")
    return;

  count++;

  let ballColor;
  let playerColor

  if (vez == 1) {
    ballColor = color(255, 0, 0)
    playerColor = color(0, 0, 255)
  } else {
    ballColor = color(0, 0, 255)
    playerColor = color(255, 0, 0)
  }

  player.color = playerColor

  const newBall = new Ball(mouseX, 10, 10, ballColor);
  newBall.jogador = vez
  balls.push(newBall);

  if (vez == 1) {
    vez = 2
  } else {
    vez = 1
  }
}

function criarPlinkos() {


  for (var j = 50; j <= width; j = j + 50) {
    plinkos.push(new Plinko(j, 75));
  }

  for (var j = 20; j <= width - 10; j = j + 50) {
    plinkos.push(new Plinko(j, 175));
  }

  for (var j = 50; j <= width; j = j + 50) {
    plinkos.push(new Plinko(j, 275));
  }

  for (var j = 20; j <= width - 10; j = j + 50) {
    plinkos.push(new Plinko(j, 375));
  }

}

function criarPontosTextos() {
  fill("white");
  textSize(35)
  for (var j = 0; j < baldes.length; j += 1) {
    const item = baldes[j];
    text(item.score, item.xStart + 20, 550)
  }
}

function criarPontuacaoPlayerTexto() {
  textSize(25)
  text("Score Jogador 1 : " + score1, 10, 30);
  text("Score Jogador 2 : " + score2, 540, 30);
  fill("white");
}

function criarBaldes() {

  for (var t = 0; t < baldesConfig.length; t = t + 1) {
    const item = baldesConfig[t]
    const dwidth = width / baldesConfig.length;
    const xStart = t * dwidth;
    const xEnd = (t + 1) * dwidth;
    criarBalde(xStart, xEnd, item.score)
  }
}

function criarDivisao(x) {
  const y = height - divisionHeight / 2;
  const width = 8;
  const dHeight = divisionHeight
  divisions.push(new Divisions(x, y, width, dHeight));
}

function criarBalde(xStart, xEnd, score) {
  const balde = {
    xStart: xStart,
    xEnd: xEnd,
    score: score
  };

  baldes.push(balde);

  criarDivisao(xStart);

  criarDivisao(xEnd);
}