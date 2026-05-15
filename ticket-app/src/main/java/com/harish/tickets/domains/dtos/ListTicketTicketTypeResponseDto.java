package com.harish.tickets.domains.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListTicketTicketTypeResponseDto {

    private UUID id;
    private String name;
    private Double price;

}