const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  lineDist: 200,
  agentAmt: 250,
  velocity: 0.25,
  radius: 0,
}

function createAgents (agents, agentAmt, width, height) {
  for (let i = 0; i < agentAmt; i++) {
    const x = random.range(20, width - 20);
    const y = random.range(20, height - 20);

    agents.push(new Agent(x, y));
  }
  return agents;
}

const sketch = ({ context, width, height }) => {

  // manager.render()
  
  const agentArr = [];
  const agents = createAgents(agentArr, params.agentAmt, width, height);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    updateAgentAmount(agentArr, params.agentAmt, width, height);
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

const updateAgentAmount = (agents, agentAmt, width, height) => {
  let current = agents.length

  if (current !== agentAmt) {
    if (current < agentAmt) {
      return createAgents(agents, agentAmt - current, width, height)
    } else if (current > agentAmt) {
      for (let i = 0; i <= current - agentAmt; i++) {
        agents.pop()
      }
    }
  }
  return agents;
}

const drawLine = (agentOne, agentTwo, context) => {
  
    const dist = agentOne.pos.getDistance(agentTwo.pos);

    if (dist < params.lineDist) {
      context.lineWidth = math.mapRange(dist, 0, params.lineDist, 1, .0001)
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
    this.vel = new Vector(random.range(-1 * params.velocity, params.velocity), random.range(-1 * params.velocity, params.velocity));
    this.radius = params.radius;
  }

  bounce(width, height) {
    if ((this.pos.x <= 10) || (this.pos.x >= width - 10)) this.vel.x *= random.range(-0.4, -1.45);
    if ((this.pos.y <= 10) || (this.pos.y >= height - 10)) this.vel.y *= random.range(-0.4, -1.45);
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
    context.arc(0, 0, params.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Untitled 1' });
  folder.addInput(params, 'radius', {min: 0, max: 6});
  folder.addInput(params, 'lineDist', {min: 10, max: 500});
  folder.addInput(params, 'velocity', {min: 0.001, max: 30});

  agentNum = folder.addInput(params, 'agentAmt', {min: 20, max: 1000, step: 1})

};


createPane();

const start = async () => {
  manager = await canvasSketch(sketch, settings);
}

start();