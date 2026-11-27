# NEXFIT exercise image assets

This directory is the NEXFIT-owned, public copy of exercise demonstration images.

## Layout
- `library/<exercise-slug>/{start,end,hold}.webp`: byte-for-byte copies of the image files referenced by the current catalog.
- `custom/`: NEXFIT-owned exercise images supplied for the catalog.

## Source and provenance
The `library/` files are mirrored from `MarvinNazari/exercise-images` at commit `2786aefa4b36a08faeca8114e0d1eb0af3ef6732`, under CC0-1.0. The source URLs and exact destination paths are recorded in `.github/assets-mirror/manifest.json`.

The mirror workflow verifies the WEBP file signature before committing files. Once the mirror is complete, catalog URLs should point to this repository rather than the upstream repository. Keep the source snapshot and manifest for provenance; do not delete the upstream project or alter existing training records.
