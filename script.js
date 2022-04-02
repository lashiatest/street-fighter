const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({position: {x: 0, y: 0}, src: './assets/background.png'})

const shop = new Sprite({position: {x: 618, y: 128}, src: './assets/shop.png', scale: 2.75, frames: 6})

const player1 = new Fighter({position: {x: 0, y: 0}, velocity: {x: 0, y: 0}, offset: {x: 0, y: 0}, src: './assets/samuraiMack/Idle.png', scale: 2.5, frames: 8, offset: {x: 215, y: 156}, sprites: {idle: {src: './assets/samuraiMack/Idle.png', frames: 8}, run: {src: './assets/samuraiMack/Run.png', frames: 8 }, jump: {src: './assets/samuraiMack/Jump.png', frames: 2}, fall: {src: './assets/samuraiMack/Fall.png', frames: 2}, attack1: {src: './assets/samuraiMack/Attack1.png', frames: 6}, takeHit: {src: './assets/samuraiMack/Take Hit - white silhouette.png', frames: 4}, death: {src: './assets/samuraiMack/Death.png', frames: 6}}, attackBox: {offset: {x: 100, y: 50}, width: 158, height: 50}})

const player2 = new Fighter({position: {x: 400, y: 100}, velocity: {x: 0, y: 0}, color: 'blue', offset: {x: -50, y: 0}, src: './assets/kenji/Idle.png', scale: 2.5, frames: 4, offset: {x: 215, y: 169}, sprites: {idle: {src: './assets/kenji/Idle.png', frames: 4}, run: {src: './assets/kenji/Run.png', frames: 8}, jump: {src: './assets/kenji/Jump.png', frames: 2}, fall: {src: './assets/kenji/Fall.png', frames: 2}, attack1: {src: './assets/kenji/Attack1.png', frames: 4}, takeHit: {src: './assets/kenji/Take hit - white silhouette.png', frames: 3}, death: {src: './assets/kenji/Death.png', frames: 7}}, attackBox: {offset: {x: -170, y: 50}, width: 170, height: 50}})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  context.fillStyle = 'rgba(255, 255, 255, 0.15)'
  context.fillRect(0, 0, canvas.width, canvas.height,)
  player1.update()
  player2.update()

  player1.velocity.x = 0
  player2.velocity.x = 0

  if(keys.a.pressed && player1.lastKey === 'a') {
    player1.velocity.x = -5
    player1.switchSprite('run')
  } else if(keys.d.pressed && player1.lastKey === 'd') {
    player1.velocity.x = 5
    player1.switchSprite('run')
  } else {
    player1.switchSprite('idle')
  }

  if(player1.velocity.y < 0) {
    player1.switchSprite('jump')
  } else if(player1.velocity.y > 0) {
    player1.switchSprite('fall')
  }

  if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
    player2.velocity.x = -5
    player2.switchSprite('run')
  } else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
    player2.velocity.x = 5
    player2.switchSprite('run')
  } else {
    player2.switchSprite('idle')
  }

  if(player2.velocity.y < 0) {
    player2.switchSprite('jump')
  } else if(player2.velocity.y > 0) {
    player2.switchSprite('fall')
  }

  if(rectangularCollision({rectangle1: player1, rectangle2: player2}) && player1.isAttacking && player1.currentFrame === 4) {
    player2.takeHit()
    player1.isAttacking = false
    gsap.to('#player2_health', {width: player2.health + '%'})
  }

  if(player1.isAttacking && player1.currentFrame === 4) {
    player1.isAttacking = false
  }

  if(rectangularCollision({rectangle1: player2, rectangle2: player1}) && player2.isAttacking && player2.currentFrame === 2) {
    player1.takeHit()
    player2.isAttacking = false
    gsap.to('#player1_health', {width: player1.health + '%'})
  }

  if(player2.isAttacking && player2.currentFrame === 2) {
    player2.isAttacking = false
  }
  
  if(player1.health <= 0 || player2.health <= 0) {
    determineWinner({player1, player2, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if(!player1.dead) {
    switch(event.key) {
      case 'd':
        keys.d.pressed = true
        player1.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player1.lastKey = 'a'
        break
      case 'w':
        player1.velocity.y = -20
        break
      case ' ':
        player1.attack()
        break
    }
  }

  if(!player2.dead) {
    switch(event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player2.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player2.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        player2.velocity.y = -20
        break
      case 'ArrowDown':
        player2.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch(event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})