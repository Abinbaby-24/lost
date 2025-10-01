package com.lost.demo.repository;

import com.lost.demo.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    // Search by location (for your search functionality)
    List<Item> findByLocationContainingIgnoreCase(String location);
    
    // Get all items ordered by creation date (newest first)
    List<Item> findAllByOrderByCreatedAtDesc();
    
    // Search by both name and location (for your search box)
    List<Item> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
}