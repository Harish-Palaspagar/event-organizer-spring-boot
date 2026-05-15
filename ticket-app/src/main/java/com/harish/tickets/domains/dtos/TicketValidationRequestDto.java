package com.harish.tickets.domains.dtos;

import com.harish.tickets.domains.entities.TicketValidationMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketValidationRequestDto {

    private UUID id;
    private TicketValidationMethod method;

}
