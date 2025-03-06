export const collegeConfig = {
  name: "SJCET",
  location: "Palai, Kerala",
  description: "St. Joseph's College of Engineering and Technology",
  
  festDetails: {
    name: "ASTHRA 2025",
    dates: "March 7, 2025",
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
      date: "2025-03-7",
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
  ],
  events : [
    { name: 'Robotics Workshop', venue: 'Lab 201', time: '10:00 AM' },
    { name: 'AI Symposium', venue: 'Auditorium', time: '2:00 PM' },
    { name: 'Drone Racing', venue: 'College Ground', time: '4:00 PM' },
    { name: 'Tech Quiz', venue: 'Seminar Hall', time: '11:30 AM' },
    { name: 'Web Development', venue: 'Lab 301', time: '3:30 PM' },
    { name: 'Console Clash', venue: 'MTB 304', time: '9:10 AM' },
    { name: 'Radio Workshop', venue: '101 SPB', time: '9:00 AM' },
    { name: 'SDR', venue:'EDA lab', time:'2:00 PM'},
    { name: 'Tech Astra 9.0',venue:'MTB seminar hall',time:'10:00 AM'},
    { name: 'Neon Football', venue:'seminar hall, newton block',time:'9:01 AM'},
    {name:'County Cricket', venue:'SJET ground',time:'9:00 AM'},
    {name:'Mini Theatre', venue:'106 MTB', time:'10:00 AM'},
    { name: 'Technova',venue:'102 SFB',time:'10:00 AM'},
    { name: 'Artifex',venue:'302 SPB',time:'10:00 AM'},
    { name:'Artifact fin literacy',venue:'electronics lab',time:'10:00 AM'},
    { name:'Citadel',venue:'106 SPB',time:'10:00 AM'},
    { name: 'Loot up',venue:'ML & DL lab', time:'10:00 AM'}
  ];
};
