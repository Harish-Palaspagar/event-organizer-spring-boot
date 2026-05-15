package com.harish.tickets.services;

import com.harish.tickets.domains.entities.Ticket;

import java.util.UUID;

public interface TicketTypeService {

    Ticket purchaseTicket(UUID userId, UUID ticketTypeId);

}
