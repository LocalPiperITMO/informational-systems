package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.utils.Pair;

import jakarta.validation.ConstraintViolationException;

@Service
public class QueueExecutorService {

    @Autowired
    private SessionFactory sessionFactory;
    
    public List<String> executeQueue(Queue<Pair<String, Object>> queue) {
        Transaction transaction = null;
        List<String> res = new ArrayList<>();
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            res.add("[INFO] Transaction started.");
            
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
                        // Handle validation errors specifically
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
                        throw ex; // Ensure rollback still occurs
                    } catch (IllegalArgumentException | org.hibernate.HibernateException ex) {
                        res.add(String.format("[ERROR] Failed to save '%s': %s", objectType, ex.getMessage()));
                        throw ex; // Ensure rollback still occurs
                    }
                }
            }
            
            transaction.commit();
            res.add("[INFO] Transaction committed successfully.");
        } catch (ConstraintViolationException ex) {
            // Rollback already handled, logging was done above
            res.add("[ERROR] Validation errors encountered. Transaction rolled back.");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            res.add(String.format("[ERROR] Transaction rolled back due to error: %s", e.getMessage()));
        } finally {
            res.add("[END] Queue processing completed.");
        }
        return res;
    }

    private void processCity(Session session, City city, List<String> res) {
        try {
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
            
            
            session.save(city);
            res.add("[INFO] City saved successfully.");
        } catch (Exception e) {
            res.add(String.format("[ERROR] Failed to process City: %s", e.getMessage()));
            throw e;
        }
    }
}
