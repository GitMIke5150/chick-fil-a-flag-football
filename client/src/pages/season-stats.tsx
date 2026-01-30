import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Trophy, Target, Star, Flag, Shield, Zap, Award, Hand, Share2, Footprints, FastForward, User } from 'lucide-react';
import { Link } from 'wouter';
import chickFilALogo from '@assets/IMG_1083_1768217940008.png';
import surfstungLogo from '@assets/D28D4B9E-1A54-4691-B798-C07AE190DD30_1768318377404.png';
import knoxPhoto from '@assets/IMG_1153_1768359895845.jpeg';
import nastyNatePhoto from '@assets/IMG_1154_1768360153489.jpeg';
import bennettPhoto from '@assets/IMG_1155_1768360219600.jpeg';
import slyPhoto from '@assets/IMG_1156_1768360326400.jpeg';
import hudsonPhoto from '@assets/IMG_1157_1768360351809.jpeg';
import calebPhoto from '@assets/IMG_1158_1768360425634.jpeg';
import davisPhoto from '@assets/IMG_1159_1768360447310.jpeg';
import hamptonPhoto from '@assets/IMG_1160_1768360556069.jpeg';
import brycePhoto from '@assets/IMG_1161_1768360584871.jpeg';
import { fetchGames } from '@/lib/api';

interface PlayerStats {
  touchdowns: number;
  extraPoints: number;
  twoPointConversions: number;
  qbTouchdowns: number;
  catches: number;
  flagPulls: number;
  interceptions: number;
  sacks: number;
  runs: number;
  firstDowns: number;
  qbFirstDownThrows: number;
  catchFirstDowns: number;
}

interface SeasonPlayerStats extends PlayerStats {
  name: string;
  fullName: string;
  gamesPlayed: number;
  totalPoints: number;
  totalFirstDowns: number;
}

