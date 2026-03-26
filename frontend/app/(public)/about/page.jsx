import Header from "@/components/Header";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      <section id="about" className="py-24 px-10 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-[38px] font-extrabold text-slate-900 mb-4 tracking-tight text-left">
              Why Choose Day Taask?
            </h2>
            <div className="w-14 h-1 bg-amber-500 rounded-full mb-6"></div>
            <p className="text-slate-500 text-base leading-[1.8] mb-8">
              We connect you with verified, background-checked professionals for
              every home need. With same-day availability and transparent
              pricing, we make home maintenance hassle-free.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  ✅
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Verified Experts
                  </h4>
                  <p className="text-[12.5px] text-slate-400 leading-[1.5]">
                    Background-checked professionals you can trust
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Same Day Service
                  </h4>
                  <p className="text-[12.5px] text-slate-400 leading-[1.5]">
                    Book and get service on the same day
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  💰
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Transparent Pricing
                  </h4>
                  <p className="text-[12.5px] text-slate-400 leading-[1.5]">
                    No hidden charges, ever
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  🕐
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    24/7 Support
                  </h4>
                  <p className="text-[12.5px] text-slate-400 leading-[1.5]">
                    Round-the-clock customer assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-[20px] p-9 text-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-[40px] font-extrabold text-slate-900 leading-none mb-1.5">
                5K+
              </div>
              <div className="text-[13px] text-slate-500 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="rounded-[20px] p-9 text-center bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300">
              <div className="text-[40px] font-extrabold text-slate-900 leading-none mb-1.5">
                200+
              </div>
              <div className="text-[13px] text-slate-500 font-medium">
                Expert Technicians
              </div>
            </div>
            <div className="rounded-[20px] p-9 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-300">
              <div className="text-[40px] font-extrabold text-slate-900 leading-none mb-1.5">
                98%
              </div>
              <div className="text-[13px] text-slate-500 font-medium">
                Satisfaction Rate
              </div>
            </div>
            <div className="rounded-[20px] p-9 text-center bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300">
              <div className="text-[40px] font-extrabold text-slate-900 leading-none mb-1.5">
                8+
              </div>
              <div className="text-[13px] text-slate-500 font-medium">
                Service Categories
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
