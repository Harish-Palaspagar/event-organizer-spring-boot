package com.harish.tickets.domains.dtos;

import com.harish.tickets.domains.entities.EventStatusEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequestDto {

    @NotBlank(message = "Event name is required")
    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    @NotBlank(message = "Venue information is required")
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    @NotNull(message = "Event status must be provided")
    private EventStatusEnum status;
    @Valid
    @NotEmpty(message = "At least one ticket type is required")
    private List<CreateTicketTypeRequestDto> ticketTypes;

}