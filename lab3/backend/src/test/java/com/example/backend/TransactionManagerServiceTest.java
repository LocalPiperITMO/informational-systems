package com.example.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.util.ArrayDeque;
import java.util.List;
import java.util.Queue;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.exceptions.ServiceNotReadyException;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.service.HealthCheckService;
import com.example.backend.service.MinioService;
import com.example.backend.service.TransactionManagerService;
import com.example.backend.utils.Pair;

class TransactionManagerServiceTest {

    @Mock
    private SessionFactory sessionFactory;

    @Mock
    private MinioService minioService;

    @Mock
    private HealthCheckService healthCheckService;

    @Mock
    private Session session;

    @Mock
    private Transaction transaction;

    @Mock
    private MultipartFile file;

    @InjectMocks
    private TransactionManagerService transactionManagerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(sessionFactory.openSession()).thenReturn(session);
        when(session.beginTransaction()).thenReturn(transaction);
    }

    @Test
    void testPrepare_AllServicesReady() {
        // Arrange
        when(healthCheckService.checkPostgresReadiness()).thenReturn(true);
        when(healthCheckService.checkMinioReadiness()).thenReturn(true);

        // Act
        List<String> result = transactionManagerService.prepare();

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("[INFO] All services ready."));
    }

    @Test
    void testPrepare_PostgresNotReady() {
        // Arrange
        when(healthCheckService.checkPostgresReadiness()).thenReturn(false);

        // Act & Assert
        ServiceNotReadyException exception = assertThrows(ServiceNotReadyException.class, () -> transactionManagerService.prepare());
        assertEquals("PostgreSQL failed readiness check", exception.getMessage());
    }

    @Test
    void testPrepare_MinioNotReady() {
        // Arrange
        when(healthCheckService.checkPostgresReadiness()).thenReturn(true);
        when(healthCheckService.checkMinioReadiness()).thenReturn(false);

        // Act & Assert
        ServiceNotReadyException exception = assertThrows(ServiceNotReadyException.class, () -> transactionManagerService.prepare());
        assertEquals("MinIO failed readiness check", exception.getMessage());
    }

@Test
void testExecute_SuccessfulTransaction() throws Exception {
    // Arrange
    Queue<Pair<String, Object>> queue = new ArrayDeque<>();
    Human governor = new Human(25, true, "owner");
    Coordinates coordinates = new Coordinates(10L, 20.5, true, "owner");
    queue.add(new Pair<>("human", governor));
    queue.add(new Pair<>("coordinates", coordinates));
    when(file.getOriginalFilename()).thenReturn("testFile.txt");
    when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
    when(file.getContentType()).thenReturn("text/plain");

    // Act
    List<String> result = transactionManagerService.execute(queue, "testUser", "uuid123", file);

    // Assert
    assertNotNull(result);
    assertTrue(result.contains("[INFO] Transaction started."));
    assertTrue(result.contains("[SUCCESS] Human created successfully."));
    assertTrue(result.contains("[SUCCESS] Coordinates created successfully."));
    verify(transaction).commit();
}


@Test
void testExecute_RuntimeExceptionOnSave() throws Exception {
    // Arrange
    Queue<Pair<String, Object>> queue = new ArrayDeque<>();
    queue.add(new Pair<>("object", new Object())); // Will fail on save
    queue.add(new Pair<>("coordinates", new Coordinates(10L, 20.5, true, "owner")));
    when(file.getOriginalFilename()).thenReturn("testFile.txt");
    when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
    when(file.getContentType()).thenReturn("text/plain");

    // Act
    List<String> result = transactionManagerService.execute(queue, "testUser", "uuid123", file);

    // Assert
    assertTrue(result.contains("[ERROR] Failed to save 'object': Unknown object type."));

    // Verify rollback occurred
    verify(transaction).rollback();
}



    @Test
    void testStartExecution_Success() throws Exception {
        // Arrange
        Queue<Pair<String, Object>> queue = new ArrayDeque<>();
        queue.add(new Pair<>("human", new Human(25, true, "owner")));
        when(healthCheckService.checkPostgresReadiness()).thenReturn(true);
        when(healthCheckService.checkMinioReadiness()).thenReturn(true);
        when(file.getOriginalFilename()).thenReturn("testFile.toml");
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(file.getContentType()).thenReturn("text/plain");

        // Act
        List<String> result = transactionManagerService.startExecution(queue, "testUser", "uuid123", file);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("[INFO] All services ready."));
        assertTrue(result.contains("[INFO] Transaction started."));
        assertTrue(result.contains("[SUCCESS] Human created successfully."));
    }

    @Test
    void testStartExecution_ServiceNotReady() throws Exception {
        // Arrange
        Queue<Pair<String, Object>> queue = new ArrayDeque<>();
        queue.add(new Pair<>("human", new Human(25, true, "owner")));
        when(healthCheckService.checkPostgresReadiness()).thenReturn(false);

        // Act
        List<String> result = transactionManagerService.startExecution(queue, "testUser", "uuid123", file);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("[ERROR] PostgreSQL failed readiness check"));
        verifyNoInteractions(sessionFactory);
    }
}

