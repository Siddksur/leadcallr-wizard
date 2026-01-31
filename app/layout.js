import './globals.css'

export const metadata = {
  title: 'Voice AI ROI Calculator | LeadCallr AI',
  description: 'Find out if Voice AI is right for your real estate business with our free ROI calculator.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
