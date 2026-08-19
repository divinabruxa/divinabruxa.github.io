#!/usr/bin/env python3
"""
ORBE DAS REALIDADES — LIMPEZA SEGURA 8.0

Objetivo:
- NÃO apagar as 78 cartas.
- NÃO apagar CNAME.
- Manter somente o núcleo da Orbe Viva 8.0 na raiz.
- Remover versões HTML/JS/CSS antigas conhecidas que podem causar confusão.
- Fazer BACKUP antes de excluir.
- NÃO entra em assets/cards nem apaga imagens .jpg/.jpeg/.png/.webp.

Uso:
  python limpar_orbe.py /caminho/da/pasta-do-site
"""

from pathlib import Path
import shutil, sys, time

KEEP_ROOT = {
    "index.html",
    "styles.css",
    "app.js",
    "sw.js",
    "manifest.webmanifest",
    "icon.svg",
    "CNAME",
    ".nojekyll",
    "README.md",
    "LICENSE",
}

# Arquivos antigos conhecidos/compatíveis com versões anteriores.
OLD_EXACT = {
    "index-orbe-viva.html",
    "ORBE-DAS-REALIDADES-VIVA.html",
    "ORBE-SUPREMA-index.html",
    "ORBE-CANALIZACAO-IA-V2.html",
}

OLD_PATTERNS = (
    "orbe-viva",
    "orbe_suprema",
    "orbe-suprema",
    "canalizacao-ia",
    "canalização-ia",
    "index-old",
    "index_old",
    "index-backup",
    "index_backup",
    "app-old",
    "app_old",
    "styles-old",
    "styles_old",
)

PROTECTED_DIRS = {
    ".git", ".github", "assets", "cards", "images", "img",
    "supabase", "functions"
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic"}

def is_old_candidate(p: Path):
    name = p.name
    low = name.lower()
    if name in OLD_EXACT:
        return True
    if p.suffix.lower() in {".html", ".htm", ".js", ".css"}:
        return any(token in low for token in OLD_PATTERNS)
    return False

def main():
    if len(sys.argv) < 2:
        print("Arraste a pasta do site para este script ou execute:")
        print("python limpar_orbe.py /caminho/da/pasta-do-site")
        raise SystemExit(2)

    site = Path(sys.argv[1]).expanduser().resolve()
    if not site.is_dir():
        print("ERRO: pasta não encontrada:", site)
        raise SystemExit(2)

    # Proteções essenciais
    if not (site / "index.html").exists():
        print("ABORTADO: index.html não encontrado. Nenhum arquivo foi apagado.")
        raise SystemExit(1)

    # Nunca mexe em imagens nem em diretórios protegidos.
    candidates = []
    for p in site.iterdir():
        if p.name in KEEP_ROOT or p.name in PROTECTED_DIRS:
            continue
        if p.is_dir():
            continue
        if p.suffix.lower() in IMAGE_EXTS:
            continue
        if is_old_candidate(p):
            candidates.append(p)

    print("\nORBE DAS REALIDADES — LIMPEZA SEGURA 8.0")
    print("Pasta:", site)
    print("\nPROTEGIDOS:")
    print("- index.html / styles.css / app.js / sw.js")
    print("- manifest.webmanifest / icon.svg / CNAME")
    print("- assets/, cards/, images/, img/")
    print("- TODAS as imagens")
    print("- supabase/ e functions/ (não serão tocados)")

    if not candidates:
        print("\nNenhum arquivo antigo conhecido foi encontrado. Nada foi apagado.")
        return

    print("\nARQUIVOS ANTIGOS ENCONTRADOS:")
    for p in candidates:
        print(" -", p.name)

    backup = site / ("_BACKUP_ANTES_DA_LIMPEZA_" + time.strftime("%Y%m%d-%H%M%S"))
    backup.mkdir()
    for p in candidates:
        shutil.copy2(p, backup / p.name)

    print("\nBackup criado em:", backup.name)
    print("Agora removendo SOMENTE os arquivos listados acima...")
    for p in candidates:
        p.unlink()

    print("\nLIMPEZA CONCLUÍDA.")
    print("As cartas, imagens, CNAME e pastas protegidas não foram alteradas.")
    print("Depois, publique/commit as exclusões no GitHub e recarregue o site.")

if __name__ == "__main__":
    main()
