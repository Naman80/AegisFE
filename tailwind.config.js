/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
  	extend: {
  		colors: {
  			'surface-variant': '#353534',
  			'on-tertiary-fixed-variant': '#005142',
  			'surface-bright': '#3a3939',
  			'secondary-fixed': '#e5e2e1',
  			secondary: '#c8c6c5',
  			primary: {
  				DEFAULT: '#adc6ff',
  				foreground: '#002e69'
  			},
  			'on-surface': '#e5e2e1',
  			'on-tertiary': '#00382d',
  			'on-error-container': '#ffdad6',
  			'surface-container-low': '#1c1b1b',
  			'on-primary-fixed': '#001a41',
  			'on-error': '#690005',
  			'surface-container-high': '#2a2a2a',
  			'on-secondary-fixed': '#1c1b1b',
  			'surface-container-lowest': '#0e0e0e',
  			background: '#131313',
  			'surface-tint': '#adc6ff',
  			'on-secondary-container': '#bab8b7',
  			error: '#ffb4ab',
  			'tertiary-fixed-dim': '#48ddbc',
  			tertiary: '#48ddbc',
  			'on-primary-container': '#ffffff',
  			'secondary-container': '#4a4949',
  			outline: '#8b90a0',
  			surface: '#131313',
  			'tertiary-container': '#00866f',
  			'error-container': '#93000a',
  			'primary-fixed': '#d8e2ff',
  			'on-surface-variant': '#c1c6d7',
  			'outline-variant': '#414754',
  			'on-background': '#e5e2e1',
  			'on-primary': '#002e69',
  			'on-primary-fixed-variant': '#004493',
  			'on-secondary': '#313030',
  			'inverse-primary': '#005bc1',
  			'surface-container-highest': '#353534',
  			'on-tertiary-container': '#ffffff',
  			'primary-fixed-dim': '#adc6ff',
  			'tertiary-fixed': '#6bfad8',
  			'primary-container': '#0071ee',
  			'surface-dim': '#131313',
  			'inverse-surface': '#e5e2e1',
  			'on-tertiary-fixed': '#002019',
  			'surface-container': '#201f1f',
  			'on-secondary-fixed-variant': '#474646',
  			'inverse-on-surface': '#313030',
  			'secondary-fixed-dim': '#c8c6c5'
  		},
  		fontFamily: {
  			headline: [
  				'Inter',
  				'sans-serif'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			label: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: '0.5rem',
  			md: 'calc(0.5rem - 2px)',
  			sm: 'calc(0.5rem - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
