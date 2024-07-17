package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.Club;
import ru.practice.kotouslugi.service.CatService;
import ru.practice.kotouslugi.service.ClubService;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.time.Instant;
import java.time.ZoneId;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class ClubControllerTest {
    private MockMvc mockMvc;
    private ClubService clubService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        clubService = mock(ClubService.class);
        ClubController controller = new ClubController(clubService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnClubList() throws Exception {
        doReturn(
            List.of(
                getTestClub()
            )
        ).when(clubService).listClub();

        mockMvc.perform(get("/api/club/list")
            .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].name").value("Клуб 1"));

        verify(clubService).listClub();
    }

    @Test
    void shouldAddClub() throws Exception {
        Club club = getTestClub();

        mockMvc.perform(post("/api/club/add")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(club)))
            .andDo(print())
            .andExpect(status().isOk());

        verify(clubService).addClub(any());
    }

    @Test
    void shouldGetClub() throws Exception {
        doReturn(getTestClub()).when(clubService).getClub(1L);

        mockMvc.perform(get("/api/club/get?id=1")
            .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(clubService).getClub(1L);
    }

    @Test
    void shouldDeleteClub() throws Exception {
        doNothing().when(clubService).deleteClub(1L);

        mockMvc.perform(delete("/api/club/deleteClub?id=1")
            .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(clubService).deleteClub(any());
    }

    private Club getTestClub() {
        String dateString = "2024-07-16T13:39:13.796+00:00";

        OffsetDateTime odt = OffsetDateTime.parse(dateString, DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        Instant instant = odt.toInstant();
        Date date = Date.from(instant);
        return Club.builder()
            .id(1L)
            .name("Клуб 1")
            .number(939424)
            .date(date)
            .description("Описание")
            .imgUrl("club-1.png")
            .build();
    }
}
