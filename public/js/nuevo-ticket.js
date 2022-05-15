console.log('Nuevo Ticket HTML');

//*Referencias HTML
const lblTicket = document.querySelector('#lblNuevoTicket');
const btnCrear  = document.querySelector('button');

const socket = io();

document.addEventListener('DOMContentLoaded',()=>{
    socket.on('utlimo-ticket',(ultimoticket)=>{
        lblTicket.innerText = 'Ticket ' + ultimoticket;
    });
});


socket.on('connect', () => {
    // console.log('Conectado');
    btnCrear.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnCrear.disabled = true;

});





btnCrear.addEventListener( 'click', () => {

    socket.emit('siguiente-ticket',null,(ticket)=>{
        lblTicket.innerText = ticket;
    });

});