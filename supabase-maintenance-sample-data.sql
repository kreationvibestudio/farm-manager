-- Farm Maintenance Sample Data
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This creates realistic maintenance logs for the past 90 days

-- Clear existing maintenance logs (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE maintenance_logs CASCADE;

-- Insert realistic maintenance logs
DO $$
DECLARE
  supervisor1_id UUID;
  supervisor2_id UUID;
  supervisor3_id UUID;
BEGIN
  -- Get supervisor IDs
  SELECT id INTO supervisor1_id FROM staff WHERE name = 'Oluwaseun Adeyemi' LIMIT 1;
  SELECT id INTO supervisor2_id FROM staff WHERE name = 'Ngozi Okonkwo' LIMIT 1;
  SELECT id INTO supervisor3_id FROM staff WHERE name = 'Amina Mohammed' LIMIT 1;
  
  -- Insert maintenance logs for the past 90 days
  -- Maintenance activities typically happen less frequently than harvests
  INSERT INTO maintenance_logs (date, block_id, activity, supervisor_id, staff_count, notes) VALUES
    -- Recent maintenance (last 7 days)
    (CURRENT_DATE - INTERVAL '2 days', 'Block A-01', 'Slashing', supervisor1_id, 12, 'Routine slashing completed. Grass cleared around mature palms.'),
    (CURRENT_DATE - INTERVAL '3 days', 'Block B-02', 'Ring Weeding', supervisor2_id, 8, 'Ring weeding around young palms (3-5 years). Good progress.'),
    (CURRENT_DATE - INTERVAL '4 days', 'Block C-01', 'Fertilizer Application', supervisor3_id, 10, 'NPK 15:15:15 applied to mature palms. 2 bags per hectare.'),
    (CURRENT_DATE - INTERVAL '5 days', 'Block A-03', 'Pruning', supervisor1_id, 6, 'Removed dead fronds and low-hanging branches. Improved access for harvest.'),
    (CURRENT_DATE - INTERVAL '6 days', 'Block B-04', 'Slashing', supervisor2_id, 14, 'Heavy slashing in overgrown area. Requires follow-up in 2 weeks.'),
    
    -- Last week
    (CURRENT_DATE - INTERVAL '8 days', 'Block C-02', 'Ring Weeding', supervisor3_id, 9, 'Ring weeding completed. Area around palms cleared.'),
    (CURRENT_DATE - INTERVAL '9 days', 'Block A-05', 'Fertilizer Application', supervisor1_id, 11, 'Urea application to boost growth. Applied before rain.'),
    (CURRENT_DATE - INTERVAL '10 days', 'Block B-06', 'Pruning', supervisor2_id, 7, 'Selective pruning to improve light penetration.'),
    (CURRENT_DATE - INTERVAL '11 days', 'Block C-03', 'Slashing', supervisor3_id, 13, 'Standard slashing operation. All paths cleared.'),
    (CURRENT_DATE - INTERVAL '12 days', 'Block A-07', 'Ring Weeding', supervisor1_id, 8, 'Ring weeding in newly planted area. Careful around seedlings.'),
    
    -- Two weeks ago
    (CURRENT_DATE - INTERVAL '15 days', 'Block B-08', 'Fertilizer Application', supervisor2_id, 10, 'DAP fertilizer applied to flowering palms.'),
    (CURRENT_DATE - INTERVAL '16 days', 'Block C-04', 'Pruning', supervisor3_id, 6, 'Removed diseased fronds. Disposed of properly.'),
    (CURRENT_DATE - INTERVAL '17 days', 'Block A-09', 'Slashing', supervisor1_id, 12, 'Routine maintenance slashing. Good weather conditions.'),
    (CURRENT_DATE - INTERVAL '18 days', 'Block B-10', 'Ring Weeding', supervisor2_id, 9, 'Ring weeding completed. Mulch applied around base.'),
    (CURRENT_DATE - INTERVAL '19 days', 'Block C-05', 'Fertilizer Application', supervisor3_id, 11, 'NPK Create applied. Follow-up scheduled in 3 months.'),
    (CURRENT_DATE - INTERVAL '20 days', 'Block A-11', 'Pruning', supervisor1_id, 7, 'Pruning to maintain canopy structure.'),
    
    -- Three weeks ago
    (CURRENT_DATE - INTERVAL '22 days', 'Block B-11', 'Slashing', supervisor2_id, 14, 'Heavy slashing in Block B-11. Some areas need rework.'),
    (CURRENT_DATE - INTERVAL '23 days', 'Block C-06', 'Ring Weeding', supervisor3_id, 8, 'Ring weeding in high-density area.'),
    (CURRENT_DATE - INTERVAL '24 days', 'Block A-12', 'Fertilizer Application', supervisor1_id, 10, 'Potassium Sulphate applied to improve fruit quality.'),
    (CURRENT_DATE - INTERVAL '25 days', 'Block B-12', 'Pruning', supervisor2_id, 6, 'Selective pruning. Removed competing branches.'),
    (CURRENT_DATE - INTERVAL '26 days', 'Block C-07', 'Slashing', supervisor3_id, 13, 'Standard slashing operation.'),
    
    -- One month ago
    (CURRENT_DATE - INTERVAL '30 days', 'Block A-02', 'Ring Weeding', supervisor1_id, 9, 'Ring weeding around mature palms.'),
    (CURRENT_DATE - INTERVAL '32 days', 'Block B-01', 'Fertilizer Application', supervisor2_id, 11, 'NPK 15:15:15 applied. Good soil moisture.'),
    (CURRENT_DATE - INTERVAL '33 days', 'Block C-08', 'Pruning', supervisor3_id, 7, 'Pruning to improve harvest access.'),
    (CURRENT_DATE - INTERVAL '34 days', 'Block A-04', 'Slashing', supervisor1_id, 12, 'Routine slashing. All paths maintained.'),
    (CURRENT_DATE - INTERVAL '35 days', 'Block B-03', 'Ring Weeding', supervisor2_id, 8, 'Ring weeding completed. Area looks good.'),
    
    -- 5-6 weeks ago
    (CURRENT_DATE - INTERVAL '38 days', 'Block C-09', 'Fertilizer Application', supervisor3_id, 10, 'Urea application. Applied evenly across block.'),
    (CURRENT_DATE - INTERVAL '40 days', 'Block A-06', 'Pruning', supervisor1_id, 6, 'Removed dead and damaged fronds.'),
    (CURRENT_DATE - INTERVAL '41 days', 'Block B-05', 'Slashing', supervisor2_id, 14, 'Heavy slashing required. Overgrown areas cleared.'),
    (CURRENT_DATE - INTERVAL '42 days', 'Block C-10', 'Ring Weeding', supervisor3_id, 9, 'Ring weeding in young palm area.'),
    (CURRENT_DATE - INTERVAL '43 days', 'Block A-08', 'Fertilizer Application', supervisor1_id, 11, 'NPK Create applied. Good response expected.'),
    
    -- 7-8 weeks ago
    (CURRENT_DATE - INTERVAL '50 days', 'Block B-07', 'Pruning', supervisor2_id, 7, 'Pruning to maintain optimal canopy.'),
    (CURRENT_DATE - INTERVAL '52 days', 'Block C-11', 'Slashing', supervisor3_id, 13, 'Standard slashing operation.'),
    (CURRENT_DATE - INTERVAL '53 days', 'Block A-10', 'Ring Weeding', supervisor1_id, 8, 'Ring weeding completed. Mulch replenished.'),
    (CURRENT_DATE - INTERVAL '54 days', 'Block B-09', 'Fertilizer Application', supervisor2_id, 10, 'DAP fertilizer applied to flowering palms.'),
    (CURRENT_DATE - INTERVAL '55 days', 'Block C-01', 'Pruning', supervisor3_id, 6, 'Selective pruning. Improved light distribution.'),
    
    -- 9-10 weeks ago
    (CURRENT_DATE - INTERVAL '60 days', 'Block A-13', 'Slashing', supervisor1_id, 12, 'Routine maintenance slashing.'),
    (CURRENT_DATE - INTERVAL '62 days', 'Block B-06', 'Ring Weeding', supervisor2_id, 9, 'Ring weeding in mature palm area.'),
    (CURRENT_DATE - INTERVAL '63 days', 'Block C-02', 'Fertilizer Application', supervisor3_id, 11, 'NPK 15:15:15 applied. Good soil conditions.'),
    (CURRENT_DATE - INTERVAL '64 days', 'Block A-01', 'Pruning', supervisor1_id, 7, 'Pruning completed. Removed low-hanging fronds.'),
    (CURRENT_DATE - INTERVAL '65 days', 'Block B-08', 'Slashing', supervisor2_id, 14, 'Heavy slashing in overgrown section.'),
    
    -- 11-12 weeks ago (older maintenance)
    (CURRENT_DATE - INTERVAL '70 days', 'Block C-03', 'Ring Weeding', supervisor3_id, 8, 'Ring weeding around young palms.'),
    (CURRENT_DATE - INTERVAL '72 days', 'Block A-05', 'Fertilizer Application', supervisor1_id, 10, 'Urea application. Applied before expected rain.'),
    (CURRENT_DATE - INTERVAL '73 days', 'Block B-10', 'Pruning', supervisor2_id, 6, 'Pruning to improve harvest efficiency.'),
    (CURRENT_DATE - INTERVAL '74 days', 'Block C-04', 'Slashing', supervisor3_id, 13, 'Standard slashing. All areas covered.'),
    (CURRENT_DATE - INTERVAL '75 days', 'Block A-07', 'Ring Weeding', supervisor1_id, 9, 'Ring weeding completed. Good progress.'),
    
    -- Additional maintenance entries for variety
    (CURRENT_DATE - INTERVAL '80 days', 'Block B-11', 'Fertilizer Application', supervisor2_id, 11, 'NPK Create applied. Monitoring growth response.'),
    (CURRENT_DATE - INTERVAL '82 days', 'Block C-05', 'Pruning', supervisor3_id, 7, 'Removed diseased and dead fronds.'),
    (CURRENT_DATE - INTERVAL '83 days', 'Block A-09', 'Slashing', supervisor1_id, 12, 'Routine slashing operation.'),
    (CURRENT_DATE - INTERVAL '85 days', 'Block B-12', 'Ring Weeding', supervisor2_id, 8, 'Ring weeding in high-density planting area.'),
    (CURRENT_DATE - INTERVAL '86 days', 'Block C-06', 'Fertilizer Application', supervisor3_id, 10, 'Potassium Sulphate applied to improve fruit quality.'),
    
    -- Some entries without supervisor (optional field)
    (CURRENT_DATE - INTERVAL '45 days', 'Block A-03', 'Slashing', NULL, 12, 'Routine slashing. Supervisor unavailable.'),
    (CURRENT_DATE - INTERVAL '58 days', 'Block B-04', 'Ring Weeding', NULL, 9, 'Ring weeding completed by field team.'),
    
    -- Some entries without staff count (optional field)
    (CURRENT_DATE - INTERVAL '67 days', 'Block C-07', 'Pruning', supervisor3_id, NULL, 'Pruning operation. Staff count not recorded.'),
    (CURRENT_DATE - INTERVAL '78 days', 'Block A-11', 'Fertilizer Application', supervisor1_id, NULL, 'Fertilizer applied by specialized team.')
  ON CONFLICT DO NOTHING;

END $$;

-- Verify data insertion
SELECT 
  (SELECT COUNT(*) FROM maintenance_logs) as total_maintenance_logs,
  (SELECT COUNT(*) FROM maintenance_logs WHERE activity = 'Slashing') as slashing_count,
  (SELECT COUNT(*) FROM maintenance_logs WHERE activity = 'Pruning') as pruning_count,
  (SELECT COUNT(*) FROM maintenance_logs WHERE activity = 'Ring Weeding') as ring_weeding_count,
  (SELECT COUNT(*) FROM maintenance_logs WHERE activity = 'Fertilizer Application') as fertilizer_count,
  (SELECT COUNT(DISTINCT block_id) FROM maintenance_logs) as unique_blocks_maintained;
