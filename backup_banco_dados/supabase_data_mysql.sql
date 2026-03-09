-- Supabase JSON to MySQL Migration Dump
-- Generated at: 2026-03-09T12:23:19.184Z

SET FOREIGN_KEY_CHECKS=0;

INSERT INTO `invoices` (`id`, `client_id`, `number`, `issue_date`, `value`, `status`, `file_url`, `file_type`, `notes`, `created_at`) VALUES 
  ('490527b8-c4bc-4556-8e79-dd9a9d4cf1df', '532e291e-9463-4ef5-8066-f97e5970b2ec', '0000001', '2025-12-04', 25000, 'Pago', 'https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/client-documents/532e291e-9463-4ef5-8066-f97e5970b2ec/1769037614378.pdf', 'pdf', '', '2026-01-21T23:20:16.355385+00:00'),
  ('ec05b817-07cd-49b0-8dfb-cb066d1f0201', 'a0915a19-fa78-41f1-96a7-c91f09ff93a9', '77', '2025-07-25', 12000, 'Pago', 'https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/client-documents/a0915a19-fa78-41f1-96a7-c91f09ff93a9/1769038143120.xml', 'xml', '', '2026-01-21T23:29:04.500811+00:00');

SET FOREIGN_KEY_CHECKS=1;
