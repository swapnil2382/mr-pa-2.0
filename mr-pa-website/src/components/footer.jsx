import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Services", "Updates", "Pricing"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies"],
    },
  ];

  return (
    <footer className="border-t border-white/5 py-16 md:py-24 bg-black">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <span className="font-medium text-white">Mr. Pa</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              The AI agent that transforms your creative vision into reality with unprecedented speed and quality.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-medium mb-4 text-sm text-white">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">© {currentYear} Mr. Pa. All rights reserved.</div>

          <div className="flex space-x-6">
            {/* LinkedIn Logo */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* Instagram Logo */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.218 2.427.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.427a4.908 4.908 0 0 1-1.153 1.772 4.908 4.908 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.427-.465a4.908 4.908 0 0 1-1.772-1.153 4.908 4.908 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428-.047-1.066-.06-1.405-.06-4.122s.013-3.056.06-4.122c.05-1.065.218-1.79.465-2.427a4.908 4.908 0 0 1 1.153-1.772A4.908 4.908 0 0 1 3.573 2.485c.637-.247 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0-2c-2.717 0-3.056.01-4.122.06-1.277.06-2.146.262-2.912.558a6.912 6.912 0 0 0-2.51 1.637 6.912 6.912 0 0 0-1.637 2.51c-.296.766-.498 1.635-.558 2.912C.01 8.944 0 9.283 0 12s.01 3.056.06 4.122c.06 1.277.262 2.146.558 2.912a6.912 6.912 0 0 0 1.637 2.51 6.912 6.912 0 0 0 2.51 1.637c.766.296 1.635.498 2.912.558C8.944 23.99 9.283 24 12 24s3.056-.01 4.122-.06c1.277-.06 2.146-.262 2.912-.558a6.912 6.912 0 0 0 2.51-1.637 6.912 6.912 0 0 0 1.637-2.51c.296-.766.498-1.635.558-2.912.05-1.066.06-1.405.06-4.122s-.01-3.056-.06-4.122c-.06-1.277-.262-2.146-.558-2.912a6.912 6.912 0 0 0-1.637-2.51 6.912 6.912 0 0 0-2.51-1.637c-.766-.296-1.635-.498-2.912-.558C15.056.01 14.717 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;