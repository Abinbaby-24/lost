package com.lost.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.lost.demo.Repository.ItemRepository;
import com.lost.demo.model.Item;
import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // Get all items (newest first)
    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAllByOrderByCreatedAtDesc();
    }

    // Add new item
    @PostMapping
    public Item createItem(@RequestBody Item item) {
        // The enum conversion should happen automatically by Spring
        // Remove the manual conversion as it might cause issues
        return itemRepository.save(item);
    }

    // Search items by location
    @GetMapping("/search")
    public List<Item> searchByLocation(@RequestParam String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location);
    }

    // Search items by name OR location (for your search box)
    @GetMapping("/searchAll")
    public List<Item> searchByNameOrLocation(@RequestParam String query) {
        return itemRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query);
    }
}