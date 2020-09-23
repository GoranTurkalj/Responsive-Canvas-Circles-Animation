const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

// We create mouse object
let mouse = {
  x: undefined,
  y: undefined,
};

// Mogu odrediti i maxRadius i minRadius varijablu ovdje pa mi poslije koristi kod ograničavanja koliko krugovi mogu rasti i smanjivati se.

// Event Listener for Interaction with the Canvas

window.addEventListener("mousemove", (event) => {
  //Unutar event funkcije dodamo u mouse objekt vrijednosti koordinata koje mouse ima tijekom eventa
  mouse.x = event.x;
  mouse.y = event.y;
});

// Event listener for resizing the browser!

window.addEventListener("resize", function () {
  // we defined this at the beggining and now want to make sure to do it EVERY time the browser is resized!
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Meni se sviđa kod resizanja browsera krugovi se počnu "rasipati" ali ako zelimo da krugovi budu dinamički generirani kod svakog resizanja po cijelom ekranu treba nam init() funkcija koju zovemo ovdje a definiramo VANI

  init();
});

// Constructing circles with objects

function Circle(x, y, dx, dy, r, fillColor) {
  //koordinate passamo pri kreaciji objekta
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = r;
  this.fillColor = fillColor;
  this.minRadius = this.radius; // minimalni radius na koji se krug moze smanjiti je onaj koji je originalno random dodjeljen
  this.maxRadius = this.radius * 3; // maksimalni radius je najviše tri puta veci od originalnog radiusa.
  // metodu koristimo za drawing a circle
  this.draw = function () {
    c.beginPath();
    c.strokeStyle = "white";
    c.fillStyle = this.fillColor;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // nakon toga napravimo fill i stroke
    c.fill();
    c.stroke();
  };

  //ovu metodu koristim za updejtanje
  this.update = function () {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      // Change velocity to positive / negative depending on this condition
      this.dx = -this.dx;
    }

    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      // do the same thing for the y value
      this.dy = -this.dy;
    }

    this.x += this.dx; // we increment x by it's velocity
    this.y += this.dy; // we increment y by it's velocity

    // Interactivity part is here!
    // Ako pustimo samo ovako - svi krugovi DESNO od miša će rasti! - zato jer recimo ako nam je miš na x= 100 a krug ima this.x na 200, onda kad to dvoje oduzmemo dobijemo NEGATIVNIH 100, što je i dalje manje od 50!
    // stoga nam ovaj kondicional ne bi bio dovoljan sam po sebi jer bi nam svi krugovi desno od miša rasli
    // Moramo dodati && operator ovdje da ograničimo!
    // Dakle, dodajemo da razlika ne moze biti veća od -50, to znači da će nam sad na X axisu svi krugovi rasti samo u daljini od 50 px s obje strane
    //Ostaje problem s Y axisom gdje rastu i dalje posvuda pa i to treba prilagoditi.
    if (
      mouse.x - this.x < 100 &&
      mouse.x - this.x > -100 &&
      mouse.y - this.y < 100 &&
      mouse.y - this.y > -100 &&
      this.radius < this.maxRadius
    ) {
      this.radius += 10;
    }
    //U else if stavimo da ako je radius krugova veći od minRadiusa, radijus se smije smanjivati.
    else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    // Use this.draw() here
    this.draw();
  };
}

// Make an array of circles - make circle objects with for loop, store them in array, then run through the  array and animate all elements - circles.

let circleArray = [];

// init() funkcija koja pomaze da se krugovi dinamički generiraju svaki put kad resizamo window

function init() {
  // moram isprazniti circleArray da se ne spawna bezbroj krugova svaki put kad resizam
  circleArray = [];

  // U for loopu onda napravim 100 krugova i spremim ih u array.
  for (let num = 0; num < 100; num++) {
    // random boje

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let alpha = Math.random();

    //Ovo je color palette s color.adobe stranice
    // const colorArray = ["#F25CA2", "#0433BF", "#032CA6", "#021859","#0B9ED9"];
    // let randomColor = Math.floor(Math.random()*colorArray.length);
    // let color = colorArray[randomColor];
    //*******************

    //Ovo mi je za SKROZ random boje
    let color = `rgba(${r},${g},${b},${alpha})`;
    //******************

    // Priprema random radiusa

    let randR = Math.floor(Math.random() * 50) + 5;
    // random koordinate

    // VAŽNO: Moram onemogućiti da se circle spawna na rubovima!
    // Oduzmemo PROMJER kruga od innerWidth - to će spriječiti da krug zapne na DESNOJ strani!
    // Zatim, na kraj DODAM radius - to će spriječiti da zapne na lijevoj strani!

    let x = Math.random() * (innerWidth - 2 * randR) + randR;

    //Istu stvar i za y axis napravim.
    // Znači, oduzmem promjer kruga od innerHeight što garantira da dolje na dnu nikad neće se spawnati na rubu
    //Zatim, dodam radius - to mi garantira da krug nikad neće biti spawnan na vrhu na rubu - pošto se x odnosi na CENTAR krug - dodavanje radiusa znači da će ga odmaknuti taman :)
    let y = Math.random() * (innerHeight - 2 * randR) + randR;

    // random velocity

    let dx = (Math.random() - 0.5) * 8;
    let dy = (Math.random() - 0.5) * 8;

    let circle = new Circle(x, y, dx, dy, randR, color);

    circleArray.push(circle);
  }
}

//Zovemo init() jednom vani - da se generira sve prvi put, a inače će bit pozvana svaki put kad se resiza window!
init();

// U animate funkciji prođem kroz cijeli array i za svaki krug pozovem kroz for loop draw() i update()
function animate() {
  requestAnimationFrame(animate);
  // Cleaning canvas on every refresh!
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let element of circleArray) {
    element.update();
  }
}
//Zovem animate()
animate();
