export const collegeConfig = {
  name: "SJCET",
  location: "Palai, Kerala",
  description: "St. Joseph's College of Engineering and Technology",
  
  festDetails: {
    name: "ASTHRA 2025",
    dates: "March 6-7, 2025",
    theme: "Future of Technology",
    description: "Annual National Level Technical Fest"
  },

  departments: [
    {
      name: "Computer Science",
      events: [
        {
          name: "CodeWars",
          venue: "CS Lab 201",
          time: "10:00 AM",
          date: "2025-03-7",
          description: "Competitive programming contest",
          prize: "₹10,000"
        }
        // Add more events
      ]
    }
    // Add more departments
  ],

  workshops: [
    {
      name: "AI & Machine Learning",
      instructor: "Dr. Sarah Johnson",
      venue: "Seminar Hall",
      date: "2024-03-15",
      time: "09:00 AM - 04:00 PM",
      capacity: 50,
      registrationFee: "₹500"
    }
    // Add more workshops
  ],

  contacts: [
    {
      name: "John Doe",
      role: "Event Coordinator",
      phone: "+91-9876543210",
      email: "coordinator@asthra.in"
    }
    // Add more contacts
  ],

  sponsors: [
    {
      name: "TechCorp",
      tier: "Platinum",
      logo: "/sponsors/techcorp.png"
    }
    // Add more sponsors
  ],

  venues: [
    {
      name: "Main Auditorium",
      capacity: 1000,
      location: "Main Block",
      facilities: ["Audio System", "Projector", "Air Conditioning"]
    }
    // Add more venues
  ]
};
