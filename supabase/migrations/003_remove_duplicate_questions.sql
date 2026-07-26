update public.questions
set
  publication_status = 'archived',
  updated_at = now(),
  updated_by = auth.uid()
where id in ('pokedex-001', 'item-comparaison-45')
  and publication_status <> 'archived';
