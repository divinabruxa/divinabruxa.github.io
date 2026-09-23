-- DIVINA BRUXA · V626 · MEMOJIS NATIVOS
-- Aplicar no projeto STAGING antes de publicar a Edge Function.
-- A tabela não é exposta a anon/authenticated; somente a função server-side,
-- com service_role, pode ler ou alterar o cofre editorial.

begin;

create table if not exists public.memoji_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 600),
  category text not null default 'orbe'
    check (category in ('orbe','site','tarot','musica','cantando','bastidores','outros')),
  accessibility_text text not null default '' check (char_length(accessibility_text) <= 240),
  video_path text not null unique check (video_path !~ '(^|/)\.\.(/|$)'),
  poster_path text check (poster_path is null or poster_path !~ '(^|/)\.\.(/|$)'),
  video_mime text not null check (video_mime in ('video/mp4','video/quicktime','video/webm','video/x-m4v')),
  video_bytes bigint not null check (video_bytes > 0 and video_bytes <= 536870912),
  poster_mime text check (poster_mime is null or poster_mime in ('image/jpeg','image/png','image/webp','image/avif')),
  poster_bytes bigint check (poster_bytes is null or (poster_bytes > 0 and poster_bytes <= 12582912)),
  status text not null default 'draft'
    check (status in ('draft','review','scheduled','published','archived')),
  is_visible boolean not null default true,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memoji_videos_schedule_required
    check (status <> 'scheduled' or publish_at is not null)
);

create index if not exists memoji_videos_public_order_idx
  on public.memoji_videos (status, is_visible, sort_order, published_at desc);
create index if not exists memoji_videos_publish_at_idx
  on public.memoji_videos (publish_at)
  where status = 'scheduled' and is_visible = true;
create index if not exists memoji_videos_created_by_idx
  on public.memoji_videos (created_by, created_at desc);

alter table public.memoji_videos enable row level security;
alter table public.memoji_videos force row level security;

revoke all on table public.memoji_videos from public, anon, authenticated;
grant select, insert, update, delete on table public.memoji_videos to service_role;

create or replace function public.touch_memoji_videos_v626()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.touch_memoji_videos_v626() from public, anon, authenticated;
grant execute on function public.touch_memoji_videos_v626() to service_role;

drop trigger if exists touch_memoji_videos_v626 on public.memoji_videos;
create trigger touch_memoji_videos_v626
before update on public.memoji_videos
for each row execute function public.touch_memoji_videos_v626();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memoji-videos-v626',
  'memoji-videos-v626',
  false,
  536870912,
  array[
    'video/mp4','video/quicktime','video/webm','video/x-m4v',
    'image/jpeg','image/png','image/webp','image/avif'
  ]::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

comment on table public.memoji_videos is
  'V626: catálogo privado de Memojis; leitura pública somente pela Edge Function com filtragem published-only.';

notify pgrst, 'reload schema';

commit;
