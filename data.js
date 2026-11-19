/* =========================================================
   ALL CLIENT CONTENT LIVES HERE.
   Edit this file only — the page builds itself from it.
   ========================================================= */
window.SITE = {
  name: "Client Name",              // shown huge behind the photo
  firstName: "Client",               // used in "Follow ___", "Talk to ___"
  tagline: "Stand-up comedian · Storyteller · On tour now",
  tourName: "The Placeholder Tour 2027",
  photo: "assets/placeholder-cutout.svg", // swap to assets/client-cutout.png (transparent bg)

  heroButtons: [
    { label: "Get Tickets", href: "#tour", primary: true },
    { label: "Watch the Special", href: "#videos" }
  ],

  // little glass cards that float around the photo
  chips: [
    { icon: "fa-solid fa-ticket", title: "Sold-out shows", sub: "40+ cities" },
    { icon: "fa-solid fa-tv", title: "New special", sub: "Streaming now" },
    { icon: "fa-solid fa-microphone-lines", title: "Weekly podcast", sub: "New eps Thursdays" }
  ],

  socials: [
    { icon: "fa-brands fa-instagram", label: "Instagram", href: "#" },
    { icon: "fa-brands fa-tiktok", label: "TikTok", href: "#" },
    { icon: "fa-brands fa-youtube", label: "YouTube", href: "#" },
    { icon: "fa-brands fa-facebook-f", label: "Facebook", href: "#" },
    { icon: "fa-brands fa-x-twitter", label: "X", href: "#" },
    { icon: "fa-solid fa-podcast", label: "Podcast", href: "#" }
  ],

  // big promo tiles under the hero (specials, podcast, merch drop...)
  promos: [
    { kicker: "On Tour", title: "The Placeholder Tour", href: "#tour", img: "" },
    { kicker: "Streaming", title: "New Comedy Special", href: "#", img: "" },
    { kicker: "Listen", title: "The Podcast", href: "#", img: "" }
  ],

  // status: "available" | "low" | "soldout"   note: optional badge text
  tour: [
    { date: "2027-01-15", city: "Manila, PH", venue: "Venue Name Arena", status: "soldout", url: "#", note: "" },
    { date: "2027-01-16", city: "Manila, PH", venue: "Venue Name Arena", status: "low", url: "#", note: "Second Show Added!" },
    { date: "2027-01-23", city: "Cebu City, PH", venue: "Placeholder Theater", status: "available", url: "#", note: "" },
    { date: "2027-02-06", city: "Davao City, PH", venue: "Convention Center", status: "available", url: "#", note: "New Show Added!" },
    { date: "2027-02-14", city: "Singapore", venue: "Esplanade Theatre", status: "low", url: "#", note: "" },
    { date: "2027-02-20", city: "Dubai, UAE", venue: "Coca-Cola Arena", status: "available", url: "#", note: "" },
    { date: "2027-03-05", city: "Los Angeles, CA", venue: "The Wiltern", status: "available", url: "#", note: "" },
    { date: "2027-03-12", city: "Las Vegas, NV", venue: "Placeholder Casino", status: "available", url: "#", note: "" },
    { date: "2027-03-19", city: "Honolulu, HI", venue: "Blaisdell Concert Hall", status: "available", url: "#", note: "" },
    { date: "2027-03-26", city: "Toronto, Canada", venue: "Massey Hall", status: "available", url: "#", note: "" }
  ],
  tourPreview: 6, // rows shown before "See all dates"

  about: [
    "Two or three paragraphs of the client's bio go here — where they grew up, how they got into comedy, and what their act is about.",
    "Career highlights: specials, festivals, TV appearances, awards, viral clips, podcast numbers.",
    "Something personal to close — the stuff fans connect with."
  ],
  stats: [
    { value: "10+", label: "Years on stage" },
    { value: "2", label: "Comedy specials" },
    { value: "1M+", label: "Followers" }
  ],

  // YouTube video IDs (the part after watch?v=). Empty id = placeholder tile.
  videos: [
    { id: "", title: "Clip title one" },
    { id: "", title: "Clip title two" },
    { id: "", title: "Clip title three" },
    { id: "", title: "Clip title four" }
  ],
  videosMore: "#",

  merch: [
    { name: "Tour Tee", price: "₱1,200", img: "", href: "#" },
    { name: "Logo Hoodie", price: "₱2,400", img: "", href: "#" },
    { name: "Dad Hat", price: "₱900", img: "", href: "#" },
    { name: "Sticker Pack", price: "₱250", img: "", href: "#" }
  ],
  merchStore: "#",

  news: [
    { date: "2026-11-01", title: "Headline about a new tour announcement", excerpt: "Short excerpt of the article.", href: "#", img: "" },
    { date: "2026-10-12", title: "Headline about the new special", excerpt: "Short excerpt of the article.", href: "#", img: "" },
    { date: "2026-09-20", title: "Interview with a big outlet", excerpt: "Short excerpt of the article.", href: "#", img: "" }
  ],

  contacts: [
    { role: "Management", name: "Management Company", line: "manager@example.com" },
    { role: "Booking", name: "Booking Agency", line: "booking@example.com" },
    { role: "Press", name: "PR Firm", line: "press@example.com" },
    { role: "Brands & Partnerships", name: "Agency Name", line: "brands@example.com" }
  ],
  fanEmail: "hello@example.com"
};
