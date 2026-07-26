package ru.practice.kotouslugi.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.CreateVoteRecordDto;
import ru.practice.kotouslugi.service.VotingService;

@RestController
@RequestMapping("/api/vote")
@AllArgsConstructor
public class VoteController {
  private final VotingService votingService;

  @PostMapping(value = "/online", produces = "application/json")
  @Operation(summary = "Проголосовать", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "201", description = "Created"),
    @ApiResponse(responseCode = "409", description = "Duplicate passport number"),
    @ApiResponse(responseCode = "403", description = "Forbidden")})
  private ResponseEntity<CreateVoteRecordDto> onlineVote(@RequestBody CreateVoteRecordDto createVoteRecordDto){
    CreateVoteRecordDto createVoteRecordDtoResponseEntity = votingService.CastAVoteOnline(createVoteRecordDto);
    return ResponseEntity.status(201).body(createVoteRecordDtoResponseEntity);
  }
}
