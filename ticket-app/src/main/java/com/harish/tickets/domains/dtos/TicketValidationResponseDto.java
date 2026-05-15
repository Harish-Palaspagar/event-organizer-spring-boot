package com.harish.tickets.domains.dtos;

import com.harish.tickets.domains.entities.TicketValidationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketValidationResponseDto {

    private UUID ticketId;
    private TicketValidationStatusEnum status;

}
