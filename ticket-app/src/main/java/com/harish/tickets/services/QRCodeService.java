package com.harish.tickets.services;

import com.harish.tickets.domains.entities.QRCode;
import com.harish.tickets.domains.entities.Ticket;

import java.util.UUID;

public interface QRCodeService {

    QRCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);

}
