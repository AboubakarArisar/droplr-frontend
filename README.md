# Droplr Frontend

A modern, location-based file sharing application built with React and Vite. Droplr allows users to share files with people within a 200-meter radius, with automatic file deletion after 20 minutes.

## 🚀 Features

### Core Functionality

- **Location-Based File Sharing**: Share files with users within 200m radius
- **Automatic File Expiry**: Files are automatically deleted after 20 minutes
- **Real-Time Upload Progress**: Visual progress indicator during file uploads
- **Drag & Drop Interface**: Intuitive file upload with drag and drop support
- **Dynamic File Type Icons**: Visual file type recognition with custom icons
- **Countdown Timer**: Real-time countdown showing remaining file time

### Location & Security

- **High-Accuracy GPS Detection**: Multi-reading GPS averaging for better accuracy
- **Network Fallback**: IP-based geolocation when GPS is unavailable
- **Accuracy Indicators**: Visual feedback on location quality
- **Adaptive Search Radius**: Adjusts search area based on location accuracy
- **Secure File Handling**: Files stored securely with Cloudinary integration

### User Experience

- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **Mobile Responsive**: Optimized for all device sizes
- **Real-Time Updates**: Live file list updates and countdown timers
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **Loading States**: Smooth loading indicators throughout the app

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 4.1.4
- **Routing**: React Router DOM 7.5.1
- **Notifications**: React Hot Toast 2.5.2
- **Linting**: ESLint with React Hooks and Refresh plugins

## 📁 Project Structure

```
droplr-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Footer component
│   ├── pages/              # Main application pages
│   │   └── Zone.jsx        # File sharing zone page
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   ├── router.jsx          # Routing configuration
│   ├── config.js           # Application configuration
│   ├── App.css             # Global styles
│   └── index.css           # Base styles
├── public/                 # Public assets
├── dist/                   # Build output
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── vercel.json             # Deployment configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd droplr-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_API_URL=http://localhost:5000/api
   # If using deployed server:
   # VITE_API_URL=https://your-deployed-api.com/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Application Flow

### 1. Landing Page (`/`)

- **Location Detection**: Automatically detects user's GPS location
- **Accuracy Filtering**: Only accepts GPS readings with ≤50m accuracy
- **Multi-Reading Averaging**: Takes 3+ readings and calculates average location
- **Fallback Support**: Uses network-based location if GPS fails

### 2. File Sharing Zone (`/zone`)

- **File Upload**: Drag & drop or click to upload files
- **Progress Tracking**: Real-time upload progress with percentage
- **File Type Recognition**: Dynamic icons based on file extensions
- **Nearby Files**: Lists files within search radius (200m default)
- **Download Functionality**: One-click file downloads

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL`: Backend API endpoint URL

### Application Settings

- **File Expiry Time**: 20 minutes (configurable in `config.js`)
- **Default Search Radius**: 200 meters
- **Maximum File Size**: 100MB (Cloudinary limit)
- **GPS Accuracy Threshold**: 50 meters

## 🎨 UI Components

### Header Component

- Clean navigation header
- Responsive design
- Consistent branding

### Footer Component

- Application footer
- Links and information

### Zone Page

- **File Upload Area**: Drag & drop interface with visual feedback
- **Progress Bar**: Real-time upload progress
- **File List**: Nearby files with metadata
- **Download Buttons**: Individual file download controls
- **Refresh Button**: Manual file list refresh

## 📊 Location Handling

### GPS Detection Process

1. **High Accuracy Mode**: Enables high-accuracy GPS
2. **Multiple Readings**: Collects 3+ GPS readings
3. **Accuracy Filtering**: Only accepts readings ≤50m accuracy
4. **Location Averaging**: Calculates average from valid readings
5. **Fallback**: Uses network location if GPS fails

### Search Radius Adaptation

- **Good Accuracy** (≤100m): 200m search radius
- **Poor Accuracy** (>100m): 200m + accuracy meters (max 500m)

### Distance Calculations

- **Haversine Formula**: Accurate Earth-surface distance calculation
- **Dynamic Bounding Box**: Latitude-adjusted search area
- **Real-time Updates**: Live distance calculations

## 🔒 Security Features

### File Security

- **Secure URLs**: Cloudinary secure URLs for file access
- **Automatic Deletion**: Files deleted after 20 minutes
- **No Local Storage**: Files not stored locally
- **Access Control**: Location-based access only

### Location Privacy

- **Client-Side Processing**: Location data processed locally
- **No Location Storage**: Location not stored permanently
- **Accuracy Transparency**: Users see their location accuracy

## 🚀 Deployment

### Vercel Deployment

The project includes `vercel.json` for easy Vercel deployment:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] GPS location detection works on mobile devices
- [ ] File upload with progress tracking
- [ ] Drag & drop functionality
- [ ] File type icons display correctly
- [ ] Countdown timers work accurately
- [ ] Download functionality
- [ ] Error handling for network issues
- [ ] Mobile responsiveness
- [ ] Location accuracy indicators

## 🔧 Development

### Code Style

- **ESLint**: Configured with React-specific rules
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

### Key Dependencies

- **React Router**: Client-side routing
- **React Hot Toast**: User notifications
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server

## 📈 Performance

### Optimizations

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Efficient Re-renders**: Optimized React component updates
- **Minimal Bundle**: Tree-shaking and dead code elimination

### Monitoring

- **Build Size**: Monitor bundle size with `npm run build`
- **Performance**: Use React DevTools for component profiling
- **Network**: Monitor API calls and file uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Droplr** - Share files with people nearby, securely and efficiently.
