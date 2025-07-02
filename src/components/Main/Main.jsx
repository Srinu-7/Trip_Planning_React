// Main.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/Main/Main.css';

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDestination, setCurrentDestination] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [itemsPerView, setItemsPerView] = useState(3);

  const destinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      price: "$899",
      rating: 4.8,
      description: "Tropical paradise with stunning beaches"
    },
    {
      id: 2,
      name: "Paris, France",
      image: "https://media.istockphoto.com/id/1064251126/photo/eiffel-tower-in-paris-at-the-sunrise.jpg?s=2048x2048&w=is&k=20&c=dv7QYNEZZuaTrLMvtgpMP6spNmGy0hehjT7vXQ4yPeY=",
      price: "$1299",
      rating: 4.9,
      description: "City of lights and romance"
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      price: "$1099",
      rating: 4.7,
      description: "Modern culture meets ancient traditions"
    },
    {
      id: 4,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      price: "$1199",
      rating: 4.9,
      description: "Iconic white buildings and blue domes"
    },
    {
      id: 5,
      name: "New York, USA",
      image: "https://media.istockphoto.com/id/538811669/photo/manhattan-panorama-with-its-skyscrapers-illuminated-at-dusk-new-york.jpg?s=612x612&w=0&k=20&c=Dhbrf7D3ALk1uJZWHB1S0kBfJT-aKbXxO3REBPBQTxE=",
      price: "$999",
      rating: 4.6,
      description: "The city that never sleeps with iconic landmarks"
    },
    {
      id: 6,
      name: "Rome, Italy",
      image: "https://media.istockphoto.com/id/516314895/photo/rome.jpg?s=612x612&w=0&k=20&c=QKWmeJIo3XB37ICC4Ex-vc4q4F0DzanzY6qYblqFAQc=",
      price: "$1049",
      rating: 4.8,
      description: "Ancient history, art, and the best pasta you'll ever eat"
    }
  ];

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description: "Explore amazing destinations across 150+ countries worldwide"
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "We guarantee the best prices for your dream vacation"
    },
    {
      icon: "🏆",
      title: "Award Winning Service",
      description: "24/7 customer support with 99% satisfaction rate"
    },
    {
      icon: "📱",
      title: "Easy Booking",
      description: "Book your trip in just a few clicks with our mobile app"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "Amazing experience! The trip was perfectly planned and executed. Highly recommend!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Mike Chen",
      location: "Toronto, Canada",
      text: "Best travel service I've ever used. Professional, reliable, and great value for money.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Davis",
      location: "London, UK",
      text: "Incredible attention to detail. Made our honeymoon absolutely perfect!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleDestinationClick = (destination) => {
    console.log('Navigate to destination:', destination.name);
  };

  const handleBookNow = () => {
    console.log('Navigate to booking page');
  };

  const handleExploreMore = () => {
    console.log('Navigate to destinations page');
  };

  const nextDestination = () => {
    const maxIndex = destinations.length - itemsPerView;
    setCurrentDestination((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevDestination = () => {
    const maxIndex = destinations.length - itemsPerView;
    setCurrentDestination((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const prevFeature = () => {
  setCurrentFeature(currentFeature - 1);
};

const nextFeature = () => {
  setCurrentFeature(currentFeature + 1);
};

  return (
    <main className="main">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Your Next
              <span className="gradient-text"> Adventure</span>
            </h1>
            <p className="hero-description">
              Create unforgettable memories with our carefully curated travel experiences.
              From exotic beaches to cultural landmarks, we make your dreams come true.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleBookNow}>
                <span>Start Planning</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-secondary" onClick={handleExploreMore}>
                <span>Explore Destinations</span>
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Popular Destinations Carousel */}
      <section
        id="destinations"
        className={`destinations-section ${isVisible.destinations ? 'animate-in' : ''}`}
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
                  transform: `translateX(-${currentDestination * (100 / itemsPerView)}%)`,
                  width: `${(destinations.length / itemsPerView) * 100}%`
                }}
              >
                {destinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="destination-card"
                    style={{
                      width: `${100 / destinations.length}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <div className="destination-image">
                      <img src={destination.image} alt={destination.name} />
                      <div className="destination-overlay">
                        <div className="destination-price">{destination.price}</div>
                        <div className="destination-rating">
                          <span className="star">⭐</span>
                          {destination.rating}
                        </div>
                      </div>
                    </div>
                    <div className="destination-info">
                      <h3 className="destination-name">{destination.name}</h3>
                      <p className="destination-description">{destination.description}</p>
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
              disabled={currentDestination >= Math.ceil(destinations.length / itemsPerView) - 1}
            >
              <span className="carousel-arrow">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`testimonials-section ${isVisible.testimonials ? 'animate-in' : ''}`}
        data-animate
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-description">
              Real experiences from real people who trusted us with their adventures
            </p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonials-container">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
                >
                  <div className="testimonial-content">
                    <div className="testimonial-text">"{testimonial.text}"</div>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">⭐</span>
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
                      <div className="author-location">{testimonial.location}</div>
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