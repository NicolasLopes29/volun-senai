import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../css/SimpleSlider.css";

export default function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  const events = [
    { id: 1, name: "Event 1", date: "2023-10-01", image: "path/to/image1.jpg" },
    { id: 2, name: "Event 2", date: "2023-10-02", image: "path/to/image2.jpg" },
    { id: 3, name: "Event 3", date: "2023-10-03", image: "path/to/image3.jpg" },
    { id: 4, name: "Event 4", date: "2023-10-04", image: "path/to/image4.jpg" },
    { id: 5, name: "Event 5", date: "2023-10-05", image: "path/to/image5.jpg" },
    { id: 6, name: "Event 6", date: "2023-10-06", image: "path/to/image6.jpg" },
    { id: 7, name: "Event 7", date: "2023-10-07", image: "path/to/image7.jpg" },
    { id: 8, name: "Event 8", date: "2023-10-08", image: "path/to/image8.jpg" },
    { id: 9, name: "Event 9", date: "2023-10-09", image: "path/to/image9.jpg" }
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.image} alt={event.name} className="event-image" />
            <h3 className="event-name">{event.name}</h3>
            <p className="event-date">{event.date}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}