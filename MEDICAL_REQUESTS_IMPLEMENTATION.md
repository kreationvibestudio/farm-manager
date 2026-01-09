# Medical Requests & Feature Updates Implementation

## Summary

This document outlines all the new features and updates implemented in this session.

## 1. Medical Request System ✅

### Features Implemented:
- **Complete approval workflow**: Staff → Supervisor → Manager
- **Work-related tracking**: Only work-related requests are approved for payment
- **Payment tracking**: Managers can record payments for approved work-related requests
- **Role-based access**: 
  - Staff/Workers can create requests and view their own
  - Supervisors can approve/reject pending requests
  - Managers can approve/reject supervisor-approved requests and record payments
- **Filtering**: By status, urgency, and work-related status
- **Statistics dashboard**: Shows total, pending, approved, and pending payment counts

### Files Created:
- `supabase-medical-requests-schema.sql` - Database schema
- `src/app/medical-requests/page.tsx` - Main page
- `src/components/medical-requests/CreateMedicalRequestModal.tsx` - Create request modal
- `src/components/medical-requests/MedicalRequestTable.tsx` - Request table with actions
- `src/components/medical-requests/PaymentModal.tsx` - Payment recording modal
- `src/lib/api/medical-requests.ts` - API service functions
- `src/app/api/medical-requests/route.ts` - GET and POST endpoints
- `src/app/api/medical-requests/[id]/route.ts` - PUT endpoint for approvals/payments

### Database Migration Required:
Run `supabase-medical-requests-schema.sql` in your Supabase SQL Editor.

## 2. Harvest Log - Palm Type ✅

### Features Implemented:
- Added "Palm Type" dropdown with options:
  - Adult Palm
  - Young Palm
- Field is optional in the harvest log form

### Files Modified:
- `src/types/index.ts` - Added `PalmType` type and `palmType` field to `HarvestLog`
- `src/components/harvest/LogHarvestModal.tsx` - Added palm type dropdown
- `src/lib/api/harvest.ts` - Updated to handle palm type in all CRUD operations

### Database Migration Required:
Run `supabase-harvest-add-palm-type.sql` in your Supabase SQL Editor.

## 3. Farm Maintenance - Road Maintenance ✅

### Features Implemented:
- Added "Road Maintenance" as a new activity type
- Road maintenance is tracked per block (like other activities)
- Included in the activity timeline chart

### Files Modified:
- `src/types/index.ts` - Added 'Road Maintenance' to `MaintenanceActivity` type
- `src/components/maintenance/LogMaintenanceModal.tsx` - Added Road Maintenance option
- `src/components/maintenance/ActivityTimelineChart.tsx` - Added Road Maintenance to chart

### Database Migration Required:
Run `supabase-maintenance-add-road-maintenance.sql` in your Supabase SQL Editor.

## 4. Navigation Updates ✅

### Changes:
- Added "Medical Requests" to sidebar navigation with Heart icon
- Positioned between "Staff Management" and "Financial Management"

### Files Modified:
- `src/components/layout/Sidebar.tsx` - Added medical requests menu item

## Database Migrations Required

**IMPORTANT**: Run these SQL scripts in your Supabase Dashboard → SQL Editor in this order:

1. `supabase-medical-requests-schema.sql` - Creates medical_requests table
2. `supabase-harvest-add-palm-type.sql` - Adds palm_type column to harvest_logs
3. `supabase-maintenance-add-road-maintenance.sql` - Updates maintenance_logs constraint

## Business Rules

### Medical Requests:
1. **Work-Related Requirement**: Only medical requests marked as "work-related" will be approved for payment
2. **Approval Flow**:
   - Staff submits request → Status: "Pending"
   - Supervisor approves/rejects → Status: "Approved by Supervisor" or "Rejected by Supervisor"
   - Manager approves/rejects → Status: "Approved by Manager" or "Rejected by Manager"
3. **Payment**:
   - If request is approved by Manager AND is work-related → `payment_status` = "Approved for Payment"
   - Manager can then record payment details (amount, date, reference)
   - Once payment is recorded → `payment_status` = "Paid"
4. **Access Control**:
   - Staff/Workers: Can create requests and view only their own
   - Supervisors: Can view all requests and approve/reject pending ones
   - Managers: Can view all requests, approve/reject supervisor-approved ones, and record payments

## Testing Checklist

- [ ] Run all database migrations
- [ ] Test creating a medical request as staff
- [ ] Test approving/rejecting as supervisor
- [ ] Test approving/rejecting as manager
- [ ] Test recording payment for work-related approved request
- [ ] Test that non-work-related requests don't get payment status
- [ ] Test harvest log with palm type selection
- [ ] Test logging road maintenance activity
- [ ] Verify road maintenance appears in activity timeline chart

## Notes

- Medical requests require staff to be registered in the staff system
- The system matches users by name (case-insensitive partial match)
- Payment can only be recorded for requests that are:
  - Approved by Manager
  - Work-related
  - Have payment status "Approved for Payment"
  - Not already paid
