const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {

  const agents = [];
  for (let i = 0; i < 150; i++) {
    const x = random.range(10, width - 10);
    const y = random.range(10, height - 10);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];
        drawLine(agent, other, context);      
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    })    
  };
};

canvasSketch(sketch, settings);

const drawLine = (agentOne, agentTwo, context) => {
  
    const dist = agentOne.pos.getDistance(agentTwo.pos);

    if (dist < 200) {
      context.lineWidth = math.mapRange(dist, 0, 200, 1, .0001)
      context.beginPath();
      context.moveTo(agentOne.pos.x, agentOne.pos.y);
      context.lineTo(agentTwo.pos.x, agentTwo.pos.y);
      context.stroke();
  }
}


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-0.25, 0.25), random.range(-0.25, 0.25));
    this.radius = random.range(0);
  }

  bounce(width, height) {
    if ((this.pos.x <= 12) || (this.pos.x >= width - 12)) this.vel.x *= random.range(-0.2, -1.25);
    if ((this.pos.y <= 12) || (this.pos.y >= height - 12)) this.vel.y *= random.range(-0.2, -1.25);
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 1;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}