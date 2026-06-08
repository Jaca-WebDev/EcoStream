# EcoStream Real Dashboard - Smart Streaming Monitor

## What This Is

A **real-time monitoring system** that uses actual system APIs to provide intelligent quality recommendations for video streaming platforms (Zoom, Teams, Google Meet).

### Features
✅ **Real Battery Monitoring** - Battery Status API  
✅ **Real Carbon Intensity** - CO2Signal API  
✅ **Real Network Speed** - Network Information API  
✅ **Multi-Objective Algorithm** - Balances quality, energy, carbon  
✅ **Smart Recommendations** - Tells you optimal quality  
✅ **Savings Tracking** - Measures actual impact  

## Quick Start

### 1. Get Free API Key
Go to: https://www.co2signal.com/  
Sign up and copy your API key

### 2. Install Dependencies
```bash
npm install
```

### 3. Add API Key
Open `src/App.js`  
Find line ~70:  
```javascript
'auth-token': 'YOUR_API_KEY_HERE'
```
Replace with your actual key

### 4. Run
```bash
npm start
```

Browser opens at http://localhost:3000

## How to Use

1. **Start Monitoring** - Click "Start Monitoring" button
2. **View Recommendations** - System shows optimal quality
3. **Adjust Zoom/Teams** - Manually set quality in your app
4. **Update Dashboard** - Select current quality in dropdown
5. **Track Savings** - View energy and carbon savings

## What You'll See

- Real battery level (from your laptop)
- Real carbon intensity (from CO2Signal API)
- Network speed (from browser)
- Recommended quality
- Energy/carbon savings
- Decision history

**Key Point:**  
"Since Zoom/Teams don't have public APIs, the system provides intelligent recommendations that users implement manually. This is honest, practical, and shows measurable impact."

## Project Structure

```
ecostream-real-complete/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── VideoPlayer.js
│   │   ├── RealBatteryMonitor.js
│   │   ├── RealCarbonTracker.js
│   │   ├── NetworkMonitor.js
│   │   ├── RecommendationEngine.js
│   │   ├── AdaptationLog.js
│   │   └── Dashboard.js
│   ├── services/
│   │   └── adaptationEngine.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## API Integration

**Battery Status API:**
```javascript
navigator.getBattery().then(battery => {
  console.log(battery.level * 100 + '%');
});
```

**CO2Signal API:**
```javascript
fetch('https://api.co2signal.com/v1/latest?lat=X&lon=Y', {
  headers: { 'auth-token': 'YOUR_KEY' }
});
```

**Network Information API:**
```javascript
const connection = navigator.connection;
console.log(connection.effectiveType);
```

## Supervised Requirements Met

✅ Real battery monitoring (not simulated)  
✅ Real carbon awareness (API integration)  
✅ Energy-aware recommendations  
✅ Carbon-conscious decisions  
✅ Works with streaming (Zoom/Teams/Meet)  
✅ Measurable savings  

## Note

This system provides **recommendations** rather than automatic control because:
- Zoom, Teams, Meet are proprietary applications
- No public APIs available for quality control
- Manual implementation is honest and practical
- Still demonstrates real sustainability impact

## Built With

- React 18.2.0
- Browser APIs (Battery, Network, Geolocation)
- CO2Signal API (carbon intensity data)
- Multi-objective reinforcement learning algorithm

---

**EcoStream v2.0** - Real Implementation  
Final Year Project - Computer Science
