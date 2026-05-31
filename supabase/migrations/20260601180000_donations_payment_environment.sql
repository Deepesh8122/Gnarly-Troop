-- Tag each donation with the PhonePe mode active when payment was initiated.
alter table public.donations
  add column if not exists payment_environment text;

alter table public.donations
  drop constraint if exists donations_payment_environment_check;

alter table public.donations
  add constraint donations_payment_environment_check
  check (payment_environment is null or payment_environment in ('sandbox', 'production'));

create index if not exists donations_payment_environment_idx
  on public.donations (payment_environment);

comment on column public.donations.payment_environment is
  'PhonePe mode when payment started: sandbox (UAT/test) or production (live).';
