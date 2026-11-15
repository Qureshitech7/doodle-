#!/bin/bash
# Resumable frame renderer for the doodle-video demo.
# Renders every frame (duration x 30 fps) in batches of 120 via
# tools/capture.mjs `frames` mode (one JPEG per time, written to disk).
# If Chrome's renderer dies mid-batch, only that batch is lost: the driver
# retries it, skipping frames already on disk. Finally encodes the JPEG
# sequence into renders/demo.mp4 (silent unless data/mix.wav exists).
#
# Requirements: Node 22+, headless Chrome (set CHROME=/path/to/chrome),
# ffmpeg. No npm install needed — capture.mjs uses only Node built-ins.
set -u
cd "$(dirname "$0")" || exit 1
# Resolve headless Chrome: $CHROME wins, else try common locations.
# (capture.mjs has its own fallback list too — set CHROME if yours is
# somewhere unusual, e.g. a Remotion headless-shell binary.)
if [ -z "${CHROME:-}" ]; then
  for c in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$c" >/dev/null 2>&1; then CHROME=$(command -v "$c"); break; fi
  done
fi
export CHROME
SEQ=review/frames/seq
BATCH_DIR=review/fb
DUR=$(python3 -c "import json;print(json.load(open('data/lines.json'))['duration'])")
N=$(python3 -c "print(int(float('$DUR')*30))")
BATCH=120
mkdir -p "$SEQ" "$BATCH_DIR" renders

cleanup_chrome() {
  pkill -f "chrome-headless-shel[l]" 2>/dev/null
  sleep 2
  rm -rf /tmp/fs-chrome-* 2>/dev/null
}

# sanity check first: boot, list shots, draw every 0.25 s
node tools/capture.mjs check || { echo "CHECK FAILED — fix the error above first"; exit 1; }

fail=0
b=0
while [ $((b * BATCH)) -lt $N ]; do
  start=$((b * BATCH))
  end=$((start + BATCH))
  [ $end -gt $N ] && end=$N
  missing=""
  for ((i = start; i < end; i++)); do
    f=$(printf "%s/f%04d.jpg" "$SEQ" $((i + 1)))
    [ -f "$f" ] || missing="$missing $i"
  done
  if [ -z "$missing" ]; then echo "batch $b ($start-$((end - 1))): already done"; b=$((b + 1)); continue; fi
  echo "batch $b ($start-$((end - 1))): rendering $(echo "$missing" | wc -w) frames"
  ok=0
  for attempt in 1 2 3; do
    missing=""
    for ((i = start; i < end; i++)); do
      f=$(printf "%s/f%04d.jpg" "$SEQ" $((i + 1)))
      [ -f "$f" ] || missing="$missing $i"
    done
    if [ -z "$missing" ]; then ok=1; break; fi
    rm -rf "$BATCH_DIR"; mkdir -p "$BATCH_DIR"
    times=""
    for i in $missing; do
      t=$(awk -v i="$i" 'BEGIN { printf "%.4f", i / 30 }')
      times="${times:+$times,}$t"
    done
    timeout 600 node tools/capture.mjs frames "$BATCH_DIR" "$times" >/tmp/doodle-render-out.log 2>&1
    rc=$?
    salvaged=0
    for i in $missing; do
      tf=$(awk -v i="$i" 'BEGIN { printf "t%.2f.jpg", i / 30 }')
      dest=$(printf "%s/f%04d.jpg" "$SEQ" $((i + 1)))
      if [ -f "$BATCH_DIR/$tf" ]; then mv "$BATCH_DIR/$tf" "$dest"; salvaged=$((salvaged + 1)); fi
    done
    echo "  attempt $attempt: rc=$rc, salvaged $salvaged frames"
    remaining=0
    for ((i = start; i < end; i++)); do
      f=$(printf "%s/f%04d.jpg" "$SEQ" $((i + 1)))
      [ -f "$f" ] || remaining=$((remaining + 1))
    done
    if [ $remaining -eq 0 ]; then ok=1; break; fi
    echo "  attempt $attempt: $remaining frames still missing, retrying"; cleanup_chrome
  done
  if [ $ok -ne 1 ]; then echo "batch $b FAILED after 3 attempts"; fail=1; break; fi
  echo "batch $b done"
  b=$((b + 1))
done
[ $fail -ne 0 ] && { echo "RENDER INCOMPLETE"; exit 1; }

count=$(ls "$SEQ"/f*.jpg 2>/dev/null | wc -l)
echo "frames on disk: $count / $N"
[ "$count" -ne "$N" ] && { echo "RENDER INCOMPLETE: missing frames"; exit 1; }

echo "encoding MP4..."
if [ -f data/mix.wav ]; then
  ffmpeg -v error -y -framerate 30 -i "$SEQ/f%04d.jpg" -i data/mix.wav \
    -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -shortest -movflags +faststart renders/demo.mp4
else
  ffmpeg -v error -y -framerate 30 -i "$SEQ/f%04d.jpg" -f lavfi -i anullsrc=r=48000:cl=stereo \
    -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -shortest -movflags +faststart renders/demo.mp4
fi
echo "encode rc=$?"
ls -la renders/demo.mp4
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate -of default=noprint_wrappers=1 renders/demo.mp4
echo DONE
