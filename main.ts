import { new_oklab, new_rgb, oklab_to_rgb, range } from 'oklab.ts/dist/oklab'

let canvas = document.createElement('canvas')

let scale = 4
let force_magnitude = 0.2
let friction_rate = 0.99
let target_missile_count = 8

function adjust_target_missile_count(event: MouseEvent) {
  let x = event.clientX / scale
  let y = event.clientY / scale
  debugger
  if (canvas.width >= canvas.height) {
    // width screen
    if (x < canvas.width / 2) {
      // left side, reduce target
      target_missile_count /= 2
    } else {
      // right side, increase target
      target_missile_count *= 2
    }
  } else {
    // tall screen
    if (y < canvas.height / 2) {
      // top side, reduce target
      target_missile_count /= 2
    } else {
      // bottom side, increase target
      target_missile_count *= 2
    }
  }
  if (target_missile_count < 2) {
    target_missile_count = 2
  }
}

canvas.addEventListener('click', adjust_target_missile_count)

function resize() {
  let rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width / scale)
  canvas.height = Math.round(rect.height / scale)
}
window.addEventListener('resize', resize)

let context = canvas.getContext('2d')!

let rgb = new_rgb()
let oklab = new_oklab()

type Circle = {
  x: number
  y: number
  radius: number
  color: string
}

type Base = Circle

type Missile = Circle & {
  vx: number
  vy: number
}

let bases: Base[] = []
let missiles: Missile[] = []

let base_color = '#c0c0c0'
let missile_color = 'white'

function init() {
  let x = 0
  let y = 0
  let radius = 0
  bases.push({ x, y, radius, color: base_color })
  bases.push({ x, y, radius, color: base_color })
}

let last_time = performance.now()
function loop() {
  let now = performance.now()
  let t = now - last_time

  if (t > 0) {
    tick()
  }

  requestAnimationFrame(loop)
}

function tick() {
  if (canvas.width >= canvas.height) {
    // desktop, width screen
    let padding = canvas.width / 5
    let radius = padding / 8
    let mid_y = canvas.height / 2

    // left base
    bases[0].x = padding
    bases[0].y = mid_y
    bases[0].radius = radius

    // right base
    bases[1].x = canvas.width - padding
    bases[1].y = mid_y
    bases[1].radius = radius

    if (missiles.length < target_missile_count) {
      // left missile
      add_missile(bases[0], { x: -1, y: random_direction() })

      // right missile
      add_missile(bases[1], { x: 1, y: random_direction() })
    }
  } else {
    // mobile, tall screen
    let padding = canvas.height / 5
    let radius = padding / 8
    let mid_x = canvas.width / 2

    // top base
    bases[0].x = mid_x
    bases[0].y = padding
    bases[0].radius = radius

    // bottom base
    bases[1].x = mid_x
    bases[1].y = canvas.height - padding
    bases[1].radius = radius

    if (missiles.length < target_missile_count) {
      // top missile
      add_missile(bases[0], { x: random_direction(), y: -1 })

      // bottom missile
      add_missile(bases[1], { x: random_direction(), y: 1 })
    }
  }

  function add_missile(base: Base, direction: { x: number; y: number }) {
    let missile_radius = base.radius / 2
    let missile_speed = missile_radius * 1

    missiles.push({
      x: base.x,
      y: base.y,
      radius: missile_radius,
      color: missile_color,
      vx: direction.x * missile_speed,
      vy: direction.y * missile_speed,
    })
  }

  // move missiles
  for (let i = 0; i < missiles.length; i += 2) {
    let a = missiles[i]
    let b = missiles[i + 1]

    /* apply friction */
    a.vx *= friction_rate
    a.vy *= friction_rate
    b.vx *= friction_rate
    b.vy *= friction_rate

    /* calculate force */

    let distance_x = b.x - a.x
    let distance_y = b.y - a.y
    let distance = calc_distance(distance_x, distance_y)

    if (distance < a.radius + b.radius) {
      // collision
      missiles.splice(i, 2)
      i -= 2
      continue
    }

    let force = normalize(distance_x, distance_y)

    /* calculate new velocity */

    a.vx = a.vx + force.x * force_magnitude
    a.vy = a.vy + force.y * force_magnitude

    b.vx = b.vx - force.x * force_magnitude
    b.vy = b.vy - force.y * force_magnitude

    /* limit speed */

    let max_speed = a.radius * 0.9
    let a_speed = calc_distance(a.vx, a.vy)
    let b_speed = calc_distance(b.vx, b.vy)
    if (a_speed > max_speed) {
      a.vx = (a.vx / a_speed) * max_speed
      a.vy = (a.vy / a_speed) * max_speed
    }
    if (b_speed > max_speed) {
      b.vx = (b.vx / b_speed) * max_speed
      b.vy = (b.vy / b_speed) * max_speed
    }

    /* update position */

    a.x += a.vx
    a.y += a.vy

    b.x += b.vx
    b.y += b.vy
  }

  // check collisions
  draw()
}

// -1 to +1 (real number)
function random_direction() {
  return Math.random() * 2 - 1
}

function normalize(x: number, y: number) {
  let length = Math.sqrt(x * x + y * y)
  return { x: x / length, y: y / length }
}

function calc_distance(dx: number, dy: number) {
  return Math.sqrt(dx * dx + dy * dy)
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let base of bases) {
    draw_circle(base)
  }

  for (let missile of missiles) {
    draw_circle(missile)
  }
}

function draw_circle(circle: Circle) {
  context.fillStyle = circle.color
  context.beginPath()
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
  context.fill()
}

document.body.appendChild(canvas)

requestAnimationFrame(() => {
  resize()
  init()
  loop()
})

Object.assign(window, {
  canvas,
  context,
  scale,
  tick,
})