const SeasonStats = () => {
  const roster = ['Davis Olson', 'Hampton Wells', 'Bryce Halter', 'Nasty Nate', 'Sly Willis', 'Hudson Paulus', 'Bennett Walters', 'Caleb', 'Knox Hager'];
  const displayOrder = ['Hampton Wells', 'Bryce Halter', 'Nasty Nate', 'Sly Willis', 'Davis Olson', 'Hudson Paulus', 'Bennett Walters', 'Caleb', 'Knox Hager'];
  const playerFullNames: Record<string, string> = {
    'Davis Olson': 'Davis Olson',
    'Hampton Wells': 'Hampton Wells',
    'Bryce Halter': 'Bryce Halter',
    'Nasty Nate': 'Nasty Nate',
    'Sly Willis': 'Sly Willis',
    'Hudson Paulus': 'Hudson Paulus',
    'Bennett Walters': 'Bennett Walters',
    'Caleb': 'Caleb',
    'Knox Hager': 'Knox Hager',
  };
  
  const playerInfo: Record<string, { fullName: string; school: string; age: number; jersey: number; photo?: string }> = {
    'Davis Olson': { fullName: 'Davis Olson', school: 'Camp Rd Middle', age: 13, jersey: 3, photo: davisPhoto },
    'Hampton Wells': { fullName: 'Hampton Wells', school: 'Camp Rd Middle', age: 13, jersey: 12, photo: hamptonPhoto },
    'Sly Willis': { fullName: 'Sly Willis', school: 'Camp Rd Middle', age: 14, jersey: 5, photo: slyPhoto },
    'Hudson Paulus': { fullName: 'Hudson Paulus', school: 'Camp Rd Middle', age: 14, jersey: 7, photo: hudsonPhoto },
    'Knox Hager': { fullName: 'Knox Hager', school: 'Camp Rd Middle', age: 13, jersey: 6, photo: knoxPhoto },
    'Nasty Nate': { fullName: 'Nasty Nate', school: 'Bishop England', age: 15, jersey: 9, photo: nastyNatePhoto },
    'Caleb': { fullName: 'Caleb', school: 'Hybrid', age: 14, jersey: 2, photo: calebPhoto },
    'Bennett Walters': { fullName: 'Bennett Walters', school: 'Camp Rd Middle', age: 13, jersey: 1, photo: bennettPhoto },
    'Bryce Halter': { fullName: 'Bryce Halter', school: 'Camp Rd Middle', age: 14, jersey: 4, photo: brycePhoto },
  };

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [modalFlipped, setModalFlipped] = useState(false);

  const toggleCardFlip = (playerName: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerName)) {
        newSet.delete(playerName);
      } else {
        newSet.add(playerName);
      }
      return newSet;
    });
  };

  const getPlayerBadges = (player: SeasonPlayerStats) => {
    const badges: { emoji: string; title: string; color: string }[] = [];
    const pointsLeader = seasonStats[0];
    const catchesLeader = [...seasonStats].sort((a, b) => b.catches - a.catches)[0];
    const flagPullsLeader = [...seasonStats].sort((a, b) => b.flagPulls - a.flagPulls)[0];
    const interceptionsLeader = [...seasonStats].sort((a, b) => b.interceptions - a.interceptions)[0];
    
    if (player.touchdowns >= 3) badges.push({ emoji: '🔥', title: 'TD MACHINE', color: 'from-orange-500 to-red-500' });
    if (player.name === pointsLeader?.name && player.totalPoints > 0) badges.push({ emoji: '👑', title: 'SCORING KING', color: 'from-amber-400 to-yellow-500' });
    if (player.name === catchesLeader?.name && player.catches > 0) badges.push({ emoji: '🙌', title: 'SURE HANDS', color: 'from-sky-400 to-blue-500' });
    if (player.name === flagPullsLeader?.name && player.flagPulls > 0) badges.push({ emoji: '🚩', title: 'LOCKDOWN', color: 'from-orange-400 to-orange-600' });
    if (player.name === interceptionsLeader?.name && player.interceptions > 0) badges.push({ emoji: '🦅', title: 'BALL HAWK', color: 'from-green-400 to-emerald-600' });
    if (player.qbTouchdowns >= 2) badges.push({ emoji: '🎯', title: 'QB SNIPER', color: 'from-purple-400 to-purple-600' });
    if (player.sacks >= 2) badges.push({ emoji: '💥', title: 'SACK MASTER', color: 'from-red-500 to-red-700' });
    
    return badges;
  };

  const getCardRarity = (player: SeasonPlayerStats) => {
    const rank = seasonStats.findIndex(p => p.name === player.name);
    if (player.touchdowns >= 3) return 'legendary';
    if (rank === 0) return 'gold';
    if (rank === 1) return 'silver';
    if (rank === 2) return 'bronze';
    return 'common';
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: '3px solid transparent',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          glow: '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.3)',
          shimmer: 'from-purple-500 via-pink-500 to-purple-500',
        };
      case 'gold':
        return {
          border: '3px solid #FFD700',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f00 50%, #1a1a2e 100%)',
          glow: '0 0 15px rgba(255, 215, 0, 0.5)',
          shimmer: 'from-yellow-400 via-amber-300 to-yellow-400',
        };
      case 'silver':
        return {
          border: '3px solid #C0C0C0',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 50%, #1a1a2e 100%)',
          glow: '0 0 10px rgba(192, 192, 192, 0.4)',
          shimmer: 'from-gray-300 via-white to-gray-300',
        };
      case 'bronze':
        return {
          border: '3px solid #CD7F32',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1a00 50%, #1a1a2e 100%)',
          glow: '0 0 10px rgba(205, 127, 50, 0.4)',
          shimmer: 'from-orange-400 via-amber-500 to-orange-400',
        };
      default:
        return {
          border: '2px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          glow: 'none',
          shimmer: 'from-gray-500 via-gray-400 to-gray-500',
        };
    }
  };

  const { data: gamesData = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
    refetchInterval: 3000,
  });

  const seasonStats: SeasonPlayerStats[] = roster.map(name => {
    const stats = gamesData.reduce((acc, game) => {
      const playerStats = game.playerStats[name];
      if (playerStats) {
        const hasStats = playerStats.touchdowns > 0 || playerStats.extraPoints > 0 || 
                        playerStats.twoPointConversions > 0 || playerStats.qbTouchdowns > 0 || 
                        playerStats.catches > 0 || playerStats.flagPulls > 0 || 
                        playerStats.interceptions > 0 || playerStats.sacks > 0 ||
                        (playerStats.runs || 0) > 0 || (playerStats.firstDowns || 0) > 0 ||
                        (playerStats.qbFirstDownThrows || 0) > 0 || (playerStats.catchFirstDowns || 0) > 0;
        return {
          touchdowns: acc.touchdowns + (playerStats.touchdowns || 0),
          extraPoints: acc.extraPoints + (playerStats.extraPoints || 0),
          twoPointConversions: acc.twoPointConversions + (playerStats.twoPointConversions || 0),
          qbTouchdowns: acc.qbTouchdowns + (playerStats.qbTouchdowns || 0),
          catches: acc.catches + (playerStats.catches || 0),
          flagPulls: acc.flagPulls + (playerStats.flagPulls || 0),
          interceptions: acc.interceptions + (playerStats.interceptions || 0),
          sacks: acc.sacks + (playerStats.sacks || 0),
          runs: acc.runs + (playerStats.runs || 0),
          firstDowns: acc.firstDowns + (playerStats.firstDowns || 0),
          qbFirstDownThrows: acc.qbFirstDownThrows + (playerStats.qbFirstDownThrows || 0),
          catchFirstDowns: acc.catchFirstDowns + (playerStats.catchFirstDowns || 0),
          gamesPlayed: acc.gamesPlayed + (hasStats ? 1 : 0),
        };
      }
      return acc;
    }, { touchdowns: 0, extraPoints: 0, twoPointConversions: 0, qbTouchdowns: 0, catches: 0, flagPulls: 0, interceptions: 0, sacks: 0, runs: 0, firstDowns: 0, qbFirstDownThrows: 0, catchFirstDowns: 0, gamesPlayed: 0 });

    return {
      name,
      fullName: playerFullNames[name] || name,
      ...stats,
      totalPoints: (stats.touchdowns * 6) + stats.extraPoints + (stats.twoPointConversions * 2),
      totalFirstDowns: stats.firstDowns + stats.catchFirstDowns + stats.qbFirstDownThrows,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  const teamStats = {
    wins: gamesData.filter(g => g.ourScore > g.opponentScore).length,
    losses: gamesData.filter(g => g.ourScore < g.opponentScore).length,
    ties: gamesData.filter(g => g.ourScore === g.opponentScore && g.ourScore > 0).length,
    totalPoints: gamesData.reduce((sum, g) => sum + g.ourScore, 0),
    pointsAllowed: gamesData.reduce((sum, g) => sum + g.opponentScore, 0),
    gamesPlayed: gamesData.length,
  };

  const leagueStandings = [
    { team: "Chick-Fil-A", gp: 5, pts: 12, wins: 4, losses: 1, ties: 0, isUs: true },
    { team: "Dick's Sporting Goods", gp: 5, pts: 10, wins: 3, losses: 1, ties: 1, isUs: false },
    { team: "Dairy Queen", gp: 5, pts: 4, wins: 1, losses: 3, ties: 1, isUs: false },
    { team: "Zaxby's", gp: 5, pts: 3, wins: 1, losses: 4, ties: 0, isUs: false },
  ];

  const ourStanding = leagueStandings.findIndex(t => t.isUs) + 1;

  const maxPoints = Math.max(...seasonStats.map(p => p.totalPoints), 1);
  const maxFirstDowns = Math.max(...seasonStats.map(p => p.totalFirstDowns), 1);
  const maxCatches = Math.max(...seasonStats.map(p => p.catches), 1);
  const maxFlagPulls = Math.max(...seasonStats.map(p => p.flagPulls), 1);

  const generateSeasonSummary = (player: SeasonPlayerStats) => {
    const badges = getPlayerBadges(player);
    const jersey = playerInfo[player.name]?.jersey || 0;
    const school = playerInfo[player.name]?.school || '';
    const age = playerInfo[player.name]?.age || 0;
    const rarity = getCardRarity(player);
    
    // Epic header based on performance
    let text = '';
    if (player.totalPoints >= 30) {
      text += `🔥🔥🔥 ABSOLUTE LEGEND 🔥🔥🔥\n\n`;
    } else if (player.totalPoints >= 20) {
      text += `⭐💫 ELITE PERFORMER 💫⭐\n\n`;
    } else if (player.totalPoints >= 12) {
      text += `💪😤 BALLER STATUS 😤💪\n\n`;
    } else if (player.touchdowns > 0 || player.flagPulls >= 3) {
      text += `🏈 MAKING MOVES 🏈\n\n`;
    }

    text += `╔══════════════════════════╗\n`;
    text += `║  🐔 CHICK-FIL-A FLAG 🐔  ║\n`;
    text += `║    2026 WINTER SEASON    ║\n`;
    text += `╚══════════════════════════╝\n\n`;

    // Player card header
    const rarityEmoji = rarity === 'legendary' ? '👑' : rarity === 'gold' ? '🥇' : rarity === 'silver' ? '🥈' : rarity === 'bronze' ? '🥉' : '🎴';
    text += `${rarityEmoji} #${jersey} ${player.fullName.toUpperCase()} ${rarityEmoji}\n`;
    text += `📍 ${school} • ${age} years old\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Points showcase
    if (player.totalPoints > 0) {
      const fireLevel = player.totalPoints >= 24 ? '🔥🔥🔥' : player.totalPoints >= 12 ? '🔥🔥' : '🔥';
      text += `${fireLevel} ${player.totalPoints} TOTAL POINTS ${fireLevel}\n\n`;
    }
    
    // Detailed stats with emojis
    text += `📊 SEASON STATS 📊\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (player.touchdowns > 0) {
      const plural = player.touchdowns > 1 ? 's' : '';
      text += `🏈 ${player.touchdowns} Touchdown${plural}\n`;
    }
    if (player.qbTouchdowns > 0) {
      const plural = player.qbTouchdowns > 1 ? 'es' : '';
      text += `🎯 ${player.qbTouchdowns} QB TD Pass${plural}\n`;
    }
    if (player.extraPoints > 0) {
      const plural = player.extraPoints > 1 ? 's' : '';
      text += `✨ ${player.extraPoints} Extra Point${plural}\n`;
    }
    if (player.twoPointConversions > 0) {
      const plural = player.twoPointConversions > 1 ? 's' : '';
      text += `⚡ ${player.twoPointConversions} 2-Point Conversion${plural}\n`;
    }
    if (player.catches > 0) {
      const plural = player.catches > 1 ? 'es' : '';
      text += `🙌 ${player.catches} Catch${plural}\n`;
    }
    if (player.runs > 0) {
      const plural = player.runs > 1 ? 's' : '';
      text += `🏃 ${player.runs} Rush${plural}\n`;
    }
    if (player.totalFirstDowns > 0) {
      const plural = player.totalFirstDowns > 1 ? 's' : '';
      text += `📍 ${player.totalFirstDowns} First Down${plural}\n`;
    }
    if (player.flagPulls > 0) {
      const plural = player.flagPulls > 1 ? 's' : '';
      text += `🚩 ${player.flagPulls} Flag Pull${plural}\n`;
    }
    if (player.interceptions > 0) {
      const plural = player.interceptions > 1 ? 's' : '';
      text += `🖐️ ${player.interceptions} Interception${plural}\n`;
    }
    if (player.sacks > 0) {
      const plural = player.sacks > 1 ? 's' : '';
      text += `💥 ${player.sacks} Sack${plural}\n`;
    }
    
    text += `\n`;
    
    // Badges showcase
    if (badges.length > 0) {
      text += `🎖️ ACHIEVEMENTS 🎖️\n`;
      badges.forEach(b => {
        text += `${b.emoji} ${b.title}\n`;
      });
      text += `\n`;
    }
    
    text += `📅 ${player.gamesPlayed} Game${player.gamesPlayed !== 1 ? 's' : ''} Played\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `🐔💪 EAT MOR CHIKIN 💪🐔\n\n`;
    text += `📱 Follow LIVE:\nchickfila-flagfootball.replit.app`;

    return text;
  };

  const shareContent = async (text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch (err) {
    }
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const sharePlayerStats = (player: SeasonPlayerStats) => {
    const text = generateSeasonSummary(player);
    shareContent(text);
  };


  const selectedPlayerStats = selectedPlayer ? seasonStats.find(p => p.name === selectedPlayer) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E51636] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]" data-testid="stats-container">
      <header className="bg-[#E51636] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={chickFilALogo} 
                alt="Chick-Fil-A" 
                className="w-11 h-11 bg-white rounded-full p-0.5 shadow-md"
              />
              <div>
                <h1 className="text-lg font-bold font-display tracking-tight">
                  🏆 Season Stats
                </h1>
                <p className="text-[10px] text-white/80 font-medium">2026 Winter • All Games Combined</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-gray-600 hover:text-gray-900 transition-colors mb-4 py-2">
          <ChevronLeft className="w-5 h-5" />
          Back to Games
        </Link>

        {/* 3D Flip Player Cards */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-gray-900">🃏 Player Cards</h2>
            <span className="text-xs text-gray-500">Tap to flip</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {displayOrder.map((name) => {
              const player = seasonStats.find(p => p.name === name);
              if (!player) return null;
              const isFlipped = flippedCards.has(player.name);
              const rarity = getCardRarity(player);
              const styles = getRarityStyles(rarity);
              const badges = getPlayerBadges(player);
              const info = playerInfo[player.name];
              
              return (
                <div
                  key={player.name}
                  className={`card-flip-container relative h-52 cursor-pointer ${
                    rarity === 'legendary' ? 'legendary-glow' :
                    rarity === 'gold' ? 'gold-glow' :
                    rarity === 'silver' ? 'silver-glow' :
                    rarity === 'bronze' ? 'bronze-glow' : ''
                  }`}
                  onClick={() => toggleCardFlip(player.name)}
                  data-testid={`card-container-${player.name}`}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Card Front */}
                    <div
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        background: styles.background,
                        border: styles.border,
                        boxShadow: styles.glow,
                      }}
                    >
                      {/* Holographic shimmer overlay */}
                      <div className="absolute inset-0 holographic-shimmer pointer-events-none" />
                      
                      {/* Team logo */}
                      <div className="absolute top-2 left-2">
                        <img src={chickFilALogo} alt="" className="w-6 h-6 rounded-full bg-white p-0.5" />
                      </div>
                      
                      {/* Jersey number */}
                      <div className="absolute top-2 right-2 bg-amber-400 text-[#8B0000] px-2 py-0.5 rounded font-black text-xs">
                        #{info?.jersey}
                      </div>
                      
                      {/* Player photo */}
                      <div className="flex justify-center pt-8">
                        <div 
                          className="w-20 h-20 rounded-full overflow-hidden border-2"
                          style={{ borderColor: rarity === 'legendary' ? '#9333ea' : rarity === 'gold' ? '#FFD700' : rarity === 'silver' ? '#C0C0C0' : rarity === 'bronze' ? '#CD7F32' : 'rgba(255,255,255,0.3)' }}
                        >
                          {info?.photo ? (
                            <img src={info.photo} alt={player.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <User className="w-10 h-10 text-white/50" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Player name */}
                      <div className="text-center mt-2 px-2">
                        <p className="text-white font-bold text-sm truncate">{player.fullName}</p>
                        <p className="text-amber-300 font-black text-lg">{player.totalPoints} PTS</p>
                      </div>
                      
                      {/* Bottom bar with badges and share */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1.5 flex items-center justify-between">
                        <div className="flex gap-1">
                          {badges.slice(0, 3).map((badge, i) => (
                            <span key={i} className="text-xs">{badge.emoji}</span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedPlayer(player.name); }}
                          className="bg-amber-400 text-[#8B0000] px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1"
                          data-testid={`button-share-front-${player.name}`}
                        >
                          <Share2 className="w-3 h-3" /> SHARE
                        </button>
                      </div>
                    </div>
                    
                    {/* Card Back */}
                    <div
                      className="absolute inset-0 rounded-xl overflow-hidden p-3"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: styles.background,
                        border: styles.border,
                        boxShadow: styles.glow,
                      }}
                    >
                      <div className="h-full flex flex-col">
                        <p className="text-[10px] font-bold text-amber-300 mb-1 text-center">{player.fullName.split(' ')[0].toUpperCase()}'S STATS</p>
                        
                        <div className="flex-1 grid grid-cols-2 gap-1 text-[10px]">
                          {player.touchdowns > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-amber-300 font-bold">{player.touchdowns}</span>
                              <span className="text-white/70"> TDs</span>
                            </div>
                          )}
                          {player.catches > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-sky-300 font-bold">{player.catches}</span>
                              <span className="text-white/70"> CTH</span>
                            </div>
                          )}
                          {player.runs > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-teal-300 font-bold">{player.runs}</span>
                              <span className="text-white/70"> RUN</span>
                            </div>
                          )}
                          {player.qbTouchdowns > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-purple-300 font-bold">{player.qbTouchdowns}</span>
                              <span className="text-white/70"> QB TD</span>
                            </div>
                          )}
                          {player.flagPulls > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-orange-300 font-bold">{player.flagPulls}</span>
                              <span className="text-white/70"> FLG</span>
                            </div>
                          )}
                          {player.interceptions > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-green-300 font-bold">{player.interceptions}</span>
                              <span className="text-white/70"> INT</span>
                            </div>
                          )}
                          {player.sacks > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-red-300 font-bold">{player.sacks}</span>
                              <span className="text-white/70"> SCK</span>
                            </div>
                          )}
                          {player.totalFirstDowns > 0 && (
                            <div className="bg-white/10 rounded px-1.5 py-1 text-center">
                              <span className="text-emerald-300 font-bold">{player.totalFirstDowns}</span>
                              <span className="text-white/70"> 1st</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Badges on back */}
                        {badges.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1 justify-center">
                            {badges.map((badge, i) => (
                              <span key={i} className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${badge.color} text-white`}>
                                {badge.emoji} {badge.title}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedPlayer(player.name); }}
                          className="mt-2 w-full py-1.5 bg-amber-400 text-[#8B0000] rounded-lg font-bold text-xs flex items-center justify-center gap-1"
                          data-testid={`button-share-back-${player.name}`}
                        >
                          <Share2 className="w-3 h-3" /> SHARE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Record */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-3">Team Record</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
              <p className="text-4xl font-display font-bold text-emerald-600">{teamStats.wins}</p>
              <p className="text-sm font-semibold text-emerald-600">WINS</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-4xl font-display font-bold text-gray-500">{teamStats.losses}</p>
              <p className="text-sm font-semibold text-gray-500">LOSSES</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
              <p className="text-4xl font-display font-bold text-amber-600">{teamStats.ties}</p>
              <p className="text-sm font-semibold text-amber-600">TIES</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#E51636]/5 rounded-xl p-4 text-center border border-[#E51636]/10">
              <p className="text-3xl font-display font-bold text-[#E51636]">{teamStats.totalPoints}</p>
              <p className="text-sm font-semibold text-[#E51636]">POINTS FOR</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <p className="text-3xl font-display font-bold text-gray-500">{teamStats.pointsAllowed}</p>
              <p className="text-sm font-semibold text-gray-500">POINTS AGAINST</p>
            </div>
          </div>
        </div>

        {/* League Standings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold text-gray-900">League Standings</h2>
            <span className="text-xs text-gray-500 font-medium">13.15 Boys • James Island</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 font-bold text-gray-600">#</th>
                  <th className="text-left py-2 px-3 font-bold text-gray-600">Team</th>
                  <th className="text-center py-2 px-2 font-bold text-gray-600">W</th>
                  <th className="text-center py-2 px-2 font-bold text-gray-600">L</th>
                  <th className="text-center py-2 px-2 font-bold text-gray-600">T</th>
                  <th className="text-center py-2 px-3 font-bold text-gray-600">PTS</th>
                </tr>
              </thead>
              <tbody>
                {leagueStandings.map((team, idx) => (
                  <tr 
                    key={team.team} 
                    className={`border-t border-gray-100 ${team.isUs ? 'bg-[#E51636]/10 font-bold' : ''}`}
                  >
                    <td className="py-2 px-3">
                      <span className={`${idx === 0 ? 'text-amber-500' : team.isUs ? 'text-[#E51636]' : 'text-gray-500'} font-bold`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className={`py-2 px-3 ${team.isUs ? 'text-[#E51636]' : 'text-gray-700'}`}>
                      {team.team}
                    </td>
                    <td className="py-2 px-2 text-center text-emerald-600">{team.wins}</td>
                    <td className="py-2 px-2 text-center text-gray-500">{team.losses}</td>
                    <td className="py-2 px-2 text-center text-amber-600">{team.ties}</td>
                    <td className={`py-2 px-3 text-center font-bold ${team.isUs ? 'text-[#E51636]' : 'text-gray-700'}`}>
                      {team.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">3 pts for win • 1 pt for tie • 0 pts for loss</p>
        </div>

        {/* Stat Leaders with Bar Charts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-4">Stat Leaders</h2>
          
          {/* Points Leader */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Points
              </span>
            </div>
            <div className="space-y-2">
              {seasonStats.slice(0, 3).map((player, idx) => (
                <div key={player.name} className="flex items-center gap-2">
                  <span className={`w-6 text-xs font-bold ${idx === 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="w-24 text-sm font-medium text-gray-700 truncate">{player.fullName.split(' ')[0]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E51636] to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(player.totalPoints / maxPoints) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-[#E51636]">{player.totalPoints}</span>
                </div>
              ))}
            </div>
          </div>

          {/* First Downs Leader */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                <FastForward className="w-4 h-4 text-teal-500" /> First Downs
              </span>
            </div>
            <div className="space-y-2">
              {[...seasonStats].sort((a, b) => b.totalFirstDowns - a.totalFirstDowns).slice(0, 3).map((player, idx) => (
                <div key={player.name} className="flex items-center gap-2">
                  <span className={`w-6 text-xs font-bold ${idx === 0 ? 'text-teal-500' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="w-24 text-sm font-medium text-gray-700 truncate">{player.fullName.split(' ')[0]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(player.totalFirstDowns / maxFirstDowns) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-teal-600">{player.totalFirstDowns}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catches Leader */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                <Hand className="w-4 h-4 text-blue-500" /> Catches
              </span>
            </div>
            <div className="space-y-2">
              {[...seasonStats].sort((a, b) => b.catches - a.catches).slice(0, 3).map((player, idx) => (
                <div key={player.name} className="flex items-center gap-2">
                  <span className={`w-6 text-xs font-bold ${idx === 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="w-24 text-sm font-medium text-gray-700 truncate">{player.fullName.split(' ')[0]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${(player.catches / maxCatches) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-blue-600">{player.catches}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flag Pulls Leader */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                <Flag className="w-4 h-4 text-orange-500" /> Flag Pulls
              </span>
            </div>
            <div className="space-y-2">
              {[...seasonStats].sort((a, b) => b.flagPulls - a.flagPulls).slice(0, 3).map((player, idx) => (
                <div key={player.name} className="flex items-center gap-2">
                  <span className={`w-6 text-xs font-bold ${idx === 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="w-24 text-sm font-medium text-gray-700 truncate">{player.fullName.split(' ')[0]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${(player.flagPulls / maxFlagPulls) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-orange-600">{player.flagPulls}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Player Detail Modal - 3D Flip Trading Card */}
        {selectedPlayerStats && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4" onClick={() => { setSelectedPlayer(null); setModalFlipped(false); }}>
            <div 
              className="relative w-full max-w-sm h-[600px] cursor-pointer"
              style={{ perspective: '1500px' }}
              onClick={(e) => { e.stopPropagation(); setModalFlipped(!modalFlipped); }}
              data-testid="modal-card-container"
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: modalFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT OF CARD - Photo & Basic Info */}
                <div 
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #E51636 0%, #b01030 50%, #8a0c26 100%)',
                  }}
                >
                  {/* Holographic shimmer */}
                  <div className="absolute inset-0 holographic-shimmer pointer-events-none" />
                  
                  {/* Top Banner */}
                  <div className="relative px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={chickFilALogo} alt="Chick-Fil-A" className="w-8 h-8 bg-white rounded-full p-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-white/90 tracking-wider">CHICK-FIL-A</p>
                          <p className="text-[8px] text-white/60">FLAG FOOTBALL</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-amber-300">2026</p>
                        <p className="text-[8px] text-white/60">WINTER</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Player Photo */}
                  <div className="relative px-6 py-6">
                    <div 
                      className="w-40 h-40 mx-auto rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                        border: '4px solid rgba(255,215,0,0.5)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                      }}
                    >
                      {playerInfo[selectedPlayerStats.name]?.photo ? (
                        <img 
                          src={playerInfo[selectedPlayerStats.name].photo} 
                          alt={selectedPlayerStats.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-20 h-20 text-white/80" />
                      )}
                    </div>
                  </div>
                  
                  {/* Player Name */}
                  <div 
                    className="mx-4 py-4 px-4 text-center"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
                      borderTop: '1px solid rgba(255,215,0,0.3)',
                      borderBottom: '1px solid rgba(255,215,0,0.3)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="bg-amber-400 text-[#8B0000] px-3 py-1 rounded font-black text-lg">#{playerInfo[selectedPlayerStats.name]?.jersey}</span>
                      <h3 className="text-2xl font-black text-white tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {selectedPlayerStats.fullName.toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-sm text-amber-200 font-semibold">{playerInfo[selectedPlayerStats.name]?.school} • Age {playerInfo[selectedPlayerStats.name]?.age}</p>
                  </div>
                  
                  {/* Points & Games */}
                  <div className="flex justify-center gap-8 py-6">
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto"
                        style={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          boxShadow: '0 4px 15px rgba(255,215,0,0.4)',
                        }}
                      >
                        <span className="text-3xl font-black text-[#8B0000]">{selectedPlayerStats.totalPoints}</span>
                      </div>
                      <p className="text-xs font-bold text-white/80 mt-2 tracking-wider">POINTS</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        <span className="text-3xl font-black text-white">{selectedPlayerStats.gamesPlayed}</span>
                      </div>
                      <p className="text-xs font-bold text-white/80 mt-2 tracking-wider">GAMES</p>
                    </div>
                  </div>
                  
                  {/* Tap hint */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-xs text-white/50 animate-pulse">👆 TAP TO SEE STATS</p>
                  </div>
                  
                  {/* Card number */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[8px] text-white/40 font-mono">CARD #{String(displayOrder.indexOf(selectedPlayerStats.name) + 1).padStart(2, '0')}/09</p>
                  </div>
                </div>
                
                {/* BACK OF CARD - Full Stats */}
                <div 
                  className="absolute inset-0 rounded-3xl overflow-hidden p-4"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-[#8B0000] px-2 py-0.5 rounded font-black text-sm">#{playerInfo[selectedPlayerStats.name]?.jersey}</span>
                      <span className="text-white font-bold">{selectedPlayerStats.fullName}</span>
                    </div>
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-lg">
                      <span className="text-[#8B0000] font-black">{selectedPlayerStats.totalPoints} PTS</span>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-amber-300 mb-3 tracking-widest">📊 SEASON STATS</p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedPlayerStats.touchdowns > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg border border-amber-500/30">
                          <p className="text-2xl font-black text-amber-300">{selectedPlayerStats.touchdowns}</p>
                          <p className="text-[9px] text-white/70 font-semibold">TOUCHDOWNS</p>
                        </div>
                      )}
                      {selectedPlayerStats.extraPoints > 0 && (
                        <div className="text-center py-3 bg-white/10 rounded-lg">
                          <p className="text-2xl font-black text-white">{selectedPlayerStats.extraPoints}</p>
                          <p className="text-[9px] text-white/70 font-semibold">EXTRA PTS</p>
                        </div>
                      )}
                      {selectedPlayerStats.twoPointConversions > 0 && (
                        <div className="text-center py-3 bg-white/10 rounded-lg">
                          <p className="text-2xl font-black text-white">{selectedPlayerStats.twoPointConversions}</p>
                          <p className="text-[9px] text-white/70 font-semibold">2-PT CONV</p>
                        </div>
                      )}
                      {selectedPlayerStats.qbTouchdowns > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                          <p className="text-2xl font-black text-purple-300">{selectedPlayerStats.qbTouchdowns}</p>
                          <p className="text-[9px] text-white/70 font-semibold">QB TD PASS</p>
                        </div>
                      )}
                      {selectedPlayerStats.catches > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-lg border border-sky-500/30">
                          <p className="text-2xl font-black text-sky-300">{selectedPlayerStats.catches}</p>
                          <p className="text-[9px] text-white/70 font-semibold">CATCHES</p>
                        </div>
                      )}
                      {selectedPlayerStats.catchFirstDowns > 0 && (
                        <div className="text-center py-3 bg-white/10 rounded-lg">
                          <p className="text-2xl font-black text-sky-300">{selectedPlayerStats.catchFirstDowns}</p>
                          <p className="text-[9px] text-white/70 font-semibold">CATCH 1ST</p>
                        </div>
                      )}
                      {selectedPlayerStats.runs > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-lg border border-teal-500/30">
                          <p className="text-2xl font-black text-teal-300">{selectedPlayerStats.runs}</p>
                          <p className="text-[9px] text-white/70 font-semibold">RUNS</p>
                        </div>
                      )}
                      {selectedPlayerStats.firstDowns > 0 && (
                        <div className="text-center py-3 bg-white/10 rounded-lg">
                          <p className="text-2xl font-black text-teal-300">{selectedPlayerStats.firstDowns}</p>
                          <p className="text-[9px] text-white/70 font-semibold">RUN 1ST</p>
                        </div>
                      )}
                      {selectedPlayerStats.qbFirstDownThrows > 0 && (
                        <div className="text-center py-3 bg-white/10 rounded-lg">
                          <p className="text-2xl font-black text-purple-300">{selectedPlayerStats.qbFirstDownThrows}</p>
                          <p className="text-[9px] text-white/70 font-semibold">QB 1ST DN</p>
                        </div>
                      )}
                      {selectedPlayerStats.flagPulls > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/30">
                          <p className="text-2xl font-black text-orange-300">{selectedPlayerStats.flagPulls}</p>
                          <p className="text-[9px] text-white/70 font-semibold">FLAG PULLS</p>
                        </div>
                      )}
                      {selectedPlayerStats.interceptions > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                          <p className="text-2xl font-black text-green-300">{selectedPlayerStats.interceptions}</p>
                          <p className="text-[9px] text-white/70 font-semibold">INTs</p>
                        </div>
                      )}
                      {selectedPlayerStats.sacks > 0 && (
                        <div className="text-center py-3 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg border border-red-500/30">
                          <p className="text-2xl font-black text-red-300">{selectedPlayerStats.sacks}</p>
                          <p className="text-[9px] text-white/70 font-semibold">SACKS</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Badges */}
                  {getPlayerBadges(selectedPlayerStats).length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-amber-300 mb-2 tracking-widest">🎖️ ACHIEVEMENTS</p>
                      <div className="flex flex-wrap gap-2">
                        {getPlayerBadges(selectedPlayerStats).map((badge, i) => (
                          <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r ${badge.color} text-white`}>
                            {badge.emoji} {badge.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Share Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); sharePlayerStats(selectedPlayerStats); }}
                    className="w-full py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 text-[#8B0000]"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
                    }}
                    data-testid="button-share-modal"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Stats
                  </button>
                  
                  {/* Back Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPlayer(null); setModalFlipped(false); }}
                    className="w-full mt-3 py-3 bg-white/20 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                    data-testid="button-back-from-player"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Team
                  </button>
                  
                  {/* Tap hint */}
                  <p className="text-center text-xs text-white/40 mt-3">👆 TAP TO FLIP BACK</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <a 
            href="mailto:info@surfstung.com?subject=Website/App Inquiry from Chick-Fil-A Flag Football"
            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span>Built & Sponsored by</span>
            <img 
              src={surfstungLogo} 
              alt="Surfstung" 
              className="w-5 h-5 rounded"
            />
            <span className="font-semibold text-gray-700">Surfstung</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default SeasonStats;
