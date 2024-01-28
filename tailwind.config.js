/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				"2xs": "296px",
				xs: "384px",
			},
			minWidth: {
				88: "22rem",
			},
		},
	},
	plugins: [],
};
