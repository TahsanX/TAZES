import { PrismaClient, AlumniStatus } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const DEPARTMENTS = ["CSE", "EEE", "Civil", "Mechanical", "BBA", "English", "Economics", "Law"];
const COMPANIES = [
  "Brac Bank",
  "Grameenphone",
  "Google",
  "Microsoft",
  "Robi Axiata",
  "Pathao",
  "bKash",
  "Therap BD",
  "Samsung R&D",
  "Reve Systems",
];
const POSITIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "Data Analyst",
  "Assistant Manager",
  "Lecturer",
  "Civil Engineer",
  "Business Analyst",
  "Marketing Executive",
  "Founder",
];
const FIRST_NAMES = [
  "Rahim", "Karim", "Fahim", "Nusrat", "Tania", "Shakil", "Mahin", "Farhana",
  "Imran", "Sadia", "Tanvir", "Mou", "Rifat", "Anika", "Zahid", "Priya",
  "Sabbir", "Lamia", "Arif", "Tasnim",
];
const LAST_NAMES = [
  "Ahmed", "Hasan", "Islam", "Chowdhury", "Rahman", "Hossain", "Akter", "Khan",
  "Uddin", "Karim",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding...");

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      orgName: "Zilla Shomiti",
      tagline: "United by roots, growing together",
      about:
        "Zilla Shomiti is a community of alumni, students, and well-wishers from our district, working together to support education, networking, and social welfare.",
      email: "contact@zillashomiti.org",
      phone: "+8801700000000",
      address: "House 12, Road 5, Dhaka, Bangladesh",
      facebook: "https://facebook.com/zillashomiti",
      footerNote: `© ${new Date().getFullYear()} Zilla Shomiti. All rights reserved.`,
    },
  });

  // Home sections
  const sections = [
    { key: "HERO", label: "Hero Carousel", order: 0 },
    { key: "STATS", label: "Community Stats", order: 1 },
    { key: "SPEECHES", label: "Teacher Speeches", order: 2 },
    { key: "ACHIEVEMENTS", label: "Achievements", order: 3 },
    { key: "COMMITTEE", label: "Committee Preview", order: 4 },
  ];
  for (const s of sections) {
    await prisma.homeSection.upsert({
      where: { key: s.key },
      update: {},
      create: { ...s, enabled: true, config: {} },
    });
  }

  // Hero slides
  const heroSlides = [
    {
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
      headline: "Welcome to Zilla Shomiti",
      subheadline: "Connecting alumni across generations",
      ctaText: "Join the Community",
      ctaHref: "/alumni/register",
      order: 0,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600",
      headline: "Celebrating Our Achievements",
      subheadline: "Every year, our members make us proud",
      ctaText: "See Achievements",
      ctaHref: "/achievements",
      order: 1,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600",
      headline: "Meet the Committee",
      subheadline: "The people leading our community forward",
      ctaText: "View Committee",
      ctaHref: "/committee",
      order: 2,
    },
  ];
  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: { ...slide, enabled: true } });
  }

  // Teacher speeches
  const speeches = [
    {
      name: "Prof. Dr. Anwar Hossain",
      designation: "Former Head of Department",
      institution: "University of Dhaka",
      message:
        "I have watched this community grow from a handful of students into a network that spans continents. Their dedication to giving back is truly inspiring.",
      order: 0,
    },
    {
      name: "Prof. Nasrin Sultana",
      designation: "Associate Professor",
      institution: "BUET",
      message:
        "Zilla Shomiti has always stood for unity and mutual support. I am proud to have taught many of its members.",
      order: 1,
    },
    {
      name: "Dr. Kamal Uddin",
      designation: "Retired Principal",
      institution: "Govt. College",
      message:
        "Education and community go hand in hand. This organization embodies that spirit perfectly.",
      order: 2,
    },
  ];
  for (const speech of speeches) {
    await prisma.teacherSpeech.create({ data: { ...speech, published: true } });
  }

  // Committee years
  const years = [2022, 2023, 2024, 2025, 2026];
  const roles = [
    { role: "President", roleOrder: 1 },
    { role: "General Secretary", roleOrder: 2 },
    { role: "Vice President", roleOrder: 3 },
    { role: "Treasurer", roleOrder: 4 },
    { role: "Joint Secretary", roleOrder: 5 },
    { role: "Organizing Secretary", roleOrder: 6 },
  ];
  for (const year of years) {
    const cy = await prisma.committeeYear.create({
      data: {
        year,
        title: `Executive Committee ${year}`,
        isCurrent: year === 2026,
        summary: `The executive committee elected for the term of ${year}.`,
      },
    });
    for (const r of roles) {
      await prisma.committeeMember.create({
        data: {
          committeeYearId: cy.id,
          name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
          role: r.role,
          roleOrder: r.roleOrder,
          department: pick(DEPARTMENTS),
          batch: 2005 + Math.floor(Math.random() * 15),
        },
      });
    }
  }

  // Alumni (~60, mostly approved, a few pending)
  for (let i = 0; i < 60; i++) {
    const status: AlumniStatus = i % 10 === 0 ? AlumniStatus.PENDING : AlumniStatus.APPROVED;
    await prisma.alumni.create({
      data: {
        name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        department: pick(DEPARTMENTS),
        batch: 1999 + Math.floor(Math.random() * 27),
        currentPosition: pick(POSITIONS),
        company: pick(COMPANIES),
        phone: `+8801${Math.floor(100000000 + Math.random() * 899999999)}`,
        facebook: `https://facebook.com/user${i}`,
        email: `alumni${i}@example.com`,
        showPhone: i % 5 === 0,
        showFacebook: i % 3 === 0,
        status,
      },
    });
  }

  // Achievements
  const achievements = [
    { title: "Scholarship Fund Launched", category: "Education", featured: true },
    { title: "Annual Reunion 2025 - Record Attendance", category: "Community", featured: true },
    { title: "Blood Donation Drive Success", category: "Social Work", featured: false },
    { title: "Member Wins National Award", category: "Recognition", featured: true },
    { title: "New Chapter Opened in Chittagong", category: "Expansion", featured: false },
    { title: "Partnership with Local University", category: "Education", featured: false },
  ];
  for (let i = 0; i < achievements.length; i++) {
    const a = achievements[i];
    await prisma.achievement.create({
      data: {
        title: a.title,
        description: `Details about ${a.title.toLowerCase()}.`,
        date: new Date(2024, i, 15),
        category: a.category,
        featured: a.featured,
        published: true,
      },
    });
  }

  // Events + photos
  const events = [
    { title: "Annual Reunion 2025", slug: "annual-reunion-2025", location: "Dhaka Club" },
    { title: "Freshers' Reception 2025", slug: "freshers-reception-2025", location: "University Auditorium" },
    { title: "Iftar Mahfil 2025", slug: "iftar-mahfil-2025", location: "Community Hall" },
  ];
  // Real Unsplash photo ids. These must not be generated from a template —
  // a fabricated id returns 404 and every gallery renders as a broken image.
  const GALLERY_PHOTOS = [
    "photo-1511578314322-379afb476865",
    "photo-1540575467063-178a50c2df87",
    "photo-1505373877841-8d25f7d46678",
    "photo-1475721027785-f74eccf877e2",
    "photo-1492684223066-81342ee5ff30",
    "photo-1531058020387-3be344556be6",
    "photo-1552664730-d307ca884978",
    "photo-1517457373958-b7bdd4587205",
    "photo-1528605248644-14dd04022da1",
  ];
  const EVENT_POSTERS = [
    "photo-1464366400600-7168b8af9bc3",
    "photo-1414235077428-338989a2e8c0",
    "photo-1519671482749-fd09be7ccebf",
  ];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const ev = await prisma.event.create({
      data: {
        title: e.title,
        slug: e.slug,
        description: `Join us for ${e.title}, a wonderful gathering of our community.`,
        date: new Date(2025, i * 3, 20),
        location: e.location,
        posterUrl: `https://images.unsplash.com/${EVENT_POSTERS[i % EVENT_POSTERS.length]}?w=1200`,
        published: true,
      },
    });
    for (let p = 0; p < 3; p++) {
      await prisma.eventPhoto.create({
        data: {
          eventId: ev.id,
          url: `https://images.unsplash.com/${GALLERY_PHOTOS[(i * 3 + p) % GALLERY_PHOTOS.length]}?w=800`,
          order: p,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
