package ru.practice.kotouslugi.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.practice.kotouslugi.model.Category;
import ru.practice.kotouslugi.model.KotoServiceEntity;
import ru.practice.kotouslugi.service.KotoService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductServiceControllerTest {
    private MockMvc mockMvc;
    private KotoService kotoService;


    @BeforeEach
    void setUp() {
        kotoService = mock(KotoService.class);
        ProductServiceController controller = new ProductServiceController(kotoService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldReturnServiceList() throws Exception {
        doReturn(
            List.of(
                getTestEntity()
            )
        ).when(kotoService).listServices();

        mockMvc.perform(get("/api/service/list")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].icon").value("hugs.png"))
            .andExpect(jsonPath("$[0].title").value("Укотоение"));

        verify(kotoService).listServices();
    }

    @Test
    void shouldReturnService() throws Exception {
        doReturn(getTestEntity()).when(kotoService).getServiceById(any());

        mockMvc.perform(get("/api/service/byId/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.icon").value("hugs.png"))
            .andExpect(jsonPath("$.title").value("Укотоение"));

        verify(kotoService).getServiceById(any());
    }

    @Test
    void shouldReturnCategoryList() throws Exception {
        doReturn(
            List.of(
                getTestCategory()
            )
        ).when(kotoService).listCategories();

        mockMvc.perform(get("/api/service/categories")
                .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
          .andExpect(jsonPath("$[0].name").value("family"));

        verify(kotoService).listCategories();
    }

    private KotoServiceEntity getTestEntity() {
        return KotoServiceEntity.builder()
            .title("Укотоение")
            .categories(
                List.of(
                    getTestCategory()
                )
            )
            .icon("hugs.png")
            .build();
    }

    private Category getTestCategory() {
        Category category = new Category();
        category.setId(1);
        category.setName("family");
        return category;
    }
}
