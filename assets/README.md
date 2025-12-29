# Assets Directory

## Background Video

Place your background video files here:

- `background-video.mp4` - Main video file (H.264 codec recommended)
- `background-video.webm` - Optional WebM format for better browser support

### Video Requirements

- **Subject**: Chariots, cherubs, seraphim, or abstract sacred imagery
- **Style**: Dark, low-light, subtle motion
- **Duration**: 10-30 seconds (will loop)
- **Resolution**: 1920x1080 or higher
- **Format**: MP4 (H.264) or WebM
- **File Size**: Compress to under 5MB for web performance

### Video Optimization Tips

1. Use HandBrake or FFmpeg to compress:
   ```bash
   ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k background-video.mp4
   ```

2. Create WebM version for better compression:
   ```bash
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus background-video.webm
   ```

3. Ensure video is loopable (smooth start/end)

### Fallback

If no video is provided, the site will automatically use a static gradient background that matches the earth-tone theme.

