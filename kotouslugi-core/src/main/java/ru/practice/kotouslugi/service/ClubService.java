package ru.practice.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.ClubRepository;
import ru.practice.kotouslugi.model.Club;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class ClubService {
    private final ClubRepository clubRepository;
    private static final Logger logger = LoggerFactory.getLogger(CatService.class);

    public ClubService(ClubRepository clubRepository) {this.clubRepository = clubRepository;}

    public List<Club> listClub() {
        List<Club> list = new LinkedList<>();
        Iterable<Club> all = clubRepository.findAll();
        all.forEach(list::add);
        return list;
    }

    public Long addClub(Club club) {
        try {
            club = clubRepository.save(club);
            return club.getId();
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    public Club getClub(Long id) {
        Optional<Club> club = clubRepository.findById(id);
        return club.orElse(null);
    }

    public void deleteClub(Long id) {
        Optional<Club> club = clubRepository.findById(id);
        club.ifPresent(clubRepository::delete);
    }
}
