/* =========================================================
   ALL SITE CONTENT LIVES HERE — edit this file only.
   The website AND the Kapitan fan assistant read from it.
   ========================================================= */
window.SITE = {
  name: "Joseph Gelito",
  firstName: "Joseph",
  monogram: "JG",
  tagline: "Comedian · Diva · Entertainer",
  tourName: "Dreamgays Rewind — Live in LA",
  photo: "assets/joseph-cutout.webp",
  photoFallback: "assets/joseph-cutout.png",

  heroButtons: [
    { label: "Get Tickets", href: "#event", primary: true },
    { label: "Watch on YouTube", href: "https://www.youtube.com/@josephgelito9803" }
  ],

  chips: [
    { icon: "fa-solid fa-star", title: "Dreamgays Rewind", sub: "Jan 22 · Long Beach, CA" },
    { icon: "fa-solid fa-masks-theater", title: "Comedy & Diva", sub: "Laughs guaranteed" },
    { icon: "fa-brands fa-youtube", title: "Panlasang Charot", sub: "On YouTube" }
  ],

  socials: [
    { icon: "fa-brands fa-youtube", label: "YouTube", href: "https://www.youtube.com/@josephgelito9803" }
  ],

  // big tiles under the hero
  promos: [
    { kicker: "Live in LA · Jan 22", title: "Dreamgays Rewind", href: "#event", img: "assets/dreamgays-rewind-poster.webp", pos: "50% 4%" },
    { kicker: "Watch", title: "Joseph on YouTube", href: "https://www.youtube.com/@josephgelito9803", img: "https://i.ytimg.com/vi/Ma3LohCwQcY/hqdefault.jpg" },
    { kicker: "Bookings", title: "Book Joseph", href: "#contact", img: "assets/joseph-cutout.webp", pos: "50% 0%", contain: true }
  ],

  /* status: "available" | "low" | "soldout".  url: ticket link (tel: works too).
     featured: true → gets the big poster + countdown section. */
  tour: [
    {
      date: "2027-01-22", time: "7:00 PM", tz: "America/Los_Angeles", startUtc: "2027-01-23T03:00:00Z",
      show: "Dreamgays Rewind",
      lineup: "Joseph Gelito with Thage & Bona",
      city: "Long Beach, CA", venue: "The Noypitz Bar & Grill",
      address: "7591 E Carson St, Long Beach, CA 90808",
      status: "available", url: "tel:+17143223528", cta: "Call for Tickets",
      prices: [{ label: "VIP", price: "$128" }, { label: "General Admission", price: "$88" }],
      ticketPhones: [
        { name: "Joseph Gelito", phone: "714-322-3528" },
        { name: "Enteng", phone: "323-449-3174" },
        { name: "Bona", phone: "510-303-6817" },
        { name: "Thage", phone: "650-296-0650" }
      ],
      poster: "assets/dreamgays-rewind-poster.webp",
      featured: true, note: "Live in Los Angeles!"
    }
  ],
  tourPreview: 6,

  about: [
    "Joseph Gelito is a Filipino comedian and diva who turns every stage into a party — big hair, gold sequins and the kind of punchlines that leave the whole room in tears.",
    "He's one-third of Dreamgays Rewind with Thage and Bona: three divas, one stage, non-stop laughs and live songs.",
    "Off stage, Joseph keeps fans laughing on YouTube — from the cooking show where you learn absolutely nothing (Panlasang Charot) to fiestas in Antique and trips to Boracay and Vegas."
  ],
  stats: [
    { value: "3", label: "Divas, one stage" },
    { value: "20+", label: "Videos on YouTube" },
    { value: "Jan 22", label: "Live in Long Beach, CA" }
  ],

  // YouTube: main videos + vertical shorts (ids from youtube.com/@josephgelito9803)
  videos: [
    { id: "0cRkaMzqCPs", title: "Hahabol-Habol — live with a Fil-Am symphony orchestra" },
    { id: "Ma3LohCwQcY", title: "Trip na Trip Ko ang Boracay" },
    { id: "MdwTCEcGxvc", title: "Fiesta sa Antique — Feel na Feel Ko!" },
    { id: "nRJfxeqiRYA", title: "Sunlight Good Vibes with Jazz & Nar" },
    { id: "yK4r50WCPoQ", title: "Guest Love: The Party Decor & Entertainment" }
  ],
  shorts: [
    { id: "uMWLrCjrzqw", title: "Panlasang Charot — cooking lesson na walang matututunan!" },
    { id: "KLgDMRw8UJ8", title: "Dyosa ng Lumot" },
    { id: "0pjCFV48UUM", title: "Titanic Kuno" },
    { id: "4xtImGkduf0", title: "See Good Diet in Vegas" },
    { id: "y9PKkn33cfI", title: "4th of July Pancit at Paksiw!" },
    { id: "KDN29Qxhok0", title: "Happy Halloween" },
    { id: "EphepCQG9Jk", title: "Ai Ai Delas Alas — Friend" }
  ],
  videosMore: "https://www.youtube.com/@josephgelito9803",

  merch: [],       // empty = section hidden
  merchStore: "",
  news: [],        // empty = section hidden

  contacts: [
    { role: "Bookings & Shows", name: "Joseph Gelito", line: "714-322-3528" },
    { role: "Dreamgays Rewind Tickets", name: "Enteng", line: "323-449-3174" }
  ],
  fanEmail: ""
};
