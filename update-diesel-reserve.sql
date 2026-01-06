-- Update Diesel Reserve to 2200 L
UPDATE inventory_items 
SET quantity = 2200,
    last_updated = CURRENT_DATE
WHERE LOWER(name) = 'diesel' 
  AND category = 'Fuel'
  AND deleted_at IS NULL;

-- Verify the update
SELECT id, name, category, quantity, unit, min_level, last_updated
FROM inventory_items
WHERE LOWER(name) = 'diesel' 
  AND category = 'Fuel'
  AND deleted_at IS NULL;
