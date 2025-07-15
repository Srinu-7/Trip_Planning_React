// Main.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/Main/Main.css";
import "../../styles/Main/input.css";
import "../../styles/Main/output.css";
import { API_BASE_URL } from "../../utils/constants";
import OpenAI from "openai";

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDestination, setCurrentDestination] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [itemsPerView, setItemsPerView] = useState(3);
  const [selectedMode, setSelectedMode] = useState("text");
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const recognitionRef = useRef(null);

  const destinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      price: "$899",
      rating: 4.8,
      description: "Tropical paradise with stunning beaches",
    },
    {
      id: 2,
      name: "Paris, France",
      image:
        "https://media.istockphoto.com/id/1064251126/photo/eiffel-tower-in-paris-at-the-sunrise.jpg?s=2048x2048&w=is&k=20&c=dv7QYNEZZuaTrLMvtgpMP6spNmGy0hehjT7vXQ4yPeY=",
      price: "$1299",
      rating: 4.9,
      description: "City of lights and romance",
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      price: "$1099",
      rating: 4.7,
      description: "Modern culture meets ancient traditions",
    },
    {
      id: 4,
      name: "Santorini, Greece",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      price: "$1199",
      rating: 4.9,
      description: "Iconic white buildings and blue domes",
    },
    {
      id: 5,
      name: "New York, USA",
      image:
        "https://media.istockphoto.com/id/538811669/photo/manhattan-panorama-with-its-skyscrapers-illuminated-at-dusk-new-york.jpg?s=612x612&w=0&k=20&c=Dhbrf7D3ALk1uJZWHB1S0kBfJT-aKbXxO3REBPBQTxE=",
      price: "$999",
      rating: 4.6,
      description: "The city that never sleeps with iconic landmarks",
    },
    {
      id: 6,
      name: "Rome, Italy",
      image:
        "https://media.istockphoto.com/id/516314895/photo/rome.jpg?s=612x612&w=0&k=20&c=QKWmeJIo3XB37ICC4Ex-vc4q4F0DzanzY6qYblqFAQc=",
      price: "$1049",
      rating: 4.8,
      description: "Ancient history, art, and the best pasta you'll ever eat",
    },
  ];

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description:
        "Explore amazing destinations across 150+ countries worldwide",
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "We guarantee the best prices for your dream vacation",
    },
    {
      icon: "🏆",
      title: "Award Winning Service",
      description: "24/7 customer support with 99% satisfaction rate",
    },
    {
      icon: "📱",
      title: "Easy Booking",
      description: "Book your trip in just a few clicks with our mobile app",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "Amazing experience! The trip was perfectly planned and executed. Highly recommend!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Mike Chen",
      location: "Toronto, Canada",
      text: "Best travel service I've ever used. Professional, reliable, and great value for money.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emma Davis",
      location: "London, UK",
      text: "Incredible attention to detail. Made our honeymoon absolutely perfect!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    // Add your functionality here
  };

  const handleConfirm = async () => {
    const text = inputText;
    const token = await getAccessToken();
    if (!token) {
      console.error("No access token available");
      return null;
    }

    try {
      const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: token,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a smart travel planning assistant. Based on the user's input, extract travel information and generate a perfect 5-day itinerary.

Respond ONLY in this JSON format. Do not wrap the response in code blocks or include any explanation:

{
  "trip_summary": {
    "destination": "...",
    "travelers": "...",
    "start_date": "...",
    "preferences": ["..."],
    "budget": "..."
  },
  "itinerary": {
    "Day 1": {
      "morning": "...",
      "afternoon": "...",
      "evening": "..."
    },
    "Day 2": { ... },
    ...
    "Day 5": { ... }
  }
}

If a field is missing from the user's input, write "not mentioned".`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        model: "gpt-4o",
        temperature: 0.8,
        max_tokens: 4096,
        top_p: 1,
      });

      const content = response.choices[0].message.content.trim();

      // Safely extract JSON only
      const firstCurly = content.indexOf("{");
      const lastCurly = content.lastIndexOf("}");
      if (firstCurly === -1 || lastCurly === -1) {
        console.error("No JSON object found.");
        return;
      }

      const jsonString = content.slice(firstCurly, lastCurly + 1);

      const parsed = JSON.parse(jsonString);

      const rawBudget = parsed.trip_summary.budget;
      const numericBudget = parseFlexibleBudget(rawBudget);
      const formattedBudget = formatIndianNumber(numericBudget);
      parsed.trip_summary.budget = formattedBudget;
      parsed.trip_summary.start_date = parsed.trip_summary.start_date == "not mentioned" ? new Date().toLocaleDateString('en-GB').split('/').join('-') : parsed.trip_summary.start_date;
      
      setTripDetails(parsed);
      console.log("Trip Details:", parsed);
      handleCancel();
      addResponseToDb(parsed);
    } catch (error) {
      console.error("Error during OpenAI request:", error);
    }
  };

  const addResponseToDb = async (data) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const jwt = userData ? userData.jwt : null;

    const requestBody = {
      destination: data.trip_summary.destination,
      travelers: data.trip_summary.travelers,
      start_date: data.trip_summary.start_date,
      preferences: data.trip_summary.preferences,
      budget: data.trip_summary.budget,
    };

    console.log("Saving trip details to database:", requestBody);

    try {
      const response = await fetch(`${API_BASE_URL}/api/trip/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error("Failed to save trip details:", response.statusText);
        return;
      }

      const result = await response.json();
      console.log("Trip details saved successfully:", result);
    } catch (error) {
      console.error("Error saving trip details:", error);
    }
  };

  // 🔧 Helper: Converts "30k", "3 lakh", "2 crore", "5,00,000", etc. to number
function parseFlexibleBudget(input) {
  if (typeof input === 'string') {
    const clean = input.trim().toLowerCase().replace(/,/g, '');

    if (clean.includes('k')) {
      return parseFloat(clean) * 1000;
    }
    if (clean.includes('lakh')) {
      return parseFloat(clean) * 100000;
    }
    if (clean.includes('crore')) {
      return parseFloat(clean) * 10000000;
    }

    // fallback: numeric string like "50000" or "300000"
    return parseInt(clean.replace(/[^0-9]/g, '')) || 0;
  }

  // if already a number
  return input;
}

// 🧠 Format number to Indian style e.g., 300000 → "3,00,000"
function formatIndianNumber(num) {
  return Number(num).toLocaleString('en-IN');
}

  const getAccessToken = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const jwt = userData ? userData.jwt : null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/token/github`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch access token:", response.statusText);
        return null;
      }

      const data = await response.json();
      console.log("data retrieved successfully:", data);
      return data.token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  };

  const handleCancel = () => {
    setInputText("");
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    console.log("Cancelled");
  };

  const handleSpeechToggle = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript:", transcript);
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current = recognition;
    }

    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleDestinationClick = (destination) => {
    console.log("Navigate to destination:", destination.name);
  };

  const nextDestination = () => {
    const maxIndex = destinations.length - itemsPerView;
    setCurrentDestination((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevDestination = () => {
    const maxIndex = destinations.length - itemsPerView;
    setCurrentDestination((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <main className="main">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Left Part - Input Choices */}
        <div className="hero-left">
          <div className="input-content">
            <div className="header">
              <h2 className="title">Plan Your Trip</h2>
              <p className="subtitle">
                How would you like to give instructions?
              </p>
            </div>

            {/* Mode Selection */}
            <div className="mode-selection">
              <button
                className={`mode-btn ${
                  selectedMode === "text" ? "active" : ""
                }`}
                onClick={() => handleModeChange("text")}
              >
                <div className="mode-icon">📝</div>
                <span>Text Instructions</span>
              </button>
              <button
                className={`mode-btn ${
                  selectedMode === "speech" ? "active" : ""
                }`}
                onClick={() => handleModeChange("speech")}
              >
                <div className="mode-icon">🎤</div>
                <span>Speech Instructions</span>
              </button>
            </div>

            {/* Input Area */}
            <div className="input-area">
              {selectedMode === "text" ? (
                <div className="text-input-section">
                  <textarea
                    className="text-input"
                    placeholder="Describe your dream trip..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                  />
                </div>
              ) : (
                <div className="speech-input-section">
                  <div className="speech-area">
                    <div
                      className={`speech-visualizer ${
                        isListening ? "listening" : ""
                      }`}
                    >
                      <div className="speech-icon">🎤</div>
                      <div className="speech-waves">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                    </div>
                    <div className="speech-status">
                      {isListening ? "Listening..." : "Click to start"}
                    </div>
                    <button
                      className={`speech-btn ${isListening ? "listening" : ""}`}
                      onClick={handleSpeechToggle}
                    >
                      {isListening ? "Stop" : "Start"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-confirm" onClick={handleConfirm}>
                Confirm
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Right Part - Trip Plan Details */}
        <div className="hero-right">
          {tripDetails && (
            <div className="trip-summary-container">
              <h3 className="trip-summary-title">Trip Summary</h3>
              <ul className="trip-summary-list">
                <li>
                  <strong>Destination:</strong>{" "}
                  {tripDetails.trip_summary.destination}
                </li>
                <li>
                  <strong>Travelers:</strong>{" "}
                  {tripDetails.trip_summary.travelers}
                </li>
                <li>
                  <strong>Start Date:</strong>{" "}
                  {tripDetails.trip_summary.start_date}
                </li>
                <li>
                  <strong>Preferences:</strong>{" "}
                  {tripDetails.trip_summary.preferences.join(", ")}
                </li>
                <li>
                  <strong>Budget:</strong> {tripDetails.trip_summary.budget}
                </li>
              </ul>

              <h3 className="itinerary-title">5-Day Itinerary</h3>
              <div className="itinerary-list">
                {Object.entries(tripDetails.itinerary).map(([day, plan]) => (
                  <div key={day} className="day-plan">
                    <h4 className="day-title">{day}</h4>
                    <div className="plan-section">
                      <p>
                        <strong>Morning:</strong> {plan.morning}
                      </p>
                      <p>
                        <strong>Afternoon:</strong> {plan.afternoon}
                      </p>
                      <p>
                        <strong>Evening:</strong> {plan.evening}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations Carousel */}
      <section
        id="destinations"
        className={`destinations-section ${
          isVisible.destinations ? "animate-in" : ""
        }`}
        data-animate
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-description">
              Discover the world's most beautiful places with our expert guides
            </p>
          </div>

          <div className="destinations-carousel">
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={prevDestination}
              aria-label="Previous destinations"
              disabled={currentDestination === 0} // Disable prev button when on first image
            >
              <span className="carousel-arrow">‹</span>
            </button>

            <div className="destinations-track-container">
              <div
                className="destinations-track"
                style={{
                  transform: `translateX(-${
                    currentDestination * (100 / itemsPerView)
                  }%)`,
                  width: `${(destinations.length / itemsPerView) * 100}%`,
                }}
              >
                {destinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="destination-card"
                    style={{
                      width: `${100 / destinations.length}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <div className="destination-image">
                      <img src={destination.image} alt={destination.name} />
                      <div className="destination-overlay">
                        <div className="destination-price">
                          {destination.price}
                        </div>
                        <div className="destination-rating">
                          <span className="star">⭐</span>
                          {destination.rating}
                        </div>
                      </div>
                    </div>
                    <div className="destination-info">
                      <h3 className="destination-name">{destination.name}</h3>
                      <p className="destination-description">
                        {destination.description}
                      </p>
                      <button className="destination-btn">
                        View Details
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-btn carousel-btn-next"
              onClick={nextDestination}
              aria-label="Next destinations"
              disabled={
                currentDestination >=
                Math.ceil(destinations.length / itemsPerView) - 1
              }
            >
              <span className="carousel-arrow">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`testimonials-section ${
          isVisible.testimonials ? "animate-in" : ""
        }`}
        data-animate
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-description">
              Real experiences from real people who trusted us with their
              adventures
            </p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonials-container">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`testimonial-card ${
                    index === currentSlide ? "active" : ""
                  }`}
                >
                  <div className="testimonial-content">
                    <div className="testimonial-text">"{testimonial.text}"</div>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-location">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Main;
