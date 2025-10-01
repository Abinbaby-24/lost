package com.lost.demo.Service;

import com.lost.demo.model.Item;
import com.lost.demo.Repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // Add a new item
    public Item addItem(Item item) {
        return itemRepository.save(item);
    }

    // Get all items
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // Search items by location (case-insensitive)
    public List<Item> searchByLocation(String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location);
    }

    // Find item by ID
    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    // Delete item by ID
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    // Clear all items (truncate)
    public void clearAllItems() {
        itemRepository.deleteAll();
    }
}
