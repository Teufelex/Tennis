"use strict"
class Field {
  constructor() {
    this.width = 300;
    this.height = 200;
    this.racketW = 10;
    this.racketH = 50;
    this.ballSize = 20;
    this.ballPosX = 0;
    this.ballPosY = 0;
    this.ballSpeedX = 1;
    this.ballSpeedY = 1;
    this.racketSpeed = 1;
    this.racketSpeedL = 0;
    this.racketSpeedR = 0;
    this.racketLPos = 0;
    this.racketRPos = 0;
    this.windowH = document.documentElement.offsetHeight;
    this.windowW = document.documentElement.offsetWidth;
    this.field = document.getElementById("cvs").getContext("2d");
    this.button = document.createElement("button");
    this.score = document.createElement("span");
    this.scoreL = 0;
    this.scoreR = 0;
    this.timer = 0;
    this.count = 0;
    this.end = false;
  }

  createField() {
    let cvs = document.getElementById("cvs");
    cvs.width = this.width;
    cvs.height = this.height;
    cvs.style.position = "absolute";
    cvs.style.top = (this.windowH - this.height) / 2 + "px";
    cvs.style.left = (this.windowW - this.width) / 2 + "px";

    this.createRacket();
    this.restart();
    this.addBall();
    this.createBtn();
    this.addScore();

    window.addEventListener("keydown", this.control.bind(this));
    window.addEventListener("keyup", this.controlOff.bind(this));
  }

  addScore() {
    this.score.classList.add("score");
    this.count = `${this.scoreL} : ${this.scoreR}`;
    this.score.innerHTML = this.count;
    this.score.style.position = "absolute";
    this.score.style.bottom = `${this.windowH - ((this.windowH - this.height) / 2)}` + "px";
    this.score.style.right = `${(this.windowW - this.width) / 2}` + "px";
    this.score.style.fontSize = "2rem";
    document.body.appendChild(this.score);
  }

  updateScore() {
    let score = document.querySelector(".score");
    this.count = `${this.scoreL} : ${this.scoreR}`;
    score.innerHTML = `${this.count}`;
  }

  createBtn() {
    this.button.classList.add("field__btn");
    this.button.innerHTML = "Start";
    this.button.style.position = "absolute";
    this.button.style.zIndex = "1";
    this.button.style.fontSize = "1rem";
    this.button.style.padding = "5px 10px";
    this.button.style.bottom = `${this.windowH - ((this.windowH - this.height) / 2)}` + "px";
    this.button.style.left = `${(this.windowW - this.width) / 2}` + "px";

    this.button.addEventListener("click", this.start.bind(this));
    document.body.appendChild(this.button);
  }

  createRacket() {
    let racketStartY = (this.height - this.racketH) / 2;
    this.racketLPos = racketStartY;
    this.racketRPos = this.racketLPos;

    this.drawRacket(this.racketLPos, this.racketRPos);
  }

  drawRacket(posL, posR) {
    let racketRStartX = this.width - this.racketW;

    this.field.fillStyle = "green";
    this.field.fillRect(0, posL, this.racketW, this.racketH);

    this.field.fillStyle = "violet";
    this.field.fillRect(racketRStartX, posR, this.racketW, this.racketH);
  }

  addBall() {
    this.field.strokeStyle = "red";
    this.field.fillStyle = "red";
    this.field.beginPath();    
    this.field.arc(this.ballPosX, this.ballPosY, this.ballSize / 2, 0, Math.PI*2, false);
    this.field.stroke();
    this.field.fill();
  }

  restart() {
    this.ballPosX = this.width / 2;
    this.ballPosY = this.height / 2;
  }

  runBall() {
    let maxW = this.width - this.ballSize / 2,
        minW = this.ballSize / 2,
        maxH = this.height - this.ballSize / 2,
        minH = this.ballSize / 2;
    
    this.ballPosX += this.ballSpeedX;
    this.ballPosY += this.ballSpeedY;

    this.checkRacket(maxW, minW);

    if (this.ballPosY > maxH || this.ballPosY < minH) 
      this.ballSpeedY = -this.ballSpeedY;

    if (this.ballPosX > maxW || this.ballPosX < minW) {
      (this.ballPosX > maxW) ? this.scoreL++ : this.scoreR++;
      this.end = true;
      this.updateScore();
    }
  }

  checkRacket(max, min) {
    let racketLStart = this.racketLPos; 
    let racketLEnd = this.racketLPos + this.racketH;
    let racketRStart = this.racketRPos;
    let racketREnd = this.racketRPos + this.racketH;
    let maxW = max - this.racketW,
        minW = min + this.racketW;

    if (this.ballPosX > maxW) {
      if (this.ballPosY > racketRStart && 
          this.ballPosY < racketREnd) {
        this.ballSpeedX = -this.ballSpeedX;
        this.count++;
      }
    }

    if (this.ballPosX < minW) {
      if (this.ballPosY > racketLStart && 
          this.ballPosY < racketLEnd) {
        this.ballSpeedX = -this.ballSpeedX;
        this.count++;
      }
    }
  }
 
  start() {
    this.restart();
    this.end = false;
    this.timer = requestAnimationFrame(this.game.bind(this));
  }

  control(e) {
    e = e || window.event;
    e.preventDefault();
    let maxPos = this.height - this.racketH;

    if (e.shiftKey && this.racketLPos > 0 || 
        e.code === "ShiftLeft" && this.racketLPos > 0) 
      this.racketSpeedL = -this.racketSpeed;
    if (e.ctrlKey && this.racketLPos < maxPos || 
        e.code === "ControlLeft" && this.racketLPos < maxPos) 
      this.racketSpeedL = this.racketSpeed;
    if (e.code === "ArrowUp" && this.racketRPos > 0)
      this.racketSpeedR = -this.racketSpeed; 
    if (e.code === "ArrowDown" && this.racketRPos < maxPos) 
      this.racketSpeedR = this.racketSpeed;
  }

  controlOff(e) {
    this.racketSpeedL = 0;
    this.racketSpeedR = 0;
  }

  moveRacket() {
    let maxPos = this.height - this.racketH;

    this.racketLPos += this.racketSpeedL;
    this.racketRPos += this.racketSpeedR;

    if (this.racketLPos <= 0 || this.racketLPos >= maxPos)    this.racketSpeedL = 0;

    if (this.racketRPos <= 0 || this.racketRPos >= maxPos)    this.racketSpeedR = 0;
  }

  game() {
    this.runBall();
    this.moveRacket();
    this.field.clearRect(0, 0, this.width, this.height);
    this.drawRacket(this.racketLPos, this.racketRPos);
    this.addBall();
    this.timer = (this.end) ? 
    cancelAnimationFrame(this.timer) : 
    requestAnimationFrame(this.game.bind(this));
  }
}

const FIELD = new Field();
FIELD.createField();