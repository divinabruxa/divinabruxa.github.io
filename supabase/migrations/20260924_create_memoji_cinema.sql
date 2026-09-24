-- Divina Bruxa 3.0 · Cinema da Orbe
-- Cofre privado: o navegador nunca consulta esta tabela ou o bucket diretamente.

create table if not exists public.memoji_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'outros',
  accessibility_text text not null default '',
  video_path text not null unique,
  poster_path text unique,
  video_mime text not null,
  video_bytes bigint not null,
  poster_mime text,
  poster_bytes bigint,
  status text not null default 'draft',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memoji_videos_title_length check (char_length(title) between 1 and 120),
  constraint memoji_videos_description_length check (char_length(description) <= 600),
  constraint memoji_videos_accessibility_length check (char_length(accessibility_text) <= 240),
  constraint memoji_videos_category check (category in ('orbe','site','tarot','musica','cantando','bastidores','outros')),
  constraint memoji_videos_status check (status in ('draft','review','scheduled','published','archived')),
  constraint memoji_videos_video_bytes check (video_bytes between 1 and 536870912),
  constraint memoji_videos_poster_bytes check (poster_bytes is null or poster_bytes between 1 and 12582912),
  constraint memoji_videos_schedule check (status <> 'scheduled' or publish_at is not null)
);

alter table public.memoji_videos enable row level security;
revoke all on table public.memoji_videos from anon, authenticated;

create index if not exists memoji_videos_public_order_idx
  on public.memoji_videos (is_visible, status, sort_order, published_at desc);
create index if not exists memoji_videos_publish_at_idx
  on public.memoji_videos (publish_at)
  where status = 'scheduled' and is_visible = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memoji-videos-v626',
  'memoji-videos-v626',
  false,
  536870912,
  array['video/mp4','video/quicktime','video/webm','video/x-m4v','image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.memoji_videos is
  'Private editorial registry for owner-published Memoji videos. Accessed only by the guarded Edge Function.';
