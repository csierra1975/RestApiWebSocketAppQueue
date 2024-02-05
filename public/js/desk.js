
const lblPending = document.querySelector('#lbl-pending')
const deskHeader = document.querySelector('h1') // trae el primero
const noMoreAlert = document.querySelector('.alert')
const workingOnTicketLbl = document.querySelector('small')

const workingOnTicketBtn = document.querySelector('#btn-draw')
const workingOnTicketDone = document.querySelector('#btn-done')

let workingTicket = null
const searchParam = new URLSearchParams( window.location.search)

if (!searchParam.has('escritorio')) {

  window.location = 'index.html'
  throw new Error('Escritorio es requerido')
}

const deskNumber = searchParam.get('escritorio')

deskHeader.innerText = `Escritorio ${deskNumber}`

workingOnTicketBtn.addEventListener('click', getTicket)
workingOnTicketDone.addEventListener('click', finishTicket)

async function getTicket () {
  const draw = await fetch(`http://localhost:3000/api/ticket/draw/${deskNumber}`).then(res => res.json())

  workingTicket = draw.ticket
  workingOnTicketLbl.innerText = workingTicket.number
 
}

async function finishTicket() {
  if (workingTicket) {
    console.log(workingTicket)
    const done = await fetch(`http://localhost:3000/api/ticket/done/${workingTicket.id}`, {method:'PUT'}).then(res => res.json())

    if (done.status === 'ok') {
      workingTicket = null
      workingOnTicketLbl.innerText = 'Nobody'
    }
  }
}

async function loadInitialCount() {
    const pendingTickets = await fetch('http://localhost:3000/api/ticket/pending').then(res => res.json())
    checkTicketCount(pendingTickets.length)
}

function checkTicketCount( currentCount = 0) {

  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none')
    workingOnTicketBtn.classList.add('disabled')
  }
  else {
    noMoreAlert.classList.add('d-none')
    workingOnTicketBtn.classList.remove('disabled')
  }
  
  lblPending.innerHTML = currentCount
}

function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
      const obj = JSON.parse(event.data)

      console.log({obj});
      
      if (obj.type === 'on-ticket-count-changed') {
        checkTicketCount(obj.payload)
      }

    };
  
    socket.onclose = ( event ) => {
      console.log( 'Connection closed' );
      setTimeout( () => {
        console.log( 'retrying to connect' );
        connectToWebSockets();
      }, 1500 );
  
    };
  
    socket.onopen = ( event ) => {
      console.log( 'Connected' );
    };
  
  }
  
connectToWebSockets();

loadInitialCount()