package ru.practice.kotouslugi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Requisition;
import ru.practice.kotouslugi.service.RequisitionService;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RequisitionControllerTest {

    private MockMvc mockMvc;
    private RequisitionService requisitionService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        requisitionService = mock(RequisitionService.class);
        RequisitionController controller = new RequisitionController(requisitionService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnReqList() throws Exception {
        doReturn(
            List.of(
                getTestReq()
            )
        ).when(requisitionService).listRequisition();

        mockMvc.perform(get("/api/requisition/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].mnemonic").value("quality"));

        verify(requisitionService).listRequisition();
    }

    @Test
    void shouldAddReq() throws Exception {
        Requisition requisition = getTestReq();

        mockMvc.perform(post("/api/requisition/create")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(requisition)))
          .andDo(print())
          .andExpect(status().isOk());

        verify(requisitionService).createRequisition(any());
    }

    @Test
    void shouldUpdReq() throws Exception {
        Requisition requisition = getTestReq();

        mockMvc.perform(post("/api/requisition/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requisition)))
            .andDo(print())
            .andExpect(status().isOk());

        verify(requisitionService).updateRequisition(any());
    }

    private Requisition getTestReq() {
        return Requisition.builder()
          .id(1)
          .mnemonic("quality")
          .name("Качество")
          .created(new Date())
          .build();
    }
}
