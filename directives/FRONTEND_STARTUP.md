# Slagie Frontend React Setup Guide

## 🚀 Frontend Server Starten

### Met Docker Compose

```bash
docker-compose up frontend
```

Frontend beschikbaar op: http://localhost:3000

### Lokaal Development

#### Stap 1: Dependencies installeren

```bash
cd frontend
npm install
```

#### Stap 2: Environment Setup

Maak `.env` bestand in `frontend/` map:

```
REACT_APP_API_URL=http://localhost:8000/api
```

#### Stap 3: Development Server Starten

```bash
npm start
```

Frontend opent automatisch op: http://localhost:3000

## 📁 Project Structuur

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Root component
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles
│   ├── api.js              # API client (axios)
│   ├── pages/
│   │   ├── LandingPage.js  # Home page
│   │   └── Dashboard.js    # Topics overview
│   └── components/
│       └── TopicCard.js    # Topic card component
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind theming
├── postcss.config.js       # PostCSS config
└── Dockerfile              # Container config
```

## 🎨 Styling

### Tailwind CSS Colors

```javascript
// tailwind.config.js
colors: {
  "slagie-teal": "#14b8a6",      // Primary
  "slagie-green": "#10b981",     // Secondary
  "slagie-accent": "#FF7F50",    // CTA buttons (Orange)
}
```

### Gradient Header

```jsx
<div className="bg-slagie-gradient text-white">
  {/* Teal to Green gradient */}
</div>
```

### Button Classes

```jsx
// Primary (Orange)
<button className="btn btn-primary">Action</button>

// Secondary (White)
<button className="btn btn-secondary">Contact</button>
```

## 🌐 Pages

### `/` - Landing Page

- Hero section met gradient
- CTA buttons
- Features showcase
- Footer

### `/dashboard` - Topic Dashboard

- Overzicht van alle CBR thema's
- Card-based layout
- Topics met statistieken
- Start buttons per thema

## 🔌 API Integration

### `src/api.js` Client

```javascript
import { getTopics, getTopic, getSubtopic, getQuestion } from './api';

// Haal alle topics op
const response = await getTopics();
console.log(response.data); // Array van topics
```

### Environment Variables

```
REACT_APP_API_URL=http://localhost:8000/api
```

Wijzig deze URL voor production!

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.3.6"
}
```

## 🛠️ Build voor Production

```bash
npm run build
```

Dit maakt optimized production build in `build/` folder.

## 🧹 Cleanup

```bash
# Verwijder node_modules
npm prune

# Maak cache schoon
npm cache clean --force
```

## ❌ Troubleshooting

### "Cannot GET /dashboard"
- React Router setup issue
- Zorg dat App.js Router correct is ingesteld
- Check browser console voor errors

### API calls falen
- Zorg dat backend draait op http://localhost:8000
- Check REACT_APP_API_URL in .env
- Open browser console voor detailfoutmeldingen

### Tailwind styles laden niet
- `npm run build` en refresh
- Check `tailwind.config.js` content paths
- Zorg dat `index.css` `@tailwind` directieven heeft

### Port 3000 in gebruik
- Gebruik ander port: `PORT=3001 npm start`

## 🚀 Deployment Tips

1. Build optimized version: `npm run build`
2. Deploy `build/` folder naar hosting service
3. Update `REACT_APP_API_URL` naar production API URL
4. Setup environment variables op hosting platform

---

Veel plezier met Slagie frontend! 🎉
