package com.example.backend.utils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.PriorityQueue;

import org.springframework.stereotype.Component;

import com.example.backend.model.City;

@Component
public class SpecOps {

    private class CityComparator implements Comparator<City> {
        @Override
        public int compare(City city1, City city2) {
            return Integer.compare(city1.getPopulation(), city2.getPopulation());
        }
    }
    
    public Long telephoneCodeSum(List<City> cities) {
        long res = 0;
        for (City city : cities) {
            res += city.getTelephoneCode();
        }
        return res;
    }

    public Long countGreaterMASL(List<City> cities, Long val) {
        long res = 0;
        for (City city : cities) {
            if (city.getMetersAboveSeaLevel() > val) {
                ++res;
            }
        }
        return res;
    }

    public List<Integer> getDistinctMASL(List<City> cities) {
        HashSet<Integer> hs = new HashSet<>();
        for (City city : cities) {
            hs.add(city.getMetersAboveSeaLevel());
        }
        return new ArrayList<>(hs);
    }

    public List<City> moveToMinPopulation(List<City> cities, Long val) {
        List<City> newCities = new ArrayList<>();
        for (City city : cities) {
            if (Objects.equals(city.getId(), val)) {
                newCities.add(city);
                break;
            }
        }
        if (newCities.isEmpty()) return newCities;
        City minCity = newCities.get(0);
        for (City city : cities) {
            if (city.getPopulation() < minCity.getPopulation() && city.isModifiable() && city.getOwner().equals(minCity.getOwner())) {
                minCity = city;
            }
        }
        if (Objects.equals(newCities.get(0).getId(), minCity.getId())) return newCities;
        newCities.add(minCity);
        int population = newCities.get(0).getPopulation() - 1;
        newCities.get(0).setPopulation(1);
        newCities.get(1).setPopulation(newCities.get(1).getPopulation() + population);
        return newCities;
    }

    public List<City> moveFromCapital(List<City> cities, Long val) {
        List<City> result = new ArrayList<>();
        if (cities.size() <= 1) return result;
        City capital = null;
        for (City city : cities) {
            if (Objects.equals(city.getId(), val)) {
                capital = city;
                break;
            }
        }
        if (capital == null) return result;
        int population = capital.getPopulation() / 2;
        capital.setPopulation(capital.getPopulation() - population);
        result.add(capital);
        PriorityQueue<City> pq = new PriorityQueue<>(cities.size(), new CityComparator());
        for (City city : cities) {
            if (!Objects.equals(city.getId(), capital.getId()) && city.isModifiable() && city.getOwner().equals(capital.getOwner())) {
                pq.add(city);
            }
        }
        if (pq.isEmpty()) return new ArrayList<>();
        if (pq.size() == 1) {
            result.add(pq.poll());
            result.get(1).setPopulation(result.get(1).getPopulation() + population);
            return result;
        }
        if (pq.size() == 2) {
            int remainder = population % 2;
            result.add(pq.poll());
            result.add(pq.poll());
            result.get(1).setPopulation(result.get(1).getPopulation() + population / 2 + ((remainder > 0)? 1 : 0));
            --remainder;
            result.get(2).setPopulation(result.get(2).getPopulation() + population / 2 + ((remainder > 0)? 1 : 0));
            return result;
        }
        int remainder = population % 3;
        result.add(pq.poll());
        result.add(pq.poll());
        result.add(pq.poll());
        result.get(1).setPopulation(result.get(1).getPopulation() + population / 3 + ((remainder > 0)? 1 : 0));
        --remainder;
        result.get(2).setPopulation(result.get(2).getPopulation() + population / 3 + ((remainder > 0)? 1 : 0));
        --remainder;
        result.get(3).setPopulation(result.get(3).getPopulation() + population / 3 + ((remainder > 0)? 1 : 0));
        return result;
    }
}
