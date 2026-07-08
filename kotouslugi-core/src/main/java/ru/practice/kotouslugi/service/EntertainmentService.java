package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.EventRepository;
import ru.practice.kotouslugi.dao.VenueRepository;
import ru.practice.kotouslugi.exception.ServiceException;
import ru.practice.kotouslugi.model.EventEntity;
import ru.practice.kotouslugi.model.Venue;

import java.util.LinkedList;
import java.util.List;

@Service
public class EntertainmentService {
  private final VenueRepository venueRepository;
  private final EventRepository eventRepository;

  public EntertainmentService(VenueRepository venueRepository, EventRepository eventRepository) {
    this.venueRepository = venueRepository;
    this.eventRepository = eventRepository;
  }

  public List<Venue> listVenues() {
    List<Venue> result = new LinkedList<>();
    venueRepository.findAll().forEach(result::add);
    return result;
  }

  public List<EventEntity> listEventsByVenue(int venueId) {
    return eventRepository.findByVenueId(venueId);
  }

  public EventEntity getEventById(int eventId) throws ServiceException {
    return eventRepository.findById(eventId)
      .orElseThrow(() -> new ServiceException("Мероприятие не найдено: " + eventId));
  }
}
