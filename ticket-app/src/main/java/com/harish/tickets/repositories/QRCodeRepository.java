package com.harish.tickets.repositories;

import com.harish.tickets.domains.entities.QRCode;
import com.harish.tickets.domains.entities.QRCodeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QRCodeRepository extends JpaRepository<QRCode, UUID> {

    Optional<QRCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID ticketPurchaseId);

    Optional<QRCode> findByIdAndStatus(UUID id, QRCodeStatusEnum status);

}
