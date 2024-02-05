import { Router } from "express";
import { TikcetController } from "./controller";
import { TicketService } from "../services/ticket.service";
import { WssService } from "../services/wss.service";


export class TicketRoutes {

    static get routes() {

        const router = Router()

        const ticketService = new TicketService()
        const ticketController = new TikcetController(ticketService)

        router.get('/', ticketController.getTickets)
        router.get('/last', ticketController.getLastTicketNumber)
        router.get('/pending', ticketController.pendingTickets)

        router.post('/', ticketController.createTicket)

        router.get('/draw/:desk', ticketController.drawTicket)
        router.put('/done/:ticketId', ticketController.ticketFinish)

        router.get('/working-on', ticketController.workingOn)

        return router
    }
}