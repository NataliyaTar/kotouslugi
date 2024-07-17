package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.service.CatService;

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

class CatControllerTest {
    private MockMvc mockMvc;
    private CatService catService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        catService = mock(CatService.class);
        CatController controller = new CatController(catService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnCatList() throws Exception {
        doReturn(
            List.of(
                getTestCat()
            )
        ).when(catService).listCat();

        mockMvc.perform(get("/api/cat/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].name").value("Tuzya"));

        verify(catService).listCat();
    }

    @Test
    void shouldAddCat() throws Exception {
        Cat cat = getTestCat();

        mockMvc.perform(post("/api/cat/add")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(cat)))
          .andDo(print())
          .andExpect(status().isOk());

        verify(catService).addCat(any());
    }

    @Test
    void shouldGetCat() throws Exception {
        doReturn(getTestCat()).when(catService).getCat(1L);

        mockMvc.perform(get("/api/cat/get?id=1")
            .contentType(MediaType.APPLICATION_JSON))
          .andDo(print())
          .andExpect(status().isOk());

        verify(catService).getCat(1L);
    }

    @Test
    void shouldDeleteCat() throws Exception {
        doNothing().when(catService).deleteCat(1L);

        mockMvc.perform(delete("/api/cat/deleteCat?id=1")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(catService).deleteCat(any());
    }

    private Cat getTestCat() {
        return Cat.builder()
            .id(1L)
            .age("2")
            .breed("Scotland")
            .sex("male")
            .name("Tuzya")
            .build();
    }
}
