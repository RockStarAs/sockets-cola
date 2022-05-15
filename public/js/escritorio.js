//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const small = document.querySelector('small');
const btnAtender = document.querySelector('button');
const sinTickets = document.querySelector('#sin-tickets');
const lblPendientes = document.querySelector('#lblPendientes');
sinTickets.style.display = 'none';
console.log('Escritorio HTML');

const searchParams = new URLSearchParams(window.location.search);

if(! searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    //btnCrear.disabled = true;
    btnAtender.disabled = true;
});

btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, (respuesta)=>{
        if(respuesta.ok){
            small.innerText = 'Ticket ' + respuesta.ticket.numero;
            //console.log(respuesta);
            //lblPendientes.innerText = respuesta.ticketsPendientes;
            sinTickets.style.display = 'none';
        }else{
            small.innerText = 'Nadie';
            sinTickets.style.display = 'block';
            //lblPendientes.innerText = 0;
            return;//?Siempre dejar un return para que no siga
        }
    }); 
}); 

socket.on('tickets-pendientes',(respuesta)=>{
    lblPendientes.innerText = respuesta;
});