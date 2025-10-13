import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Example players data
const examplePlayers = [
  {
    fullName: "Alex Chen",
    ign: "BodaxAce",
    role: "Captain",
    bio: "Strategic leader with 5+ years of competitive experience. Known for clutch plays and team coordination.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxace",
      twitch: "https://twitch.tv/bodaxace"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Sarah Johnson",
    ign: "BodaxSniper",
    role: "Entry Fragger",
    bio: "Aggressive entry fragger with lightning-fast reflexes. Specializes in opening rounds and creating space.",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxsniper",
      twitch: "https://twitch.tv/bodaxsniper"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Marcus Rodriguez",
    ign: "BodaxSupport",
    role: "Support",
    bio: "Reliable support player with excellent game sense. Master of utility usage and team positioning.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxsupport",
      twitch: "https://twitch.tv/bodaxsupport"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "Emma Thompson",
    ign: "BodaxFlex",
    role: "Flex",
    bio: "Versatile player who adapts to any situation. Expert in multiple agent roles and map strategies.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxflex",
      twitch: "https://twitch.tv/bodaxflex"
    },
    createdAt: Timestamp.now()
  },
  {
    fullName: "David Kim",
    ign: "BodaxIGL",
    role: "In-Game Leader",
    bio: "Tactical mastermind with exceptional shot-calling abilities. Leads the team through complex strategies.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxigl",
      twitch: "https://twitch.tv/bodaxigl"
    },
    createdAt: Timestamp.now()
  }
];

// Example coaches data
const exampleCoaches = [
  {
    fullName: "Coach Mike",
    ign: "BodaxCoach",
    role: "Coach",
    bio: "Former professional player turned coach. Brings years of competitive experience and strategic knowledge.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    socials: {
      twitter: "https://twitter.com/bodaxcoach"
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
    caster: "Shroud",
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
    caster: "TenZ",
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
    caster: "SicK",
    vlrLink: "https://vlr.gg/event/1236",
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
    caster: "Shroud",
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
    caster: "TenZ",
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
    caster: "SicK",
    vlrLink: "https://vlr.gg/event/1228",
    createdAt: Timestamp.now()
  }
];

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
