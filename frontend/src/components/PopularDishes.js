import React, { useRef } from 'react';
import './PopularDishes.css';

const PopularDishes = () => {
  const carouselRef = useRef(null);

  const dishes = [
    { id: 1, name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop&crop=center' },
    { id: 2, name: 'Burger', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&crop=center' },
    { id: 3, name: 'Pasta', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=120&h=120&fit=crop&crop=center' },
    { id: 4, name: 'Sushi', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&h=120&fit=crop&crop=center' },
    { id: 5, name: 'Salad', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop&crop=center' },
    { id: 6, name: 'Tacos', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=120&fit=crop&crop=center' },
    { id: 7, name: 'Ice Cream', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=120&h=120&fit=crop&crop=center' },
    { id: 8, name: 'Fried Chicken', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=120&h=120&fit=crop&crop=center' },
    { id: 9, name: 'Steak', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&h=120&fit=crop&crop=center' },
    { id: 10, name: 'Sandwich', imageUrl: 'https://images.unsplash.com/photo-1481070414801-51b21d9e8305?w=120&h=120&fit=crop&crop=center' },
  ];

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="popular-dishes">
      <div className="container">
        <h2>Order our best food options</h2>
        <div className="carousel-container">
          <div className="carousel" ref={carouselRef}>
            {dishes.map(dish => (
              <div key={dish.id} className="dish-item">
                <img src={dish.imageUrl} alt={dish.name} />
                <p>{dish.name}</p>
              </div>
            ))}
          </div>
          <button className="arrow left" onClick={scrollLeft}>&lt;</button>
          <button className="arrow right" onClick={scrollRight}>&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;