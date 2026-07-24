package ru.practice.kotouslugi.controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.CreateVoteRecordDto;
import ru.practice.kotouslugi.service.VoitingService;

@RestController
@RequestMapping("/api/vote")
@AllArgsConstructor
public class VoteController {
  private final VoitingService voitingService;
  @PostMapping("/online")
  private ResponseEntity<CreateVoteRecordDto> onlineVote(@RequestBody CreateVoteRecordDto createVoteRecordDto){
    CreateVoteRecordDto createVoteRecordDtoResponseEntity = voitingService.CastAVoteOnline(createVoteRecordDto);
    return ResponseEntity.status(201).body(createVoteRecordDtoResponseEntity);
  }


}
