package com.example.backend;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.response.FileResponse;
import com.example.backend.model.City;
import com.example.backend.model.Human;
import com.example.backend.repo.ImportOperationRepository;
import com.example.backend.service.EntityParsingService;
import com.example.backend.service.FileProcessingService;
import com.example.backend.service.QueueExecutorService;

class FileProcessingServiceTest {

    @Mock
    private EntityParsingService entityParsingService;

    @Mock
    private QueueExecutorService queueExecutorService;

    @Mock
    private ImportOperationRepository importOperationRepository;

    @InjectMocks
    private FileProcessingService fileProcessingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testProcessFiles_SuccessfulProcessing() throws Exception {
        // Arrange
        String tomlContent = """
                [[createQuery]]
                type = "human"
                data = { age = 52, isModifiable = true }

                [[createQuery]]
                type = "city"
                data = { name = "Springfield", coordinates = 75, governor = 48, area = 1200.5, population = 500000, capital = true, metersAboveSeaLevel = 50, establishmentDate = "2022-01-01T00:00:00Z", telephoneCode = 12345, climate = "MONSOON", government = "NOOCRACY", isModifiable = true }
                """;

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("testFile.toml");
        when(file.getBytes()).thenReturn(tomlContent.getBytes(StandardCharsets.UTF_8));

        Human mockHuman = new Human();
        City mockCity = new City();

        when(entityParsingService.buildHuman(anyMap(), anyString())).thenReturn(mockHuman);
        when(entityParsingService.buildCity(anyMap(), anyString())).thenReturn(mockCity);
        when(queueExecutorService.executeQueue(any())).thenReturn(List.of(
                "[SUCCESS] Human created successfully.",
                "[SUCCESS] City created successfully."
        ));

        // Act
        FileResponse fr = fileProcessingService.processFiles(List.of(file), "testUser");
        List<String> logs = fr.getResults();

        // Assert
        assertTrue(logs.contains("[SUCCESS] File testFile.toml processed successfully."));
        assertTrue(logs.contains("[END] Processing for file testFile.toml completed."));
    }

    @Test
    void testProcessFiles_ValidationError() throws Exception {
        // Arrange
        String tomlContent = """
                [[createQuery]]
                type = "city"
                data = { name = "", coordinates = 75, governor = 48, area = -1200.5, population = 500000, capital = true, metersAboveSeaLevel = 50, establishmentDate = "2022-01-01T00:00:00Z", telephoneCode = 12345, climate = "MONSOON", government = "NOOCRACY", isModifiable = true }
                """;
    
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("validationError.toml");
        when(file.getBytes()).thenReturn(tomlContent.getBytes(StandardCharsets.UTF_8));
    
        City mockCity = new City();
    
        when(entityParsingService.buildCity(anyMap(), anyString())).thenReturn(mockCity);
        when(queueExecutorService.executeQueue(any())).thenThrow(
            new IllegalArgumentException("Validation failed for object: [name must not be blank, area must be positive]")
        );
    
        // Act
        FileResponse fr = fileProcessingService.processFiles(List.of(file), "testUser");
        List<String> logs = fr.getResults();
    
        // Assert
        assertTrue(logs.contains("[ERROR] File validationError.toml encountered an error: Validation failed for object: [name must not be blank, area must be positive]"));
        assertTrue(logs.contains("[END] Processing for file validationError.toml completed."));
    }
    

    @Test
    void testProcessFiles_InvalidTomlStructure() throws Exception {
        // Arrange
        String invalidTomlContent = "invalid content here";

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("invalidFile.toml");
        when(file.getBytes()).thenReturn(invalidTomlContent.getBytes(StandardCharsets.UTF_8));

        // Act
        FileResponse fr = fileProcessingService.processFiles(List.of(file), "testUser");
        List<String> logs = fr.getResults();

        // Assert
        assertTrue(logs.contains("[ERROR] File invalidFile.toml has an illegal structure: Unknown token at line or invalid TOML structure."));
        assertTrue(logs.contains("[END] Processing for file invalidFile.toml completed."));
    }

    @Test
    void testProcessFiles_UnexpectedError() throws Exception {
        // Arrange
        String tomlContent = """
                [[createQuery]]
                type = "human"
                data = { age = 52, isModifiable = true }
                """;

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("unexpectedError.toml");
        when(file.getBytes()).thenReturn(tomlContent.getBytes(StandardCharsets.UTF_8));

        when(entityParsingService.buildHuman(anyMap(), anyString())).thenThrow(new RuntimeException("Unexpected exception occurred"));

        // Act
        FileResponse fr = fileProcessingService.processFiles(List.of(file), "testUser");
        List<String> logs = fr.getResults();

        // Assert
        assertTrue(logs.contains("[ERROR] File unexpectedError.toml encountered an unexpected error: Unexpected exception occurred"));
        assertTrue(logs.contains("[END] Processing for file unexpectedError.toml completed."));
    }

    @Test
    void testProcessFiles_DuplicateCityName() throws Exception {
        // Arrange
        String tomlContent = """
                [[createQuery]]
                type = "city"
                data = { name = "Springfield", coordinates = 75, governor = 48, area = 1200.5, population = 500000, capital = true, metersAboveSeaLevel = 50, establishmentDate = "2022-01-01T00:00:00Z", telephoneCode = 12345, climate = "MONSOON", government = "NOOCRACY", isModifiable = true }

                [[createQuery]]
                type = "city"
                data = { name = "Springfield", coordinates = 76, governor = 49, area = 1500.0, population = 600000, capital = false, metersAboveSeaLevel = 100, establishmentDate = "2023-01-01T00:00:00Z", telephoneCode = 54321, climate = "TEMPERATE", government = "DEMOCRACY", isModifiable = true }
                """;

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("duplicateCityName.toml");
        when(file.getBytes()).thenReturn(tomlContent.getBytes(StandardCharsets.UTF_8));

        City mockCity1 = new City();
        City mockCity2 = new City();

        when(entityParsingService.buildCity(anyMap(), anyString()))
            .thenReturn(mockCity1) // First city
            .thenReturn(mockCity2); // Second city (duplicate)

        when(queueExecutorService.executeQueue(any())).thenThrow(
            new IllegalArgumentException("A city with the name 'Springfield' already exists.")
        );

        // Act
        FileResponse fr = fileProcessingService.processFiles(List.of(file), "testUser");
        List<String> logs = fr.getResults();

        // Assert
        assertTrue(logs.contains("[ERROR] File duplicateCityName.toml encountered an error: A city with the name 'Springfield' already exists."));
        assertTrue(logs.contains("[END] Processing for file duplicateCityName.toml completed."));
    }

}
