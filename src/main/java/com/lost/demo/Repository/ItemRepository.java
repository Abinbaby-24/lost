package com.lost.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lost.demo.model.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // You can define custom query methods here if needed
}
