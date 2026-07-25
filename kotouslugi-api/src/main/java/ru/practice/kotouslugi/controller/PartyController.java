package ru.practice.kotouslugi.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.PoliticalParty;
import ru.practice.kotouslugi.model.PoliticalPartyDTO;
import ru.practice.kotouslugi.service.PoliticalPartyService;

import java.util.Date;

@AllArgsConstructor
@RestController
@RequestMapping("/api/party")
public class PartyController {
  private final PoliticalPartyService partyService;

  @PostMapping(value = "/add", produces = "application/json")
  @Operation(summary = "Добавить партию", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "201", description = "Created"),
    @ApiResponse(responseCode = "403", description = "Forbidden")})
  private ResponseEntity<PoliticalParty> addParty(@RequestBody PoliticalPartyDTO dto){
    PoliticalParty politicalPartySaved = partyService.addPoliticalParty(dto);
    return ResponseEntity.status(201).body(politicalPartySaved);
  }

}
