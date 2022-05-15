const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero,escritorio){
        this.numero = numero;
        this.escritorio = escritorio
    }
}


class TicketControl {
    constructor(){
        this.ultimo     = 0;
        this.hoy        = new Date().getDate(); // Si hoy es 11 - aparece esa fecha
        this.tickets    = [];
        this.ultimos4   = [];
    
        this.init();
    }

    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){
        const { hoy, tickets, ultimo, ultimos4} = require('../db/data.json');
        //console.log(data);
        if( hoy === this.hoy){
            this.tickets    = tickets;
            this.ultimo     = ultimo;
            this.ultimos4   = ultimos4;
        }else{
            //? Es porque es otro día
            this.guardarDb();
        }
    }

    guardarDb(){
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo,null);
        this.tickets.push(ticket);

        this.guardarDb();
        return 'Ticket' + ' ' + this.ultimo;
    }

    atenderTicket(escritorio){

        //* Validar cuando :  No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }
        //const ticket = this.tickets[0];//? Equivalente a la línea de abajo
        const ticket = this.tickets.shift();//?Remueve el primero elemento del arreglo y lo retorna
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);//? Añadir un elemento nuevo al arreglo, pero el elemento va al inicio
        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1);
        }
        this.guardarDb();
        return ticket;
    }
};

module.exports = {
    TicketControl
};