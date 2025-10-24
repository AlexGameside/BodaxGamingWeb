import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Bodax Gaming Players Data
const examplePlayers = [
  {
    fullName: "Nail",
    ign: "Nail",
    role: "Recon Initiator",
    bio: "Strategic recon initiator with exceptional information gathering and team support capabilities.",
    photoUrl: "",
    socials: {
      twitter: "https://twitter.com/Nailvlr"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Simplex",
    ign: "Simplex",
    role: "Flash Initiator",
    bio: "Aggressive flash initiator with lightning-fast reflexes. Specializes in creating openings and team coordination.",
    photoUrl: "/photos/players/25_BodaxGaming_Headshot_Simplex.png",
    socials: {
      twitter: "https://twitter.com/SimplexVal"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "InsaneDIN",
    ign: "InsaneDIN",
    role: "Duelist",
    bio: "Aggressive duelist with exceptional fragging ability. Known for clutch plays and high-impact performances.",
    photoUrl: "/photos/players/25_BodaxGaming_Dini.png",
    socials: {
      twitter: "https://twitter.com/InsaneDINIVL"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Euii",
    ign: "Euii",
    role: "Sentinel",
    bio: "Defensive specialist with excellent game sense. Master of site control and defensive utility usage.",
    photoUrl: "/photos/players/25_BodaxGaming_Headshot_Euii.png",
    socials: {
      twitter: "https://twitter.com/EuiiNoname"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Reos",
    ign: "Reos",
    role: "Smoke Controller",
    bio: "Tactical smoke controller with exceptional map control. Expert in area denial and team positioning.",
    photoUrl: "/photos/players/25_BodaxGaming_Headshot_Reos.png",
    socials: {
      twitter: "https://twitter.com/reosval"
    },
    createdAt: Timestamp.now()
  }
];

// Bodax Gaming Coaches Data
const exampleCoaches = [
  {
    fullName: "CloudTail",
    ign: "CloudTail",
    role: "Main Coach",
    bio: "Experienced main coach with deep strategic knowledge and team leadership capabilities.",
    photoUrl: "/photos/coaches/25_BodaxGaming_Headshot_Cloudtail.png",
    socials: {
      twitter: "https://twitter.com/CloudTailVal"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Sharky",
    ign: "Sharky",
    role: "Assistant Coach",
    bio: "Supportive assistant coach focused on player development and tactical refinement.",
    photoUrl: "/photos/coaches/25_BodaxGaming_Headshot_Sharky.png",
    socials: {
      twitter: "https://twitter.com/Sharky443"
    },
    createdAt: Timestamp.now()
  }
];

// Example matches data
const exampleMatches = [
  // Upcoming matches
  {
    opponent: "Team Phoenix",
    tournament: "Valorant Champions Tour",
    date: Timestamp.fromDate(new Date('2025-02-15T19:00:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1234",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Cyber Wolves",
    tournament: "Masters Tournament",
    date: Timestamp.fromDate(new Date('2025-02-20T20:30:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1235",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Digital Storm",
    tournament: "Pro League",
    date: Timestamp.fromDate(new Date('2025-02-25T18:00:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1236",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Shadow Legion",
    tournament: "Championship Series",
    date: Timestamp.fromDate(new Date('2025-03-01T19:30:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1237",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Neon Rush",
    tournament: "Masters Qualifier",
    date: Timestamp.fromDate(new Date('2025-03-05T20:00:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1238",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Quantum Force",
    tournament: "Elite Championship",
    date: Timestamp.fromDate(new Date('2025-03-10T18:30:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1239",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Crimson Titans",
    tournament: "Pro Circuit",
    date: Timestamp.fromDate(new Date('2025-03-15T19:00:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1240",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Void Warriors",
    tournament: "Champions League",
    date: Timestamp.fromDate(new Date('2025-03-20T20:30:00')),
    ourScore: 0,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1241",
    createdAt: Timestamp.now()
  },
  // Past matches
  {
    opponent: "Thunder Gaming",
    tournament: "Winter Championship",
    date: Timestamp.fromDate(new Date('2025-01-28T19:00:00')),
    ourScore: 2,
    opponentScore: 1,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1230",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Lightning Strike",
    tournament: "Spring Series",
    date: Timestamp.fromDate(new Date('2025-01-25T20:00:00')),
    ourScore: 1,
    opponentScore: 2,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1229",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Fire Hawks",
    tournament: "Elite League",
    date: Timestamp.fromDate(new Date('2025-01-22T18:30:00')),
    ourScore: 2,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1228",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Storm Riders",
    tournament: "Championship Finals",
    date: Timestamp.fromDate(new Date('2024-12-15T19:30:00')),
    ourScore: 2,
    opponentScore: 1,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1227",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Ice Warriors",
    tournament: "Winter Cup",
    date: Timestamp.fromDate(new Date('2024-12-10T18:00:00')),
    ourScore: 0,
    opponentScore: 2,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1226",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Blaze Titans",
    tournament: "Elite Series",
    date: Timestamp.fromDate(new Date('2024-11-28T20:00:00')),
    ourScore: 2,
    opponentScore: 0,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1225",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Frost Giants",
    tournament: "Pro League",
    date: Timestamp.fromDate(new Date('2024-11-15T19:00:00')),
    ourScore: 1,
    opponentScore: 2,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1224",
    createdAt: Timestamp.now()
  },
  {
    opponent: "Wind Strikers",
    tournament: "Masters Qualifier",
    date: Timestamp.fromDate(new Date('2024-10-30T18:30:00')),
    ourScore: 2,
    opponentScore: 1,
    streamLink: "https://twitch.tv/valorant",
    vlrLink: "https://vlr.gg/event/1223",
    createdAt: Timestamp.now()
  }
];

// Function to clear existing players data
export const clearPlayersData = async () => {
  try {
    console.log('Clearing existing players data...');
    const playersSnapshot = await getDocs(collection(db, 'players'));
    for (const playerDoc of playersSnapshot.docs) {
      await deleteDoc(doc(db, 'players', playerDoc.id));
      console.log(`Deleted player: ${playerDoc.id}`);
    }
    console.log('Players data cleared successfully!');
  } catch (error) {
    console.error('Error clearing players data:', error);
  }
};

export const seedDatabase = async () => {
  try {
    console.log('Starting to seed database...');
    
    // Add players
    console.log('Adding players...');
    for (const player of examplePlayers) {
      await addDoc(collection(db, 'players'), player);
      console.log(`Added player: ${player.fullName}`);
    }
    
    // Add coaches
    console.log('Adding coaches...');
    for (const coach of exampleCoaches) {
      await addDoc(collection(db, 'players'), coach);
      console.log(`Added coach: ${coach.fullName}`);
    }
    
    // Add matches
    console.log('Adding matches...');
    for (const match of exampleMatches) {
      await addDoc(collection(db, 'matches'), match);
      console.log(`Added match: vs ${match.opponent}`);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Function to clear and reseed with new team data
export const clearAndReseedTeam = async () => {
  try {
    console.log('Starting to clear and reseed team data...');
    
    // Clear existing players
    await clearPlayersData();
    
    // Add new players
    console.log('Adding new players...');
    for (const player of examplePlayers) {
      await addDoc(collection(db, 'players'), player);
      console.log(`Added player: ${player.fullName}`);
    }
    
    // Add new coaches
    console.log('Adding new coaches...');
    for (const coach of exampleCoaches) {
      await addDoc(collection(db, 'players'), coach);
      console.log(`Added coach: ${coach.fullName}`);
    }
    
    console.log('Team data cleared and reseeded successfully!');
  } catch (error) {
    console.error('Error clearing and reseeding team data:', error);
  }
};

// Function to check if data already exists
export const checkDataExists = async () => {
  try {
    const { getDocs } = await import('firebase/firestore');
    const playersSnapshot = await getDocs(collection(db, 'players'));
    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    
    return {
      hasPlayers: !playersSnapshot.empty,
      hasMatches: !matchesSnapshot.empty,
      playerCount: playersSnapshot.size,
      matchCount: matchesSnapshot.size
    };
  } catch (error) {
    console.error('Error checking data:', error);
    return { hasPlayers: false, hasMatches: false, playerCount: 0, matchCount: 0 };
  }
};
