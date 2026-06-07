import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import RealBatteryMonitor from './components/RealBatteryMonitor';
import RealCarbonTracker from './components/RealCarbonTracker';
import NetworkMonitor from './components/NetworkMonitor';
import RecommendationEngine from './components/RecommendationEngine';
import AdaptationLog from './components/AdaptationLog';
import { adaptQuality, logDecision, contentTypes } from './services/adaptationEngine';
import './App.css';

function App() {
  // Real system state (not simulated!)
  const [realBattery, setRealBattery] = useState(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [carbonIntensity, setCarbonIntensity] = useState(null);
  const [carbonLocation, setCarbonLocation] = useState(null);
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const [connectionType, setConnectionType] = useState('unknown');
  
  // Session state
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [contentType, setContentType] = useState('lecture');
  const [userSelectedQuality, setUserSelectedQuality] = useState('720p');
  const [recommendedQuality, setRecommendedQuality] = useState('720p');
  
  // Metrics and logging
  const [decisions, setDecisions] = useState([]);
  const [sessionStart, setSessionStart] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [energySavings, setEnergySavings] = useState({ percentage: 0, mW: 0 });
  const [carbonSavings, setCarbonSavings] = useState({ percentage: 0, grams: 0 });
  
  // Initialize real battery monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        // Initial values
        setRealBattery(Math.round(battery.level * 100));
        setBatteryCharging(battery.charging);
        
        // Listen for changes
        battery.addEventListener('levelchange', () => {
          setRealBattery(Math.round(battery.level * 100));
        });
        
        battery.addEventListener('chargingchange', () => {
          setBatteryCharging(battery.charging);
        });
      });
    } else {
      // Fallback for browsers without Battery API
      console.warn('Battery Status API not supported');
      setRealBattery(75); // Default fallback
    }
  }, []);
  
  // Get user's location for carbon intensity
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCarbonLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation not available:', error);
          // Fallback to default location (can be changed)
          setCarbonLocation({ lat: 6.5244, lon: 3.3792 }); // Lagos, Nigeria
        }
      );
    } else {
      // Default location
      setCarbonLocation({ lat: 6.5244, lon: 3.3792 }); // Lagos, Nigeria
    }
  }, []);
  
  // Fetch real carbon intensity from API
  useEffect(() => {
    if (!carbonLocation) return;
    
    const fetchCarbonIntensity = async () => {
      try {
        // Using CO2Signal API (free tier)
        // Note: You need to sign up for API key at https://www.co2signal.com/
        const response = await fetch(
          `https://api.co2signal.com/v1/latest?lat=${carbonLocation.lat}&lon=${carbonLocation.lon}`,
          {
            headers: {
              'auth-token': '13b53feae28ba3d1d1260210eacd5a65' // Replace with actual key
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setCarbonIntensity(Math.round(data.data.carbonIntensity));
        } else {
          // Fallback to reasonable estimate
          setCarbonIntensity(350);
        }
      } catch (error) {
        console.warn('Carbon API error:', error);
        // Fallback based on time of day (peak hours = higher carbon)
        const hour = new Date().getHours();
        if (hour >= 17 && hour <= 21) {
          setCarbonIntensity(450); // Peak hours - more fossil fuels
        } else {
          setCarbonIntensity(300); // Off-peak
        }
      }
    };
    
    fetchCarbonIntensity();
    // Refresh every 15 minutes
    const interval = setInterval(fetchCarbonIntensity, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [carbonLocation]);
  
  // Monitor network connection
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      const updateNetwork = () => {
        setConnectionType(connection.effectiveType || 'unknown');
        
        // Estimate speed based on connection type
        const speedMap = {
          'slow-2g': 0.05,
          '2g': 0.25,
          '3g': 1.5,
          '4g': 10,
          '5g': 20,
          'wifi': 10
        };
        
        setNetworkSpeed(speedMap[connection.effectiveType] || 5);
      };
      
      updateNetwork();
      connection.addEventListener('change', updateNetwork);
      
      return () => connection.removeEventListener('change', updateNetwork);
    } else {
      // Fallback - estimate from download speed
      setNetworkSpeed(5);
      setConnectionType('wifi');
    }
  }, []);
  
  // Auto-recommendation engine (runs every 10 seconds when monitoring)
  useEffect(() => {
    if (!isMonitoring || realBattery === null || !carbonIntensity || !networkSpeed) return;
    
    const interval = setInterval(() => {
      performRecommendation();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [isMonitoring, realBattery, carbonIntensity, networkSpeed, contentType, userSelectedQuality]);
  
  // Perform recommendation
  const performRecommendation = () => {
    if (!realBattery || !carbonIntensity || !networkSpeed) return;
    
    const state = {
      battery: realBattery,
      charging: batteryCharging,
      carbonIntensity,
      networkSpeed,
      bufferLevel: 8, // Assume good buffer
      contentType,
      currentQuality: userSelectedQuality
    };
    
    const decision = adaptQuality(state);
    const log = logDecision(state, decision);
    
    // Update recommended quality
    setRecommendedQuality(decision.quality);
    
    // Add to decision log
    setDecisions(prev => [...prev.slice(-19), log]);
    
    // Create notification if recommendation differs from user selection
    if (decision.quality !== userSelectedQuality) {
      createNotification(decision, state);
    }
    
    // Calculate savings
    calculateSavings(decision.quality);
  };
  
  // Create user notification
  const createNotification = (decision, state) => {
    let message = '';
    let type = 'info';
    
    if (decision.mode === 'Battery Critical') {
      message = `⚡ Battery at ${state.battery}% - Reduce to ${decision.quality} to extend ${estimateExtension(decision.quality)} minutes`;
      type = 'critical';
    } else if (decision.mode === 'Carbon Conscious') {
      message = ` High carbon period (${state.carbonIntensity} gCO₂e/kWh) - Reduce to ${decision.quality} to save ${estimateCarbonSaved(decision.quality)}g CO₂/hour`;
      type = 'warning';
    } else {
      message = ` Recommended: ${decision.quality} for optimal balance`;
      type = 'info';
    }
    
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    // Browser notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('EcoStream Recommendation', {
        body: message,
        icon: '⚡'
      });
    }
  };
  
  // Estimate battery extension
  const estimateExtension = (quality) => {
    const powerSavings = {
      '360p': 45,
      '480p': 35,
      '540p': 25,
      '720p': 15,
      '1080p': 0
    };
    return powerSavings[quality] || 20;
  };
  
  // Estimate carbon saved
  const estimateCarbonSaved = (quality) => {
    const carbonSavings = {
      '360p': 15,
      '480p': 12,
      '540p': 8,
      '720p': 5,
      '1080p': 0
    };
    return carbonSavings[quality] || 10;
  };
  
  // Calculate energy and carbon savings
  const calculateSavings = (recommendedQuality) => {
    // Compare recommended vs max quality (1080p baseline)
    const powerMap = {
      '360p': 350,
      '480p': 450,
      '540p': 520,
      '720p': 650,
      '1080p': 850
    };
    
    const baseline = 850; // 1080p power
    const recommended = powerMap[recommendedQuality];
    const savings = baseline - recommended;
    const percentage = Math.round((savings / baseline) * 100);
    
    setEnergySavings({ percentage, mW: savings });
    
    // Carbon savings
    const carbonPerMW = carbonIntensity / 1000000; // Convert to gCO₂ per mW per hour
    const carbonSaved = savings * carbonPerMW * 1;
    const carbonPercentage = percentage; // Same as energy percentage
    
    setCarbonSavings({ percentage: carbonPercentage, grams: carbonSaved.toFixed(2) });
  };
  
  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };
  
  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setSessionStart(new Date());
    requestNotificationPermission();
    performRecommendation(); // Immediate first recommendation
  };
  
  const handleStopMonitoring = () => {
    setIsMonitoring(false);
  };
  
  const handleManualRecommendation = () => {
    performRecommendation();
  };
  
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
            <h1>EcoStream Smart Dashboard</h1>
          </div>
          <p className="tagline">Real-Time Energy-Aware & Carbon-Conscious Streaming Assistant</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Left Column - Status & Controls */}
        <div className="video-section">
          <VideoPlayer 
            isMonitoring={isMonitoring}
            currentQuality={userSelectedQuality}
            recommendedQuality={recommendedQuality}
            onStart={handleStartMonitoring}
            onStop={handleStopMonitoring}
          />
          
          {/* Control Panel */}
          <div className="control-panel">
            <h3> Manual Controls</h3>
            
            <div className="control-group">
              <label> Content Type:</label>
              <select 
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="select"
              >
                <option value="slides">Lecture Slides (Text-heavy)</option>
                <option value="diagram">Detailed Diagrams</option>
                <option value="lecture">Live Lecture (Talking Head)</option>
                <option value="demonstration">Live Demonstration</option>
              </select>
            </div>
            
            <div className="control-group">
              <label> Current Zoom/Teams Quality:</label>
              <select 
                value={userSelectedQuality}
                onChange={(e) => setUserSelectedQuality(e.target.value)}
                className="select"
              >
                <option value="360p">360p (Low)</option>
                <option value="480p">480p (Medium)</option>
                <option value="540p">540p (Medium+)</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
              </select>
              <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                Manually set this to match your Zoom/Teams quality setting
              </small>
            </div>
            
            <div className="control-actions">
              <button 
                onClick={handleManualRecommendation}
                disabled={!isMonitoring}
                className="btn-secondary"
              >
                🔄 Get Recommendation
              </button>
            </div>
          </div>
          
          {/* Notifications Panel */}
          {notifications.length > 0 && (
            <div className="notifications-panel">
              <h3>🔔 Recent Notifications</h3>
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification notification-${notif.type}`}
                >
                  <div className="notification-time">{notif.timestamp}</div>
                  <div className="notification-message">{notif.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Column - Real Metrics */}
        <div className="metrics-section">
          <RealBatteryMonitor 
            battery={realBattery}
            charging={batteryCharging}
            currentQuality={userSelectedQuality}
            isMonitoring={isMonitoring}
          />
          
          <RealCarbonTracker 
            carbonIntensity={carbonIntensity}
            location={carbonLocation}
            currentQuality={userSelectedQuality}
            isMonitoring={isMonitoring}
          />
          
          <NetworkMonitor 
            speed={networkSpeed}
            connectionType={connectionType}
          />
          
          <RecommendationEngine 
            recommendedQuality={recommendedQuality}
            currentQuality={userSelectedQuality}
            energySavings={energySavings}
            carbonSavings={carbonSavings}
            isMonitoring={isMonitoring}
          />
          
          <AdaptationLog 
            decisions={decisions}
            currentQuality={userSelectedQuality}
          />
        </div>
      </main>
      
      {/* Dashboard - Full Width */}
      {isMonitoring && (
        <Dashboard 
          decisions={decisions}
          battery={realBattery}
          carbonIntensity={carbonIntensity}
          sessionStart={sessionStart}
          energySavings={energySavings}
          carbonSavings={carbonSavings}
        />
      )}
      
      {/* Footer */}
      <footer className="footer">
        <p>EcoStream Smart Dashboard v2.0 | Real-Time Monitoring System | Final Year Project</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
          Using: Battery Status API • Network Information API • CO2Signal API • Multi-Objective RL Algorithm
        </p>
      </footer>
    </div>
  );
}

export default App;
