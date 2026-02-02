# Questerix Landing Pages

The marketing and subject hub frontend for the Questerix education platform.
Built with **React**, **Vite**, and **Tailwind CSS v4**.

## 🚀 Features
- **High-Fidelity Design**: Glassmorphism headers, gradients, and noise textures.
- **Mobile-First**: Fully responsive navigation with a smooth hamburger drawer.
- **Dynamic Routing**: Supports root (`/`) and subject hubs (`/?subdomain=math`).
- **Ecosystem Integration**: Directly links to the Student App for authentication.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (using `@theme` and native CSS variables)
- **Icons**: Lucide React
- **Deployment**: Ready for Cloudflare Pages (SPA mode)

## 🏃‍♂️ Running Locally

This app is designed to work alongside the Student App.

### 1. Start the Landing Page
```bash
# Install dependencies
npm install

# Run the dev server (Port 5175 is recommended)
npm run dev -- --port 5175 --host 127.0.0.1
```
Access at: `http://127.0.0.1:5175`

### 2. Start the Student App (Required for Login Links)
The "Get Started" and "Log in" buttons redirect to `localhost:3000`.
You must have the Student App running on this port.

```bash
cd ../student-app
flutter run -d web-server --web-port=3000 --web-hostname=127.0.0.1
```

## 📱 Mobile Verification
To test the mobile layout:
1. Open Chrome DevTools (`F12`).
2. Toggle Device Toolbar (`Ctrl+Shift+M`).
3. Select "iPhone 12 Pro" or set width to `390px`.
4. Verify the Hamburger Menu and stacked Hero buttons.
