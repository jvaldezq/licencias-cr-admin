import type {Config} from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./sections/**/*.{ts,tsx}',
		'./icons/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ["Montserrat Variable", "sans-serif"],
			},
			colors: {
				primary: "#383836",
				secondary: "#ca0b10",
				verified: '#0284c7',
				error: 'rgb(211, 47, 47)',
				warning: 'rgb(245, 124, 0)',
				['warning-yellow']: 'rgb(255, 244, 229)',
				info: 'rgb(2, 136, 209)',
				success: 'rgb(56, 142, 60)'
			},
			keyframes: {
				"accordion-down": {
					from: {height: "0"},
					to: {height: "var(--radix-accordion-content-height)"},
				},
				"accordion-up": {
					from: {height: "var(--radix-accordion-content-height)"},
					to: {height: "0"},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
} satisfies Config

export default config