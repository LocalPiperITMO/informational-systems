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

@Service
public class QueueExecutorService {

    @Autowired
    private SessionFactory sessionFactory;
    
    public List<String> executeQueue(Queue<Pair<String, Object>> queue) {
        Transaction transaction = null;
        List<String> res = new ArrayList<>();
        try (Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            while (!queue.isEmpty()) {
                Pair<String, Object> p = queue.poll();
                if (null != p.getKey()) switch (p.getKey()) {
                    case "human" -> {
                        session.save((Human)p.getValue());
                        res.add("Human created successfully");
                    }
                    case "coordinates" -> {
                        session.save((Coordinates)p.getValue());
                        res.add("Coordinates created successfully");
                    }
                    case "city" -> {
                        session.save((City)p.getValue());
                        res.add("City created successfully");
                    }
                    default -> {
                    }
                }
            }
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            res.add("Exception occurred: " + e.getMessage());
        }
        return res;
    }
}
