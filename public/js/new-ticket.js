

console.log('Nuevo Ticket HTML');

const label = document.getElementById('lbl-new-ticket')
const button = document.querySelector('button')

button.addEventListener( 'click', (e) => {

    fetch('http://localhost:3000/api/ticket', { method: 'POST'})
    .then( data => {

        if (data.ok) { 
             data.json().then(res => {
                label.innerText = `${res.number}`
             })
        }
        else {
            label.innerText = 'There is an issue'
        }
    })

})

fetch('http://localhost:3000/api/ticket/last')
.then( data => {

    if (data.ok) { 
         data.json().then(res => label.innerText = `${res}`)
    }
    else {
        label.innerText = 'There is an issue'
    }
})


