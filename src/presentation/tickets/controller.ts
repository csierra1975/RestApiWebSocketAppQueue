import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";


export class TikcetController {

    constructor(
        private readonly ticketService: TicketService
    ){}

    public getTickets = async (req:Request, res: Response) =>{
        res.status(200).json(this.ticketService.tickets)
    }

    public getLastTicketNumber = async (req:Request, res: Response) =>{
        res.status(200).json(this.ticketService.lastTicketNumber)
    }

    public pendingTickets = async (req:Request, res: Response) =>{
        res.status(200).json(this.ticketService.pendingTickets)
    }

    public createTicket = async (req:Request, res: Response) =>{
        res.status(201).json(this.ticketService.createTicket())
    }

    public drawTicket = async (req:Request, res: Response) =>{
        
        const { desk } = req.params
        
        res.status(200).json(this.ticketService.drawTicket(desk))
    }

    public ticketFinish = async (req:Request, res: Response) =>{

        const { ticketId } = req.params
       
        res.status(200).json(this.ticketService.onFinishTicket(ticketId))
    }

    public workingOn = async (req:Request, res: Response) =>{

        res.status(200).json(this.ticketService.lastWorkingOnTickets)
    }
}