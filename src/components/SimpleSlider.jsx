import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./../css/SimpleSlider.css";

export default function SimpleSlider() {
  var settings = {
    overflow: false,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const events = [
    { id: 1, name: "Event 1", place: "São Paulo - SP", image: "path/to/image1.jpg" },
    { id: 2, name: "Event 2", place: "Rio de Janeiro - RJ", image: "path/to/image2.jpg" },
    { id: 3, name: "Event 3", place: "Porto Alegre - RS", image: "path/to/image3.jpg" },
    { id: 4, name: "Event 4", place: "Belo Horizonte - MG", image: "path/to/image4.jpg" },
    { id: 5, name: "Event 5", place: "Florianópolis - SC", image: "path/to/image5.jpg" },
    { id: 6, name: "Event 6", place: "Curitiba - PR", image: "path/to/image6.jpg" },
    { id: 7, name: "Event 7", place: "Manaus - AM", image: "path/to/image7.jpg" },
    { id: 8, name: "Event 8", place: "Goiânia - GO", image: "path/to/image8.jpg" },
    { id: 9, name: "Event 9", place: "Palmas - TO", image: "path/to/image9.jpg" }
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="card-image-container">
              <img src={event.image} alt={event.name} className="event-image" />
            </div>
            <div className="card-content">
              <h3 className="event-name">{event.name}</h3>
              <p className="event-place">{event.place}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}