import Image from "next/image";

// components/CategoryCard.jsx
export default function CategoryCard({
  icon: icon,
  title,
  description,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-yellow-300"
    >
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
          <img src={icon} className="w-10 h-10 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
