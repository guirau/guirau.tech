#!/usr/bin/env bash
# Produces assets/face-{512,1024,1536}.jpg from the source portrait.
#
# Deliberately does NOT key the amber backdrop. Chroma-keying amber from skin
# and curly hair is failure-prone and irreversible once baked; §4.5 removes
# the backdrop by FRAMING instead, and §6.1's radial vignette finishes the job.
# Shirt and shoulders are cropped out entirely; eyes land on the upper third.
set -euo pipefail

cd "$(dirname "$0")/../.."
SRC="../../docs/reference/me.jpg"

# The crop box below is tuned to THIS 1600x1600 export. A different source
# (re-export, swap) must fail loudly, not silently re-frame the face.
DIMS="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$SRC")"
[ "$DIMS" = "1600,1600" ] || {
  echo "source is ${DIMS}, expected 1600,1600 -- re-measure the crop landmarks before regenerating" >&2
  exit 1
}

# 755x755 square from a 1600x1600 source, offset +432,+238.
#
# The brief's landmarks (face centre x~810, hairline y~50, chin y~960) were
# measured loosely; a naive crop built from them puts the eyes at the dead
# vertical centre and clips into the chin. Both are called out in the plan as
# failure conditions, so this box was tuned against the actual pixels
# (luma-sampled at the crop edges) rather than the raw landmarks:
#   - Eyes sample at source y~525, and a pure-black shirt/collar pixel first
#     appears at y~1000 (x~560-570, the left collar point) -- luma goes from
#     ~180 (amber) to <10 (fabric) between y=990 and y=1010. Everything below
#     this script's crop-bottom (238+755=993) is verified skin, hair, or
#     background at every x in the box, never shirt.
#   - Solving for the eyes to land on the box's upper third against that
#     y=993 floor gives box size 755 and top offset 238. That verified floor
#     is what sets the box size here, not the brief's chin~960 estimate,
#     which measured about 30-70px short of where the jaw actually ends.
#   - Width 755 centred on x~810 (432..1187) keeps both ears inside the
#     frame with a slim amber margin either side.
CROP="crop=755:755:432:238"

for size in 512 1024 1536; do
  ffmpeg -y -loglevel error -i "$SRC" \
    -vf "${CROP},scale=${size}:${size}:flags=lanczos" \
    -q:v 3 "assets/face-${size}.jpg"
  echo "  assets/face-${size}.jpg  $(wc -c < "assets/face-${size}.jpg") bytes"
done
