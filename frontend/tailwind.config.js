/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                primary: '#0A66FF',
                'primary-hover': '#0753CC',
                secondary: '#0F172A',
                accent: '#FF7A00',

                // Functional Colors
                success: '#16A34A',
                warning: '#EA580C',
                error: '#DC2626',
                info: '#0284C7',

                // Base & Typography
                background: '#FFFFFF',
                surface: '#F9FAFB',
                text: '#1F2937',
                muted: '#64748B',
                border: '#E5E7EB',

                // Legacy colors (keep for backward compatibility)
                'slagie-teal': '#2DD4BF',
                'slagie-green': '#10B981',
                'slagie-accent': '#F97316',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%, 100%': { transform: 'translateX(-100%)' },
                    '50%': { transform: 'translateX(100%)' },
                }
            },
            backgroundSize: {
                '200': '200%',
            }
        },
    },
    plugins: [],
}
