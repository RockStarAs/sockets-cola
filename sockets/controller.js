const { TicketControl } = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    
    console.log('Cliente conectado', socket.id );

    /*socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });*/
    socket.on('siguiente-ticket',(payload,callback)=>{
        const siguiente = ticketControl.siguiente();
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);//?Enviando al resto la información de los tickets
        callback(siguiente);
        //TODO: Notificar que hay un nuevo ticket pendiente de asignar.
        
    });

    socket.on('atender-ticket',(payload,callback)=>{
        let {escritorio} = payload;
        if(!escritorio){
            return callback({
                ok: false,
                msg: "El escritorio es obligatorio"
            }); 
        }
        const ticket = ticketControl.atenderTicket(escritorio);
        //TODO: Notifica cambio en los últimos 4 tickets
        socket.broadcast.emit('estado-actual',ticketControl.ultimos4); //?Notificando cambios en los últimos 4 tickets
        //? NOTIFICANDO AL MISMO USUARIO Y AL RESTO LOS TICKETS PENDIENTES
        socket.emit('tickets-pendientes',ticketControl.tickets.length); //? Respondiendole también al mismo usuario
        const ticketsPendientes = ticketControl.tickets.length;
        socket.broadcast.emit('tickets-pendientes',ticketsPendientes);//?Enviando al resto la información de los tickets
        

        if(!ticket){
            return callback({
                ok: false,
                msg: "No hay ticket pendientes"
            });
        }
        callback({
            ok: true,
            ticket,
            //ticketsPendientes
        });
    });

    socket.emit('utlimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual',ticketControl.ultimos4);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);

    socket.on('enviar-mensaje', ( payload, callback ) => {
        
        const id = 123456789;
        callback( id );

        socket.broadcast.emit('enviar-mensaje', payload );

    });

}



module.exports = {
    socketController
}

