CREATE POLICY "Allow uploads" ON storage.objects FOR
  INSERT WITH CHECK (
    bucket_id = 'tasks' AND auth.role() = 'anon'
  );

CREATE POLICY "Allow downloads" ON storage.objects FOR
  SELECT USING (
    bucket_id = 'tasks' AND auth.role() = 'anon'
  );
