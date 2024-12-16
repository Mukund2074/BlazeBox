/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'custom-dark': '0 5px 10px 1px rgba(53, 48, 47, 0.8)', // Adjust the blur and spread as needed
        'custom-dark-up': '0 -2px 5px 1px rgba(120, 140, 150, 0.8)',
      },
      fontSize: {
        'md': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents([{
        '.responsive-text': {
          fontSize: '1rem', 
          '@screen sm': {
            fontSize: '1.125rem',
          },
          '@screen md': {
            fontSize: '1.25rem', 
          },
          '@screen lg': {
            fontSize: '1.5rem',
          }
        },
      }, 
      {
        '.responsive-paragraph': {
          fontSize: '0.75rem', 
          '@screen sm': {
            fontSize: '0.75rem',
          },
          '@screen md': {
            fontSize: '0.75rem', 
          },
         
        },
      }]
    )
    },
  ],
};
