package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Fine;
import ru.practice.kotouslugi.model.enums.FineStatus;
import ru.practice.kotouslugi.service.FineService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FineControllerTest {
    private MockMvc mockMvc;
    private FineService fineService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        fineService = mock(FineService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new FineController(fineService)).build();
    }

    @Test
    void shouldReturnFineList() throws Exception {
        doReturn(List.of(getTestFine())).when(fineService).listFines();

        mockMvc.perform(get("/api/v1/fine/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].reason").value("Порча мебели когтями"));

        verify(fineService).listFines();
    }

    @Test
    void shouldReturnFinesByCat() throws Exception {
        doReturn(List.of(getTestFine())).when(fineService).listFinesByCat(1L);

        mockMvc.perform(get("/api/v1/fine/listByCat?catId=1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].catId").value(1L));

        verify(fineService).listFinesByCat(1L);
    }

    @Test
    void shouldAddFine() throws Exception {
        mockMvc.perform(post("/api/v1/fine/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(getTestFine())))
            .andExpect(status().isOk());

        verify(fineService).addFine(any());
    }

    @Test
    void shouldPayFine() throws Exception {
        Fine paid = getTestFine();
        paid.setStatus(FineStatus.PAID);
        doReturn(paid).when(fineService).payFine(1L);

        mockMvc.perform(post("/api/v1/fine/pay?id=1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PAID"));

        verify(fineService).payFine(1L);
    }

    private Fine getTestFine() {
        return Fine.builder()
            .id(1L)
            .catId(1L)
            .reason("Порча мебели когтями")
            .amount(500)
            .status(FineStatus.UNPAID)
            .build();
    }
}
