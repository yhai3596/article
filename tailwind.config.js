/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			letterSpacing: {
				tight: '-0.02em',
			},
			lineHeight: {
				heading: '1.1',
				headingLarge: '1.2',
				body: '1.6',
			},
			colors: {
				// Brand colors
				brand: {
					primary: '#3B82F6', // Blue
					secondary: '#8B5CF6', // Purple
					accent: '#0F172A', // Deep navy for CTAs
					success: '#10B981', // Green for badges only
					background: '#F8FAFF', // Very light warm pink/gray
					gradientStart: '#3B82F6',
					gradientEnd: '#8B5CF6',
				},
				// Traditional color tokens
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#3B82F6',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#8B5CF6',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#0F172A',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			boxShadow: {
				'neumorphic': '8px 8px 16px rgba(163, 177, 198, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.7)',
				'neumorphic-inset': 'inset 8px 8px 16px rgba(163, 177, 198, 0.15), inset -8px -8px 16px rgba(255, 255, 255, 0.7)',
				'soft': '0 4px 20px rgba(59, 130, 246, 0.15)',
				'gradient': '0 10px 40px rgba(59, 130, 246, 0.2)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				pill: '9999px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in-up': {
					from: {
						opacity: '0',
						transform: 'translateY(30px)',
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'gradient-x': 'gradient-x 3s ease infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}