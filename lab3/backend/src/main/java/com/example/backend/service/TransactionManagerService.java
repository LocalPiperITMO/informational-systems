package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.exceptions.ServiceNotReadyException;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.utils.Pair;

import jakarta.validation.ConstraintViolationException;

@Service
public class TransactionManagerService {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private MinioService minioService;

    @Autowired
    private HealthCheckService healthCheckService;

    public List<String> prepare() {
        List<String> res = new ArrayList<>();
        res.add("[INFO] Checking readiness...");
        boolean postgresReady = healthCheckService.checkPostgresReadiness();
        boolean minioReady = healthCheckService.checkMinioReadiness();
        if (!postgresReady) {
            throw new ServiceNotReadyException("PostgreSQL failed readiness check");
        } else if (!minioReady) {
            throw new ServiceNotReadyException("MinIO failed readiness check");
        }
        res.add("[INFO] All services ready.");
        return res;
    }

    public List<String> execute(Queue<Pair<String, Object>> queue, String username, String uuid, MultipartFile file) {
        // initial data prep
        Transaction transaction = null;
        List<String> res = new ArrayList<>();
        String objectName = file.getOriginalFilename();
        String path = username + "/" + uuid;
        boolean fileMoved = false;

        try (Session session = sessionFactory.openSession()) {
            // transaction start
            transaction = session.beginTransaction();
            res.add("[INFO] Transaction started.");
    
            // staging file
            String contentType = file.getContentType();
            minioService.stageFile(path, file.getInputStream(), contentType);
            res.add("[INFO] File staged in MinIO: " + objectName);
    
            // processing objects from the queue
            while (!queue.isEmpty()) {
                Pair<String, Object> p = queue.poll();
                if (p != null && p.getKey() != null) {
                    String objectType = p.getKey();
                    Object object = p.getValue();
    
                    res.add(String.format("[INFO] Processing object of type '%s'.", objectType));
    
                    try {
                        switch (objectType) {
                            case "human" -> {
                                session.save((Human) object);
                                res.add("[SUCCESS] Human created successfully.");
                            }
                            case "coordinates" -> {
                                session.save((Coordinates) object);
                                res.add("[SUCCESS] Coordinates created successfully.");
                            }
                            case "city" -> {
                                City city = (City) object;
                                processCity(session, city, res);
                                res.add("[SUCCESS] City created successfully.");
                            }
                            default -> {
                                res.add(String.format("[ERROR] Unknown object type '%s'. Skipping.", objectType));
                            }
                        }
                    } catch (ConstraintViolationException ex) {
                        res.add("[ERROR] Validation failed for object:");
                        ex.getConstraintViolations().forEach(violation -> {
                            String errorMessage = String.format(
                                "    [CONSTRAINT] Property: '%s', Value: '%s', Issue: '%s'",
                                violation.getPropertyPath(),
                                violation.getInvalidValue(),
                                violation.getMessage()
                            );
                            res.add(errorMessage);
                        });
                        throw ex;
                    } catch (IllegalArgumentException | org.hibernate.HibernateException ex) {
                        res.add(String.format("[ERROR] Failed to save '%s': %s", objectType, ex.getMessage()));
                        throw ex;
                    }
                }
            }
    
            // all objects processed, now trying to finalize file and commit
            if (!fileMoved) {
                minioService.uploadFile(path, file.getInputStream(), contentType);
                minioService.deleteFile(path, "staging");
                fileMoved = true;
            }
    
            // commit
            transaction.commit();
            res.add("[INFO] File saved in MinIO.");
            res.add("[INFO] Transaction committed successfully.");
        } catch (Exception e) {
            // remove file + rollback
            if (!fileMoved) {
                try {
                    minioService.deleteFile(path, "staging");
                    res.add("[INFO] Staging file deleted from MinIO due to error.");
                } catch (Exception deleteEx) {
                    res.add("[ERROR] Failed to delete file from staging: " + deleteEx.getMessage());
                }
            } else {
                // If the file was already moved, remove it from the 'scripts' bucket
                try {
                    minioService.deleteFile(path, "scripts");
                    res.add("[INFO] File deleted from scripts bucket due to error.");
                } catch (Exception deleteEx) {
                    // WORST POSSIBLE OUTCOME
                    res.add("[ERROR] Failed to delete file from scripts: " + deleteEx.getMessage());
                }
            }
            
            // Rollback transaction if something failed
            if (transaction != null) {
                transaction.rollback();
            }
    
            res.add(String.format("[ERROR] Transaction rolled back due to error: %s", e.getMessage()));
        } finally {
            res.add("[END] Queue processing completed.");
        }
        return res;
    }
    
    public List<String> startExecution(Queue<Pair<String, Object>> queue, String username, String uuid, MultipartFile file) {
        List<String> res = new ArrayList<>();
        try {
            res.addAll(prepare());
            res.addAll(execute(queue, username, uuid, file));   
        } catch (ServiceNotReadyException e) {
            res.add("[ERROR]" + " " + e.getMessage());
        }
        return res;
    }
    

    private void processCity(Session session, City city, List<String> res) {
        try {
            // Check for city name uniqueness
            String query = "SELECT count(*) FROM City WHERE name = :name";
            Long count = (Long) session.createQuery(query)
                .setParameter("name", city.getName())
                .uniqueResult();
            
            if (count > 0) {
                throw new IllegalArgumentException("A city with the name '" + city.getName() + "' already exists.");
            }
            
            // Process coordinates
            if (city.getCoordinates() != null) {
                if (city.getCoordinates().getId() == null) {
                    session.save(city.getCoordinates());
                    res.add("[INFO] New Coordinates for City created successfully.");
                } else {
                    Coordinates coordinates = session.get(Coordinates.class, city.getCoordinates().getId());
                    if (coordinates == null) {
                        throw new IllegalArgumentException("Coordinates with ID " + city.getCoordinates().getId() + " do not exist.");
                    }
                    city.setCoordinates(coordinates);
                    res.add("[INFO] Existing Coordinates mapped to City.");
                }
            }
    
            // Process governor
            try {
                if (city.getGovernor() != null) {
                    if (city.getGovernor().getId() == null) {
                        session.save(city.getGovernor());
                        res.add("[INFO] New Governor for City created successfully.");
                    } else {
                        Human governor = session.get(Human.class, city.getGovernor().getId());
                        if (governor == null) {
                            throw new IllegalArgumentException("Governor with the given ID does not exist.");
                        }
                        city.setGovernor(governor);
                        res.add("[INFO] Existing Governor mapped to City.");
                    }
                }
            } catch (IllegalArgumentException ex) {
                res.add(String.format("[ERROR] Failed to process City: %s", ex.getMessage()));
                throw ex;
            } catch (NullPointerException ex) {
                res.add("[ERROR] Governor with the given ID does not exist.");
                throw new IllegalArgumentException("Governor with the given ID does not exist.", ex);
            }
    
            // Save the city
            session.save(city);
            res.add("[INFO] City saved successfully.");
        } catch (Exception e) {
            res.add(String.format("[ERROR] Failed to process City: %s", e.getMessage()));
            throw e;
        }
    }
    
}
