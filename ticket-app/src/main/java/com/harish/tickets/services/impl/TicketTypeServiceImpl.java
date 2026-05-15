package com.harish.tickets.services.impl;

import com.harish.tickets.domains.entities.Ticket;
import com.harish.tickets.domains.entities.TicketStatusEnum;
import com.harish.tickets.domains.entities.TicketType;
import com.harish.tickets.domains.entities.User;
import com.harish.tickets.exceptions.TicketTypeNotFoundException;
import com.harish.tickets.exceptions.TicketsSoldOutException;
import com.harish.tickets.exceptions.UserNotFoundException;
import com.harish.tickets.repositories.TicketRepository;
import com.harish.tickets.repositories.TicketTypeRepository;
import com.harish.tickets.repositories.UserRepository;
import com.harish.tickets.services.QRCodeService;
import com.harish.tickets.services.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final QRCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
                String.format("User with ID %s was not found", userId)
        ));
        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundException(
                        String.format("Ticket type with ID %s was not found", ticketTypeId)
                ));
        int purchasedTickets = ticketRepository.countByTicketTypeId(ticketType.getId());
        Integer totalAvailable = ticketType.getTotalAvailable();
        if (purchasedTickets + 1 > totalAvailable) {
            throw new TicketsSoldOutException();
        }
        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatusEnum.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setPurchaser(user);
        Ticket savedTicket = ticketRepository.save(ticket);
        qrCodeService.generateQrCode(savedTicket);
        return ticketRepository.save(savedTicket);
    }

}
