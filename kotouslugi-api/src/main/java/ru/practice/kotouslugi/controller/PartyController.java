package ru.practice.kotouslugi.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.PoliticalParty;
import ru.practice.kotouslugi.model.PoliticalPartyDTO;
import ru.practice.kotouslugi.service.PoliticalPartyService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/party")
public class PartyController {
  private final PoliticalPartyService partyService;

  @PostMapping(value = "/add", produces = "application/json")
  @Operation(summary = "Добавить партию", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "201", description = "Created"),
    @ApiResponse(responseCode = "403", description = "Forbidden")})
  public ResponseEntity<PoliticalParty> addParty(@RequestBody PoliticalPartyDTO dto){
    PoliticalParty politicalPartySaved = partyService.addPoliticalParty(dto);
    return ResponseEntity.status(201).body(politicalPartySaved);
  }

  @GetMapping("/get")
  public ResponseEntity<List<PoliticalParty>> getAllParties(){
    List<PoliticalParty> politicalParties = partyService.getParties();
    return ResponseEntity.status(200).body(politicalParties);
  }
}
