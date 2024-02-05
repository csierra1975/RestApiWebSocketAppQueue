import { WebSocketServer } from "ws";
import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interface/ticket";
import { WssService } from "./wss.service";


export class TicketService {

    constructor(
        private readonly wss =  WssService.instante

    ){}
    public tickets: Ticket[] = [
        {id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false},
    ]

    private readonly workingOnTicket: Ticket[] = []

    public get pendingTickets(): Ticket[] {
        return this.tickets.filter(ticket => !ticket.handleAtDesk)
    }

    public get lastTicketNumber() {
        return this.tickets.length > 0 ? this.tickets.at(-1)?.number : 0
    }

    public get lastWorkingOnTickets() {
        return this.workingOnTicket.slice(0,4)
    }

    public createTicket() {

        const newTicket: Ticket =  {id: UuidAdapter.v4(), number: this.tickets.length + 1, createdAt: new Date(), done: false}

        this.tickets.push(newTicket)

        this.onTicketNumberChange()
        return newTicket
    }

    public drawTicket(desk: string) {

        const ticket = this.tickets.find(ticket => !ticket.handleAtDesk)

        if (!ticket) return { status : 'No pending ticket'}

        ticket.handleAtDesk = `Desk: ${desk}`
        ticket.handleAt = new Date()

        this.workingOnTicket.unshift({...ticket})
        // TODO: WS
        this.onTicketNumberChange()
        return { status: 'ok', ticket}
    }

    public onFinishTicket(id: string) {

        const ticket = this.tickets.find(t => t.id === id)

        if (!ticket) return { status : 'error', message: 'ticket not found'}

        this.tickets =  this.tickets.map( t => {
            if (t.id === id){
                t.done = true
            }

            return t
        })

        this.onTicketNumberChange()

        return { status: 'ok'}
    }

    private onTicketNumberChange() {
        this.wss.sendMessage({ type: 'on-ticket-count-changed', payload: this.pendingTickets.length})
    }
}