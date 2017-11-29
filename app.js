firebase.initializeApp({
	databaseURL: ''
})

const db = firebase.database()
const ref = db.ref('clients')
const insert = document.getElementById('add')
let clients
let num = 1000 
let time
let counter = 0
let sound = new buzz.sound("sound/buzz", {
    formats: [ "mp3"]
})

insert.addEventListener('submit', (e) => { 	
  	e.preventDefault()  	
  	add( ref, input() )    
})

function input() {
	name = document.getElementById('name').value
	initials = document.getElementById("initials").value
  email = document.getElementById("email").value   
}

function add() {  
  document.getElementById('home').classList.toggle('displayNone')  
  getDB(1, 3)          
  return false
}

function addPlayer(num){
  let doc = {
    name,
    initials,
    email,
    score: num      
  }      
  db.ref('clients').push().set(doc)   
  document.getElementById("add").reset()    
  getDB(2, 10) 
}

function gameOver(){
  clearInterval(time)
  document.getElementById('numbers').classList.toggle('bounceIn')
  setTimeout( function(){
    addPlayer(num)
    document.getElementById('game').classList.toggle('displayNone')    
  }, 2000)
  getDB(2, 10)
}

function getDB(num, item){ 
  ref.on('value', data => { 
    let html = '<div class="display"><table><tr><th colspan="2">Score</th></tr>'
    let scores = data.val()
    let keys = Object.keys(scores)
    console.log(keys)
    let sortable = [];
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i]
      let initials = scores[k].initials
      let score = scores[k].score
      sortable.push([initials, score]);
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1];
    })
    let k = 0
    if(item > keys.length){
      item = keys.length
    }
    for(let i = 0; i < item; i++){
      let sort = sortable[i]
      let init = sort[0]
      let sco = sort[1]
      html += '<tr><td>' + (k+1) + ". " + init + '</td><td>' + sco +'</td></tr>'
      k++
    }
    html += '</tr></table></div>'
    let id = "history" + num
    document.getElementById(id).innerHTML = html     
  })
}  
  
getDB("", 10)

function start(){
  document.getElementById('pregame').classList.toggle('displayNone')
  document.getElementById('numbers').classList.toggle('displayNone')
  time = setInterval(function(){
      num-= 1
      if(num <= 0){
        document.removeEventListener('keydown', key, false)
        gameOver()
      }
      document.getElementById('num').innerHTML = num
    }, 100)
  document.addEventListener('keydown', key, false)

  function key(a){
    switch (a.which) {
      case 68:
        if(counter < 1){               
          changeScore()
          counter++ 
          setTimeout(function(){
            counter = 0
            document.getElementById('game').classList.toggle('gameError')
          }, 1000)
        }
        break      
      case 85:
        if(counter < 1){
          counter++
          document.removeEventListener('keydown', key, false)
          gameOver()          
        }            
        break
    }
  }

  function changeScore(){
    document.getElementById('game').classList.toggle('gameError')  
    sound.play()
     .fadeIn()
    num-= 100
    document.getElementById('num').innerHTML = num 
  }
}