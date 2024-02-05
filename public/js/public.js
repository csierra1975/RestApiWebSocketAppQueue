

async function getTicketsWorkingOn () {
    const tickets = await fetch(`http://localhost:3000/api/ticket/working-on`).then(res => res.json())
  
    console.log(tickets)

    let lblNumber = 1
    tickets.forEach(element => {
        
        const { number, handleAtDesk } = element

        const lblTicket = document.querySelector(`#lbl-ticket-0${lblNumber}`)
        const lblDesk = document.querySelector(`#lbl-desk-0${lblNumber}`)

        lblTicket.innerHTML = `Ticket ${number}`
        lblDesk.innerHTML = handleAtDesk

        lblNumber++

    });
}


function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
      const obj = JSON.parse(event.data)

      console.log({obj});
      
      if (obj.type === 'on-ticket-count-changed') {
        getTicketsWorkingOn()
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

getTicketsWorkingOn()