# Program Registration Form

A production-ready registration form website with email and SMS confirmation notifications. Built with a focus on visual design, accessibility, and user experience.

## Features

- **Beautiful UI**: Earth-tone color palette with elegant typography
- **Animated Background**: Subtle video background with fallback support
- **Form Validation**: Real-time client-side and server-side validation
- **Email Notifications**: Automatic confirmation emails via SMTP
- **SMS Notifications**: SMS confirmations via Twilio
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized assets and lazy loading

## Project Structure

```
toursignup/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Form validation and submission
├── server.js           # Express backend API
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

**For Email (SMTP):**
- Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833)
- SendGrid: Use your SMTP credentials
- Resend: Use their SMTP settings

**For SMS (Twilio):**
- Sign up at [Twilio](https://www.twilio.com/)
- Get your Account SID, Auth Token, and Phone Number
- Add them to `.env`

### 3. Add Background Video (Optional)

Place your background video in an `assets/` folder:
- `assets/background-video.mp4`
- `assets/background-video.webm` (optional, for better browser support)

The video should be:
- Dark, subtle imagery (chariots, cherubs, seraphim, or abstract)
- Compressed for web (H.264 codec)
- Loopable
- Duration: 10-30 seconds

If no video is provided, the site will use a static gradient fallback.

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Configuration Options

### Email Providers

**Gmail:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Resend:**
```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key
```

### SMS (Twilio)

1. Create a Twilio account
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number or use a trial number
4. Add credentials to `.env`

## Form Fields

The registration form collects:
- **Full Name** (required)
- **Email Address** (required, validated)
- **Phone Number** (required, international format)
- **WhatsApp Number** (required, international format)
- **How did you hear about the event?** (required, dropdown)
- **School / Program Name** (required)

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-sand: #d4c5a9;
    --color-clay: #b8956a;
    --color-olive: #8b8b6f;
    --color-charcoal: #2c2c2c;
    --color-yellow: #f4d03f;
}
```

### Typography

Change fonts in `index.html` and `styles.css`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

### Email Template

Edit the email HTML template in `server.js` (around line 80).

## Production Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:
- Heroku: Use Config Vars
- Vercel: Use Environment Variables
- AWS: Use Parameter Store or Secrets Manager

### Security

- Never commit `.env` to version control
- Use strong passwords and API keys
- Enable HTTPS in production
- Consider rate limiting for the API endpoint

### Performance

- Compress background video (use tools like HandBrake)
- Optimize images
- Enable gzip compression
- Use a CDN for static assets

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support
- High contrast mode support

## License

Copyright © 2025 ResetGlobalPeople. All Rights Reserved

