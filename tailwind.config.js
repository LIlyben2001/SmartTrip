import {
  Brain,
  Wallet,
  Ticket,
  ClipboardList,
  FileDown,
  BadgeCheck
} from 'lucide-react'; // Install Lucide if not done: npm install lucide-react

const features = [
  {
    icon: <Brain className="text-pink-500 w-6 h-6" />,
    title: "AI Trip Builder",
    description: "Build multi-city trips with smart time & cost estimates.",
  },
  {
    icon: <Wallet className="text-yellow-500 w-6 h-6" />,
    title: "Real-Time Budget",
    description: "Know how much your trip will cost as you plan.",
  },
  {
    icon: <Ticket className="text-yellow-400 w-6 h-6" />,
    title: "Ticketing Alerts",
    description: "Get notified of places that need advance booking or permits.",
  },
  {
    icon: <ClipboardList className="text-orange-400 w-6 h-6" />,
    title: "Custom Itineraries",
    description: "Save, share or download your personalized trip plan.",
  },
  {
    icon: <FileDown className="text-blue-500 w-6 h-6" />,
    title: "Offline Access",
    description: "Export your itinerary as PDF for travel use.",
  },
  {
    icon: <BadgeCheck className="text-green-600 w-6 h-6" />,
    title: "China Ready",
    description: "Handles real-name bookings, permits & local transit.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-orange-50 py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-orange-700 mb-2">
        What Makes SmartTrip Special?
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-10">
        SmartTrip combines technology with travel expertise to bring you a smarter, simpler planning experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
