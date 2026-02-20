// components/ServiceCard.jsx
import Image from "next/image";
import { Star } from "lucide-react";

export default function ServiceCard({
  image,
  title,
  description,
  price,
  rating,
  bookings,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          fill={true}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-500 transition">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Rating & Bookings */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-500 px-3 py-1.5 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4 fill-current" />
            {rating}
          </span>
          <span className="text-gray-500 text-sm">
            {bookings.toLocaleString()} bookings
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-bold text-gray-900">{price}</p>
          </div>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition shadow-md">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
