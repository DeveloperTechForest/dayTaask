import Header from "@/components/Header";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      {/* <!-- ═══ CONTACT ═══ --> */}
      <section
        id="contact"
        className="min-h-screen contact-glow-tl contact-glow-br py-16 md:py-24 px-4 sm:px-6 md:px-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto text-center relative z-[1]">
          <h2 className="text-3xl md:text-[42px] font-extrabold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-base md:text-[17px] leading-[1.7] mb-10">
            We're fully operational and ready to help.
            <br />
            Reach out for any booking, inquiry or estimate!
          </p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            
            <a
              href="tel:+919522223143"
              className="flex items-center gap-4 bg-white/[0.07] border border-white/[0.12] backdrop-blur-md rounded-2xl px-6 py-5 w-full sm:min-w-[240px] text-left hover:bg-white/[0.12] hover:-translate-y-1 transition-all duration-300 no-underline"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
               
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase mb-1">
                  Call Us
                </div>
                <div className="text-base text-white font-semibold">
                  +91-9522223143
                </div>
              </div>
            </a>

        
            <a
              href="mailto:daytaask@gmail.com"
              className="flex items-center gap-4 bg-white/[0.07] border border-white/[0.12] backdrop-blur-md rounded-2xl px-6 py-5 w-full sm:min-w-[240px] text-left hover:bg-white/[0.12] hover:-translate-y-1 transition-all duration-300 no-underline"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
               
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase mb-1">
                  Email Us
                </div>
                <div className="text-base text-white font-semibold">
                  daytaask@gmail.com
                </div>
              </div>
            </a>
          </div>

          
          <a
            href="https://wa.me/919522223143"
            target="_blank"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 rounded-full text-base font-bold shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:bg-[#1DA851] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all"
          >
            <svg
              className="w-[22px] h-[22px] fill-white flex-shrink-0"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.504 1.13 6.752 3.048 9.386L1.052 31.2l6.01-1.922A15.923 15.923 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.28 22.596c-.384 1.082-1.908 1.98-3.12 2.242-.832.176-1.918.316-5.572-1.198-4.676-1.93-7.686-6.68-7.922-6.988-.228-.306-1.914-2.546-1.914-4.858s1.198-3.434 1.672-3.918c.394-.402.914-.6 1.428-.574.16.006.304.014.432.022.388.018.584.04.84.652.322.774 1.106 2.688 1.2 2.882.096.196.192.458.058.764-.126.314-.236.454-.432.68-.196.228-.382.402-.578.648-.18.218-.384.452-.156.84.228.38 1.006 1.63 2.634 2.85.266.128.584.096.82-.148.298-.314.666-.836 1.04-1.046.03-.03.036-.06.042-.076.404-.562.942-.756 1.308-.756.304 0 .642.044 1.114.472.582.524 1.396 1.532 1.512 1.664.522.608.74 1.174.372 1.74-.006.012-.014.024-.02.036z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
};

export default page;
