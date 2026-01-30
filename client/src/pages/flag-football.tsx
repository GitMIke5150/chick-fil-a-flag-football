import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Edit, ChevronLeft, ChevronDown, Calendar, Clock, BarChart3, Zap, Undo2, Trophy, Target, Flag, Shield, Sparkles, Hand, Trash2, Share2, Home, FastForward, Footprints, Lock, Minus, Plus, Check, X, CircleSlash, Smartphone, Send, MapPin, Users, AlertTriangle, RotateCcw, Mic, MicOff, Loader2, MessageSquare, Video, VideoOff, Play, Download } from 'lucide-react';
import ConfettiExplosion from 'react-confetti-explosion';
import { Link } from 'wouter';
import chickFilALogo from '@assets/IMG_1083_1768217940008.png';
import surfstungLogo from '@assets/D28D4B9E-1A54-4691-B798-C07AE190DD30_1768318377404.png';
import dairyQueenLogo from '@assets/generated_images/dairy_queen_dq_logo.png';
import dicksSportingGoodsLogo from "@assets/generated_images/dick's_sporting_goods_logo.png";
import zaxbysLogo from "@assets/generated_images/zaxby's_restaurant_logo.png";

const opponentLogos: Record<string, string> = {
  'Dairy Queen': dairyQueenLogo,
  "Dick's Sporting Goods": dicksSportingGoodsLogo,
  "Zaxby's": zaxbysLogo,
};
import { fetchGames, createGame, updateGame, deleteGame } from '@/lib/api';
import type { Game } from '@shared/schema';

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
  completions: number;
  incompletes: number;
  drops: number;
  notes?: Array<{ text: string; quarter: number; timestamp: number }>;
  targets?: number;
  fiftyFiftyCatches?: number;
  fiftyFiftyTargets?: number;
  fumbles?: number;
  forcedFumbles?: number;
  fumbleRecoveries?: number;
  highlights?: Array<{ videoUrl: string; description: string; timestamp: number; quarter: number }>;
}

interface ScheduleGame {
  id: number;
  date: string;
  day: string;
  opponent: string;
  time: string;
  field: string;
  location: 'home' | 'away';
}


const FlagFootballScorer = () => {
  const queryClient = useQueryClient();
  const roster = ['Davis Olson', 'Hampton Wells', 'Sly Willis', 'Hudson Paulus', 'Nasty Nate', 'Caleb', 'Bryce Halter', 'Bennett Walters', 'Knox Hager'];
  
  const playerFullNames: Record<string, string> = {
    'Davis Olson': 'Davis Olson',
    'Hampton Wells': 'Hampton Wells',
    'Sly Willis': 'Sly Willis',
    'Hudson Paulus': 'Hudson Paulus',
    'Nasty Nate': 'Nasty Nate',
    'Caleb': 'Caleb',
    'Bryce Halter': 'Bryce Halter',
    'Bennett Walters': 'Bennett Walters',
    'Knox Hager': 'Knox Hager',
  };

  const playerInfo: Record<string, { fullName: string; school: string; age: number; jersey: number }> = {
    'Davis Olson': { fullName: 'Davis Olson', school: 'Camp Rd Middle', age: 13, jersey: 3 },
    'Hampton Wells': { fullName: 'Hampton Wells', school: 'Camp Rd Middle', age: 13, jersey: 12 },
    'Sly Willis': { fullName: 'Sly Willis', school: 'Camp Rd Middle', age: 14, jersey: 5 },
    'Hudson Paulus': { fullName: 'Hudson Paulus', school: 'Camp Rd Middle', age: 14, jersey: 7 },
    'Knox Hager': { fullName: 'Knox Hager', school: 'Camp Rd Middle', age: 13, jersey: 6 },
    'Nasty Nate': { fullName: 'Nasty Nate', school: 'Bishop England', age: 15, jersey: 9 },
    'Caleb': { fullName: 'Caleb', school: 'Hybrid', age: 14, jersey: 2 },
    'Bennett Walters': { fullName: 'Bennett Walters', school: 'Camp Rd Middle', age: 13, jersey: 1 },
    'Bryce Halter': { fullName: 'Bryce Halter', school: 'Camp Rd Middle', age: 14, jersey: 4 },
  };

  const getPlayerStats = (statsObj: Record<string, PlayerStats> | undefined, player: string): PlayerStats | undefined => {
    if (!statsObj) return undefined;
    const firstName = player.split(' ')[0];
    const nicknames: Record<string, string> = {
      'Hampton Wells': 'Hampton',
      'Nasty Nate': 'Nate',
      'Bryce Halter': 'Bryce',
    };
    const nickname = nicknames[player];
    
    const hasRealStats = (s: PlayerStats | undefined) => s && (
      s.touchdowns > 0 || s.catches > 0 || s.flagPulls > 0 || s.interceptions > 0 ||
      s.sacks > 0 || s.runs > 0 || s.completions > 0 || s.incompletes > 0 ||
      s.qbTouchdowns > 0 || s.qbFirstDownThrows > 0 || s.catchFirstDowns > 0 ||
      s.extraPoints > 0 || s.twoPointConversions > 0 || s.drops > 0 ||
      (s.notes && s.notes.length > 0)
    );
    
    const fullNameStats = statsObj[player];
    const firstNameStats = statsObj[firstName];
    const nicknameStats = nickname ? statsObj[nickname] : undefined;
    
    if (hasRealStats(firstNameStats)) return firstNameStats;
    if (hasRealStats(fullNameStats)) return fullNameStats;
    if (hasRealStats(nicknameStats)) return nicknameStats;
    return fullNameStats || firstNameStats || nicknameStats;
  };

  // Micro story generator based on player stats
  const getMicroStory = (stats: PlayerStats): string => {
    const totalTDs = (stats.touchdowns || 0) + (stats.qbTouchdowns || 0);
    const totalFirstDowns = (stats.firstDowns || 0) + (stats.catchFirstDowns || 0) + (stats.qbFirstDownThrows || 0);
    const totalDefense = (stats.flagPulls || 0) + (stats.interceptions || 0) + (stats.sacks || 0);
    
    if (totalTDs >= 2) return "Lighting up the scoreboard!";
    if (totalTDs > 0) return "Found the end zone!";
    if (totalFirstDowns >= 3) return "Moving the chains all night!";
    if (totalFirstDowns >= 2) return "Moved the chains!";
    if (totalDefense >= 3) return "Shutdown defender tonight!";
    if (stats.interceptions && stats.interceptions > 0) return "Ball hawk on defense!";
    if (totalDefense >= 2) return "Locked down on defense.";
    if ((stats.catches || 0) >= 3) return "Sure hands all game!";
    if ((stats.catches || 0) >= 2) return "Reliable hands tonight.";
    if ((stats.twoPointConversions || 0) > 0) return "Clutch in the red zone!";
    return "Solid effort. Ready for more!";
  };

  // Auto badge picker based on top stat
  const getBadge = (stats: PlayerStats): string => {
    const totalTDs = (stats.touchdowns || 0) + (stats.qbTouchdowns || 0);
    if (totalTDs > 0) return "🏆 TD Scorer";
    if ((stats.twoPointConversions || 0) > 0) return "⚡ Clutch Converter";
    if ((stats.interceptions || 0) > 0) return "🖐️ Interceptor";
    if ((stats.sacks || 0) > 0) return "💥 Pass Rusher";
    if ((stats.firstDowns || 0) > 0) return "🏃 Ground Gainer";
    if ((stats.catchFirstDowns || 0) > 0) return "📍 First Down Machine";
    if ((stats.qbFirstDownThrows || 0) > 0) return "🎯 Precision Passer";
    if ((stats.flagPulls || 0) > 0) return "🛡️ Defensive Hawk";
    if ((stats.catches || 0) > 0) return "🙌 Reliable Hands";
    if ((stats.runs || 0) > 0) return "🏃 Ball Carrier";
    if ((stats.completions || 0) > 0) return "🎯 Distributor";
    return "💪 Team Contributor";
  };

  const schedule: ScheduleGame[] = [
    { id: 1, date: '01/07', day: 'Wed', opponent: 'Dairy Queen', time: '6:45pm', field: 'Bay 1', location: 'away' },
    { id: 2, date: '01/08', day: 'Thur', opponent: "Dick's Sporting Goods", time: '5:45pm', field: 'Bay 2', location: 'home' },
    { id: 3, date: '01/13', day: 'Tues', opponent: "Zaxby's", time: '7:45pm', field: 'Bay 2', location: 'home' },
    { id: 4, date: '01/20', day: 'Tues', opponent: "Dick's Sporting Goods", time: '7:45pm', field: 'Bay 2', location: 'home' },
    { id: 5, date: '01/22', day: 'Thur', opponent: 'Dairy Queen', time: '5:45pm', field: 'Bay 2', location: 'away' },
    { id: 6, date: '01/29', day: 'Thur', opponent: "Zaxby's", time: '6:45pm', field: 'Bay 2', location: 'away' },
    { id: 7, date: '02/05', day: 'Thur', opponent: "Dick's Sporting Goods", time: '6:45pm', field: 'Bay 2', location: 'away' },
    { id: 8, date: '02/12', day: 'Thur', opponent: 'Dairy Queen', time: '6:45pm', field: 'Bay 2', location: 'home' }
  ];

  // Halftime sponsors/coaches carousel
  const halftimeSponsors = [
    { 
      name: 'SURFSTUNG',
      headline: 'YOUR VISION, BUILT',
      supporting: 'Apps • Websites • AI Solutions',
      cta: 'See the Studio',
      color: 'from-violet-600 via-purple-600 to-indigo-700',
      accentColor: 'bg-cyan-400 text-black',
      logo: surfstungLogo,
      link: '/surfstung',
      badge: '💻'
    },
    { 
      name: 'JOHN HALTER',
      headline: 'LOWCOUNTRY LIVING AWAITS',
      supporting: 'Seabrook Island Real Estate',
      cta: 'Tour Listings',
      color: 'from-emerald-600 via-teal-600 to-cyan-700',
      accentColor: 'bg-white text-emerald-700',
      logo: chickFilALogo,
      link: 'https://www.seabrookisland.com/real-estate/agents/john-halter/',
      badge: '🏝️'
    },
    { 
      name: 'WELLS COMPASS',
      headline: 'FIND YOUR COMPASS',
      supporting: 'Professional Counseling for Families',
      cta: 'Learn More',
      color: 'from-sky-600 via-blue-600 to-indigo-600',
      accentColor: 'bg-white text-blue-700',
      logo: chickFilALogo,
      link: 'https://wells-compass--surfstungco.replit.app',
      badge: '🧭'
    },
    { 
      name: 'KRISTEN OLSON HAIR',
      headline: 'YOUR GLOW-UP STARTS HERE',
      supporting: 'Natural Blonding • Dimensional Color',
      cta: 'Book Now',
      color: 'from-pink-500 via-rose-500 to-fuchsia-600',
      accentColor: 'bg-white text-pink-600',
      logo: 'https://kristen-olson-hair--surfstungco.replit.app/assets/4F0ACD37-E450-4CEE-A466-C35E65A5D500_1766761641777-CXnFFOiZ.png',
      link: 'https://kristen-olson-hair--surfstungco.replit.app',
      badge: '✨'
    },
    { 
      name: 'YOUR BUSINESS',
      headline: 'WANT TO BE FEATURED HERE?',
      supporting: 'Reach local families at every game!',
      cta: 'Get Started',
      color: 'from-gray-700 via-gray-800 to-gray-900',
      accentColor: 'bg-[#E51636] text-white',
      logo: chickFilALogo,
      link: '/sponsor-inquiry',
      badge: '📣'
    },
  ];

  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'spectator'>(() => {
    const saved = localStorage.getItem('chickFilAViewMode');
    const isUnlocked = localStorage.getItem('chickFilAAdminUnlocked') === 'true';
    return isUnlocked && saved === 'admin' ? 'admin' : 'spectator';
  });
  const [adminUnlocked, setAdminUnlocked] = useState(() => 
    localStorage.getItem('chickFilAAdminUnlocked') === 'true'
  );
  const [adminCode, setAdminCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [showHomeScreenGuide, setShowHomeScreenGuide] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [expandedHighlights, setExpandedHighlights] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<'our' | 'opponent' | null>(null);
  const [isEditingPastGame, setIsEditingPastGame] = useState(false);
  const [stagedStats, setStagedStats] = useState<Array<{
    id: string;
    player: string;
    stat: keyof PlayerStats;
    scoreValue: number;
    actionName: string;
    emoji: string;
  }>>([]);
  const [celebration, setCelebration] = useState<'touchdown' | 'firstdown' | null>(null);
  
  // Quick Play wizard state
  const [playMode, setPlayMode] = useState<'none' | 'pass' | 'run' | 'defense' | 'detailed' | 'opponent' | 'penalty' | 'timeout'>('none');
  const [playStep, setPlayStep] = useState<'selectQB' | 'selectReceiver' | 'selectResult' | 'selectTarget' | 'selectFiftyFiftyResult' | 'selectRunner' | 'selectDefender' | 'selectDefenseType' | 'opponentChoice' | 'opponentPassOutcome' | 'opponentRunOutcome' | 'opponentConversion' | 'opponentFirstDown' | 'selectDefenderAfterStop' | 'selectDefenseTypeAfterStop' | 'penaltyChoice' | 'selectConversionQB' | 'selectConversionReceiver' | 'selectConversionType' | 'selectInterceptor' | 'selectSacker' | 'selectPickSixPlayer'>('selectQB');
  const [selectedQB, setSelectedQB] = useState<string | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);
  const [conversionQB, setConversionQB] = useState<string | null>(null);
  const [conversionReceiver, setConversionReceiver] = useState<string | null>(null);
  const [selectedRunner, setSelectedRunner] = useState<string | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<string | null>(null);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [opponentPlayContext, setOpponentPlayContext] = useState<{ type: 'pass' | 'run'; firstDown: boolean } | null>(null);
  
  // Action history for undo
  type ActionHistoryEntry = {
    id: string;
    gameId: number;
    timestamp: number;
    type: 'stat' | 'score' | 'opponent_score' | 'opponent_play';
    description: string;
    undo: () => Promise<void>;
  };
  const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>([]);
  
  // Possession state - offense or defense
  const [possession, setPossession] = useState<'offense' | 'defense'>('offense');
  
  // Down tracker - 1st through 4th down
  const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
  
  // Timeout state - tracks if a timeout is currently active
  const [timeoutActive, setTimeoutActive] = useState<'us' | 'them' | null>(null);
  
  const advanceDown = async (gameId?: number) => {
    const newDown = currentDown === 4 ? 1 : (currentDown + 1) as 1 | 2 | 3 | 4;
    setCurrentDown(newDown);
    
    // Broadcast to ticker if game provided
    if (gameId) {
      const downLabel = newDown === 1 ? '1ST' : newDown === 2 ? '2ND' : newDown === 3 ? '3RD' : '4TH';
      await updateGameMutation.mutateAsync({
        id: gameId,
        data: {
          lastPlay: {
            player: '',
            action: `${downLabel} DOWN`,
            emoji: '🏈',
            timestamp: Date.now(),
          },
        },
      });
    }
  };
  
  const resetToFirstDown = () => {
    setCurrentDown(1);
  };
  
  // Sticky ticker state - persists until manual refresh
  const [displayedLastPlay, setDisplayedLastPlay] = useState<{ player: string; action: string; emoji: string; timestamp: number; videoUrl?: string } | null>(null);
  const [pullRefreshY, setPullRefreshY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // Halftime carousel state
  const [halftimeSponsorIndex, setHalftimeSponsorIndex] = useState(0);

  // Voice commentary state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showCommentary, setShowCommentary] = useState(false);
  const audioChunksRef = React.useRef<Blob[]>([]);
  
  // Pending voice play - awaiting user confirmation
  type PendingVoicePlay = {
    transcription: string;
    parsedPlay: any;
    gameId: number;
    quarter: number;
    timestamp: number;
    videoUrl?: string;
  };
  const [pendingVoicePlay, setPendingVoicePlay] = useState<PendingVoicePlay | null>(null);
  
  // Video recording state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoChunksRef = React.useRef<Blob[]>([]);
  const [pendingVideoUrl, setPendingVideoUrl] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const videoPreviewRef = React.useRef<HTMLVideoElement | null>(null);
  const recordingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  
  // Separate audio recording for transcription (audio-only is much smaller than video)
  const [videoAudioRecorder, setVideoAudioRecorder] = useState<MediaRecorder | null>(null);
  const videoAudioChunksRef = React.useRef<Blob[]>([]);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);

  // Pending video play preview state - for confirmation before saving
  type PendingVideoPlay = {
    parsedPlay: any;
    transcription: string;
    objectPath: string;
    timestamp: number;
    quarter: number;
    commentaryText: string;
    newStats: any;
    scoreChange: number;
    tickerPlayer: string;
    tickerAction: string;
    tickerEmoji: string;
  };
  const [pendingVideoPlay, setPendingVideoPlay] = useState<PendingVideoPlay | null>(null);

  // Play log state - tracks last 10 plays
  type PlayLogEntry = {
    id: string;
    timestamp: number;
    player: string;
    action: string;
    emoji: string;
    quarter: number;
  };
  const [playLog, setPlayLog] = useState<PlayLogEntry[]>([]);
  const [showPlayLog, setShowPlayLog] = useState(false);

  // Confirmation toast state
  const [confirmationToast, setConfirmationToast] = useState<{ message: string; emoji: string; visible: boolean } | null>(null);

  // Offline detection state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: gamesData = [], isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
    refetchInterval: 1500,
  });

  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateGame(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setSelectedGame(null);
    },
  });

  const games = gamesData.reduce((acc, game) => {
    acc[game.id] = {
      ourScore: game.ourScore,
      opponentScore: game.opponentScore,
      notes: game.notes || '',
      stats: game.playerStats,
      isFinished: game.isFinished === 1,
      lastPlay: game.lastPlay || null,
      publicLastPlay: (game as any).publicLastPlay || null,
      quarter: game.quarter || 1,
      isHalftime: game.isHalftime === 1,
      possession: (game.possession as 'offense' | 'defense') || 'offense',
      coachCommentary: (game as any).coachCommentary || [],
      aiHighlights: (game as any).aiHighlights || '',
    };
    return acc;
  }, {} as Record<number, { ourScore: number; opponentScore: number; notes: string; stats: Record<string, PlayerStats>; isFinished: boolean; lastPlay: { player: string; action: string; emoji: string; timestamp: number; videoUrl?: string } | null; publicLastPlay: { player: string; action: string; emoji: string; timestamp: number; videoUrl?: string } | null; quarter: number; isHalftime: boolean; possession: 'offense' | 'defense'; coachCommentary: Array<{ text: string; timestamp: number; quarter: number; videoUrl?: string }>; aiHighlights: string }>);

  // Clear staged stats and play wizard when game changes
  useEffect(() => {
    setStagedStats([]);
    setSelectedPlayer(null);
    resetPlayWizard();
    // Reset down tracker for new game - keeps it simple and predictable
    setCurrentDown(1);
    // Sync possession from database when selecting a game
    if (selectedGame && games[selectedGame]) {
      setPossession(games[selectedGame].possession);
    }
    // Initialize sticky ticker when selecting a game
    if (selectedGame && games[selectedGame]?.lastPlay) {
      setDisplayedLastPlay(games[selectedGame].lastPlay);
    } else {
      setDisplayedLastPlay(null);
    }
  }, [selectedGame]);

  // Halftime carousel rotation - rotate every 4 seconds during halftime
  useEffect(() => {
    const currentGame = selectedGame ? games[selectedGame] : null;
    if (!currentGame?.isHalftime) {
      setHalftimeSponsorIndex(0);
      return;
    }
    
    const interval = setInterval(() => {
      setHalftimeSponsorIndex(prev => (prev + 1) % halftimeSponsors.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [selectedGame, games[selectedGame ?? 0]?.isHalftime, halftimeSponsors.length]);

  // Track when user triggers a manual refresh
  const [pendingRefresh, setPendingRefresh] = useState(false);
  
  // Update displayedLastPlay when fresh data arrives after manual refresh
  useEffect(() => {
    if (pendingRefresh && selectedGame) {
      const newLastPlay = games[selectedGame]?.lastPlay;
      if (newLastPlay) {
        setDisplayedLastPlay(newLastPlay);
      }
      setPendingRefresh(false);
      setIsRefreshing(false);
    }
  }, [gamesData, pendingRefresh, selectedGame]);

  // Pull-to-refresh handlers for spectator view
  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== 'spectator') return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (viewMode !== 'spectator' || touchStartY === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    if (diff > 0 && diff < 150) {
      setPullRefreshY(diff);
    }
  };

  const handleTouchEnd = async () => {
    if (viewMode !== 'spectator') return;
    if (pullRefreshY > 80) {
      setIsRefreshing(true);
      setPendingRefresh(true);
      await queryClient.invalidateQueries({ queryKey: ['games'] });
    }
    setPullRefreshY(0);
    setTouchStartY(0);
  };

  const resetPlayWizard = () => {
    setPlayMode('none');
    setPlayStep('selectQB');
    setSelectedQB(null);
    setSelectedReceiver(null);
    setSelectedRunner(null);
    setSelectedDefender(null);
    setOpponentPlayContext(null);
    setConversionQB(null);
    setConversionReceiver(null);
  };

  // Voice commentary recording functions
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice recording is not supported on this device');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        console.log('[Voice] Data available, size:', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        console.log('[Voice] Recording stopped, chunks collected:', audioChunksRef.current.length);
        stream.getTracks().forEach(track => track.stop());
        if (audioChunksRef.current.length > 0 && selectedGame) {
          await processRecording();
        } else {
          console.log('[Voice] No audio chunks or no game selected');
        }
      };
      
      recorder.onerror = (event) => {
        console.error('Recording error:', event);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setMediaRecorder(null);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setMediaRecorder(null);
      setIsRecording(false);
      alert('Please allow microphone access to record commentary');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Video recording functions
  const openCameraModal = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Video recording is not supported on this device');
      return;
    }
    
    try {
      // Try to get the best available video format with maximum stabilization
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          // @ts-ignore - stabilization constraints for mobile devices
          videoStabilization: true,
          // @ts-ignore - iOS specific stabilization mode
          imageStabilization: true,
          // @ts-ignore - advanced constraints for better stabilization
          advanced: [
            { videoStabilization: true },
            { imageStabilization: true },
            // Continuous focus/exposure helps reduce jitter
            { focusMode: 'continuous' },
            { exposureMode: 'continuous' },
            { whiteBalanceMode: 'continuous' }
          ]
        },
        audio: true 
      });
      
      // Try to apply stabilization after stream is obtained (some devices require this)
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          // @ts-ignore - applyConstraints for stabilization
          await videoTrack.applyConstraints({
            // @ts-ignore
            videoStabilization: true,
            // @ts-ignore
            imageStabilization: true
          });
          console.log('[Camera] Applied stabilization constraints');
        } catch (e) {
          console.log('[Camera] Stabilization constraints not fully supported, using defaults');
        }
      }
      
      setVideoStream(stream);
      setShowCameraModal(true);
      setRecordedVideoBlob(null);
      setRecordingDuration(0);
      videoChunksRef.current = [];
      
      // Wait for modal to render, then attach stream to video element
      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(console.error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to access camera:', error);
      alert('Please allow camera access to record video');
    }
  };

  const closeCameraModal = () => {
    // Stop all tracks
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (videoRecorder && videoRecorder.state === 'recording') {
      videoRecorder.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setShowCameraModal(false);
    setIsRecordingVideo(false);
    setVideoRecorder(null);
    setRecordingDuration(0);
    setRecordedVideoBlob(null);
    setPendingVideoPlay(null); // Clear any pending preview
    videoChunksRef.current = [];
  };

  const startVideoRecording = () => {
    if (!videoStream) return;
    
    // Check if MediaRecorder is available (iOS Safari 14.3+)
    if (typeof MediaRecorder === 'undefined') {
      alert('Video recording is not supported on this device. Please update your browser or try a different device.');
      return;
    }
    
    videoChunksRef.current = [];
    videoAudioChunksRef.current = [];
    setRecordingDuration(0);
    
    // Try different MIME types for cross-platform support
    let mimeType = '';
    const mimeTypes = [
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1',
      'video/mp4',
      ''
    ];
    
    for (const type of mimeTypes) {
      if (!type || MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }
    
    try {
      // VIDEO RECORDER - for the video file (includes audio)
      const recorder = new MediaRecorder(videoStream, mimeType ? { mimeType } : undefined);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        console.log('[Video] Recording stopped, chunks:', videoChunksRef.current.length);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        if (videoChunksRef.current.length > 0) {
          const blob = new Blob(videoChunksRef.current, { type: mimeType || 'video/webm' });
          console.log('[Video] Created blob, size:', blob.size);
          setRecordedVideoBlob(blob);
        } else {
          console.log('[Video] No chunks recorded!');
        }
      };
      
      recorder.onerror = (event) => {
        console.error('Video recording error:', event);
        setIsRecordingVideo(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };
      
      // AUDIO-ONLY RECORDER - for transcription (much smaller file size!)
      const audioTracks = videoStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioStream = new MediaStream(audioTracks);
        let audioMimeType = '';
        const audioMimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', ''];
        for (const type of audioMimeTypes) {
          if (!type || MediaRecorder.isTypeSupported(type)) {
            audioMimeType = type;
            break;
          }
        }
        
        const audioRec = new MediaRecorder(audioStream, audioMimeType ? { mimeType: audioMimeType } : undefined);
        
        audioRec.ondataavailable = (event) => {
          if (event.data.size > 0) {
            videoAudioChunksRef.current.push(event.data);
          }
        };
        
        audioRec.onstop = () => {
          console.log('[VideoAudio] Recording stopped, chunks:', videoAudioChunksRef.current.length);
          if (videoAudioChunksRef.current.length > 0) {
            const audioBlob = new Blob(videoAudioChunksRef.current, { type: audioMimeType || 'audio/webm' });
            console.log('[VideoAudio] Created blob, size:', audioBlob.size);
            setRecordedAudioBlob(audioBlob);
          }
        };
        
        setVideoAudioRecorder(audioRec);
        audioRec.start(1000);
        console.log('[Audio] Started separate audio recording with mimeType:', audioMimeType || 'default');
      } else {
        console.log('[Audio] No audio tracks available for separate recording');
      }
      
      setVideoRecorder(recorder);
      recorder.start(1000); // Capture chunks every second
      console.log('[Video] Started recording with mimeType:', mimeType || 'default');
      setIsRecordingVideo(true);
      
      // Start duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 15) {
            // Auto-stop at 15 seconds
            if (recorder.state === 'recording') {
              recorder.stop();
              setIsRecordingVideo(false);
            }
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to create MediaRecorder:', error);
      alert('Video recording failed. Please try again.');
    }
  };

  const stopVideoRecording = () => {
    // Stop video recorder
    if (videoRecorder && videoRecorder.state === 'recording') {
      videoRecorder.stop();
      setIsRecordingVideo(false);
    }
    // Stop audio recorder (for transcription)
    if (videoAudioRecorder && videoAudioRecorder.state === 'recording') {
      videoAudioRecorder.stop();
    }
  };

  const sendVideoToFeed = async () => {
    if (!recordedVideoBlob || !selectedGame) return;
    
    const game = games[selectedGame];
    if (!game) return;
    
    // CRITICAL: Capture blob references IMMEDIATELY before any async operations
    const videoBlob = recordedVideoBlob;
    
    // Wait for audio blob if it's not ready yet (audio recorder finishes after video)
    let audioBlob = recordedAudioBlob;
    if (!audioBlob && videoAudioRecorder) {
      console.log('[Audio] Waiting for audio recording to finish...');
      // Wait up to 2 seconds for audio blob to be ready
      for (let i = 0; i < 20 && !audioBlob; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        // Check videoAudioChunksRef directly since state might not be updated yet
        if (videoAudioChunksRef.current.length > 0) {
          audioBlob = new Blob(videoAudioChunksRef.current, { type: 'audio/webm' });
          console.log('[Audio] Created blob from chunks, size:', audioBlob.size);
          break;
        }
      }
    }
    
    // Detect iOS Safari - needs video-to-audio extraction on server
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));
    
    console.log('[Video] Starting send, video blob size:', videoBlob.size, 'type:', videoBlob.type);
    console.log('[Audio] Audio blob for transcription:', audioBlob?.size || 'none', 'type:', audioBlob?.type || 'none');
    console.log('[Platform] iOS Safari detected:', isIOSSafari);
    
    setIsUploadingVideo(true);
    
    try {
      const contentType = videoBlob.type || 'video/webm';
      const extension = contentType.includes('mp4') ? 'mp4' : 'webm';
      
      // STEP 1: Read AUDIO blob to base64 for transcription (NOT the video - it's too large!)
      console.log('[Audio] Step 1: Converting AUDIO to base64 for transcription...');
      let base64Audio = '';
      if (audioBlob && audioBlob.size > 0) {
        try {
          base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              console.log('[Audio] FileReader result type:', typeof result, 'length:', result?.length || 0);
              if (!result || result.length < 100) {
                console.error('[Audio] FileReader returned empty/invalid result');
                reject(new Error('FileReader returned empty result'));
                return;
              }
              // Strip data URL prefix to get raw base64
              const commaIndex = result.indexOf(',');
              const base64 = commaIndex > 0 ? result.substring(commaIndex + 1) : '';
              console.log('[Audio] Extracted base64 length:', base64.length);
              resolve(base64);
            };
            reader.onerror = (e) => {
              console.error('[Audio] FileReader error:', e);
              reject(e);
            };
            reader.readAsDataURL(audioBlob);
          });
        } catch (e) {
          console.error('[Audio] Base64 conversion failed:', e);
          base64Audio = '';
        }
      } else {
        console.log('[Audio] No audio blob available for transcription');
      }
      console.log('[Audio] Base64 conversion complete, length:', base64Audio.length);
      
      // STEP 2: Upload video to storage (in parallel with transcription if possible)
      // EPHEMERAL MODEL: Previous video for this game will be auto-deleted
      console.log('[Video] Step 2: Getting upload URL...');
      const urlResponse = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `play-${Date.now()}.${extension}`,
          size: videoBlob.size,
          contentType,
          gameId: game.id, // Pass gameId to auto-delete previous video
        }),
      });
      
      if (!urlResponse.ok) throw new Error('Failed to get upload URL');
      
      const urlData = await urlResponse.json();
      console.log('[Video] Upload URL response:', urlData);
      const { uploadURL, objectPath } = urlData;
      
      if (!objectPath) {
        console.error('[Video] No objectPath returned from upload URL request!');
        throw new Error('No object path returned');
      }
      
      // Upload video directly to storage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: videoBlob,
        headers: { 'Content-Type': contentType },
      });
      
      if (!uploadResponse.ok) throw new Error('Failed to upload video');
      console.log('[Video] Upload successful, objectPath:', objectPath);
      
      const timestamp = Date.now();
      const quarter = game.quarter || 1;
      
      // STEP 3: TRANSCRIBE AUDIO FROM VIDEO - Extract plays from what coach said
      console.log('[Video] Step 3: Transcribing audio...');
      let transcription = '';
      let parsedPlay: any = null;
      let commentaryText = 'Video clip';
      let tickerPlayer = '';
      let tickerAction = 'Video clip added';
      let tickerEmoji = '🎬';
      let newStats = { ...game.stats };
      let scoreChange = 0;
      
      // Attempt transcription - use audio if available, otherwise extract from video (iOS Safari fallback)
      const hasValidAudio = base64Audio.length > 1000;
      const shouldTryVideoFallback = !hasValidAudio && videoBlob && videoBlob.size > 10000;
      
      if (hasValidAudio || shouldTryVideoFallback) {
        try {
          let requestBody: any;
          
          if (hasValidAudio) {
            console.log('[Audio] Sending AUDIO to transcription API, base64 length:', base64Audio.length);
            requestBody = { audio: base64Audio, inputType: 'audio' };
          } else {
            // iOS Safari fallback: send video to server for audio extraction
            console.log('[Video] No audio captured, sending VIDEO for server-side audio extraction');
            console.log('[Video] Converting video blob to base64, size:', videoBlob.size);
            toast({ title: 'Processing audio...', description: 'Extracting audio from video', variant: 'default' });
            
            const base64Video = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                const commaIndex = result.indexOf(',');
                const base64 = commaIndex > 0 ? result.substring(commaIndex + 1) : '';
                console.log('[Video] Video base64 length:', base64.length);
                resolve(base64);
              };
              reader.onerror = reject;
              reader.readAsDataURL(videoBlob);
            });
            
            requestBody = { video: base64Video, inputType: 'video' };
          }
          
          // Send to parse-play endpoint (handles both audio and video input)
          const parseResponse = await fetch('/api/parse-play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          
          if (parseResponse.ok) {
            const parseResult = await parseResponse.json();
            transcription = parseResult.transcription || '';
            parsedPlay = parseResult.parsedPlay;
            console.log('[Video] Transcription:', transcription);
            console.log('[Video] Parsed play:', parsedPlay);
            
            // If we got a valid play, use the cleaned commentary and apply stats
            if (parsedPlay && parsedPlay.playType !== 'unknown' && parsedPlay.confidence !== 'low') {
              commentaryText = parsedPlay.cleanedCommentary || parsedPlay.tickerText || transcription || 'Video clip';
              
              // Apply stats using the same logic as voice plays
              const result = await applyParsedPlay(selectedGame, parsedPlay, transcription);
              if (result) {
                newStats = result.newStats;
                scoreChange = result.scoreChange.ourScore;
                tickerPlayer = result.tickerPlayer;
                tickerAction = parsedPlay.cleanedCommentary || parsedPlay.tickerText || result.tickerAction;
                tickerEmoji = result.tickerEmoji;
                console.log('[Video] Stats applied! Player:', tickerPlayer, 'Score change:', scoreChange);
                
                // Link video to all involved players' highlights
                const involvedPlayers: string[] = [];
                if (parsedPlay.qb) involvedPlayers.push(parsedPlay.qb);
                if (parsedPlay.receiver) involvedPlayers.push(parsedPlay.receiver);
                if (parsedPlay.runner) involvedPlayers.push(parsedPlay.runner);
                if (parsedPlay.defender) involvedPlayers.push(parsedPlay.defender);
                
                const highlightEntry = {
                  videoUrl: objectPath,
                  description: parsedPlay.cleanedCommentary || parsedPlay.tickerText || tickerAction,
                  timestamp,
                  quarter,
                };
                
                // Add highlight to each involved player
                for (const playerName of involvedPlayers) {
                  if (newStats[playerName]) {
                    const existingHighlights = newStats[playerName].highlights || [];
                    newStats[playerName] = {
                      ...newStats[playerName],
                      highlights: [...existingHighlights, highlightEntry],
                    };
                  }
                }
                console.log('[Video] Linked video to players:', involvedPlayers);
              }
            } else if (transcription && transcription.trim()) {
              // We got transcription but no clear play - use raw transcription as commentary
              commentaryText = transcription;
              tickerAction = transcription;
              toast({ title: 'Voice heard but unclear', description: `"${transcription}" - Could not identify play`, variant: 'default' });
            } else if (!transcription || !transcription.trim()) {
              toast({ title: 'No voice detected', description: 'Speak clearly while recording', variant: 'destructive' });
            }
          } else {
            const errorText = await parseResponse.text();
            console.log('[Video] Transcription API error:', parseResponse.status, errorText);
            toast({ title: 'AI Error', description: `Status ${parseResponse.status}: ${errorText.substring(0, 100)}`, variant: 'destructive' });
          }
        } catch (transcribeError: any) {
          console.log('[Video] Transcription error (continuing with video only):', transcribeError);
          toast({ title: 'Transcription failed', description: transcribeError?.message || 'Network error', variant: 'destructive' });
        }
      } else {
        console.log('[Audio] No valid audio or video for transcription. Audio length:', base64Audio.length, 'Video size:', videoBlob?.size);
        toast({ title: 'No audio captured', description: 'Make sure microphone is allowed', variant: 'destructive' });
      }
      
      // If we have a valid parsed play, show preview for confirmation
      if (parsedPlay && parsedPlay.playType !== 'unknown' && parsedPlay.confidence !== 'low') {
        console.log('[Video] Showing preview for confirmation');
        setPendingVideoPlay({
          parsedPlay,
          transcription,
          objectPath,
          timestamp,
          quarter,
          commentaryText,
          newStats,
          scoreChange,
          tickerPlayer,
          tickerAction,
          tickerEmoji,
        });
        setIsUploadingVideo(false);
        return; // Wait for user confirmation
      }
      
      // No valid play parsed - save video-only entry without preview
      const videoEntry = { text: commentaryText, timestamp, quarter, videoUrl: objectPath };
      console.log('[Video] Creating commentary entry (no play parsed):', videoEntry);
      const newCommentary = [
        ...(game.coachCommentary || []),
        videoEntry,
      ];
      
      const updateData: any = {
        coachCommentary: newCommentary,
        playerStats: newStats,
        lastPlay: {
          player: tickerPlayer,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp,
          videoUrl: objectPath,
        },
      };
      
      // Add score if play resulted in points
      if (scoreChange > 0) {
        updateData.ourScore = (game.ourScore || 0) + scoreChange;
      }
      
      console.log('[Video] Saving to database:', JSON.stringify(updateData));
      
      await updateGameMutation.mutateAsync({
        id: selectedGame,
        data: updateData,
      });
      
      // Add to play log so it shows up immediately
      const newPlayEntry: PlayLogEntry = {
        id: `video-${Date.now()}`,
        timestamp,
        player: tickerPlayer,
        action: tickerAction,
        emoji: tickerEmoji,
        quarter,
      };
      setPlayLog(prev => [newPlayEntry, ...prev].slice(0, 10));
      
      // Clear the recorded video to prevent accidental re-sends
      setRecordedVideoBlob(null);
      setRecordingDuration(0);
      
      // Close modal and show confirmation with play info
      closeCameraModal();
      const confirmMsg = parsedPlay && parsedPlay.playType !== 'unknown' 
        ? `Video + stats logged! ${tickerEmoji}` 
        : 'Video added to feed!';
      setConfirmationToast({ message: confirmMsg, emoji: tickerEmoji, visible: true });
      setTimeout(() => setConfirmationToast(null), 2000);
      
    } catch (error) {
      console.error('Failed to upload video:', error);
      alert('Failed to upload video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Confirm pending video play - save the stats and video
  const confirmPendingVideoPlay = async () => {
    if (!pendingVideoPlay || !selectedGame) return;
    
    const game = games[selectedGame];
    if (!game) return;
    
    const { parsedPlay, objectPath, timestamp, quarter, commentaryText, newStats, scoreChange, tickerPlayer, tickerAction, tickerEmoji } = pendingVideoPlay;
    
    setIsUploadingVideo(true);
    try {
      const videoEntry = { text: commentaryText, timestamp, quarter, videoUrl: objectPath };
      console.log('[Video] Confirming play:', videoEntry);
      const newCommentary = [
        ...(game.coachCommentary || []),
        videoEntry,
      ];
      
      const lastPlayData = {
        player: tickerPlayer,
        action: tickerAction,
        emoji: tickerEmoji,
        timestamp,
        videoUrl: objectPath,
      };
      
      const updateData: any = {
        coachCommentary: newCommentary,
        playerStats: newStats,
        lastPlay: lastPlayData,
        publicLastPlay: lastPlayData, // Also update spectator view
      };
      
      if (scoreChange > 0) {
        updateData.ourScore = (game.ourScore || 0) + scoreChange;
      }
      
      await updateGameMutation.mutateAsync({
        id: selectedGame,
        data: updateData,
      });
      
      const newPlayEntry: PlayLogEntry = {
        id: `video-${Date.now()}`,
        timestamp,
        player: tickerPlayer,
        action: tickerAction,
        emoji: tickerEmoji,
        quarter,
      };
      setPlayLog(prev => [newPlayEntry, ...prev].slice(0, 10));
      
      setRecordedVideoBlob(null);
      setRecordingDuration(0);
      setPendingVideoPlay(null);
      closeCameraModal();
      
      setConfirmationToast({ message: `Stats logged! ${tickerEmoji}`, emoji: tickerEmoji, visible: true });
      setTimeout(() => setConfirmationToast(null), 2000);
    } catch (error) {
      console.error('Failed to save video:', error);
      alert('Failed to save video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Cancel pending video play - discard without saving
  const cancelPendingVideoPlay = () => {
    setPendingVideoPlay(null);
    setRecordedVideoBlob(null);
    setRecordingDuration(0);
    closeCameraModal();
  };

  // Send stat only (transcribe + log stats but don't save video)
  const sendStatOnly = async () => {
    if (!recordedVideoBlob || !selectedGame) return;
    
    const game = games[selectedGame];
    if (!game) return;
    
    // Get audio for transcription
    let audioBlob = recordedAudioBlob;
    if (!audioBlob && videoAudioRecorder) {
      console.log('[StatOnly] Waiting for audio recording to finish...');
      for (let i = 0; i < 20 && !audioBlob; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (videoAudioChunksRef.current.length > 0) {
          audioBlob = new Blob(videoAudioChunksRef.current, { type: 'audio/webm' });
          break;
        }
      }
    }
    
    if (!audioBlob || audioBlob.size < 1000) {
      alert('No audio to transcribe - try using voice recording instead');
      return;
    }
    
    setIsUploadingVideo(true); // Reuse same loading state
    
    try {
      // Convert audio to base64
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const commaIndex = result.indexOf(',');
          resolve(commaIndex > 0 ? result.substring(commaIndex + 1) : '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      if (base64Audio.length < 1000) {
        alert('Audio too short to transcribe');
        return;
      }
      
      // Transcribe and parse play
      const parseResponse = await fetch('/api/parse-play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio }),
      });
      
      if (!parseResponse.ok) {
        throw new Error('Failed to transcribe');
      }
      
      const parseResult = await parseResponse.json();
      const transcription = parseResult.transcription || '';
      const parsedPlay = parseResult.parsedPlay;
      
      console.log('[StatOnly] Transcription:', transcription);
      console.log('[StatOnly] Parsed play:', parsedPlay);
      
      if (!parsedPlay || parsedPlay.playType === 'unknown' || parsedPlay.confidence === 'low') {
        alert('Could not understand the play - try voice recording instead');
        return;
      }
      
      const timestamp = Date.now();
      const quarter = game.quarter || 1;
      
      // Apply stats
      const result = await applyParsedPlay(selectedGame, parsedPlay, transcription);
      if (!result) {
        alert('Could not apply play stats');
        return;
      }
      
      const { newStats, scoreChange, tickerPlayer, tickerAction, tickerEmoji } = result;
      const commentaryText = parsedPlay.cleanedCommentary || parsedPlay.tickerText || transcription;
      
      // Create commentary entry WITHOUT video
      const commentaryEntry = { text: commentaryText, timestamp, quarter };
      const newCommentary = [...(game.coachCommentary || []), commentaryEntry];
      
      const updateData: any = {
        coachCommentary: newCommentary,
        playerStats: newStats,
        lastPlay: {
          player: tickerPlayer,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp,
        },
      };
      
      if (scoreChange.ourScore > 0) {
        updateData.ourScore = (game.ourScore || 0) + scoreChange.ourScore;
      }
      
      await updateGameMutation.mutateAsync({ id: selectedGame, data: updateData });
      
      // Add to play log
      const newPlayEntry: PlayLogEntry = {
        id: `stat-${Date.now()}`,
        timestamp,
        player: tickerPlayer,
        action: tickerAction,
        emoji: tickerEmoji,
        quarter,
      };
      setPlayLog(prev => [newPlayEntry, ...prev].slice(0, 10));
      
      // Clear and close
      setRecordedVideoBlob(null);
      setRecordingDuration(0);
      closeCameraModal();
      
      setConfirmationToast({ message: `Stats logged! ${tickerEmoji}`, emoji: tickerEmoji, visible: true });
      setTimeout(() => setConfirmationToast(null), 2000);
      
    } catch (error) {
      console.error('Failed to log stat:', error);
      alert('Failed to transcribe play');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Apply parsed play to game stats
  const applyParsedPlay = async (
    gameId: number,
    parsedPlay: { playType: string; qb?: string; receiver?: string; runner?: string; defender?: string; result: string; description?: string },
    transcription: string
  ) => {
    const game = games[gameId];
    if (!game) return null;

    const newStats = { ...game.stats };
    const timestamp = Date.now();
    const quarter = game.quarter || 1;
    let tickerPlayer = '';
    let tickerAction = '';
    let tickerEmoji = '🏈';
    let scoreChange = { ourScore: 0 };

    // Helper to ensure player stats exist (preserve existing highlights)
    const ensureStats = (player: string) => {
      if (!newStats[player]) {
        newStats[player] = {
          catches: 0, touchdowns: 0, flagPulls: 0, interceptions: 0,
          sacks: 0, drops: 0, runs: 0, firstDowns: 0, extraPoints: 0,
          twoPointConversions: 0, completions: 0, incompletes: 0,
          qbTouchdowns: 0, qbFirstDownThrows: 0, catchFirstDowns: 0,
          targets: 0, notes: [], highlights: [],
        };
      } else if (!newStats[player].highlights) {
        // Ensure existing players have highlights array
        newStats[player].highlights = [];
      }
    };

    // Handle pass plays
    if (parsedPlay.playType === 'pass' && parsedPlay.qb) {
      const qb = parsedPlay.qb;
      const rec = parsedPlay.receiver;
      ensureStats(qb);
      if (rec) ensureStats(rec);
      tickerPlayer = rec || qb;

      const tdCelebrations = ['🔥 TOUCHDOWN! 🔥', '💥 TD BOMB! 💥', '🎆 SCORE! 🎆', '⚡ TOUCHDOWN! ⚡', '🏆 SIX POINTS! 🏆'];
      const randomTdCelebration = tdCelebrations[Math.floor(Math.random() * tdCelebrations.length)];
      
      if (parsedPlay.result === 'touchdown' && rec) {
        newStats[qb].qbTouchdowns = (newStats[qb].qbTouchdowns || 0) + 1;
        newStats[qb].completions = (newStats[qb].completions || 0) + 1;
        newStats[rec].touchdowns = (newStats[rec].touchdowns || 0) + 1;
        newStats[rec].catches = (newStats[rec].catches || 0) + 1;
        scoreChange.ourScore = 6;
        tickerAction = `${randomTdCelebration} from ${qb}!`;
        tickerEmoji = '🏈';
      } else if (parsedPlay.result === 'firstDown' && rec) {
        newStats[qb].completions = (newStats[qb].completions || 0) + 1;
        newStats[qb].qbFirstDownThrows = (newStats[qb].qbFirstDownThrows || 0) + 1;
        newStats[rec].catches = (newStats[rec].catches || 0) + 1;
        newStats[rec].catchFirstDowns = (newStats[rec].catchFirstDowns || 0) + 1;
        tickerAction = `🎯 FIRST DOWN from ${qb}!`;
        tickerEmoji = '🎯';
      } else if (parsedPlay.result === 'catch' && rec) {
        newStats[qb].completions = (newStats[qb].completions || 0) + 1;
        newStats[rec].catches = (newStats[rec].catches || 0) + 1;
        tickerAction = `✅ Catch from ${qb}`;
        tickerEmoji = '✅';
      } else if (parsedPlay.result === 'incomplete') {
        newStats[qb].incompletes = (newStats[qb].incompletes || 0) + 1;
        if (rec) newStats[rec].targets = (newStats[rec].targets || 0) + 1;
        tickerPlayer = qb;
        tickerAction = '❌ Incomplete... shake it off!';
        tickerEmoji = '❌';
      } else if (parsedPlay.result === 'interception') {
        newStats[qb].interceptions = (newStats[qb].interceptions || 0) + 1;
        tickerPlayer = qb;
        tickerAction = '🚨 PICKED OFF! Tough break...';
        tickerEmoji = '🚨';
      } else if (parsedPlay.result === 'drop' && rec) {
        newStats[rec].drops = (newStats[rec].drops || 0) + 1;
        newStats[rec].targets = (newStats[rec].targets || 0) + 1;
        tickerAction = '💔 Drop... next one!';
        tickerEmoji = '💔';
      }
    }

    // Handle run plays
    if (parsedPlay.playType === 'run' && parsedPlay.runner) {
      const runner = parsedPlay.runner;
      ensureStats(runner);
      tickerPlayer = runner;
      newStats[runner].runs = (newStats[runner].runs || 0) + 1;
      if (parsedPlay.result === 'runFirstDown' || parsedPlay.result === 'firstDown') {
        newStats[runner].firstDowns = (newStats[runner].firstDowns || 0) + 1;
        tickerAction = '🏃💨 FIRST DOWN! Moving the chains!';
        tickerEmoji = '🏃';
      } else if (parsedPlay.result === 'touchdown') {
        newStats[runner].touchdowns = (newStats[runner].touchdowns || 0) + 1;
        scoreChange.ourScore = 6;
        tickerAction = '🏃🔥 RUSHING TD! HOUSE CALL!';
        tickerEmoji = '🏈';
      } else {
        tickerAction = '🏃 Good run!';
        tickerEmoji = '🏃';
      }
    }

    // Handle defense plays
    if (parsedPlay.playType === 'defense' && parsedPlay.defender) {
      const def = parsedPlay.defender;
      ensureStats(def);
      tickerPlayer = def;
      const defCelebrations = ['🚩 FLAG PULL! 🚩', '🛑 STOPPED! 🛑', '💪 GOT EM! 💪'];
      const randomDefCelebration = defCelebrations[Math.floor(Math.random() * defCelebrations.length)];
      
      if (parsedPlay.result === 'flagPull') {
        newStats[def].flagPulls = (newStats[def].flagPulls || 0) + 1;
        tickerAction = randomDefCelebration;
        tickerEmoji = '🚩';
      } else if (parsedPlay.result === 'pick6') {
        // Pick 6 = interception returned for touchdown (6 points!)
        newStats[def].interceptions = (newStats[def].interceptions || 0) + 1;
        newStats[def].touchdowns = (newStats[def].touchdowns || 0) + 1;
        scoreChange.ourScore = 6;
        tickerAction = '🔥🏆 PICK SIX!!! HOUSE CALL! 🏆🔥';
        tickerEmoji = '🏆';
      } else if (parsedPlay.result === 'interception') {
        newStats[def].interceptions = (newStats[def].interceptions || 0) + 1;
        tickerAction = '🏆🔥 PICK! TURNOVER! 🔥🏆';
        tickerEmoji = '🏆';
      } else if (parsedPlay.result === 'sack') {
        newStats[def].sacks = (newStats[def].sacks || 0) + 1;
        tickerAction = '💥 SACK! QB DOWN! 💥';
        tickerEmoji = '💥';
      }
    }

    // Handle conversions
    if (parsedPlay.playType === 'conversion' && parsedPlay.qb && parsedPlay.receiver) {
      const qb = parsedPlay.qb;
      const rec = parsedPlay.receiver;
      ensureStats(qb);
      ensureStats(rec);
      tickerPlayer = rec;
      if (parsedPlay.result === 'extraPoint') {
        newStats[qb].qbTouchdowns = (newStats[qb].qbTouchdowns || 0) + 1;
        newStats[rec].extraPoints = (newStats[rec].extraPoints || 0) + 1;
        scoreChange.ourScore = 1;
        tickerAction = `⭐ EXTRA POINT GOOD! from ${qb}!`;
        tickerEmoji = '⭐';
      } else if (parsedPlay.result === 'twoPoint') {
        newStats[qb].qbTouchdowns = (newStats[qb].qbTouchdowns || 0) + 1;
        newStats[rec].twoPointConversions = (newStats[rec].twoPointConversions || 0) + 1;
        scoreChange.ourScore = 2;
        tickerAction = `⚡ 2-POINT CONVERSION! ⚡ from ${qb}!`;
        tickerEmoji = '⚡';
      }
    }

    // Add description as note to players involved
    const playersInvolved = [parsedPlay.qb, parsedPlay.receiver, parsedPlay.runner, parsedPlay.defender].filter(Boolean) as string[];
    if (parsedPlay.description && playersInvolved.length > 0) {
      playersInvolved.forEach(player => {
        ensureStats(player);
        const existingNotes = newStats[player].notes || [];
        newStats[player] = {
          ...newStats[player],
          notes: [...existingNotes, { text: transcription, quarter, timestamp }],
        };
      });
    }

    return {
      newStats,
      tickerPlayer,
      tickerAction,
      tickerEmoji,
      scoreChange,
      timestamp,
    };
  };

  const processRecording = async () => {
    if (!selectedGame) {
      console.log('[Voice] No game selected');
      return;
    }
    
    console.log('[Voice] Processing recording, chunks:', audioChunksRef.current.length);
    setIsTranscribing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('[Voice] Audio blob size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        console.log('[Voice] Audio blob is empty, aborting');
        setIsTranscribing(false);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onerror = (err) => {
        console.error('[Voice] FileReader error:', err);
        setIsTranscribing(false);
      };
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        console.log('[Voice] Base64 audio length:', base64Audio?.length || 0);
        
        try {
          console.log('[Voice] Calling /api/parse-play...');
          // Use AI play parser to transcribe and parse the command
          const response = await fetch('/api/parse-play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio }),
          });
          
          console.log('[Voice] Response status:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('[Voice] API error:', errorText);
            throw new Error('Play parsing failed: ' + errorText);
          }
          
          const { transcription, parsedPlay } = await response.json();
          console.log('[Voice] Transcription:', transcription);
          console.log('[Voice] Parsed play:', parsedPlay);
          
          if (transcription && transcription.trim()) {
            const game = games[selectedGame];
            const timestamp = Date.now();
            const quarter = game?.quarter || 1;
            
            // Store as pending - don't apply yet, wait for user confirmation
            // Include pending video if one was recorded
            setPendingVoicePlay({
              transcription: transcription.trim(),
              parsedPlay,
              gameId: selectedGame,
              quarter,
              timestamp,
              videoUrl: pendingVideoUrl || undefined,
            });
          }
        } catch (error: any) {
          console.error('[Voice] Play parsing error:', error?.message || String(error), error);
        }
        
        setIsTranscribing(false);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error: any) {
      console.error('[Voice] Processing error:', error?.message || String(error), error);
      setIsTranscribing(false);
    }
  };

  // Confirm and apply the pending voice play
  const confirmPendingPlay = async () => {
    if (!pendingVoicePlay) return;
    
    const { transcription, parsedPlay, gameId, quarter, timestamp, videoUrl } = pendingVoicePlay;
    const game = games[gameId];
    if (!game) {
      setPendingVoicePlay(null);
      setPendingVideoUrl(null);
      return;
    }
    
    // Use cleaned commentary from AI if available, otherwise use raw transcription
    const commentaryText = parsedPlay?.cleanedCommentary || transcription;
    
    // Add to commentary with cleaned text and optional video
    const newCommentary = [
      ...(game.coachCommentary || []),
      { text: commentaryText, timestamp, quarter, videoUrl },
    ];
    
    // Use cleaned commentary for display (same as coach notes)
    const displayAction = parsedPlay?.cleanedCommentary || parsedPlay?.tickerText || transcription;
    
    // Check if we got a valid parsed play
    if (parsedPlay.playType !== 'unknown' && parsedPlay.confidence !== 'low') {
      // Apply the parsed play to stats
      const result = await applyParsedPlay(gameId, parsedPlay, transcription);
      
      if (result) {
        
        await updateGameMutation.mutateAsync({
          id: gameId,
          data: {
            ourScore: (game.ourScore || 0) + result.scoreChange.ourScore,
            coachCommentary: newCommentary,
            playerStats: result.newStats,
            lastPlay: {
              player: result.tickerPlayer,
              action: displayAction,
              emoji: result.tickerEmoji,
              timestamp: result.timestamp,
            },
          },
        });
        
        // Add to play log
        const newPlayEntry: PlayLogEntry = {
          id: `play-${Date.now()}`,
          timestamp: result.timestamp,
          player: result.tickerPlayer,
          action: displayAction,
          emoji: result.tickerEmoji,
          quarter: quarter,
        };
        setPlayLog(prev => [newPlayEntry, ...prev].slice(0, 10));
        
        // Show confirmation toast
        const toastMessage = displayAction;
        setConfirmationToast({ message: toastMessage, emoji: result.tickerEmoji, visible: true });
        setTimeout(() => setConfirmationToast(null), 3000);
      }
    } else {
      // Fallback: use cleaned commentary (same as coach notes)
      await updateGameMutation.mutateAsync({
        id: gameId,
        data: {
          coachCommentary: newCommentary,
          lastPlay: {
            player: '',
            action: displayAction,
            emoji: '🎙️',
            timestamp,
          },
        },
      });
      
      // Still show toast for unknown plays
      setConfirmationToast({ message: displayAction, emoji: '🎙️', visible: true });
      setTimeout(() => setConfirmationToast(null), 3000);
    }
    
    // Clear pending play and video
    setPendingVoicePlay(null);
    setPendingVideoUrl(null);
  };
  
  // Cancel the pending voice play
  const cancelPendingPlay = () => {
    setPendingVoicePlay(null);
    setPendingVideoUrl(null);
  };

  const generateHighlights = async () => {
    if (!selectedGame) return;
    
    try {
      const response = await fetch(`/api/games/${selectedGame}/generate-highlights`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to generate highlights');
      
      await queryClient.invalidateQueries({ queryKey: ['games'] });
    } catch (error) {
      console.error('Failed to generate highlights:', error);
    }
  };

  // Helper to get current down label
  const getDownLabel = () => {
    return currentDown === 1 ? '1st' : currentDown === 2 ? '2nd' : currentDown === 3 ? '3rd' : '4th';
  };

  // Quick Play commit functions - auto-broadcast with linked ticker
  const commitPassPlay = async (gameId: number, result: 'complete' | 'firstDown' | 'touchdown' | 'incomplete' | 'interception' | 'fiftyFiftyComplete' | 'fiftyFiftyIncomplete' | 'fumble' | 'qbFumble' | 'sackFumble', target?: string) => {
    const currentGame = games[gameId];
    if (!currentGame || !selectedQB) return;

    const downLabel = getDownLabel();
    const previousStats = { ...currentGame.stats };
    const previousScore = currentGame.ourScore;
    const previousLastPlay = currentGame.lastPlay;
    const newStats = { ...currentGame.stats };
    let scoreChange = 0;
    let tickerAction = '';
    let tickerEmoji = '';
    let celebrationType: 'touchdown' | 'firstdown' | null = null;

    // QB stats
    newStats[selectedQB] = { ...newStats[selectedQB] };
    
    // For incomplete/interception/50-50, use target if provided; otherwise use selectedReceiver
    const receiver = (result === 'incomplete' || result === 'interception' || result === 'fiftyFiftyComplete' || result === 'fiftyFiftyIncomplete') ? target : selectedReceiver;
    
    // Receiver stats (only if a valid receiver/target is specified)
    if (receiver && receiver !== 'Incomplete' && receiver !== 'Interception' && receiver !== 'FiftyFifty') {
      newStats[receiver] = { 
        touchdowns: 0, extraPoints: 0, twoPointConversions: 0, qbTouchdowns: 0,
        catches: 0, flagPulls: 0, interceptions: 0, sacks: 0, runs: 0,
        firstDowns: 0, qbFirstDownThrows: 0, catchFirstDowns: 0,
        completions: 0, incompletes: 0, drops: 0, targets: 0,
        fiftyFiftyCatches: 0, fiftyFiftyTargets: 0,
        ...newStats[receiver] 
      };
    }

    if (result === 'touchdown') {
      newStats[selectedQB].qbTouchdowns = (newStats[selectedQB].qbTouchdowns || 0) + 1;
      newStats[selectedQB].completions = (newStats[selectedQB].completions || 0) + 1;
      if (receiver) {
        newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
        newStats[receiver].touchdowns = (newStats[receiver].touchdowns || 0) + 1;
      }
      scoreChange = 6;
      tickerAction = `TD PASS TO ${(playerFullNames[receiver || ''] || receiver || '').toUpperCase()}!`;
      tickerEmoji = '🏈';
      celebrationType = 'touchdown';
    } else if (result === 'firstDown') {
      newStats[selectedQB].qbFirstDownThrows = (newStats[selectedQB].qbFirstDownThrows || 0) + 1;
      newStats[selectedQB].completions = (newStats[selectedQB].completions || 0) + 1;
      if (receiver) {
        newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
        newStats[receiver].catchFirstDowns = (newStats[receiver].catchFirstDowns || 0) + 1;
      }
      tickerAction = `${downLabel} & GOAL - FIRST DOWN TO ${(playerFullNames[receiver || ''] || receiver || '').toUpperCase()}!`;
      tickerEmoji = '🎯';
      celebrationType = 'firstdown';
    } else if (result === 'complete') {
      newStats[selectedQB].completions = (newStats[selectedQB].completions || 0) + 1;
      if (receiver) {
        newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
      }
      tickerAction = `${downLabel} DOWN - COMPLETE TO ${(playerFullNames[receiver || ''] || receiver || '').toUpperCase()}`;
      tickerEmoji = '✅';
    } else if (result === 'interception') {
      newStats[selectedQB].interceptions = (newStats[selectedQB].interceptions || 0) + 1;
      if (receiver) {
        newStats[receiver].targets = (newStats[receiver].targets || 0) + 1;
        tickerAction = `INTERCEPTION! Target: ${(playerFullNames[receiver] || receiver).toUpperCase()}`;
      } else {
        tickerAction = `INTERCEPTION!`;
      }
      tickerEmoji = '🚨';
    } else if (result === 'fiftyFiftyComplete') {
      newStats[selectedQB].completions = (newStats[selectedQB].completions || 0) + 1;
      if (receiver) {
        newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
        newStats[receiver].fiftyFiftyCatches = (newStats[receiver].fiftyFiftyCatches || 0) + 1;
        newStats[receiver].fiftyFiftyTargets = (newStats[receiver].fiftyFiftyTargets || 0) + 1;
        tickerAction = `50-50 CATCH! ${(playerFullNames[receiver] || receiver).toUpperCase()} 💪`;
      } else {
        tickerAction = `50-50 BALL CAUGHT!`;
      }
      tickerEmoji = '🎯';
    } else if (result === 'fiftyFiftyIncomplete') {
      newStats[selectedQB].incompletes = (newStats[selectedQB].incompletes || 0) + 1;
      if (receiver) {
        newStats[receiver].targets = (newStats[receiver].targets || 0) + 1;
        newStats[receiver].fiftyFiftyTargets = (newStats[receiver].fiftyFiftyTargets || 0) + 1;
        tickerAction = `50-50 INCOMPLETE - ${(playerFullNames[receiver] || receiver).toUpperCase()} (Good Effort)`;
      } else {
        tickerAction = `50-50 BALL INCOMPLETE`;
      }
      tickerEmoji = '💪';
    } else if (result === 'fumble') {
      newStats[selectedQB].completions = (newStats[selectedQB].completions || 0) + 1;
      if (receiver) {
        newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
        newStats[receiver].fumbles = (newStats[receiver].fumbles || 0) + 1;
        tickerAction = `FUMBLE! ${(playerFullNames[receiver] || receiver).toUpperCase()} after catch`;
      } else {
        tickerAction = `FUMBLE AFTER CATCH!`;
      }
      tickerEmoji = '😬';
    } else if (result === 'qbFumble') {
      newStats[selectedQB].fumbles = (newStats[selectedQB].fumbles || 0) + 1;
      tickerAction = `QB FUMBLE! ${(playerFullNames[selectedQB] || selectedQB).toUpperCase()}`;
      tickerEmoji = '😬';
    } else if (result === 'sackFumble') {
      newStats[selectedQB].fumbles = (newStats[selectedQB].fumbles || 0) + 1;
      tickerAction = `SACK FUMBLE! ${(playerFullNames[selectedQB] || selectedQB).toUpperCase()}`;
      tickerEmoji = '💥';
    } else {
      newStats[selectedQB].incompletes = (newStats[selectedQB].incompletes || 0) + 1;
      if (receiver) {
        newStats[receiver].targets = (newStats[receiver].targets || 0) + 1;
        tickerAction = `INCOMPLETE TO ${(playerFullNames[receiver] || receiver).toUpperCase()}`;
      } else {
        tickerAction = `PASS INCOMPLETE`;
      }
      tickerEmoji = '❌';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        ourScore: currentGame.ourScore + scoreChange,
        lastPlay: {
          player: playerFullNames[selectedQB] || selectedQB,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Add to undo history
    const undoGameId = gameId;
    const undoPreviousStats = previousStats;
    const undoPreviousScore = previousScore;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `pass_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'stat',
      description: tickerAction,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { 
            playerStats: undoPreviousStats, 
            ourScore: undoPreviousScore,
            lastPlay: undoPreviousLastPlay 
          },
        });
      },
    }, ...prev.slice(0, 9)]);

    if (celebrationType) {
      setCelebration(celebrationType);
      setTimeout(() => setCelebration(null), celebrationType === 'touchdown' ? 3000 : 2000);
      // Auto-reset to 1st down on touchdown or first down
      resetToFirstDown();
    } else if (result === 'complete' || result === 'fiftyFiftyComplete') {
      // Auto-advance down for regular completions
      advanceDown();
    }

    resetPlayWizard();
  };

  const commitRunPlay = async (gameId: number, result: 'run' | 'firstDown' | 'touchdown' | 'fumble') => {
    const currentGame = games[gameId];
    if (!currentGame || !selectedRunner) return;

    const downLabel = getDownLabel();
    const previousStats = { ...currentGame.stats };
    const previousScore = currentGame.ourScore;
    const previousLastPlay = currentGame.lastPlay;
    const newStats = { ...currentGame.stats };
    let scoreChange = 0;
    let tickerAction = '';
    let tickerEmoji = '';
    let celebrationType: 'touchdown' | 'firstdown' | null = null;

    newStats[selectedRunner] = { ...newStats[selectedRunner] };
    newStats[selectedRunner].runs = (newStats[selectedRunner].runs || 0) + 1;

    if (result === 'touchdown') {
      newStats[selectedRunner].touchdowns = (newStats[selectedRunner].touchdowns || 0) + 1;
      scoreChange = 6;
      tickerAction = 'RUSHING TOUCHDOWN!';
      tickerEmoji = '🏈';
      celebrationType = 'touchdown';
    } else if (result === 'firstDown') {
      newStats[selectedRunner].firstDowns = (newStats[selectedRunner].firstDowns || 0) + 1;
      tickerAction = `${downLabel} & GOAL - RUN FIRST DOWN!`;
      tickerEmoji = '🏃';
      celebrationType = 'firstdown';
    } else if (result === 'fumble') {
      newStats[selectedRunner].fumbles = (newStats[selectedRunner].fumbles || 0) + 1;
      tickerAction = `${downLabel} DOWN - FUMBLE!`;
      tickerEmoji = '😬';
    } else {
      tickerAction = `${downLabel} DOWN - RUN PLAY`;
      tickerEmoji = '🏃';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        ourScore: currentGame.ourScore + scoreChange,
        lastPlay: {
          player: playerFullNames[selectedRunner] || selectedRunner,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Add to undo history
    const undoGameId = gameId;
    const undoPreviousStats = previousStats;
    const undoPreviousScore = previousScore;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `run_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'stat',
      description: tickerAction,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { 
            playerStats: undoPreviousStats, 
            ourScore: undoPreviousScore,
            lastPlay: undoPreviousLastPlay 
          },
        });
      },
    }, ...prev.slice(0, 9)]);

    if (celebrationType) {
      setCelebration(celebrationType);
      setTimeout(() => setCelebration(null), celebrationType === 'touchdown' ? 3000 : 2000);
      // Auto-reset to 1st down on touchdown or first down
      resetToFirstDown();
    } else if (result === 'run') {
      // Auto-advance down for regular runs
      advanceDown();
    }

    resetPlayWizard();
  };

  const commitDefensePlay = async (gameId: number, playType: 'flagPull' | 'interception' | 'sack' | 'forcedFumble') => {
    const currentGame = games[gameId];
    if (!currentGame || !selectedDefender) return;

    const previousStats = { ...currentGame.stats };
    const previousLastPlay = currentGame.lastPlay;
    const newStats = { ...currentGame.stats };
    let tickerAction = '';
    let tickerEmoji = '';

    newStats[selectedDefender] = { ...newStats[selectedDefender] };

    if (playType === 'flagPull') {
      newStats[selectedDefender].flagPulls = (newStats[selectedDefender].flagPulls || 0) + 1;
      tickerAction = 'FLAG PULL!';
      tickerEmoji = '🚩';
    } else if (playType === 'interception') {
      newStats[selectedDefender].interceptions = (newStats[selectedDefender].interceptions || 0) + 1;
      tickerAction = 'INTERCEPTION!';
      tickerEmoji = '🖐️';
    } else if (playType === 'forcedFumble') {
      newStats[selectedDefender].forcedFumbles = (newStats[selectedDefender].forcedFumbles || 0) + 1;
      tickerAction = 'FORCED FUMBLE!';
      tickerEmoji = '💥';
    } else {
      newStats[selectedDefender].sacks = (newStats[selectedDefender].sacks || 0) + 1;
      tickerAction = 'SACK!';
      tickerEmoji = '💥';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        lastPlay: {
          player: playerFullNames[selectedDefender] || selectedDefender,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Add to undo history
    const undoGameId = gameId;
    const undoPreviousStats = previousStats;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `defense_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'stat',
      description: tickerAction,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { 
            playerStats: undoPreviousStats, 
            lastPlay: undoPreviousLastPlay 
          },
        });
      },
    }, ...prev.slice(0, 9)]);

    resetPlayWizard();
  };

  const commitConversion = async (gameId: number, type: 'extraPoint' | 'twoPoint', qb: string, receiver: string) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const previousStats = { ...currentGame.stats };
    const previousScore = currentGame.ourScore;
    const previousLastPlay = currentGame.lastPlay;
    const newStats = { ...currentGame.stats };
    let scoreChange = type === 'extraPoint' ? 1 : 2;
    let tickerAction = type === 'extraPoint' ? 'EXTRA POINT!' : '2-POINT CONVERSION!';
    let tickerEmoji = type === 'extraPoint' ? '✨' : '⚡';

    newStats[qb] = { ...newStats[qb] };
    newStats[receiver] = { ...newStats[receiver] };
    
    newStats[qb].completions = (newStats[qb].completions || 0) + 1;
    newStats[receiver].catches = (newStats[receiver].catches || 0) + 1;
    
    if (type === 'extraPoint') {
      newStats[receiver].extraPoints = (newStats[receiver].extraPoints || 0) + 1;
    } else {
      newStats[receiver].twoPointConversions = (newStats[receiver].twoPointConversions || 0) + 1;
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        ourScore: currentGame.ourScore + scoreChange,
        lastPlay: {
          player: `${playerFullNames[qb] || qb} → ${playerFullNames[receiver] || receiver}`,
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Add to undo history
    const undoGameId = gameId;
    const undoPreviousStats = previousStats;
    const undoPreviousScore = previousScore;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `conversion_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'stat',
      description: tickerAction,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { 
            playerStats: undoPreviousStats, 
            ourScore: undoPreviousScore,
            lastPlay: undoPreviousLastPlay 
          },
        });
      },
    }, ...prev.slice(0, 9)]);

    resetPlayWizard();
  };

  // Opponent TD - updates their score
  const commitOpponentTD = async (gameId: number, conversionPoints: number = 0) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const totalPoints = 6 + conversionPoints;
    const conversionText = conversionPoints === 2 ? ' + 2pt' : conversionPoints === 1 ? ' + XP' : '';
    
    // Store previous state for undo
    const previousScore = currentGame.opponentScore;
    const previousLastPlay = currentGame.lastPlay;
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        opponentScore: currentGame.opponentScore + totalPoints,
        lastPlay: {
          player: 'Opponent',
          action: `OPPONENT TD${conversionText}`,
          emoji: '😤',
          timestamp: Date.now(),
        },
      },
    });

    // Add to action history for undo - store only the primitive values needed
    const undoGameId = gameId;
    const undoPreviousScore = previousScore;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `opponent_td_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'opponent_score',
      description: `Opponent TD${conversionText} (+${totalPoints})`,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { opponentScore: undoPreviousScore, lastPlay: undoPreviousLastPlay },
        });
      },
    }, ...prev.slice(0, 9)]);

    // Auto-switch to offense after their score and reset to 1st down
    setPossession('offense');
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { possession: 'offense' },
    });
    resetToFirstDown();
    resetPlayWizard();
  };

  // Opponent play (pass complete or run gain) - stores context and asks about first down
  const setupOpponentPlay = (playType: 'pass' | 'run') => {
    setOpponentPlayContext({ type: playType, firstDown: false });
    setPlayStep('opponentFirstDown');
  };

  // After first down selection, go to defender selection
  const commitOpponentFirstDown = (isFirstDown: boolean) => {
    if (opponentPlayContext) {
      setOpponentPlayContext({ ...opponentPlayContext, firstDown: isFirstDown });
    }
    setPlayStep('selectDefenderAfterStop');
  };

  // We stopped them - records defensive stat and switches possession
  const commitDefensiveStop = async (gameId: number, playType: 'flagPull' | 'interception' | 'sack', defenderOverride?: string) => {
    const currentGame = games[gameId];
    const defender = defenderOverride || selectedDefender;
    if (!currentGame || !defender) return;
    const previousStats = { ...currentGame.stats };
    const previousLastPlay = currentGame.lastPlay;
    const newStats = { ...currentGame.stats };
    let tickerAction = '';
    let tickerEmoji = '';
    let statKey: keyof PlayerStats;
    let previousValue: number;

    // Build context prefix from opponent play (if any)
    let contextPrefix = 'OPPONENT PLAY - ';
    if (opponentPlayContext) {
      const playTypeLabel = opponentPlayContext.type === 'pass' ? 'OPPONENT PASS' : 'OPPONENT RUN';
      const firstDownLabel = opponentPlayContext.firstDown ? ' (1ST DOWN)' : '';
      contextPrefix = `${playTypeLabel}${firstDownLabel} - `;
    }

    newStats[defender] = { ...newStats[defender] };
    const defenderName = (playerFullNames[defender] || defender).toUpperCase();
    
    if (playType === 'flagPull') {
      statKey = 'flagPulls';
      previousValue = newStats[defender].flagPulls || 0;
      newStats[defender].flagPulls = previousValue + 1;
      tickerAction = `${contextPrefix}${defenderName} FLAG PULL! 🎉`;
      tickerEmoji = '🚩';
    } else if (playType === 'interception') {
      statKey = 'interceptions';
      previousValue = newStats[defender].interceptions || 0;
      newStats[defender].interceptions = previousValue + 1;
      tickerAction = `${contextPrefix}${defenderName} INTERCEPTION! 🎉`;
      tickerEmoji = '🖐️';
    } else {
      statKey = 'sacks';
      previousValue = newStats[defender].sacks || 0;
      newStats[defender].sacks = previousValue + 1;
      tickerAction = `${contextPrefix}${defenderName} SACK! 🎉`;
      tickerEmoji = '💥';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        lastPlay: {
          player: '',
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Add to action history for undo - store only primitives, get fresh data at undo time
    const undoGameId = gameId;
    const undoDefender = defender;
    const undoStatKey = statKey;
    const undoPreviousValue = previousValue;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `defense_stop_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'stat',
      description: `${playerFullNames[undoDefender] || undoDefender} ${playType}`,
      undo: async () => {
        // Get fresh game data at undo time from query cache
        const freshGames = queryClient.getQueryData<Game[]>(['games']) || [];
        const freshGame = freshGames.find(g => g.id === undoGameId);
        if (!freshGame) return;
        
        const freshStats = freshGame.playerStats as Record<string, PlayerStats>;
        const revertedStats = { ...freshStats };
        revertedStats[undoDefender] = { ...revertedStats[undoDefender], [undoStatKey]: undoPreviousValue };
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { playerStats: revertedStats, lastPlay: undoPreviousLastPlay },
        });
      },
    }, ...prev.slice(0, 9)]);

    // Auto-switch to offense after stopping them and reset to 1st down
    setPossession('offense');
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { possession: 'offense' },
    });
    resetToFirstDown();
    resetPlayWizard();
  };

  // Pick Six - our player intercepts and returns for TD (6 points for us + INT credit)
  const commitPickSix = async (gameId: number, player: string) => {
    const currentGame = games[gameId];
    if (!currentGame) return;
    
    const previousStats = { ...currentGame.stats };
    const previousScore = currentGame.ourScore;
    const previousLastPlay = currentGame.lastPlay;
    
    const newStats = { ...currentGame.stats };
    newStats[player] = { ...newStats[player] };
    const previousIntValue = newStats[player].interceptions || 0;
    newStats[player].interceptions = previousIntValue + 1;
    
    const playerName = (playerFullNames[player] || player).toUpperCase();
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        ourScore: currentGame.ourScore + 6,
        playerStats: newStats,
        lastPlay: {
          player: '',
          action: `🏈 PICK SIX! ${playerName} TAKES IT TO THE HOUSE!`,
          emoji: '🎉',
          timestamp: Date.now(),
        },
      },
    });
    
    // Add to action history for undo
    const undoGameId = gameId;
    const undoPlayer = player;
    const undoPreviousScore = previousScore;
    const undoPreviousIntValue = previousIntValue;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `pick_six_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'score',
      description: `${playerFullNames[undoPlayer] || undoPlayer} PICK SIX (+6)`,
      undo: async () => {
        const freshGames = queryClient.getQueryData<Game[]>(['games']) || [];
        const freshGame = freshGames.find(g => g.id === undoGameId);
        if (!freshGame) return;
        
        const freshStats = freshGame.playerStats as Record<string, PlayerStats>;
        const revertedStats = { ...freshStats };
        revertedStats[undoPlayer] = { ...revertedStats[undoPlayer], interceptions: undoPreviousIntValue };
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { ourScore: undoPreviousScore, playerStats: revertedStats, lastPlay: undoPreviousLastPlay },
        });
      },
    }, ...prev.slice(0, 9)]);
    
    // Celebrate and switch to offense
    setCelebration('touchdown');
    setTimeout(() => setCelebration(null), 2000);
    setPossession('offense');
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { possession: 'offense' },
    });
    resetToFirstDown();
    resetPlayWizard();
  };

  // Opponent Pick Six - they intercept and return for TD (6 points for them)
  const commitOpponentPickSix = async (gameId: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;
    
    const previousScore = currentGame.opponentScore;
    const previousLastPlay = currentGame.lastPlay;
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        opponentScore: currentGame.opponentScore + 6,
        lastPlay: {
          player: 'Opponent',
          action: '😤 OPPONENT PICK SIX! (+6)',
          emoji: '😤',
          timestamp: Date.now(),
        },
      },
    });
    
    // Add to action history for undo
    const undoGameId = gameId;
    const undoPreviousScore = previousScore;
    const undoPreviousLastPlay = previousLastPlay;
    setActionHistory(prev => [{
      id: `opponent_pick_six_${Date.now()}`,
      gameId: undoGameId,
      timestamp: Date.now(),
      type: 'opponent_score',
      description: `Opponent Pick Six (+6)`,
      undo: async () => {
        await updateGameMutation.mutateAsync({
          id: undoGameId,
          data: { opponentScore: undoPreviousScore, lastPlay: undoPreviousLastPlay },
        });
      },
    }, ...prev.slice(0, 9)]);
    
    // Auto-switch to offense after their score
    setPossession('offense');
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { possession: 'offense' },
    });
    resetToFirstDown();
    resetPlayWizard();
  };

  // Special defensive stop - no player credited (out of bounds, fumble)
  const commitSpecialDefensiveStop = async (gameId: number, stopType: 'outOfBounds' | 'fumble') => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    let tickerAction = '';
    let tickerEmoji = '';

    // Build context prefix from opponent play (if any)
    let contextPrefix = 'OPPONENT PLAY - ';
    if (opponentPlayContext) {
      const playTypeLabel = opponentPlayContext.type === 'pass' ? 'OPPONENT PASS' : 'OPPONENT RUN';
      const firstDownLabel = opponentPlayContext.firstDown ? ' (1ST DOWN)' : '';
      contextPrefix = `${playTypeLabel}${firstDownLabel} - `;
    }

    if (stopType === 'outOfBounds') {
      tickerAction = `${contextPrefix}OUT OF BOUNDS`;
      tickerEmoji = '📍';
    } else {
      tickerAction = `${contextPrefix}FUMBLE! TURNOVER! 🎉`;
      tickerEmoji = '🏈';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        lastPlay: {
          player: '',
          action: tickerAction,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Auto-switch to offense after stopping them and reset to 1st down
    setPossession('offense');
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { possession: 'offense' },
    });
    resetToFirstDown();
    resetPlayWizard();
  };

  // Incomplete pass - just broadcasts to ticker, no defender needed, no possession change
  const commitIncompletePass = async (gameId: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        lastPlay: {
          player: 'Opponent',
          action: '❌ OPPONENT PASS INCOMPLETE',
          emoji: '❌',
          timestamp: Date.now(),
        },
      },
    });

    resetPlayWizard();
  };

  // Penalty - just broadcasts to ticker
  const commitPenalty = async (gameId: number, onUs: boolean) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        lastPlay: {
          player: onUs ? 'Us' : 'Opponent',
          action: onUs ? 'PENALTY ON US' : 'PENALTY ON THEM',
          emoji: '🚨',
          timestamp: Date.now(),
        },
      },
    });

    resetPlayWizard();
  };

  // Timeout - toggles timeout state on/off
  const startTimeout = async (gameId: number, onUs: boolean) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    setTimeoutActive(onUs ? 'us' : 'them');
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        lastPlay: {
          player: onUs ? 'Us' : 'Opponent',
          action: onUs ? '⏱️ TIMEOUT - CHICK-FIL-A' : '⏱️ TIMEOUT - OPPONENT',
          emoji: '⏱️',
          timestamp: Date.now(),
        },
      },
    });

    resetPlayWizard();
  };
  
  const endTimeout = async (gameId: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const wasOurs = timeoutActive === 'us';
    setTimeoutActive(null);
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        lastPlay: {
          player: wasOurs ? 'Us' : 'Opponent',
          action: '▶️ TIMEOUT OVER - PLAY RESUMES',
          emoji: '▶️',
          timestamp: Date.now(),
        },
      },
    });

    resetPlayWizard();
  };

  // Punt - switches possession
  const commitPunt = async (gameId: number, byUs: boolean) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const newPossession = byUs ? 'defense' : 'offense';
    setPossession(newPossession);
    
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        possession: newPossession,
        lastPlay: {
          player: byUs ? 'Us' : 'Opponent',
          action: byUs ? '🦶 CHICK-FIL-A PUNTS' : '🦶 OPPONENT PUNTS',
          emoji: '🦶',
          timestamp: Date.now(),
        },
      },
    });

    resetToFirstDown();
    resetPlayWizard();
  };

  // Undo last action
  const undoLastAction = async () => {
    console.log('[Undo] Action history length:', actionHistory.length);
    if (actionHistory.length === 0) {
      console.log('[Undo] No actions to undo');
      return;
    }
    
    const lastAction = actionHistory[0];
    console.log('[Undo] Undoing action:', lastAction.description);
    try {
      await lastAction.undo();
      console.log('[Undo] Undo successful');
      setActionHistory(prev => prev.slice(1));
    } catch (error) {
      console.error('[Undo] Undo failed:', error);
    }
  };

  // Find game in progress (has data, not finished, and has some activity)
  const inProgressGameId = schedule.find(g => {
    const gameData = games[g.id];
    if (!gameData || gameData.isFinished) return false;
    // Game is in progress if it has any score or recent activity
    return gameData.ourScore > 0 || gameData.opponentScore > 0 || gameData.lastPlay !== null;
  })?.id || null;

  // Find next unfinished game (for "UP NEXT" - only show if no game is in progress)
  const nextGameId = schedule.find(g => !games[g.id] || !games[g.id]?.isFinished)?.id || null;
  
  // Calculate season record from finished games
  const seasonRecord = Object.values(games).reduce((acc, game) => {
    if (game.isFinished) {
      if (game.ourScore > game.opponentScore) acc.wins++;
      else if (game.ourScore < game.opponentScore) acc.losses++;
      else acc.ties++;
    }
    return acc;
  }, { wins: 0, losses: 0, ties: 0 });

  // League standings (updated weekly from league emails)
  const leagueStandings = [
    { team: "Chick-Fil-A", gp: 5, pts: 12, wins: 4, losses: 1, ties: 0, isUs: true },
    { team: "Dick's Sporting Goods", gp: 5, pts: 10, wins: 3, losses: 1, ties: 1, isUs: false },
    { team: "Dairy Queen", gp: 5, pts: 4, wins: 1, losses: 3, ties: 1, isUs: false },
    { team: "Zaxby's", gp: 5, pts: 3, wins: 1, losses: 4, ties: 0, isUs: false },
  ];

  const handleAdminLogin = () => {
    if (adminCode === '5150') {
      setAdminUnlocked(true);
      setViewMode('admin');
      localStorage.setItem('chickFilAAdminUnlocked', 'true');
      localStorage.setItem('chickFilAViewMode', 'admin');
      setAdminCode('');
      setShowAdminLogin(false);
    } else {
      setAdminCode('');
    }
  };

  const handleAdminLogout = () => {
    setAdminUnlocked(false);
    setViewMode('spectator');
    localStorage.removeItem('chickFilAAdminUnlocked');
    localStorage.setItem('chickFilAViewMode', 'spectator');
    setShowAdminLogin(false);
  };

  const initGame = async (gameId: number) => {
    const gameInfo = schedule.find(g => g.id === gameId);
    if (!gameInfo) return;

    if (!games[gameId]) {
      const initialStats = roster.reduce((acc, name) => ({
        ...acc,
        [name]: { touchdowns: 0, extraPoints: 0, twoPointConversions: 0, qbTouchdowns: 0, catches: 0, flagPulls: 0, interceptions: 0, sacks: 0, runs: 0, firstDowns: 0, qbFirstDownThrows: 0, catchFirstDowns: 0, completions: 0, incompletes: 0, drops: 0, notes: [] }
      }), {});

      await createGameMutation.mutateAsync({
        id: gameId,
        opponent: gameInfo.opponent,
        ourScore: 0,
        opponentScore: 0,
        notes: '',
        playerStats: initialStats,
      });
      setIsEditingPastGame(false);
    } else if (games[gameId]?.isFinished && viewMode === 'admin') {
      // Admin selecting a finished game - prompt to enter edit mode
      if (confirm('This game is marked FINAL. Do you want to edit the stats?')) {
        setIsEditingPastGame(true);
      } else {
        setIsEditingPastGame(false);
      }
    } else {
      setIsEditingPastGame(false);
    }
    setSelectedGame(gameId);
    // Clear selected player when switching games
    setSelectedPlayer(null);
  };

  const updateScore = async (gameId: number, team: 'ourScore' | 'opponentScore', value: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const newScore = Math.max(0, currentGame[team] + value);
    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { [team]: newScore },
    });
  };

  const quickStat = async (gameId: number, player: string, stat: keyof PlayerStats, scoreValue: number, actionName: string, emoji: string) => {
    const currentGame = games[gameId];
    if (!currentGame) return;

    const newStats = {
      ...currentGame.stats,
      [player]: {
        ...currentGame.stats[player],
        [stat]: Math.max(0, (currentGame.stats[player]?.[stat] || 0) + 1)
      }
    };

    const newOurScore = scoreValue > 0 ? currentGame.ourScore + scoreValue : currentGame.ourScore;

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { 
        playerStats: newStats,
        ourScore: newOurScore,
        lastPlay: {
          player: playerFullNames[player] || player,
          action: actionName,
          emoji: emoji,
          timestamp: Date.now(),
        },
      },
    });

    // Auto-reset down on TD or first down stats
    const isTouchdown = stat === 'touchdowns' || stat === 'qbTouchdowns';
    const isFirstDown = stat === 'firstDowns' || stat === 'qbFirstDownThrows' || stat === 'catchFirstDowns';
    if (isTouchdown || isFirstDown) {
      resetToFirstDown();
      // Trigger celebration
      setCelebration(isTouchdown ? 'touchdown' : 'firstdown');
      setTimeout(() => setCelebration(null), isTouchdown ? 3000 : 2000);
    }

    setSelectedPlayer(null);
  };

  const stageStat = (player: string, stat: keyof PlayerStats, scoreValue: number, actionName: string, emoji: string, keepPlayerSelected = false) => {
    setStagedStats(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      player,
      stat,
      scoreValue,
      actionName,
      emoji,
    }]);
    if (!keepPlayerSelected) {
      setSelectedPlayer(null);
    }
  };

  const removeStagedStat = (id: string) => {
    setStagedStats(prev => prev.filter(s => s.id !== id));
  };

  const commitStagedStats = async (gameId: number) => {
    const currentGame = games[gameId];
    if (!currentGame || stagedStats.length === 0) return;

    const newStats = { ...currentGame.stats };
    let totalScoreChange = 0;

    for (const staged of stagedStats) {
      newStats[staged.player] = {
        ...newStats[staged.player],
        [staged.stat]: Math.max(0, (newStats[staged.player]?.[staged.stat] || 0) + 1)
      };
      totalScoreChange += staged.scoreValue;
    }

    const lastStat = stagedStats[stagedStats.length - 1];
    const tdStat = stagedStats.find(s => s.stat === 'touchdowns');
    const qbStat = stagedStats.find(s => s.stat === 'qbTouchdowns' || s.stat === 'completions');
    
    let tickerMessage = lastStat.actionName;
    let tickerPlayer = playerFullNames[lastStat.player] || lastStat.player;
    let tickerEmoji = lastStat.emoji;

    if (tdStat && qbStat && tdStat.player !== qbStat.player) {
      tickerMessage = `TD from ${playerFullNames[qbStat.player] || qbStat.player}`;
      tickerPlayer = playerFullNames[tdStat.player] || tdStat.player;
      tickerEmoji = '🏈';
    }

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: {
        playerStats: newStats,
        ourScore: currentGame.ourScore + totalScoreChange,
        lastPlay: {
          player: tickerPlayer,
          action: tickerMessage,
          emoji: tickerEmoji,
          timestamp: Date.now(),
        },
      },
    });

    // Trigger celebration for touchdowns or first downs
    const hasTouchdown = stagedStats.some(s => s.stat === 'touchdowns' || s.stat === 'qbTouchdowns');
    const hasFirstDown = stagedStats.some(s => s.stat === 'firstDowns' || s.stat === 'qbFirstDownThrows' || s.stat === 'catchFirstDowns');
    
    if (hasTouchdown) {
      setCelebration('touchdown');
      setTimeout(() => setCelebration(null), 3000);
      resetToFirstDown(); // Auto-reset down on TD
    } else if (hasFirstDown) {
      setCelebration('firstdown');
      setTimeout(() => setCelebration(null), 2000);
      resetToFirstDown(); // Auto-reset down on first down
    }

    setStagedStats([]);
  };

  const removeStat = async (gameId: number, player: string, stat: keyof PlayerStats, scoreValue: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;
    
    const currentValue = currentGame.stats[player]?.[stat] || 0;
    if (currentValue <= 0) return;

    const newStats = {
      ...currentGame.stats,
      [player]: {
        ...currentGame.stats[player],
        [stat]: currentValue - 1
      }
    };

    const newOurScore = scoreValue > 0 ? Math.max(0, currentGame.ourScore - scoreValue) : currentGame.ourScore;

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { 
        playerStats: newStats,
        ourScore: newOurScore,
      },
    });
  };

  const addStat = async (gameId: number, player: string, stat: keyof PlayerStats, scoreValue: number) => {
    const currentGame = games[gameId];
    if (!currentGame) return;
    
    const currentValue = currentGame.stats[player]?.[stat] || 0;

    const newStats = {
      ...currentGame.stats,
      [player]: {
        ...currentGame.stats[player],
        [stat]: currentValue + 1
      }
    };

    const newOurScore = scoreValue > 0 ? currentGame.ourScore + scoreValue : currentGame.ourScore;

    await updateGameMutation.mutateAsync({
      id: gameId,
      data: { 
        playerStats: newStats,
        ourScore: newOurScore,
      },
    });
  };

  const resetGame = async (gameId: number) => {
    if (confirm('Reset this game?')) {
      await deleteGameMutation.mutateAsync(gameId);
    }
  };

  const markGameFinal = async (gameId: number) => {
    if (confirm('Mark this game as FINAL? This locks in the score and stats.')) {
      await updateGameMutation.mutateAsync({
        id: gameId,
        data: { isFinished: 1 },
      });
      
      // Generate AI highlights from coach commentary
      try {
        await fetch(`/api/games/${gameId}/generate-highlights`, { method: 'POST' });
        await queryClient.invalidateQueries({ queryKey: ['games'] });
      } catch (error) {
        console.error('Failed to generate highlights:', error);
      }
      
      // Clean up video storage - stats are preserved, only videos deleted
      try {
        await fetch(`/api/uploads/cleanup-game/${gameId}`, { method: 'POST' });
        console.log('[FINAL] Video cleanup complete for game', gameId);
      } catch (error) {
        console.error('Failed to cleanup videos:', error);
      }
      
      setSelectedGame(null);
    }
  };

  const generateGameSummary = () => {
    if (!selectedGame || !currentGame) return '';
    const info = schedule.find(g => g.id === selectedGame);
    if (!info) return '';

    const isWin = currentGame.ourScore > currentGame.opponentScore;
    const isLoss = currentGame.ourScore < currentGame.opponentScore;
    const isTie = currentGame.ourScore === currentGame.opponentScore;
    const scoreDiff = Math.abs(currentGame.ourScore - currentGame.opponentScore);
    const isBlowout = scoreDiff >= 14;
    const isNailbiter = scoreDiff <= 6 && !isTie;

    // Epic header based on result
    let text = '';
    if (isWin && isBlowout) {
      text += `🔥🔥🔥 ABSOLUTE DOMINATION 🔥🔥🔥\n`;
    } else if (isWin && isNailbiter) {
      text += `😤💪 CLUTCH VICTORY 💪😤\n`;
    } else if (isWin) {
      text += `🏆✨ W IN THE BOOKS ✨🏆\n`;
    } else if (isLoss && isBlowout) {
      text += `😤 WE'LL BE BACK 😤\n`;
    } else if (isLoss && isNailbiter) {
      text += `💔 TOUGH ONE TO SWALLOW 💔\n`;
    } else if (isLoss) {
      text += `📝 LESSONS LEARNED 📝\n`;
    } else {
      text += `⚔️ BATTLE TO A DRAW ⚔️\n`;
    }

    text += `\n🐔 CHICK-FIL-A FLAG FOOTBALL 🐔\n`;
    text += `🏈 2026 WINTER SEASON 🏈\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `📅 ${info.day.toUpperCase()} ${info.date}\n`;
    text += `⏰ ${info.time} • 📍 ${info.field}\n`;
    text += `🆚 vs ${info.opponent.toUpperCase()}\n\n`;
    
    // Epic scoreboard
    text += `╔══════════════════════════╗\n`;
    text += `║    💥 FINAL SCORE 💥     ║\n`;
    text += `╠══════════════════════════╣\n`;
    text += `║                          ║\n`;
    text += `║   🐔 CHICK-FIL-A   ${String(currentGame.ourScore).padStart(2, ' ')}   ║\n`;
    text += `║   🏴 ${info.opponent.slice(0, 12).padEnd(12, ' ')} ${String(currentGame.opponentScore).padStart(2, ' ')}   ║\n`;
    text += `║                          ║\n`;
    if (isWin) {
      text += `║      🎉 VICTORY 🎉       ║\n`;
    } else if (isLoss) {
      text += `║        DEFEAT 😤         ║\n`;
    } else {
      text += `║         TIE 🤝          ║\n`;
    }
    text += `╚══════════════════════════╝\n\n`;

    // Find top performers
    const playerPoints: { player: string; points: number; tds: number; stats: typeof currentGame.stats[string] }[] = [];
    roster.forEach(player => {
      const stats = currentGame.stats[player];
      if (!stats) return;
      const points = (stats.touchdowns * 6) + stats.extraPoints + (stats.twoPointConversions * 2);
      const tds = stats.touchdowns + (stats.qbTouchdowns || 0);
      if (points > 0 || tds > 0 || stats.flagPulls > 0 || stats.interceptions > 0 || stats.catches > 0) {
        playerPoints.push({ player, points, tds, stats });
      }
    });
    playerPoints.sort((a, b) => b.points - a.points || b.tds - a.tds);

    if (playerPoints.length > 0) {
      text += `🌟 PLAYER HIGHLIGHTS 🌟\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      playerPoints.forEach(({ player, points, stats }) => {
        const fullName = playerFullNames[player] || player;
        const statEmojis: string[] = [];
        
        if (stats.touchdowns > 0) {
          const tds = stats.touchdowns;
          statEmojis.push(`🏈${tds > 1 ? `x${tds}` : ''} TD${tds > 1 ? 's' : ''}`);
        }
        if ((stats.qbTouchdowns || 0) > 0) {
          const qbtds = stats.qbTouchdowns || 0;
          statEmojis.push(`🎯${qbtds > 1 ? `x${qbtds}` : ''} QB TD`);
        }
        if (stats.extraPoints > 0) {
          statEmojis.push(`✨${stats.extraPoints > 1 ? `x${stats.extraPoints}` : ''} XP`);
        }
        if (stats.twoPointConversions > 0) {
          statEmojis.push(`⚡${stats.twoPointConversions > 1 ? `x${stats.twoPointConversions}` : ''} 2PT`);
        }
        if (stats.catches > 0) {
          statEmojis.push(`🙌${stats.catches > 1 ? `x${stats.catches}` : ''} Catch`);
        }
        if ((stats.catchFirstDowns || 0) > 0) {
          statEmojis.push(`📍${(stats.catchFirstDowns || 0) > 1 ? `x${stats.catchFirstDowns}` : ''} 1st`);
        }
        if ((stats.runs || 0) > 0) {
          statEmojis.push(`🏃${(stats.runs || 0) > 1 ? `x${stats.runs}` : ''} Run`);
        }
        if (stats.flagPulls > 0) {
          statEmojis.push(`🚩${stats.flagPulls > 1 ? `x${stats.flagPulls}` : ''} Flag`);
        }
        if (stats.interceptions > 0) {
          statEmojis.push(`🖐️${stats.interceptions > 1 ? `x${stats.interceptions}` : ''} INT`);
        }
        if (stats.sacks > 0) {
          statEmojis.push(`💥${stats.sacks > 1 ? `x${stats.sacks}` : ''} Sack`);
        }

        if (statEmojis.length > 0) {
          const badge = points >= 18 ? '🔥' : points >= 12 ? '⭐' : points >= 6 ? '💫' : '👊';
          text += `${badge} ${fullName.toUpperCase()}\n`;
          text += `   ${statEmojis.join(' • ')}\n`;
          if (points > 0) text += `   💰 ${points} PTS\n`;
          text += `\n`;
        }
      });
    }

    // Add hype footer
    if (isWin) {
      text += `🐔💪 EAT MOR CHIKIN, WIN MOR GAMES 💪🐔\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    return text;
  };

  const generatePlayerSummary = (player: string) => {
    if (!selectedGame || !currentGame) return '';
    const info = schedule.find(g => g.id === selectedGame);
    if (!info) return '';

    const stats = currentGame.stats[player];
    if (!stats) return '';

    const points = (stats.touchdowns * 6) + stats.extraPoints + (stats.twoPointConversions * 2);
    const badge = getBadge(stats);
    const microStory = getMicroStory(stats);

    let text = `🏈 ${(playerFullNames[player] || player).toUpperCase()} 🏈\n`;
    text += `Chick-Fil-A Flag Football\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `${badge}\n`;
    text += `"${microStory}"\n\n`;
    text += `📅 Game ${info.id} vs ${info.opponent}\n`;
    text += `📍 ${info.day} ${info.date}\n\n`;

    if (points > 0) {
      text += `⭐ ${points} POINTS\n\n`;
    }

    text += `📊 STATS\n`;
    if (stats.touchdowns > 0) text += `  🏈 ${stats.touchdowns} Touchdown${stats.touchdowns > 1 ? 's' : ''}\n`;
    if (stats.extraPoints > 0) text += `  ✨ ${stats.extraPoints} Extra Point${stats.extraPoints > 1 ? 's' : ''}\n`;
    if (stats.twoPointConversions > 0) text += `  ⚡ ${stats.twoPointConversions} 2-Point Conversion${stats.twoPointConversions > 1 ? 's' : ''}\n`;
    if (stats.qbTouchdowns > 0) text += `  🎯 ${stats.qbTouchdowns} QB TD Pass${stats.qbTouchdowns > 1 ? 'es' : ''}\n`;
    if (stats.catches > 0) text += `  🙌 ${stats.catches} Catch${stats.catches > 1 ? 'es' : ''}\n`;
    if ((stats.catchFirstDowns || 0) > 0) text += `  📍 ${stats.catchFirstDowns} Catch First Down${(stats.catchFirstDowns || 0) > 1 ? 's' : ''}\n`;
    if ((stats.runs || 0) > 0) text += `  🏃 ${stats.runs} Run${(stats.runs || 0) > 1 ? 's' : ''}\n`;
    if ((stats.firstDowns || 0) > 0) text += `  📍 ${stats.firstDowns} Run First Down${(stats.firstDowns || 0) > 1 ? 's' : ''}\n`;
    if ((stats.qbFirstDownThrows || 0) > 0) text += `  🎯 ${stats.qbFirstDownThrows} QB First Down Throw${(stats.qbFirstDownThrows || 0) > 1 ? 's' : ''}\n`;
    if (stats.flagPulls > 0) text += `  🚩 ${stats.flagPulls} Flag Pull${stats.flagPulls > 1 ? 's' : ''}\n`;
    if (stats.interceptions > 0) text += `  🖐️ ${stats.interceptions} Interception${stats.interceptions > 1 ? 's' : ''}\n`;
    if (stats.sacks > 0) text += `  💥 ${stats.sacks} Sack${stats.sacks > 1 ? 's' : ''}\n`;
    if ((stats.completions || 0) > 0) text += `  ✅ ${stats.completions} Completion${(stats.completions || 0) > 1 ? 's' : ''}\n`;
    if ((stats.incompletes || 0) > 0) text += `  ❌ ${stats.incompletes} Incomplete${(stats.incompletes || 0) > 1 ? 's' : ''}\n`;
    if ((stats.drops || 0) > 0) text += `  🫳 ${stats.drops} Drop${(stats.drops || 0) > 1 ? 's' : ''}\n`;

    return text;
  };

  const shareContent = async (text: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch (err) {
      // Share was cancelled or failed, fall through to clipboard
    }
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      // Clipboard also failed - just alert that it couldn't copy
      console.log('Share failed:', err);
    }
  };

  const shareGame = async () => {
    const text = generateGameSummary();
    if (!text) return;
    
    const fullText = text + `\n📱 Follow the game LIVE:\n${window.location.origin}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: 'Chick-Fil-A Flag Football',
          text: fullText,
          url: window.location.origin
        });
        return;
      }
    } catch (err) {
      // Share was cancelled or failed
    }
    
    try {
      await navigator.clipboard.writeText(fullText);
      alert('Game summary copied! Share it with family and friends.');
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const sharePlayer = (player: string) => {
    const text = generatePlayerSummary(player);
    if (text) shareContent(text);
  };

  const shareApp = async () => {
    const text = `🏈 Chick-Fil-A Flag Football 🏈\n\n` +
      `Track our team's scores and stats for the 2026 Winter Season!\n\n` +
      `📱 Add to your home screen for instant access:\n` +
      `${window.location.origin}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: 'Chick-Fil-A Flag Football',
          text: text,
          url: window.location.origin
        });
        return;
      }
    } catch (err) {
      // Share was cancelled or failed
    }
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied! Share it with family and friends.');
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const currentGame = selectedGame ? games[selectedGame] : null;
  const gameInfo = selectedGame ? schedule.find(g => g.id === selectedGame) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E51636] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]" data-testid="app-container">
      {/* Celebration Confetti */}
      {celebration && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[100]">
          <ConfettiExplosion
            force={celebration === 'touchdown' ? 0.8 : 0.5}
            duration={celebration === 'touchdown' ? 3000 : 2000}
            particleCount={celebration === 'touchdown' ? 150 : 80}
            width={celebration === 'touchdown' ? 1600 : 1000}
            colors={celebration === 'touchdown' 
              ? ['#E51636', '#FFFFFF', '#FFD700', '#FF6B6B', '#4CAF50'] 
              : ['#E51636', '#FFFFFF', '#FFD700']
            }
          />
        </div>
      )}
      
      {/* Confirmation Toast */}
      {confirmationToast?.visible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] animate-bounce" data-testid="confirmation-toast">
          <div className="bg-black/90 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <span className="text-2xl">{confirmationToast.emoji}</span>
            <span className="font-bold text-sm">{confirmationToast.message}</span>
            <Check className="w-5 h-5 text-green-400" />
          </div>
        </div>
      )}
      
      {/* Offline Indicator Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white text-center py-2 px-4 text-sm font-semibold shadow-lg flex items-center justify-center gap-2" data-testid="offline-banner">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M12 9v2m0 4h.01" />
          </svg>
          Offline Mode - Showing cached data
        </div>
      )}
      
      <header className={`bg-[#E51636] text-white sticky z-50 shadow-lg ${!isOnline ? 'top-9' : 'top-0'}`}>
        <div className="max-w-lg mx-auto px-3 py-1.5">
          {/* Admin Login Bar */}
          {!adminUnlocked && (
            <div className="flex items-center justify-between mb-1">
              {!showAdminLogin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 transition-all"
                  data-testid="button-show-admin-login"
                >
                  <Lock className="w-3 h-3" />
                  Admin Login
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="Enter code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="w-24 px-3 py-1.5 rounded-full text-xs text-gray-900 bg-white/90 placeholder-gray-500 outline-none"
                    data-testid="input-admin-code"
                    autoFocus
                  />
                  <button
                    onClick={handleAdminLogin}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 hover:bg-green-600 transition-all"
                    data-testid="button-admin-login-submit"
                  >
                    Enter
                  </button>
                  <button
                    onClick={() => { setShowAdminLogin(false); setAdminCode(''); }}
                    className="px-2 py-1.5 rounded-full text-xs bg-white/10 hover:bg-white/20 transition-all"
                    data-testid="button-admin-login-cancel"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={chickFilALogo} 
                alt="Chick-Fil-A" 
                className="w-11 h-11 bg-white rounded-full p-0.5 shadow-md"
                data-testid="logo-chickfila"
              />
              <div>
                <h1 className="text-sm font-bold font-display tracking-tight leading-none" data-testid="app-title">
                  2026 Winter Flag Football
                </h1>
                <p className="text-[10px] text-white/80 font-medium leading-tight">
                  {seasonRecord.wins}-{seasonRecord.losses} • <span className="text-amber-300 font-bold">1st Place</span>
                </p>
              </div>
            </div>
            {adminUnlocked && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newMode = viewMode === 'admin' ? 'spectator' : 'admin';
                    setViewMode(newMode);
                    localStorage.setItem('chickFilAViewMode', newMode);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm transition-all btn-press bg-white/15 hover:bg-white/25"
                  data-testid="button-toggle-mode"
                >
                  {viewMode === 'admin' ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {viewMode === 'admin' ? 'Admin' : 'View'}
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="p-2 rounded-full backdrop-blur-sm transition-all btn-press bg-white/10 hover:bg-white/20"
                  data-testid="button-lock-admin"
                  title="Lock admin mode"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2.5">
        <div className="max-w-lg mx-auto px-4">
          <Link 
            href="/surfstung"
            className="flex items-center justify-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
            data-testid="link-sponsored"
          >
            <span className="text-white/60">Built by</span>
            <img 
              src={surfstungLogo} 
              alt="Surfstung AI & Media" 
              className="w-5 h-5 rounded"
            />
            <span className="font-bold">Surfstung AI & Media</span>
          </Link>
        </div>
      </div>

      <main 
        className="max-w-lg mx-auto px-4 py-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!selectedGame ? (
          <div className="animate-fade-in">
            {/* LIVE NOW BANNER - Shows when a game is in progress */}
            {inProgressGameId && (() => {
              const liveGame = schedule.find(g => g.id === inProgressGameId);
              const liveGameData = games[inProgressGameId];
              const halfText = liveGameData?.quarter === 1 ? '1st' : '2nd';
              return (
                <button
                  onClick={() => setSelectedGame(inProgressGameId)}
                  className="w-full mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white rounded-2xl p-5 shadow-xl btn-press border-2 border-green-400/30 relative overflow-hidden"
                  data-testid="button-live-game"
                >
                  {/* Animated background pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                      {liveGame && opponentLogos[liveGame.opponent] ? (
                        <img 
                          src={opponentLogos[liveGame.opponent]} 
                          alt={liveGame.opponent} 
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <Zap className="w-8 h-8 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-white/30 px-2.5 py-1 rounded-full">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                          LIVE NOW
                        </span>
                        {liveGameData?.isHalftime ? (
                          <span className="text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full animate-pulse">
                            ⏸️ HALFTIME
                          </span>
                        ) : (
                          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
                            {halfText} Half
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xl">Chick-fil-A vs {liveGame?.opponent}</p>
                      <p className="text-2xl font-black mt-1">
                        {liveGameData?.ourScore || 0} - {liveGameData?.opponentScore || 0}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })()}

            {/* UP NEXT - Only show if no game is in progress */}
            {!inProgressGameId && nextGameId && (() => {
              const nextGame = schedule.find(g => g.id === nextGameId);
              return (
                <button
                  onClick={() => initGame(nextGameId)}
                  className="w-full mb-4 bg-gradient-to-r from-[#E51636] to-[#c41230] text-white rounded-2xl p-5 shadow-lg btn-press border-2 border-[#E51636]/20"
                  data-testid="button-next-game"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                      {nextGame && opponentLogos[nextGame.opponent] ? (
                        <img 
                          src={opponentLogos[nextGame.opponent]} 
                          alt={nextGame.opponent} 
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <Zap className="w-8 h-8 text-[#E51636]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">UP NEXT</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          nextGame?.location === 'home' ? 'bg-white/30' : 'bg-white/10'
                        }`}>
                          {nextGame?.location === 'home' ? 'HOME' : 'AWAY'}
                        </span>
                      </div>
                      <p className="font-bold text-xl">Game {nextGameId}: vs {nextGame?.opponent}</p>
                      <p className="text-sm text-white/80">
                        {nextGame?.day} {nextGame?.date} • {nextGame?.time} • {nextGame?.field}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })()}

            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-xl font-display font-bold text-gray-900">Schedule</h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowStandings(true)}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold btn-press shadow-sm hover:bg-amber-600 transition-colors"
                  data-testid="button-standings"
                >
                  <Trophy className="w-4 h-4" />
                  Standings
                </button>
                <Link href="/stats" className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E51636] text-white rounded-xl text-sm font-bold btn-press shadow-sm hover:bg-[#c41230] transition-colors" data-testid="link-season-stats">
                  <BarChart3 className="w-4 h-4" />
                  Team
                </Link>
              </div>
            </div>
            
            {/* Venue Location Link */}
            <a 
              href="https://maps.google.com/?q=1045+Fort+Johnson+Rd,+Charleston,+SC+29412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E51636] transition-colors mb-4"
              data-testid="link-venue-directions"
            >
              <MapPin className="w-4 h-4" />
              <span>Bayview Soccer Complex • 1045 Fort Johnson Rd</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">Get Directions</span>
            </a>

            {/* FAN PROMO BANNER - Live Feeds & Save to Home Screen */}
            {viewMode === 'spectator' && (
              <div 
                className="relative rounded-2xl mb-4 overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 50%, #1a1a2e 100%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
                data-testid="fan-promo-banner"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-purple-600/10" />
                <div className="relative px-3 py-3">
                  <div className="flex flex-col items-center text-center">
                    <img src="/surfstung-logo-full.png" alt="Surfstung AI & Media" className="w-36 h-36 object-contain drop-shadow-lg -mb-2" />
                    <p className="text-cyan-400 font-bold text-[11px]">Built by Surfstung AI & Media</p>
                    <p className="text-white font-bold text-sm mt-1">NEW: Live Video & Audio Feeds!</p>
                    <p className="text-gray-400 text-[11px]">Tap a game for real-time play-by-play!</p>
                  </div>
                  
                  <div className="flex gap-3 mt-4 px-2">
                    <button 
                      onClick={shareApp}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                      data-testid="share-app-banner"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share App</span>
                    </button>
                    <button 
                      onClick={() => setShowHomeScreenGuide(!showHomeScreenGuide)}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      data-testid="home-screen-toggle-schedule"
                    >
                      <span>📱</span>
                      <span>Save App</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showHomeScreenGuide ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {showHomeScreenGuide && (
                    <div className="mt-3 pt-3 border-t border-white/20 space-y-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🍎</span>
                          <span className="text-white font-bold text-sm">iPhone / iPad</span>
                          <span className="text-gray-400 text-xs">Safari</span>
                        </div>
                        <ol className="text-gray-300 text-xs space-y-1 ml-6">
                          <li>1. Tap <span className="text-white font-bold">Share</span> ⬆️ at the bottom</li>
                          <li>2. Tap "<span className="text-white font-bold">Add to Home Screen</span>"</li>
                          <li>3. Tap "<span className="text-white font-bold">Add</span>"</li>
                        </ol>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🤖</span>
                          <span className="text-white font-bold text-sm">Android</span>
                          <span className="text-gray-400 text-xs">Chrome</span>
                        </div>
                        <ol className="text-gray-300 text-xs space-y-1 ml-6">
                          <li>1. Tap <span className="text-white font-bold">menu</span> ⋮ top right</li>
                          <li>2. Tap "<span className="text-white font-bold">Add to Home screen</span>"</li>
                          <li>3. Tap "<span className="text-white font-bold">Add</span>"</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {schedule.map((game, index) => {
                const hasScore = games[game.id];
                const isFinished = games[game.id]?.isFinished;
                const isWin = isFinished && games[game.id].ourScore > games[game.id].opponentScore;
                const isLoss = isFinished && games[game.id].ourScore < games[game.id].opponentScore;
                const isNextGame = game.id === nextGameId;
                
                return (
                  <button
                    key={game.id}
                    onClick={() => initGame(game.id)}
                    className={`w-full bg-white rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-all btn-press border animate-slide-up ${
                      isNextGame ? 'border-[#E51636]/30 ring-2 ring-[#E51636]/10' : 'border-gray-100'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`button-game-${game.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden ${
                        isWin ? 'bg-emerald-500 ring-2 ring-emerald-400' :
                        isLoss ? 'bg-gray-200 ring-2 ring-gray-300' :
                        'bg-white ring-2 ring-gray-200'
                      }`}>
                        {opponentLogos[game.opponent] ? (
                          <img 
                            src={opponentLogos[game.opponent]} 
                            alt={game.opponent} 
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="font-display font-bold text-xl text-gray-600">{game.id}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-lg truncate">{game.opponent}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            game.location === 'home' 
                              ? 'bg-[#E51636]/10 text-[#E51636]' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {game.location === 'home' ? 'HOME' : 'AWAY'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {game.day} {game.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {game.time}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            {game.field}
                          </span>
                        </div>
                      </div>
                      
                      {hasScore && isFinished && (
                        <div className="text-right">
                          <div className={`text-3xl font-display font-bold ${isWin ? 'text-emerald-600' : isLoss ? 'text-gray-400' : 'text-gray-900'}`}>
                            {game.location === 'home' 
                              ? `${games[game.id].opponentScore}-${games[game.id].ourScore}`
                              : `${games[game.id].ourScore}-${games[game.id].opponentScore}`}
                          </div>
                          <div className={`text-xs font-bold ${isWin ? 'text-emerald-600' : isLoss ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isWin ? 'WIN' : isLoss ? 'LOSS' : 'TIE'}
                          </div>
                        </div>
                      )}
                      {hasScore && !isFinished && (
                        <div className="text-right">
                          <div className="text-2xl font-display font-bold text-[#E51636]">
                            {game.location === 'home' 
                              ? `${games[game.id].opponentScore}-${games[game.id].ourScore}`
                              : `${games[game.id].ourScore}-${games[game.id].opponentScore}`}
                          </div>
                          <div className="text-xs font-bold text-[#E51636]/60">
                            IN PROGRESS
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4">
            <button
              onClick={() => { setSelectedGame(null); setSelectedPlayer(null); }}
              className="flex items-center gap-2 text-base font-semibold text-gray-600 hover:text-gray-900 transition-colors py-2"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Schedule
            </button>

            {/* SCOREBOARD - Tap scores to edit in admin mode */}
            <div className="bg-gradient-to-r from-[#E51636] to-[#c41230] rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                <span className="text-sm font-bold text-white/80">
                  GAME {gameInfo?.id} • {gameInfo?.day} {gameInfo?.date}
                </span>
                <div className="flex items-center gap-2">
                  {currentGame?.isFinished ? (
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full text-white">FINAL</span>
                  ) : currentGame?.isHalftime ? (
                    <span className="text-xs font-bold bg-amber-400 text-amber-900 px-2 py-1 rounded-full animate-pulse">
                      ⏸️ HALFTIME
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full text-white">
                      {currentGame?.quarter === 1 ? '1st' : '2nd'} Half
                    </span>
                  )}
                  {viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && (
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full text-white">TAP SCORE</span>
                  )}
                  {viewMode === 'admin' && isEditingPastGame && (
                    <span className="text-xs font-bold bg-amber-500 px-2 py-1 rounded-full text-white animate-pulse">EDITING</span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* LEFT SCORE - Opponent when HOME, Us when AWAY */}
                  <div 
                    className={`text-center ${viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) ? 'cursor-pointer' : ''}`}
                    onClick={() => viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && setEditingScore(gameInfo?.location === 'home' ? 'opponent' : 'our')}
                    data-testid={gameInfo?.location === 'home' ? 'score-opponent-tap' : 'score-our-tap'}
                  >
                    <p className={`${gameInfo?.location === 'home' ? 'text-white/60' : 'text-white/80'} text-sm font-bold mb-1 truncate`}>
                      {gameInfo?.location === 'home' ? gameInfo?.opponent?.toUpperCase() : 'CHICK-FIL-A'}
                    </p>
                    <p className={`text-7xl font-display font-bold ${gameInfo?.location === 'home' ? 'text-white/70' : 'text-white'} ${
                      (gameInfo?.location === 'home' && editingScore === 'opponent') || (gameInfo?.location !== 'home' && editingScore === 'our') 
                        ? 'ring-4 ring-white rounded-xl' : ''
                    }`} data-testid={gameInfo?.location === 'home' ? 'score-opponent' : 'score-our'}>
                      {gameInfo?.location === 'home' ? currentGame?.opponentScore : currentGame?.ourScore}
                    </p>
                  </div>
                  {/* RIGHT SCORE - Us when HOME, Opponent when AWAY */}
                  <div 
                    className={`text-center ${viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) ? 'cursor-pointer' : ''}`}
                    onClick={() => viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && setEditingScore(gameInfo?.location === 'home' ? 'our' : 'opponent')}
                    data-testid={gameInfo?.location === 'home' ? 'score-our-tap' : 'score-opponent-tap'}
                  >
                    <p className={`${gameInfo?.location === 'home' ? 'text-white/80' : 'text-white/60'} text-sm font-bold mb-1 truncate`}>
                      {gameInfo?.location === 'home' ? 'CHICK-FIL-A' : gameInfo?.opponent?.toUpperCase()}
                    </p>
                    <p className={`text-7xl font-display font-bold ${gameInfo?.location === 'home' ? 'text-white' : 'text-white/70'} ${
                      (gameInfo?.location === 'home' && editingScore === 'our') || (gameInfo?.location !== 'home' && editingScore === 'opponent') 
                        ? 'ring-4 ring-white rounded-xl' : ''
                    }`} data-testid={gameInfo?.location === 'home' ? 'score-our' : 'score-opponent'}>
                      {gameInfo?.location === 'home' ? currentGame?.ourScore : currentGame?.opponentScore}
                    </p>
                  </div>
                </div>
                
                {/* Score edit controls - same for both teams */}
                {editingScore && viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && (
                  <div className="mt-4 bg-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-sm">
                        {editingScore === 'our' ? 'CHICK-FIL-A' : gameInfo?.opponent?.toUpperCase()}
                      </span>
                      <button 
                        onClick={() => setEditingScore(null)}
                        className="text-white/60 text-sm font-bold"
                      >
                        Done
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => updateScore(selectedGame, editingScore === 'our' ? 'ourScore' : 'opponentScore', 6)} 
                        className="bg-white text-[#E51636] py-4 rounded-xl text-xl font-bold btn-press"
                        data-testid={`button-${editingScore}-plus6`}
                      >
                        +6
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, editingScore === 'our' ? 'ourScore' : 'opponentScore', 2)} 
                        className="bg-white text-[#E51636] py-4 rounded-xl text-xl font-bold btn-press"
                        data-testid={`button-${editingScore}-plus2`}
                      >
                        +2
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, editingScore === 'our' ? 'ourScore' : 'opponentScore', 1)} 
                        className="bg-white text-[#E51636] py-4 rounded-xl text-xl font-bold btn-press"
                        data-testid={`button-${editingScore}-plus1`}
                      >
                        +1
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, editingScore === 'our' ? 'ourScore' : 'opponentScore', -1)} 
                        className="bg-white/20 text-white py-4 rounded-xl text-xl font-bold btn-press"
                        data-testid={`button-${editingScore}-minus1`}
                      >
                        -1
                      </button>
                    </div>
                  </div>
                )}

                {/* OPPONENT SCORED - Quick buttons for admin */}
                {viewMode === 'admin' && !editingScore && (!currentGame?.isFinished || isEditingPastGame) && (
                  <div className="mt-4 bg-gray-800/50 rounded-xl p-3">
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wide mb-2 text-center">
                      {gameInfo?.opponent} Scored
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => updateScore(selectedGame, 'opponentScore', 6)} 
                        className="bg-gray-600 text-white py-3 rounded-xl text-lg font-bold btn-press"
                        data-testid="button-opponent-plus6"
                      >
                        +6
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, 'opponentScore', 2)} 
                        className="bg-gray-600 text-white py-3 rounded-xl text-lg font-bold btn-press"
                        data-testid="button-opponent-plus2"
                      >
                        +2
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, 'opponentScore', 1)} 
                        className="bg-gray-600 text-white py-3 rounded-xl text-lg font-bold btn-press"
                        data-testid="button-opponent-plus1"
                      >
                        +1
                      </button>
                      <button 
                        onClick={() => updateScore(selectedGame, 'opponentScore', -1)} 
                        className="bg-gray-700 text-white/70 py-3 rounded-xl text-lg font-bold btn-press"
                        data-testid="button-opponent-minus1"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PULL TO REFRESH INDICATOR - Shows when pulling down */}
            {viewMode === 'spectator' && pullRefreshY > 0 && (
              <div 
                className="flex items-center justify-center gap-2 text-white text-sm font-bold mb-2 transition-all"
                style={{ opacity: Math.min(pullRefreshY / 80, 1), transform: `translateY(${pullRefreshY / 3}px)` }}
                data-testid="pull-indicator"
              >
                <div className={`w-5 h-5 border-2 border-white rounded-full ${pullRefreshY > 80 ? 'animate-spin border-t-transparent' : ''}`} />
                <span>{pullRefreshY > 80 ? 'Release to refresh...' : 'Pull down to refresh...'}</span>
              </div>
            )}

            {/* REFRESHING INDICATOR */}
            {isRefreshing && (
              <div className="flex items-center justify-center gap-2 text-white text-sm font-bold mb-2" data-testid="refreshing-indicator">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Refreshing...</span>
              </div>
            )}

            {/* LIVE INDICATOR - Shows spectators data is fresh */}
            {viewMode === 'spectator' && dataUpdatedAt && !isRefreshing && pullRefreshY === 0 && (
              <div className="flex flex-col items-center justify-center gap-1 text-gray-600 text-xs mb-2" data-testid="live-indicator">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">LIVE • Updated {new Date(dataUpdatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
                  <button
                    onClick={async () => {
                      setIsRefreshing(true);
                      setPendingRefresh(true);
                      await queryClient.invalidateQueries({ queryKey: ['games'] });
                    }}
                    className="ml-2 p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors btn-press"
                    data-testid="button-refresh"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-gray-500 text-[10px]">↓ Slide down or tap refresh ↓</span>
              </div>
            )}

            {/* AI HIGHLIGHTS - Shows for finished games */}
            {currentGame?.isFinished && currentGame?.aiHighlights && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-4 mb-3" data-testid="ai-highlights">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Game Highlights</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{currentGame.aiHighlights}</p>
              </div>
            )}

            {/* COACH COMMENTARY - Shows for finished games if any recorded */}
            {currentGame?.isFinished && currentGame?.coachCommentary && currentGame.coachCommentary.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-3" data-testid="coach-commentary-final">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-800">Coach Commentary</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {currentGame.coachCommentary.map((c: { text: string; quarter: number; videoUrl?: string }, i: number) => (
                    <div key={i} className="bg-white/50 rounded-lg p-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-600 font-medium">H{c.quarter}</span>
                          {c.videoUrl && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">🎬 Video</span>
                          )}
                        </div>
                        {c.videoUrl && (
                          <button
                            onClick={async () => {
                              try {
                                const videoLink = `${window.location.origin}/api/uploads/object/${encodeURIComponent(c.videoUrl!)}`;
                                const shareText = `🏈 ${c.text}\n\nWatch: ${videoLink}`;
                                
                                if (navigator.share) {
                                  await navigator.share({ 
                                    title: 'Flag Football Highlight',
                                    text: shareText,
                                    url: videoLink
                                  });
                                } else {
                                  await navigator.clipboard.writeText(shareText);
                                  alert('Link copied! Paste in a text message to share.');
                                }
                              } catch (err) {
                                console.error('Share failed:', err);
                              }
                            }}
                            className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                            data-testid={`spectator-share-play-${i}`}
                          >
                            <Send className="w-3 h-3" />
                            Text
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{c.text}</p>
                      {c.videoUrl && (
                        <video 
                          src={c.videoUrl}
                          controls
                          className="mt-2 rounded-lg w-full max-h-40 bg-black"
                          preload="metadata"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POSSESSION INDICATOR - Shows for admin during live tracking (not for past games) */}
            {viewMode === 'admin' && !currentGame?.isFinished && (
              <div 
                className={`relative rounded-2xl py-2.5 px-4 mb-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider overflow-hidden ${
                  possession === 'offense' 
                    ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white'
                }`}
                style={{ 
                  boxShadow: possession === 'offense' 
                    ? '0 4px 20px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)' 
                    : '0 4px 20px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                data-testid="possession-indicator"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative flex items-center gap-2">
                  {possession === 'offense' ? (
                    <>🏈 CHICK-FIL-A HAS THE BALL</>
                  ) : (
                    <>🛡️ CHICK-FIL-A ON DEFENSE</>
                  )}
                </span>
              </div>
            )}

            {/* POSSESSION INDICATOR - Shows for spectators during live games */}
            {!currentGame?.isFinished && viewMode === 'spectator' && currentGame && (
              <div 
                className={`relative rounded-2xl py-2.5 px-4 mb-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider overflow-hidden ${
                  currentGame.possession === 'offense' 
                    ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white'
                }`}
                style={{ 
                  boxShadow: currentGame.possession === 'offense' 
                    ? '0 4px 20px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)' 
                    : '0 4px 20px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                data-testid="possession-indicator-spectator"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative flex items-center gap-2">
                  {currentGame.possession === 'offense' ? (
                    <>🏈 CHICK-FIL-A HAS THE BALL</>
                  ) : (
                    <>🛡️ CHICK-FIL-A ON DEFENSE</>
                  )}
                </span>
              </div>
            )}

            {/* HALFTIME COACHES CAROUSEL - Shows during halftime for all viewers */}
            {currentGame?.isHalftime && (
              <a 
                href={halftimeSponsors[halftimeSponsorIndex].link}
                target={halftimeSponsors[halftimeSponsorIndex].link.startsWith('/') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`block bg-gradient-to-br ${halftimeSponsors[halftimeSponsorIndex].color} rounded-3xl shadow-2xl overflow-hidden mb-4 transition-all duration-500 btn-press relative`}
                data-testid="halftime-carousel"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_50%)]" />
                
                <div className="px-4 py-2 bg-black/20 backdrop-blur-sm flex items-center justify-between">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">⏸️ Halftime</span>
                  <div className="flex gap-1.5">
                    {halftimeSponsors.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === halftimeSponsorIndex 
                            ? 'bg-white scale-110' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Sponsor ⏸️</span>
                </div>
                
                <div className="px-6 py-8 text-center relative">
                  <div className="absolute top-4 left-4 text-2xl">{halftimeSponsors[halftimeSponsorIndex].badge}</div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-white/95 rounded-2xl shadow-xl flex items-center justify-center p-3 backdrop-blur-sm">
                      <img 
                        src={halftimeSponsors[halftimeSponsorIndex].logo} 
                        alt={halftimeSponsors[halftimeSponsorIndex].name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm font-bold text-white/70 uppercase tracking-[0.25em] mb-2">
                    {halftimeSponsors[halftimeSponsorIndex].name}
                  </p>
                  
                  <p className="text-3xl font-black text-white mb-3 drop-shadow-lg leading-tight" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", letterSpacing: '0.02em' }}>
                    {halftimeSponsors[halftimeSponsorIndex].headline}
                  </p>
                  
                  <p className="text-base font-medium text-white/80 mb-5">
                    {halftimeSponsors[halftimeSponsorIndex].supporting}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 ${halftimeSponsors[halftimeSponsorIndex].accentColor} px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg`}>
                    {halftimeSponsors[halftimeSponsorIndex].cta}
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </a>
            )}

            {/* FOX SPORTS STYLE LIVE PLAY TICKER - Admin view */}
            {viewMode === 'admin' && currentGame?.lastPlay && (Date.now() - currentGame.lastPlay.timestamp < 30000) && !currentGame?.isHalftime && (
              <div 
                className="relative overflow-hidden rounded-lg shadow-2xl mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
                }}
                data-testid="last-play-ticker"
              >
                {/* Background glow for touchdowns */}
                {currentGame.lastPlay!.action.toLowerCase().includes('touchdown') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-500/20 to-red-600/20" />
                )}
                
                {/* Top accent bar - FOX SPORTS RED */}
                <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-2 flex items-center justify-between">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  
                  {/* LIVE indicator */}
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="relative flex items-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping absolute" />
                      <div className="w-3 h-3 bg-white rounded-full relative" />
                    </div>
                    <span className="text-sm font-black text-white tracking-[0.2em] uppercase" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                      LIVE
                    </span>
                  </div>
                  
                  <span className="text-xs font-bold text-white/80 tracking-widest uppercase relative z-10">
                    CHICK-FIL-A FLAG FOOTBALL
                  </span>
                </div>
                
                {/* Main content area */}
                <div className="relative px-5 py-6">
                  {/* Diagonal accent stripe */}
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-600/30 to-transparent transform skew-x-[-15deg] translate-x-10" />
                  
                  {currentGame.lastPlay!.player ? (
                    <div className="relative z-10">
                      {/* Player name - massive and bold */}
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl">{currentGame.lastPlay!.emoji}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          {currentGame.lastPlay!.player.toUpperCase()}
                        </h2>
                      </div>
                      
                      {/* Action description */}
                      <p className="text-lg md:text-xl font-bold text-center leading-tight px-2" style={{ color: '#f0f0f0', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {currentGame.lastPlay!.action}
                      </p>
                      
                      {/* Touchdown celebration */}
                      {currentGame.lastPlay!.action.toLowerCase().includes('touchdown') && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-6 py-2 rounded-full shadow-lg">
                            <span className="text-xl font-black text-white tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                              🏈 TOUCHDOWN! 🏈
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Interception celebration */}
                      {(currentGame.lastPlay!.action.toLowerCase().includes('pick') || currentGame.lastPlay!.action.toLowerCase().includes('interception')) && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-2 rounded-full shadow-lg">
                            <span className="text-xl font-black text-white tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                              🏆 TURNOVER! 🏆
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* VIDEO PLAYER - Show for plays with player names too! */}
                      {(currentGame.lastPlay as any)?.videoUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-red-500/50 shadow-xl">
                          <video 
                            src={(currentGame.lastPlay as any).videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full max-h-56 bg-black"
                            data-testid="last-play-video-with-player"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative z-10">
                      {/* Action without player name */}
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-4xl">{currentGame.lastPlay!.emoji}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white text-center leading-tight px-2" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {currentGame.lastPlay!.action}
                      </p>
                      
                      {/* VIDEO PLAYER - Prominent display */}
                      {(currentGame.lastPlay as any)?.videoUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-red-500/50 shadow-xl">
                          <video 
                            src={(currentGame.lastPlay as any).videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full max-h-56 bg-black"
                            data-testid="last-play-video-admin"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
                
                {/* Post to Public + Text Buttons */}
                <div className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-center gap-3">
                  {/* TEXT/SHARE Button - Uses native share */}
                  {(currentGame?.lastPlay as any)?.videoUrl && (
                    <button
                      onClick={async () => {
                        const shareText = `🏈 ${currentGame?.lastPlay?.action}\n\nWatch the video: ${window.location.origin}${(currentGame?.lastPlay as any)?.videoUrl}`;
                        if (navigator.share) {
                          try {
                            await navigator.share({ text: shareText });
                          } catch (err) {
                            console.log('Share cancelled');
                          }
                        } else {
                          await navigator.clipboard.writeText(shareText);
                          setConfirmationToast({ message: 'Link copied!', emoji: '📋', visible: true });
                          setTimeout(() => setConfirmationToast(null), 2000);
                        }
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all"
                      data-testid="text-share-btn"
                    >
                      <Send className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  )}
                  
                  {/* Post to Public Button */}
                  <button
                    onClick={async () => {
                      if (!selectedGame || !currentGame?.lastPlay) return;
                      try {
                        await updateGameMutation.mutateAsync({
                          id: selectedGame,
                          data: { publicLastPlay: currentGame.lastPlay },
                        });
                        setConfirmationToast({ message: 'Posted to public!', emoji: '📢', visible: true });
                        setTimeout(() => setConfirmationToast(null), 2000);
                      } catch (error) {
                        console.error('Failed to post to public:', error);
                      }
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all"
                    data-testid="post-to-public-btn"
                  >
                    <span>📢</span>
                    <span>Post to Public</span>
                  </button>
                </div>
              </div>
            )}

            {/* FOX SPORTS STYLE LAST PLAY TICKER - Spectator view (only shows explicitly posted plays) */}
            {viewMode === 'spectator' && currentGame?.publicLastPlay && !currentGame?.isHalftime && (
              <div 
                className="relative overflow-hidden rounded-lg shadow-2xl mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
                }}
                data-testid="last-play-ticker-spectator"
              >
                {/* Background glow for touchdowns */}
                {currentGame.publicLastPlay.action.toLowerCase().includes('touchdown') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-500/20 to-red-600/20" />
                )}
                
                {/* Top accent bar - FOX SPORTS RED */}
                <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-2 flex items-center justify-between">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" style={{ backgroundSize: '200% 100%' }} />
                  
                  {/* LAST PLAY indicator */}
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    <span className="text-sm font-black text-white tracking-[0.2em] uppercase" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                      LAST PLAY
                    </span>
                  </div>
                  
                  <span className="text-xs font-bold text-white/80 tracking-widest uppercase relative z-10">
                    CHICK-FIL-A FLAG FOOTBALL
                  </span>
                </div>
                
                {/* Main content area */}
                <div className="relative px-5 py-6">
                  {/* Diagonal accent stripe */}
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-600/30 to-transparent transform skew-x-[-15deg] translate-x-10" />
                  
                  {currentGame.publicLastPlay.player ? (
                    <div className="relative z-10">
                      {/* Player name - massive and bold */}
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl">{currentGame.publicLastPlay.emoji}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          {currentGame.publicLastPlay.player.toUpperCase()}
                        </h2>
                      </div>
                      
                      {/* Action description */}
                      <p className="text-lg md:text-xl font-bold text-center leading-tight px-2" style={{ color: '#f0f0f0', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {currentGame.publicLastPlay.action}
                      </p>
                      
                      {/* Touchdown celebration */}
                      {currentGame.publicLastPlay.action.toLowerCase().includes('touchdown') && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-6 py-2 rounded-full shadow-lg">
                            <span className="text-xl font-black text-white tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                              🏈 TOUCHDOWN! 🏈
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Interception celebration */}
                      {(currentGame.publicLastPlay.action.toLowerCase().includes('pick') || currentGame.publicLastPlay.action.toLowerCase().includes('interception')) && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-2 rounded-full shadow-lg">
                            <span className="text-xl font-black text-white tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
                              🏆 TURNOVER! 🏆
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* VIDEO PLAYER - Show if available */}
                      {currentGame.publicLastPlay.videoUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-red-500/50 shadow-xl">
                          <video 
                            src={currentGame.publicLastPlay.videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full max-h-56 bg-black"
                            data-testid="last-play-video-spectator"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative z-10">
                      {/* Action without player name */}
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-4xl">{currentGame.publicLastPlay.emoji}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white text-center leading-tight px-2" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {currentGame.publicLastPlay.action}
                      </p>
                      
                      {/* VIDEO PLAYER - Prominent display */}
                      {currentGame.publicLastPlay.videoUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-red-500/50 shadow-xl">
                          <video 
                            src={currentGame.publicLastPlay.videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full max-h-56 bg-black"
                            data-testid="last-play-video-spectator-no-player"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* BIG TEXT BUTTON FOR PARENTS TO SHARE - Uses native share or copies link */}
                {currentGame.publicLastPlay.videoUrl && (
                  <div className="px-5 py-4 bg-gradient-to-r from-gray-900 to-gray-800">
                    <button
                      onClick={async () => {
                        const shareText = `🏈 ${currentGame.publicLastPlay!.player?.toUpperCase() || 'GREAT PLAY'}!\n\n${currentGame.publicLastPlay!.action}\n\nWatch the video: ${window.location.origin}${currentGame.publicLastPlay!.videoUrl}`;
                        if (navigator.share) {
                          try {
                            await navigator.share({ text: shareText });
                          } catch (err) {
                            console.log('Share cancelled');
                          }
                        } else {
                          await navigator.clipboard.writeText(shareText);
                          setConfirmationToast({ message: 'Link copied!', emoji: '📋', visible: true });
                          setTimeout(() => setConfirmationToast(null), 2000);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-4 px-8 rounded-xl shadow-2xl flex items-center justify-center gap-3 text-xl transition-all active:scale-95"
                      data-testid="spectator-text-share-btn"
                    >
                      <Send className="w-7 h-7" />
                      <span>SHARE THIS VIDEO</span>
                    </button>
                  </div>
                )}
                
                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
              </div>
            )}

            {/* STAGED STATS PANEL - Shows pending stats before broadcast */}
            {viewMode === 'admin' && stagedStats.length > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-4 mb-4 border-4 border-green-300 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                    📋 READY TO SEND
                  </h3>
                  <span className="bg-white text-green-600 text-sm font-black px-3 py-1 rounded-full">{stagedStats.length} stat{stagedStats.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {stagedStats.map((stat, index) => (
                    <div key={stat.id} className="bg-white/30 rounded-xl p-3 flex items-center justify-between border border-white/40">
                      <div className="flex items-center gap-3">
                        <span className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white">{index + 1}</span>
                        <span className="text-2xl">{stat.emoji}</span>
                        <div>
                          <p className="text-white font-bold">{playerFullNames[stat.player] || stat.player}</p>
                          <p className="text-white/90 text-sm font-semibold">{stat.actionName}{stat.scoreValue > 0 ? ` (+${stat.scoreValue} pts)` : ''}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStagedStat(stat.id)}
                        className="bg-red-500/80 text-white p-2 rounded-lg btn-press"
                        data-testid={`remove-staged-${stat.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => selectedGame && commitStagedStats(selectedGame)}
                  disabled={updateGameMutation.isPending}
                  className="w-full bg-white text-green-600 py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                  data-testid="button-broadcast"
                >
                  <Send className="w-6 h-6" />
                  {updateGameMutation.isPending ? 'SENDING...' : 'UPDATE & BROADCAST'}
                </button>
              </div>
            )}

            {/* UNDO & PLAY LOG - Quick admin controls */}
            {viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && (
              <>
              <div className="flex gap-2 mb-4">
                {/* Undo Button */}
                <button
                  onClick={undoLastAction}
                  disabled={actionHistory.length === 0 || updateGameMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-bold text-sm btn-press shadow-lg flex items-center justify-center gap-2 disabled:opacity-40"
                  data-testid="button-undo"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo{actionHistory.length > 0 ? ` (${actionHistory.length})` : ''}
                </button>
                
                {/* Play Log Toggle */}
                <button
                  onClick={() => setShowPlayLog(!showPlayLog)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm btn-press shadow-lg flex items-center justify-center gap-2 ${
                    showPlayLog 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'bg-white border-2 border-blue-500 text-blue-600'
                  }`}
                  data-testid="button-play-log"
                >
                  <BarChart3 className="w-4 h-4" />
                  Play Log{playLog.length > 0 ? ` (${playLog.length})` : ''}
                </button>
                
                {/* Voice Record Button - LARGE AND PROMINENT */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing || !!pendingVoicePlay || isRecordingVideo}
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center btn-press shadow-xl transition-all border-4 ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse border-red-300' 
                      : isTranscribing 
                        ? 'bg-gray-400 border-gray-300' 
                        : pendingVoicePlay || isRecordingVideo
                          ? 'bg-gray-400 border-gray-300'
                          : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border-purple-300'
                  }`}
                  data-testid="mic-button-top"
                >
                  {isTranscribing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                  <span className="text-[10px] font-bold text-white mt-1 uppercase tracking-wide">
                    {isRecording ? 'Stop' : isTranscribing ? 'Wait' : 'Voice'}
                  </span>
                </button>
                
                {/* Video Record Button - LARGE AND PROMINENT */}
                <button
                  onClick={openCameraModal}
                  disabled={isRecording || isTranscribing || isUploadingVideo}
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center btn-press shadow-xl transition-all border-4 ${
                    pendingVideoUrl
                      ? 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-green-300'
                      : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-blue-300'
                  }`}
                  data-testid="video-button-top"
                >
                  {pendingVideoUrl ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <Video className="w-8 h-8 text-white" />
                  )}
                  <span className="text-[10px] font-bold text-white mt-1 uppercase tracking-wide">
                    {pendingVideoUrl ? 'Ready' : 'Video'}
                  </span>
                </button>
              </div>
              
              {/* Voice Recording Status */}
              {isRecording && (
                <div className="text-center text-sm text-red-600 font-medium animate-pulse mb-2">
                  🎙️ Recording... Tap to stop
                </div>
              )}
              
              {isUploadingVideo && (
                <div className="text-center text-sm text-blue-600 font-medium mb-2">
                  Uploading video...
                </div>
              )}
              
              {pendingVideoUrl && !pendingVoicePlay && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2 flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">🎬 Video ready to attach to next play</span>
                  <button 
                    onClick={() => setPendingVideoUrl(null)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Discard
                  </button>
                </div>
              )}
              
              {isTranscribing && (
                <div className="text-center text-sm text-purple-600 font-medium mb-2">
                  Transcribing...
                </div>
              )}
              
              {/* Pending Voice Play Preview */}
              {pendingVoicePlay && (
                <div className="bg-white rounded-xl border-2 border-purple-400 p-4 shadow-md mb-4" data-testid="pending-voice-play-top">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Review Voice Play</p>
                  
                  {/* Share Card Preview - shows cleaned commentary */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 mb-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-bold mb-1">SHARE CARD:</p>
                    <p className="text-gray-900 font-medium text-base italic">
                      "{pendingVoicePlay.parsedPlay?.cleanedCommentary || pendingVoicePlay.parsedPlay?.tickerText || pendingVoicePlay.transcription}"
                    </p>
                  </div>
                  
                  {/* Video Preview if attached */}
                  {pendingVoicePlay.videoUrl && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">🎬 Video attached to this play</span>
                    </div>
                  )}
                  
                  {pendingVoicePlay.parsedPlay && pendingVoicePlay.parsedPlay.playType !== 'unknown' && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Detected:</span>{' '}
                      <span className="text-purple-700">
                        {pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'touchdown' ? '🏈 Touchdown Pass' :
                         pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'catch' ? '🏈 Completion' :
                         pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'firstDown' ? '🎯 First Down' :
                         pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'incomplete' ? '❌ Incomplete' :
                         pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'interception' ? '🔴 Interception' :
                         pendingVoicePlay.parsedPlay.playType === 'run' && pendingVoicePlay.parsedPlay.result === 'touchdown' ? '🏃 Rushing TD' :
                         pendingVoicePlay.parsedPlay.playType === 'run' ? '🏃 Run' :
                         pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'flagPull' ? '🚩 Flag Pull' :
                         pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'pick6' ? '🏆 PICK SIX!' :
                         pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'interception' ? '🏆 Interception' :
                         pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'sack' ? '💥 Sack' :
                         pendingVoicePlay.parsedPlay.playType === 'conversion' && pendingVoicePlay.parsedPlay.result === 'extraPoint' ? '⭐ Extra Point' :
                         pendingVoicePlay.parsedPlay.playType === 'conversion' && pendingVoicePlay.parsedPlay.result === 'twoPoint' ? '⭐ 2PT Conversion' :
                         pendingVoicePlay.parsedPlay.playType}
                      </span>
                      {pendingVoicePlay.parsedPlay.qb && <span className="ml-2">QB: {pendingVoicePlay.parsedPlay.qb}</span>}
                      {pendingVoicePlay.parsedPlay.receiver && <span className="ml-2">→ {pendingVoicePlay.parsedPlay.receiver}</span>}
                      {pendingVoicePlay.parsedPlay.runner && <span className="ml-2">Runner: {pendingVoicePlay.parsedPlay.runner}</span>}
                      {pendingVoicePlay.parsedPlay.defender && <span className="ml-2">Defender: {pendingVoicePlay.parsedPlay.defender}</span>}
                    </div>
                  )}
                  
                  {pendingVoicePlay.parsedPlay?.playType === 'unknown' && (
                    <div className="text-sm text-orange-600 mb-3">
                      ⚠️ Could not parse - will save as commentary only
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={confirmPendingPlay}
                      disabled={updateGameMutation.isPending}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                      data-testid="button-confirm-voice-play-top"
                    >
                      <Check className="w-5 h-5" />
                      Submit
                    </button>
                    <button
                      onClick={cancelPendingPlay}
                      disabled={updateGameMutation.isPending}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                      data-testid="button-cancel-voice-play-top"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              </>
            )}

            {/* PLAY LOG - Shows last 10 plays */}
            {viewMode === 'admin' && showPlayLog && playLog.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-4 mb-4" data-testid="play-log">
                <h3 className="text-sm font-black text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Recent Plays
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {playLog.map((play, idx) => {
                    const time = new Date(play.timestamp);
                    const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    return (
                      <div key={play.id} className="bg-white rounded-lg p-2 flex items-center gap-3 border border-blue-100">
                        <span className="text-lg">{play.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {play.player ? `${play.player.toUpperCase()}` : 'GAME'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{play.action}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">H{play.quarter}</span>
                          <span className="text-[10px] text-gray-400">{timeStr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OPPONENT QUICK SCORE - Fast opponent score buttons */}
            {viewMode === 'admin' && (!currentGame?.isFinished || isEditingPastGame) && (
              <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-3 mb-4" data-testid="opponent-quick-score">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Opponent Scored</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedGame) return;
                      const currentGame = games[selectedGame];
                      const prevScore = currentGame.opponentScore;
                      const gameId = selectedGame;
                      
                      // Update action history FIRST (sync) before mutation
                      setActionHistory(prev => [{
                        id: `opp-td-${Date.now()}`,
                        gameId: gameId,
                        timestamp: Date.now(),
                        type: 'opponent_score' as const,
                        description: 'Opponent TD (+6)',
                        undo: async () => {
                          await updateGameMutation.mutateAsync({
                            id: gameId,
                            data: { opponentScore: prevScore },
                          });
                        },
                      }, ...prev].slice(0, 10));
                      
                      // Then do the mutation
                      await updateGameMutation.mutateAsync({
                        id: gameId,
                        data: { 
                          opponentScore: prevScore + 6,
                          lastPlay: {
                            player: '',
                            action: '❌ OPPONENT TD',
                            emoji: '❌',
                            timestamp: Date.now(),
                          },
                        },
                      });
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold text-sm btn-press"
                    data-testid="button-opponent-td"
                  >
                    TD (+6)
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedGame) return;
                      const currentGame = games[selectedGame];
                      const prevScore = currentGame.opponentScore;
                      const gameId = selectedGame;
                      
                      // Update action history FIRST
                      setActionHistory(prev => [{
                        id: `opp-xp-${Date.now()}`,
                        gameId: gameId,
                        timestamp: Date.now(),
                        type: 'opponent_score' as const,
                        description: 'Opponent XP (+1)',
                        undo: async () => {
                          await updateGameMutation.mutateAsync({
                            id: gameId,
                            data: { opponentScore: prevScore },
                          });
                        },
                      }, ...prev].slice(0, 10));
                      
                      await updateGameMutation.mutateAsync({
                        id: gameId,
                        data: { 
                          opponentScore: prevScore + 1,
                          lastPlay: {
                            player: '',
                            action: '❌ OPPONENT XP',
                            emoji: '❌',
                            timestamp: Date.now(),
                          },
                        },
                      });
                    }}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-bold text-sm btn-press"
                    data-testid="button-opponent-xp"
                  >
                    XP (+1)
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedGame) return;
                      const currentGame = games[selectedGame];
                      const prevScore = currentGame.opponentScore;
                      const gameId = selectedGame;
                      
                      // Update action history FIRST
                      setActionHistory(prev => [{
                        id: `opp-2pt-${Date.now()}`,
                        gameId: gameId,
                        timestamp: Date.now(),
                        type: 'opponent_score' as const,
                        description: 'Opponent 2PT (+2)',
                        undo: async () => {
                          await updateGameMutation.mutateAsync({
                            id: gameId,
                            data: { opponentScore: prevScore },
                          });
                        },
                      }, ...prev].slice(0, 10));
                      
                      await updateGameMutation.mutateAsync({
                        id: gameId,
                        data: { 
                          opponentScore: prevScore + 2,
                          lastPlay: {
                            player: '',
                            action: '❌ OPPONENT 2PT',
                            emoji: '❌',
                            timestamp: Date.now(),
                          },
                        },
                      });
                    }}
                    className="flex-1 bg-amber-600 text-white py-2 rounded-xl font-bold text-sm btn-press"
                    data-testid="button-opponent-2pt"
                  >
                    2PT (+2)
                  </button>
                </div>
              </div>
            )}

            {/* QUICK PLAYS - Streamlined play entry for admin */}
            {viewMode === 'admin' && !currentGame?.isFinished && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                
                {/* MAIN MENU - Quick Play buttons (live games only) */}
                {playMode === 'none' && (
                  <>
                    {/* Half Tracker - Toggle between 1st and 2nd half */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={async () => {
                          if (!selectedGame) return;
                          const currentGame = games[selectedGame];
                          const nextHalf = currentGame.quarter === 1 ? 2 : 1;
                          const halfNames = ['', '1ST HALF', '2ND HALF'];
                          const lastPlay = {
                            player: 'GAME',
                            action: `${halfNames[nextHalf]} BEGINS`,
                            emoji: '📢',
                            timestamp: Date.now(),
                          };
                          await updateGameMutation.mutateAsync({
                            id: selectedGame,
                            data: { 
                              quarter: nextHalf, 
                              isHalftime: 0,
                              lastPlay,
                            },
                          });
                        }}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl font-black text-sm btn-press shadow-lg flex items-center justify-center gap-2"
                        data-testid="half-tracker"
                      >
                        <span className="text-lg">
                          {selectedGame && games[selectedGame] ? (
                            games[selectedGame].quarter === 1 ? '1st' : '2nd'
                          ) : '1st'}
                        </span>
                        <span className="text-xs opacity-80">HALF ▶</span>
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (!selectedGame) return;
                          const currentGame = games[selectedGame];
                          const isGoingToHalftime = !currentGame.isHalftime;
                          const lastPlay = {
                            player: 'GAME',
                            action: isGoingToHalftime ? 'HALFTIME' : '2ND HALF BEGINS',
                            emoji: isGoingToHalftime ? '⏸️' : '▶️',
                            timestamp: Date.now(),
                          };
                          await updateGameMutation.mutateAsync({
                            id: selectedGame,
                            data: { 
                              isHalftime: currentGame.isHalftime ? 0 : 1,
                              quarter: isGoingToHalftime ? currentGame.quarter : 2,
                              lastPlay,
                            },
                          });
                        }}
                        className={`px-4 py-2 rounded-xl font-black text-sm btn-press shadow-lg ${
                          selectedGame && games[selectedGame]?.isHalftime
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        data-testid="halftime-toggle"
                      >
                        {selectedGame && games[selectedGame]?.isHalftime ? '⏸️ HALFTIME' : '⏸️ HALF'}
                      </button>
                    </div>

                    {/* Possession & Down Tracker */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={async () => {
                          if (!selectedGame) return;
                          const newPossession = possession === 'offense' ? 'defense' : 'offense';
                          setPossession(newPossession);
                          if (newPossession === 'offense') {
                            resetToFirstDown();
                          }
                          await updateGameMutation.mutateAsync({
                            id: selectedGame,
                            data: { possession: newPossession },
                          });
                        }}
                        className={`px-4 py-3 rounded-xl font-bold text-sm btn-press shadow-md flex items-center justify-center gap-1 ${
                          possession === 'offense' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}
                        data-testid="toggle-possession"
                      >
                        {possession === 'offense' ? '🏈' : '🛡️'}
                      </button>
                      
                      {/* Down Tracker - only show when on offense */}
                      {possession === 'offense' && (
                        <button
                          onClick={() => advanceDown(selectedGame || undefined)}
                          disabled={updateGameMutation.isPending}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-base btn-press shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="down-tracker"
                        >
                          <span className="text-xl">
                            {currentDown === 1 ? '1st' : currentDown === 2 ? '2nd' : currentDown === 3 ? '3rd' : '4th'}
                          </span>
                          <span className="text-sm opacity-80">DOWN ▶</span>
                        </button>
                      )}
                      
                      {/* Defense indicator when on defense */}
                      {possession === 'defense' && (
                        <div className="flex-1 bg-orange-500/20 text-orange-700 py-3 rounded-xl font-bold text-base flex items-center justify-center">
                          🛡️ DEFENSE - Use THEM to record plays
                        </div>
                      )}
                    </div>

                    {/* Our plays - when we have the ball */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <button
                        onClick={async () => { 
                          setPlayMode('pass'); 
                          setPlayStep('selectQB'); 
                          setPossession('offense');
                          if (selectedGame) {
                            await updateGameMutation.mutateAsync({ id: selectedGame, data: { possession: 'offense' } });
                          }
                        }}
                        className="bg-purple-600 text-white py-5 rounded-xl font-black btn-press shadow-lg flex flex-col items-center gap-1"
                        data-testid="quick-pass-play"
                      >
                        <Target className="w-7 h-7" />
                        <span className="text-sm">PASS</span>
                      </button>
                      <button
                        onClick={async () => { 
                          setPlayMode('run'); 
                          setPlayStep('selectRunner'); 
                          setPossession('offense');
                          if (selectedGame) {
                            await updateGameMutation.mutateAsync({ id: selectedGame, data: { possession: 'offense' } });
                          }
                        }}
                        className="bg-teal-600 text-white py-5 rounded-xl font-black btn-press shadow-lg flex flex-col items-center gap-1"
                        data-testid="quick-run-play"
                      >
                        <Footprints className="w-7 h-7" />
                        <span className="text-sm">RUN</span>
                      </button>
                      <button
                        onClick={async () => { 
                          setPlayMode('opponent'); 
                          setPlayStep('opponentChoice'); 
                          setPossession('defense');
                          if (selectedGame) {
                            await updateGameMutation.mutateAsync({ id: selectedGame, data: { possession: 'defense' } });
                          }
                        }}
                        className="bg-gray-700 text-white py-5 rounded-xl font-black btn-press shadow-lg flex flex-col items-center gap-1"
                        data-testid="quick-opponent-play"
                      >
                        <Users className="w-7 h-7" />
                        <span className="text-sm">THEM</span>
                      </button>
                    </div>
                    
                    {/* Secondary actions row */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      <button
                        onClick={() => { setPlayMode('detailed'); setPlayStep('selectQB'); }}
                        className="bg-amber-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center gap-1"
                        data-testid="quick-conversion"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px]">XP/2PT</span>
                      </button>
                      <button
                        onClick={() => selectedGame && commitPunt(selectedGame, true)}
                        disabled={updateGameMutation.isPending}
                        className="bg-indigo-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center gap-1 disabled:opacity-50"
                        data-testid="quick-punt"
                      >
                        <Footprints className="w-4 h-4" />
                        <span className="text-[10px]">PUNT</span>
                      </button>
                      <button
                        onClick={() => { setPlayMode('penalty'); setPlayStep('penaltyChoice'); }}
                        className="bg-yellow-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center gap-1"
                        data-testid="quick-penalty"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px]">PENALTY</span>
                      </button>
                      <button
                        onClick={() => { setPlayMode('timeout'); }}
                        className={`${timeoutActive ? 'bg-green-500 animate-pulse' : 'bg-blue-500'} text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center gap-1`}
                        data-testid="quick-timeout"
                      >
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px]">{timeoutActive ? 'RESUME' : 'TIMEOUT'}</span>
                      </button>
                      <button
                        onClick={undoLastAction}
                        disabled={actionHistory.length === 0}
                        className="bg-gray-400 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center gap-1 disabled:opacity-40"
                        data-testid="quick-undo"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-[10px]">UNDO</span>
                      </button>
                    </div>

                    {/* More stats toggle */}
                    <div className="mb-4">
                      <button
                        onClick={() => setShowDetailedStats(!showDetailedStats)}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2"
                        data-testid="toggle-detailed-stats"
                      >
                        <BarChart3 className="w-5 h-5" />
                        {showDetailedStats ? 'HIDE STATS' : 'MORE STATS'}
                      </button>
                    </div>

                    {/* Voice Commentary */}
                    <div className="mb-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-purple-800">Coach Commentary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentGame?.coachCommentary && currentGame.coachCommentary.length > 0 && (
                            <button
                              onClick={() => setShowCommentary(!showCommentary)}
                              className="text-xs bg-white text-purple-600 px-3 py-1 rounded-full font-medium"
                              data-testid="toggle-commentary"
                            >
                              {showCommentary ? 'Hide' : `View (${currentGame.coachCommentary.length})`}
                            </button>
                          )}
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isTranscribing}
                            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center btn-press shadow-xl transition-all border-4 ${
                              isRecording 
                                ? 'bg-red-500 animate-pulse border-red-300' 
                                : isTranscribing 
                                  ? 'bg-gray-400 border-gray-300' 
                                  : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border-purple-300'
                            }`}
                            data-testid="mic-button"
                          >
                            {isTranscribing ? (
                              <Loader2 className="w-7 h-7 text-white animate-spin" />
                            ) : isRecording ? (
                              <MicOff className="w-7 h-7 text-white" />
                            ) : (
                              <Mic className="w-7 h-7 text-white" />
                            )}
                            <span className="text-[8px] font-bold text-white mt-0.5 uppercase">
                              {isRecording ? 'Stop' : 'Voice'}
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {isRecording && (
                        <div className="text-center text-sm text-red-600 font-medium animate-pulse">
                          🎙️ Recording... Tap to stop
                        </div>
                      )}
                      
                      {isTranscribing && (
                        <div className="text-center text-sm text-purple-600 font-medium">
                          Transcribing...
                        </div>
                      )}
                      
                      {/* Pending Voice Play Preview - Submit/Cancel before applying */}
                      {pendingVoicePlay && (
                        <div className="mt-3 bg-white rounded-xl border-2 border-purple-400 p-4 shadow-md" data-testid="pending-voice-play">
                          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Review Voice Play</p>
                          
                          {/* Share Card Preview - shows cleaned commentary */}
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 mb-3 border border-amber-200">
                            <p className="text-xs text-amber-600 font-bold mb-1">SHARE CARD:</p>
                            <p className="text-gray-900 font-medium text-base italic">
                              "{pendingVoicePlay.parsedPlay?.cleanedCommentary || pendingVoicePlay.parsedPlay?.tickerText || pendingVoicePlay.transcription}"
                            </p>
                          </div>
                          
                          {/* Detected play info */}
                          {pendingVoicePlay.parsedPlay && pendingVoicePlay.parsedPlay.playType !== 'unknown' && (
                            <div className="text-sm text-gray-600 mb-3">
                              <span className="font-medium">Detected:</span>{' '}
                              <span className="text-purple-700">
                                {pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'touchdown' ? '🏈 Touchdown Pass' :
                                 pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'catch' ? '🏈 Completion' :
                                 pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'firstDown' ? '🎯 First Down' :
                                 pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'incomplete' ? '❌ Incomplete' :
                                 pendingVoicePlay.parsedPlay.playType === 'pass' && pendingVoicePlay.parsedPlay.result === 'interception' ? '🔴 Interception' :
                                 pendingVoicePlay.parsedPlay.playType === 'run' && pendingVoicePlay.parsedPlay.result === 'touchdown' ? '🏃 Rushing TD' :
                                 pendingVoicePlay.parsedPlay.playType === 'run' ? '🏃 Run' :
                                 pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'flagPull' ? '🚩 Flag Pull' :
                                 pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'pick6' ? '🏆 PICK SIX!' :
                                 pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'interception' ? '🏆 Interception' :
                                 pendingVoicePlay.parsedPlay.playType === 'defense' && pendingVoicePlay.parsedPlay.result === 'sack' ? '💥 Sack' :
                                 pendingVoicePlay.parsedPlay.playType === 'conversion' && pendingVoicePlay.parsedPlay.result === 'extraPoint' ? '⭐ Extra Point' :
                                 pendingVoicePlay.parsedPlay.playType === 'conversion' && pendingVoicePlay.parsedPlay.result === 'twoPoint' ? '⭐ 2PT Conversion' :
                                 pendingVoicePlay.parsedPlay.playType}
                              </span>
                              {pendingVoicePlay.parsedPlay.qb && <span className="ml-2">QB: {pendingVoicePlay.parsedPlay.qb}</span>}
                              {pendingVoicePlay.parsedPlay.receiver && <span className="ml-2">→ {pendingVoicePlay.parsedPlay.receiver}</span>}
                              {pendingVoicePlay.parsedPlay.runner && <span className="ml-2">Runner: {pendingVoicePlay.parsedPlay.runner}</span>}
                              {pendingVoicePlay.parsedPlay.defender && <span className="ml-2">Defender: {pendingVoicePlay.parsedPlay.defender}</span>}
                            </div>
                          )}
                          
                          {pendingVoicePlay.parsedPlay?.playType === 'unknown' && (
                            <div className="text-sm text-orange-600 mb-3">
                              ⚠️ Could not parse play - will save as commentary only
                            </div>
                          )}
                          
                          {/* Submit / Cancel buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={confirmPendingPlay}
                              disabled={updateGameMutation.isPending}
                              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                              data-testid="button-confirm-voice-play"
                            >
                              <Check className="w-5 h-5" />
                              Submit
                            </button>
                            <button
                              onClick={cancelPendingPlay}
                              disabled={updateGameMutation.isPending}
                              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                              data-testid="button-cancel-voice-play"
                            >
                              <X className="w-5 h-5" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {showCommentary && currentGame?.coachCommentary && currentGame.coachCommentary.length > 0 && (
                        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                          {currentGame.coachCommentary.slice().reverse().map((c: { text: string; quarter: number; videoUrl?: string }, i: number) => (
                            <div key={i} className="bg-white rounded-lg p-2 text-sm">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-purple-500 font-medium">H{c.quarter}</span>
                                  {c.videoUrl && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">🎬 Video</span>
                                  )}
                                </div>
                                {c.videoUrl && (
                                  <button
                                    onClick={async () => {
                                      try {
                                        const videoLink = `${window.location.origin}/api/uploads/object/${encodeURIComponent(c.videoUrl!)}`;
                                        const shareText = `🏈 ${c.text}\n\nWatch: ${videoLink}`;
                                        
                                        if (navigator.share) {
                                          await navigator.share({ 
                                            title: 'Flag Football Highlight',
                                            text: shareText,
                                            url: videoLink
                                          });
                                        } else {
                                          await navigator.clipboard.writeText(shareText);
                                          alert('Link copied! Paste in a text message to share.');
                                        }
                                      } catch (err) {
                                        console.error('Share failed:', err);
                                      }
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                                    data-testid={`share-play-${i}`}
                                  >
                                    <Send className="w-3 h-3" />
                                    Text
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-700">{c.text}</p>
                              {c.videoUrl && (
                                <video 
                                  src={c.videoUrl}
                                  controls
                                  className="mt-2 rounded-lg w-full max-h-40 bg-black"
                                  preload="metadata"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Game controls */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => markGameFinal(selectedGame)}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold btn-press"
                        data-testid="button-final"
                      >
                        <Trophy className="w-5 h-5" /> FINAL
                      </button>
                      <button
                        onClick={() => resetGame(selectedGame)}
                        className="bg-gray-100 text-gray-500 px-4 py-3 rounded-xl btn-press"
                        data-testid="button-reset"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}

                {/* PASS PLAY FLOW */}
                {playMode === 'pass' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-purple-600">
                        {playStep === 'selectQB' ? '🏈 WHO THREW?' : 
                         playStep === 'selectReceiver' ? `${selectedQB} → WHO CAUGHT?` : 
                         `${selectedQB} → ${selectedReceiver}`}
                      </span>
                      <div className="w-12" />
                    </div>

                    {playStep === 'selectQB' && (
                      <div className="grid grid-cols-2 gap-3">
                        {roster.map((player) => (
                          <button
                            key={player}
                            onClick={() => { setSelectedQB(player); setPlayStep('selectReceiver'); }}
                            className="bg-purple-100 text-purple-700 py-4 rounded-xl font-bold btn-press text-sm"
                            data-testid={`pass-qb-${player}`}
                          >
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    )}

                    {playStep === 'selectReceiver' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {roster.filter(p => p !== selectedQB).map((player) => (
                            <button
                              key={player}
                              onClick={() => { setSelectedReceiver(player); setPlayStep('selectResult'); }}
                              className="bg-blue-100 text-blue-700 py-4 rounded-xl font-bold btn-press text-sm"
                              data-testid={`pass-receiver-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          <p className="text-xs text-gray-500 text-center font-semibold uppercase tracking-wide">Contested / No Catch</p>
                          <button
                            onClick={() => { setSelectedReceiver('FiftyFifty'); setPlayStep('selectTarget'); }}
                            className="w-full bg-amber-100 text-amber-700 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2"
                            data-testid="pass-fifty-fifty"
                          >
                            <Target className="w-5 h-5" /> 50-50 Ball
                          </button>
                          <button
                            onClick={() => { setSelectedReceiver('Incomplete'); setPlayStep('selectTarget'); }}
                            className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2"
                            data-testid="pass-incomplete"
                          >
                            <X className="w-5 h-5" /> Incomplete Pass
                          </button>
                          <button
                            onClick={() => { setSelectedReceiver('Interception'); setPlayStep('selectTarget'); }}
                            className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2"
                            data-testid="pass-interception"
                          >
                            <AlertTriangle className="w-5 h-5" /> Interception
                          </button>
                          <button
                            onClick={() => selectedGame && commitOpponentPickSix(selectedGame)}
                            disabled={updateGameMutation.isPending}
                            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                            data-testid="opponent-pick-six"
                          >
                            😤 PICK SIX AGAINST US (+6)
                          </button>
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          <p className="text-xs text-gray-500 text-center font-semibold uppercase tracking-wide">QB Turnover</p>
                          <button
                            onClick={() => selectedGame && commitPassPlay(selectedGame, 'qbFumble')}
                            disabled={updateGameMutation.isPending}
                            className="w-full bg-red-200 text-red-700 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                            data-testid="pass-qb-fumble"
                          >
                            <AlertTriangle className="w-5 h-5" /> QB Fumble
                          </button>
                          <button
                            onClick={() => selectedGame && commitPassPlay(selectedGame, 'sackFumble')}
                            disabled={updateGameMutation.isPending}
                            className="w-full bg-red-300 text-red-800 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                            data-testid="pass-sack-fumble"
                          >
                            <Zap className="w-5 h-5" /> Sack Fumble
                          </button>
                        </div>
                      </div>
                    )}

                    {playStep === 'selectTarget' && (
                      <div className="space-y-4">
                        <p className="text-center text-gray-600 font-semibold">
                          {selectedReceiver === 'FiftyFifty' ? 'Who went for the 50-50 ball?' : 'Who was the intended target?'}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {roster.filter(p => p !== selectedQB).map((player) => (
                            <button
                              key={player}
                              onClick={() => { 
                                if (selectedReceiver === 'FiftyFifty') {
                                  setSelectedRunner(player);
                                  setPlayStep('selectFiftyFiftyResult');
                                } else {
                                  selectedGame && commitPassPlay(selectedGame, selectedReceiver === 'Interception' ? 'interception' : 'incomplete', player);
                                }
                              }}
                              className={`py-4 rounded-xl font-bold btn-press text-sm ${
                                selectedReceiver === 'FiftyFifty' ? 'bg-amber-100 text-amber-700' :
                                selectedReceiver === 'Interception' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }`}
                              data-testid={`pass-target-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                        {selectedReceiver !== 'FiftyFifty' && (
                          <button
                            onClick={() => selectedGame && commitPassPlay(selectedGame, selectedReceiver === 'Interception' ? 'interception' : 'incomplete')}
                            className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold btn-press"
                            data-testid="pass-no-target"
                          >
                            No Specific Target
                          </button>
                        )}
                      </div>
                    )}

                    {playStep === 'selectFiftyFiftyResult' && (
                      <div className="space-y-4">
                        <p className="text-center text-gray-600 font-semibold">
                          50-50 to {playerFullNames[selectedRunner || ''] || selectedRunner} — Result?
                        </p>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'fiftyFiftyComplete', selectedRunner || undefined)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-green-500 text-white py-4 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="fifty-fifty-complete"
                        >
                          <Check className="w-5 h-5" /> CAUGHT IT! 💪
                        </button>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'fiftyFiftyIncomplete', selectedRunner || undefined)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-200 text-gray-600 py-4 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="fifty-fifty-incomplete"
                        >
                          <X className="w-5 h-5" /> Incomplete (Good Effort)
                        </button>
                      </div>
                    )}

                    {playStep === 'selectResult' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'touchdown')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-[#E51636] text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="pass-result-td"
                        >
                          <Trophy className="w-7 h-7" /> TOUCHDOWN! +6
                        </button>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'firstDown')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="pass-result-1d"
                        >
                          <FastForward className="w-6 h-6" /> FIRST DOWN
                        </button>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'complete')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="pass-result-complete"
                        >
                          <Check className="w-5 h-5" /> Complete
                        </button>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'incomplete')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="pass-result-incomplete"
                        >
                          <X className="w-4 h-4" /> Incomplete
                        </button>
                        <button
                          onClick={() => selectedGame && commitPassPlay(selectedGame, 'fumble')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="pass-result-fumble"
                        >
                          <AlertTriangle className="w-4 h-4" /> FUMBLE (After Catch)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* RUN PLAY FLOW */}
                {playMode === 'run' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-teal-600">
                        {playStep === 'selectRunner' ? '🏃 WHO RAN?' : `${selectedRunner} RAN`}
                      </span>
                      <div className="w-12" />
                    </div>

                    {playStep === 'selectRunner' && (
                      <div className="grid grid-cols-2 gap-3">
                        {roster.map((player) => (
                          <button
                            key={player}
                            onClick={() => { setSelectedRunner(player); setPlayStep('selectResult'); }}
                            className="bg-teal-100 text-teal-700 py-4 rounded-xl font-bold btn-press text-sm"
                            data-testid={`run-player-${player}`}
                          >
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    )}

                    {playStep === 'selectResult' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => selectedGame && commitRunPlay(selectedGame, 'touchdown')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-[#E51636] text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="run-result-td"
                        >
                          <Trophy className="w-7 h-7" /> TOUCHDOWN! +6
                        </button>
                        <button
                          onClick={() => selectedGame && commitRunPlay(selectedGame, 'firstDown')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="run-result-1d"
                        >
                          <FastForward className="w-6 h-6" /> FIRST DOWN
                        </button>
                        <button
                          onClick={() => selectedGame && commitRunPlay(selectedGame, 'run')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-teal-100 text-teal-700 py-4 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="run-result-run"
                        >
                          <Footprints className="w-5 h-5" /> RUN
                        </button>
                        <button
                          onClick={() => selectedGame && commitRunPlay(selectedGame, 'fumble')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="run-result-fumble"
                        >
                          <AlertTriangle className="w-5 h-5" /> FUMBLE
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* DEFENSE PLAY FLOW */}
                {playMode === 'defense' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-orange-600">
                        {playStep === 'selectDefender' ? '🛡️ WHO MADE THE PLAY?' : `${selectedDefender}`}
                      </span>
                      <div className="w-12" />
                    </div>

                    {playStep === 'selectDefender' && (
                      <div className="grid grid-cols-2 gap-3">
                        {roster.map((player) => (
                          <button
                            key={player}
                            onClick={() => { setSelectedDefender(player); setPlayStep('selectDefenseType'); }}
                            className="bg-orange-100 text-orange-700 py-4 rounded-xl font-bold btn-press text-sm"
                            data-testid={`defense-player-${player}`}
                          >
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    )}

                    {playStep === 'selectDefenseType' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => selectedGame && commitDefensePlay(selectedGame, 'flagPull')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="defense-flag"
                        >
                          <Flag className="w-6 h-6" /> FLAG PULL
                        </button>
                        <button
                          onClick={() => selectedGame && commitDefensePlay(selectedGame, 'interception')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="defense-int"
                        >
                          <Shield className="w-6 h-6" /> INTERCEPTION
                        </button>
                        <button
                          onClick={() => selectedGame && commitDefensePlay(selectedGame, 'sack')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="defense-sack"
                        >
                          <Zap className="w-6 h-6" /> SACK
                        </button>
                        <button
                          onClick={() => selectedGame && commitDefensePlay(selectedGame, 'forcedFumble')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="defense-fumble"
                        >
                          <AlertTriangle className="w-6 h-6" /> FORCED FUMBLE
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* CONVERSION / XP FLOW - QB → Receiver */}
                {playMode === 'detailed' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-amber-600">
                        {!conversionQB ? '🏈 WHO THREW?' : 
                         !conversionReceiver ? `${conversionQB} → WHO CAUGHT?` : 
                         `${conversionQB} → ${conversionReceiver}`}
                      </span>
                      <div className="w-12" />
                    </div>

                    {!conversionQB && (
                      <div className="grid grid-cols-2 gap-3">
                        {roster.map((player) => (
                          <button
                            key={player}
                            onClick={() => setConversionQB(player)}
                            className="bg-amber-100 text-amber-700 py-4 rounded-xl font-bold btn-press text-sm"
                            data-testid={`conversion-qb-${player}`}
                          >
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    )}

                    {conversionQB && !conversionReceiver && (
                      <div className="grid grid-cols-2 gap-3">
                        {roster.filter(p => p !== conversionQB).map((player) => (
                          <button
                            key={player}
                            onClick={() => setConversionReceiver(player)}
                            className="bg-blue-100 text-blue-700 py-4 rounded-xl font-bold btn-press text-sm"
                            data-testid={`conversion-receiver-${player}`}
                          >
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    )}

                    {conversionQB && conversionReceiver && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => selectedGame && conversionQB && conversionReceiver && commitConversion(selectedGame, 'extraPoint', conversionQB, conversionReceiver)}
                          disabled={updateGameMutation.isPending}
                          className="bg-amber-500 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex flex-col items-center gap-1 disabled:opacity-50"
                          data-testid="conversion-xp"
                        >
                          <Sparkles className="w-7 h-7" />
                          XP +1
                        </button>
                        <button
                          onClick={() => selectedGame && conversionQB && conversionReceiver && commitConversion(selectedGame, 'twoPoint', conversionQB, conversionReceiver)}
                          disabled={updateGameMutation.isPending}
                          className="bg-purple-600 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex flex-col items-center gap-1 disabled:opacity-50"
                          data-testid="conversion-2pt"
                        >
                          <Zap className="w-7 h-7" />
                          2PT +2
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* OPPONENT PLAY FLOW */}
                {playMode === 'opponent' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-gray-700">
                        {playStep === 'opponentChoice' ? '😤 OPPONENT PLAY' : 
                         playStep === 'opponentPassOutcome' ? '🎯 THEIR PASS' :
                         playStep === 'opponentRunOutcome' ? '🏃 THEIR RUN' :
                         playStep === 'opponentFirstDown' ? '📍 FIRST DOWN?' :
                         playStep === 'opponentConversion' ? '😤 THEIR TD!' :
                         playStep === 'selectDefenderAfterStop' ? '🛡️ WHO STOPPED THEM?' :
                         playStep === 'selectInterceptor' ? '🖐️ WHO GOT THE PICK?' :
                         playStep === 'selectSacker' ? '💥 WHO GOT THE SACK?' :
                         playStep === 'selectPickSixPlayer' ? '🏈 PICK SIX!' :
                         `${selectedDefender}`}
                      </span>
                      <div className="w-12" />
                    </div>

                    {playStep === 'opponentChoice' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setPlayStep('opponentPassOutcome')}
                            className="bg-purple-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex flex-col items-center justify-center gap-1"
                            data-testid="opponent-pass"
                          >
                            <Target className="w-6 h-6" />
                            PASS
                          </button>
                          <button
                            onClick={() => setPlayStep('opponentRunOutcome')}
                            className="bg-teal-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex flex-col items-center justify-center gap-1"
                            data-testid="opponent-run"
                          >
                            <Footprints className="w-6 h-6" />
                            RUN
                          </button>
                        </div>
                        <button
                          onClick={() => setPlayStep('opponentConversion')}
                          className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-td"
                        >
                          😤 THEIR TD
                        </button>
                        <button
                          onClick={() => setPlayStep('selectSacker')}
                          className="w-full bg-yellow-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-sack"
                        >
                          💥 WE SACKED THEM!
                        </button>
                        <button
                          onClick={() => selectedGame && commitPunt(selectedGame, false)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-indigo-500 text-white py-4 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="opponent-punt"
                        >
                          🦶 THEY PUNT
                        </button>
                      </div>
                    )}

                    {/* Opponent Pass Outcome */}
                    {playStep === 'opponentPassOutcome' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => setPlayStep('opponentConversion')}
                          className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-pass-td"
                        >
                          🏈 TOUCHDOWN
                        </button>
                        <button
                          onClick={() => setupOpponentPlay('pass')}
                          className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-pass-complete"
                        >
                          ✅ COMPLETE
                        </button>
                        <button
                          onClick={() => selectedGame && commitIncompletePass(selectedGame)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="opponent-pass-incomplete"
                        >
                          ❌ INCOMPLETE
                        </button>
                        <button
                          onClick={() => setPlayStep('selectInterceptor')}
                          className="w-full bg-green-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-pass-intercepted"
                        >
                          <Shield className="w-6 h-6" /> WE INTERCEPTED! 🖐️
                        </button>
                        <button
                          onClick={() => setPlayStep('selectPickSixPlayer')}
                          className="w-full bg-emerald-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="our-pick-six"
                        >
                          🏈 PICK SIX! 🎉
                        </button>
                      </div>
                    )}

                    {/* Opponent Run Outcome */}
                    {playStep === 'opponentRunOutcome' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => setPlayStep('opponentConversion')}
                          className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-run-td"
                        >
                          🏈 TOUCHDOWN
                        </button>
                        <button
                          onClick={() => setupOpponentPlay('run')}
                          className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-run-gain"
                        >
                          🏃 GAIN
                        </button>
                        <button
                          onClick={() => { setOpponentPlayContext(null); setPlayStep('selectDefenderAfterStop'); }}
                          className="w-full bg-green-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-run-stopped"
                        >
                          🛑 STOPPED
                        </button>
                      </div>
                    )}

                    {/* First Down Selection */}
                    {playStep === 'opponentFirstDown' && opponentPlayContext && (
                      <div className="space-y-3">
                        <p className="text-center text-gray-600 font-semibold mb-2">
                          {opponentPlayContext.type === 'pass' ? 'Their pass was complete.' : 'They gained yards.'}
                        </p>
                        <button
                          onClick={() => commitOpponentFirstDown(true)}
                          className="w-full bg-red-500 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-first-down-yes"
                        >
                          📍 FIRST DOWN
                        </button>
                        <button
                          onClick={() => commitOpponentFirstDown(false)}
                          className="w-full bg-gray-600 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3"
                          data-testid="opponent-first-down-no"
                        >
                          ➡️ NO FIRST DOWN
                        </button>
                      </div>
                    )}

                    {playStep === 'opponentConversion' && (
                      <div className="space-y-3">
                        <p className="text-center text-gray-500 font-semibold mb-2">Did they make the conversion?</p>
                        <button
                          onClick={() => selectedGame && commitOpponentTD(selectedGame, 0)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="opponent-td-no-conv"
                        >
                          TD ONLY (+6)
                        </button>
                        <button
                          onClick={() => selectedGame && commitOpponentTD(selectedGame, 1)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-600 text-white py-4 rounded-xl font-bold btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="opponent-td-xp"
                        >
                          TD + XP (+7)
                        </button>
                        <button
                          onClick={() => selectedGame && commitOpponentTD(selectedGame, 2)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="opponent-td-2pt"
                        >
                          TD + 2PT (+8)
                        </button>
                      </div>
                    )}

                    {/* Select Interceptor - dedicated flow for interceptions */}
                    {playStep === 'selectInterceptor' && (
                      <div className="space-y-4">
                        <p className="text-center text-green-700 font-bold text-lg">🖐️ WHO GOT THE PICK?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {roster.map((player) => (
                            <button
                              key={player}
                              onClick={() => selectedGame && commitDefensiveStop(selectedGame, 'interception', player)}
                              disabled={updateGameMutation.isPending}
                              className="bg-green-100 text-green-700 py-4 rounded-xl font-bold btn-press text-sm disabled:opacity-50"
                              data-testid={`interceptor-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Select Sacker - dedicated flow for sacks */}
                    {playStep === 'selectSacker' && (
                      <div className="space-y-4">
                        <p className="text-center text-yellow-700 font-bold text-lg">💥 WHO GOT THE SACK?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {roster.map((player) => (
                            <button
                              key={player}
                              onClick={() => selectedGame && commitDefensiveStop(selectedGame, 'sack', player)}
                              disabled={updateGameMutation.isPending}
                              className="bg-yellow-100 text-yellow-700 py-4 rounded-xl font-bold btn-press text-sm disabled:opacity-50"
                              data-testid={`sacker-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Select Pick Six Player - we intercept and take it to the house */}
                    {playStep === 'selectPickSixPlayer' && (
                      <div className="space-y-4">
                        <p className="text-center text-emerald-700 font-bold text-lg">🏈 WHO GOT THE PICK SIX?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {roster.map((player) => (
                            <button
                              key={player}
                              onClick={() => selectedGame && commitPickSix(selectedGame, player)}
                              disabled={updateGameMutation.isPending}
                              className="bg-emerald-100 text-emerald-700 py-4 rounded-xl font-bold btn-press text-sm disabled:opacity-50"
                              data-testid={`pick-six-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {playStep === 'selectDefenderAfterStop' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {roster.map((player) => (
                            <button
                              key={player}
                              onClick={() => { setSelectedDefender(player); setPlayStep('selectDefenseTypeAfterStop'); }}
                              className="bg-green-100 text-green-700 py-4 rounded-xl font-bold btn-press text-sm"
                              data-testid={`stop-defender-${player}`}
                            >
                              {playerFullNames[player] || player}
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          <p className="text-xs text-gray-500 text-center font-semibold uppercase tracking-wide">No Player Stop</p>
                          <button
                            onClick={() => selectedGame && commitSpecialDefensiveStop(selectedGame, 'outOfBounds')}
                            disabled={updateGameMutation.isPending}
                            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                            data-testid="stop-out-of-bounds"
                          >
                            <MapPin className="w-5 h-5" /> Out of Bounds
                          </button>
                          <button
                            onClick={() => selectedGame && commitSpecialDefensiveStop(selectedGame, 'fumble')}
                            disabled={updateGameMutation.isPending}
                            className="w-full bg-amber-100 text-amber-700 py-3 rounded-xl font-bold btn-press flex items-center justify-center gap-2 disabled:opacity-50"
                            data-testid="stop-fumble"
                          >
                            <AlertTriangle className="w-5 h-5" /> Fumble (Turnover)
                          </button>
                        </div>
                      </div>
                    )}

                    {playStep === 'selectDefenseTypeAfterStop' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => selectedGame && commitDefensiveStop(selectedGame, 'flagPull')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-lg btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="stop-flag"
                        >
                          <Flag className="w-6 h-6" /> FLAG PULL
                        </button>
                        <button
                          onClick={() => selectedGame && commitDefensiveStop(selectedGame, 'interception')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="stop-int"
                        >
                          <Shield className="w-6 h-6" /> INTERCEPTION
                        </button>
                        <button
                          onClick={() => selectedGame && commitDefensiveStop(selectedGame, 'sack')}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg btn-press shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          data-testid="stop-sack"
                        >
                          <Zap className="w-6 h-6" /> SACK
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* PENALTY FLOW */}
                {playMode === 'penalty' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-yellow-600">🚨 PENALTY</span>
                      <div className="w-12" />
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => selectedGame && commitPenalty(selectedGame, true)}
                        disabled={updateGameMutation.isPending}
                        className="w-full bg-yellow-500 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                        data-testid="penalty-us"
                      >
                        🚨 ON US
                      </button>
                      <button
                        onClick={() => selectedGame && commitPenalty(selectedGame, false)}
                        disabled={updateGameMutation.isPending}
                        className="w-full bg-gray-600 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                        data-testid="penalty-them"
                      >
                        🚨 ON THEM
                      </button>
                    </div>
                  </div>
                )}

                {/* TIMEOUT FLOW */}
                {playMode === 'timeout' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={resetPlayWizard} className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <span className="text-lg font-black text-blue-600">⏱️ TIMEOUT</span>
                      <div className="w-12" />
                    </div>

                    {timeoutActive ? (
                      <div className="space-y-3">
                        <div className="bg-blue-100 border-2 border-blue-500 rounded-xl p-4 text-center mb-4">
                          <p className="text-blue-700 font-bold text-lg animate-pulse">
                            ⏱️ {timeoutActive === 'us' ? 'OUR' : 'THEIR'} TIMEOUT IN PROGRESS
                          </p>
                        </div>
                        <button
                          onClick={() => selectedGame && endTimeout(selectedGame)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-green-600 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="timeout-end"
                        >
                          ▶️ END TIMEOUT
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => selectedGame && startTimeout(selectedGame, true)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-blue-500 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="timeout-us"
                        >
                          ⏱️ OUR TIMEOUT
                        </button>
                        <button
                          onClick={() => selectedGame && startTimeout(selectedGame, false)}
                          disabled={updateGameMutation.isPending}
                          className="w-full bg-gray-600 text-white py-5 rounded-xl font-black text-xl btn-press shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          data-testid="timeout-them"
                        >
                          ⏱️ THEIR TIMEOUT
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* DETAILED STATS - Collapsible for edge cases */}
                {showDetailedStats && playMode === 'none' && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">SELECT PLAYER FOR DETAILED STATS</p>
                    
                    {!selectedPlayer ? (
                      <div className="grid grid-cols-2 gap-2">
                        {roster.map((player) => (
                          <button
                            key={player}
                            onClick={() => setSelectedPlayer(player)}
                            className="py-3 px-3 rounded-xl text-left font-bold btn-press transition-all text-sm bg-gray-100 text-gray-900 hover:bg-gray-200 flex items-center gap-2"
                            data-testid={`detailed-select-${player}`}
                          >
                            <span className="bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded text-xs font-bold">#{playerInfo[player]?.jersey}</span>
                            {playerFullNames[player] || player}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => setSelectedPlayer(null)}
                            className="flex items-center gap-1 text-sm font-semibold text-gray-600"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                          </button>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="bg-[#E51636] text-white px-2 py-0.5 rounded font-bold text-sm">#{playerInfo[selectedPlayer]?.jersey}</span>
                              <span className="text-lg font-bold text-[#E51636]">{playerFullNames[selectedPlayer] || selectedPlayer}</span>
                            </div>
                            <p className="text-xs text-gray-500">{playerInfo[selectedPlayer]?.school} • Age {playerInfo[selectedPlayer]?.age}</p>
                          </div>
                          <div className="w-12" />
                        </div>

                        <div className="space-y-4">
                          {/* OFFENSE - Scoring plays */}
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Offense (adds to score)</p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => stageStat(selectedPlayer, 'touchdowns', 6, 'Touchdown!', '🏈')}
                                className="bg-[#E51636] text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-td`}
                              >
                                <Trophy className="w-5 h-5 mb-1" />
                                TD +6
                              </button>
                              <button
                                onClick={() => stageStat(selectedPlayer, 'extraPoints', 1, 'Extra Point', '✨')}
                                className="bg-[#E51636] text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-xp`}
                              >
                                <Sparkles className="w-5 h-5 mb-1" />
                                XP +1
                              </button>
                              <button
                                onClick={() => stageStat(selectedPlayer, 'twoPointConversions', 2, '2-Point Conv', '⚡')}
                                className="bg-[#E51636] text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-2pt`}
                              >
                                <Zap className="w-5 h-5 mb-1" />
                                2PT +2
                              </button>
                            </div>
                          </div>

                          {/* QB PASSING */}
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">QB Passing</p>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              <button
                                onClick={() => stageStat(selectedPlayer, 'completions', 0, 'Completion', '✅')}
                                className="bg-purple-400 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-comp`}
                              >
                                <Check className="w-5 h-5 mb-1" />
                                Complete
                              </button>
                              <button
                                onClick={() => stageStat(selectedPlayer, 'incompletes', 0, 'Incomplete', '❌')}
                                className="bg-gray-400 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-incomp`}
                              >
                                <X className="w-5 h-5 mb-1" />
                                Incomplete
                              </button>
                              <button
                                onClick={() => stageStat(selectedPlayer, 'drops', 0, 'Drop', '🫳')}
                                className="bg-gray-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-drop`}
                              >
                                <CircleSlash className="w-5 h-5 mb-1" />
                                Drop
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => stageStat(selectedPlayer, 'qbTouchdowns', 0, 'QB TD Pass', '🎯')}
                                className="bg-purple-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-qbtd`}
                              >
                                <Target className="w-5 h-5 mb-1" />
                                QB TD Pass
                              </button>
                              <button
                                onClick={() => stageStat(selectedPlayer, 'qbFirstDownThrows', 0, 'QB First Down!', '🎯')}
                                className="bg-purple-600 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-qb1d`}
                              >
                                <FastForward className="w-5 h-5 mb-1" />
                                QB 1st Down
                              </button>
                            </div>
                          </div>

                          {/* CATCHES */}
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Catches</p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => stageStat(selectedPlayer, 'catches', 0, 'Catch', '🙌')}
                                className="bg-blue-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-catch`}
                              >
                                <Hand className="w-5 h-5 mb-1" />
                                Catch
                              </button>
                              <button
                                onClick={() => {
                                  stageStat(selectedPlayer, 'catches', 0, 'Catch', '🙌', true);
                                  stageStat(selectedPlayer, 'catchFirstDowns', 0, 'Catch 1st Down!', '🎯');
                                }}
                                className="bg-blue-600 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-catch1d`}
                              >
                                <FastForward className="w-5 h-5 mb-1" />
                                Catch 1D
                              </button>
                              <button
                                onClick={() => {
                                  stageStat(selectedPlayer, 'catches', 0, 'Catch', '🙌', true);
                                  stageStat(selectedPlayer, 'touchdowns', 6, 'Catch TD!', '🏈');
                                }}
                                className="bg-blue-700 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                                data-testid={`button-${selectedPlayer}-catchtd`}
                              >
                                <Trophy className="w-5 h-5 mb-1" />
                                Catch TD
                              </button>
                            </div>
                          </div>

                      {/* RUNS */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Runs</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => stageStat(selectedPlayer, 'runs', 0, 'Run', '🏃')}
                            className="bg-teal-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-run`}
                          >
                            <Footprints className="w-5 h-5 mb-1" />
                            Run
                          </button>
                          <button
                            onClick={() => {
                              stageStat(selectedPlayer, 'runs', 0, 'Run', '🏃', true);
                              stageStat(selectedPlayer, 'firstDowns', 0, 'First Down!', '📍');
                            }}
                            className="bg-teal-600 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-run1d`}
                          >
                            <FastForward className="w-5 h-5 mb-1" />
                            Run 1D
                          </button>
                          <button
                            onClick={() => {
                              stageStat(selectedPlayer, 'runs', 0, 'Run', '🏃', true);
                              stageStat(selectedPlayer, 'touchdowns', 6, 'Run TD!', '🏈');
                            }}
                            className="bg-teal-700 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-runtd`}
                          >
                            <Trophy className="w-5 h-5 mb-1" />
                            Run TD
                          </button>
                        </div>
                      </div>

                      {/* DEFENSE */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Defense</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => stageStat(selectedPlayer, 'flagPulls', 0, 'Flag Pull', '🚩')}
                            className="bg-orange-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-flag`}
                          >
                            <Flag className="w-5 h-5 mb-1" />
                            Flag
                          </button>
                          <button
                            onClick={() => stageStat(selectedPlayer, 'interceptions', 0, 'Interception!', '🖐️')}
                            className="bg-green-500 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-int`}
                          >
                            <Shield className="w-5 h-5 mb-1" />
                            INT
                          </button>
                          <button
                            onClick={() => stageStat(selectedPlayer, 'sacks', 0, 'Sack!', '💥')}
                            className="bg-red-600 text-white py-4 rounded-xl font-bold btn-press shadow-md flex flex-col items-center"
                            data-testid={`button-${selectedPlayer}-sack`}
                          >
                            <Zap className="w-5 h-5 mb-1" />
                            Sack
                          </button>
                        </div>
                      </div>

                      {/* EDIT CURRENT STATS - Fix mistakes */}
                      {(() => {
                        const playerStats = currentGame?.stats[selectedPlayer] || {
                          touchdowns: 0, extraPoints: 0, twoPointConversions: 0, qbTouchdowns: 0,
                          catches: 0, flagPulls: 0, interceptions: 0, sacks: 0, runs: 0,
                          firstDowns: 0, qbFirstDownThrows: 0, catchFirstDowns: 0,
                          completions: 0, incompletes: 0, drops: 0
                        };
                        const hasAnyStats = playerStats && (
                          playerStats.touchdowns > 0 || playerStats.extraPoints > 0 || playerStats.twoPointConversions > 0 ||
                          playerStats.qbTouchdowns > 0 || playerStats.catches > 0 || playerStats.flagPulls > 0 ||
                          playerStats.interceptions > 0 || playerStats.sacks > 0 || (playerStats.runs || 0) > 0 ||
                          (playerStats.firstDowns || 0) > 0 || (playerStats.qbFirstDownThrows || 0) > 0 || (playerStats.catchFirstDowns || 0) > 0 ||
                          (playerStats.completions || 0) > 0 || (playerStats.incompletes || 0) > 0 || (playerStats.drops || 0) > 0
                        );
                        
                        return (
                          <div className="border-t border-gray-200 pt-4 mt-2">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">✏️ Edit Stats</p>
                            <div className="space-y-2">
                              {/* Scoring Stats */}
                              <div className="bg-[#E51636]/10 rounded-lg p-3">
                                <p className="text-xs font-bold text-[#E51636] mb-2">SCORING</p>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'touchdowns', 6)} disabled={(playerStats.touchdowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.touchdowns || 0} TD</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'touchdowns', 6)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'extraPoints', 1)} disabled={(playerStats.extraPoints || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.extraPoints || 0} XP</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'extraPoints', 1)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'twoPointConversions', 2)} disabled={(playerStats.twoPointConversions || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.twoPointConversions || 0} 2PT</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'twoPointConversions', 2)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                              {/* Receiving Stats */}
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs font-bold text-blue-600 mb-2">RECEIVING</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'catches', 0)} disabled={(playerStats.catches || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.catches || 0} CTH</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'catches', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'catchFirstDowns', 0)} disabled={(playerStats.catchFirstDowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.catchFirstDowns || 0} C1D</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'catchFirstDowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                              {/* Rushing Stats */}
                              <div className="bg-teal-50 rounded-lg p-3">
                                <p className="text-xs font-bold text-teal-600 mb-2">RUSHING</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'runs', 0)} disabled={(playerStats.runs || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.runs || 0} RUN</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'runs', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'firstDowns', 0)} disabled={(playerStats.firstDowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.firstDowns || 0} R1D</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'firstDowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                              {/* QB Stats */}
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs font-bold text-purple-600 mb-2">QUARTERBACK</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'qbTouchdowns', 0)} disabled={(playerStats.qbTouchdowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.qbTouchdowns || 0} QBTD</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'qbTouchdowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'qbFirstDownThrows', 0)} disabled={(playerStats.qbFirstDownThrows || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.qbFirstDownThrows || 0} QB1D</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'qbFirstDownThrows', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                              {/* Defense Stats */}
                              <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-xs font-bold text-orange-600 mb-2">DEFENSE</p>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'flagPulls', 0)} disabled={(playerStats.flagPulls || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.flagPulls || 0} FLG</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'flagPulls', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'interceptions', 0)} disabled={(playerStats.interceptions || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.interceptions || 0} INT</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'interceptions', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                                    <button onClick={() => removeStat(selectedGame, selectedPlayer, 'sacks', 0)} disabled={(playerStats.sacks || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                                    <span className="text-sm font-bold">{playerStats.sacks || 0} SCK</span>
                                    <button onClick={() => addStat(selectedGame, selectedPlayer, 'sacks', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        })()}

                      {/* MY HIGHLIGHTS - Player video clips */}
                      {(() => {
                        const playerStats = currentGame?.stats[selectedPlayer];
                        const highlights = playerStats?.highlights || [];
                        
                        if (highlights.length === 0) return null;
                        
                        return (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              MY HIGHLIGHTS ({highlights.length})
                            </p>
                            <div className="space-y-3">
                              {highlights.map((highlight, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-bold text-purple-800">{highlight.description}</p>
                                      <p className="text-xs text-purple-500">
                                        Half {highlight.quarter > 2 ? 2 : 1} • {new Date(highlight.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                      </p>
                                    </div>
                                    <button
                                      onClick={async () => {
                                        try {
                                          const videoLink = `${window.location.origin}/api/uploads/object/${encodeURIComponent(highlight.videoUrl)}`;
                                          const shareText = `${highlight.description}\n\nWatch: ${videoLink}`;
                                          
                                          if (navigator.share) {
                                            await navigator.share({ 
                                              title: highlight.description,
                                              text: shareText,
                                              url: videoLink
                                            });
                                          } else {
                                            await navigator.clipboard.writeText(shareText);
                                            alert('Link copied! Paste in a text message to share.');
                                          }
                                        } catch (err) {
                                          console.error('Share failed:', err);
                                        }
                                      }}
                                      className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                                      data-testid={`share-highlight-${idx}`}
                                    >
                                      <Share2 className="w-3 h-3" />
                                      Share
                                    </button>
                                  </div>
                                  <video
                                    src={highlight.videoUrl}
                                    controls
                                    playsInline
                                    className="w-full rounded-lg bg-black"
                                    style={{ maxHeight: '200px' }}
                                    onError={(e) => {
                                      const parent = (e.target as HTMLVideoElement).closest('.bg-gradient-to-r');
                                      if (parent) (parent as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      </div>
                    </>
                  )}
                  </div>
                )}
              </div>
            )}

            {/* EDIT PAST GAME STATS - Shows when admin is editing a finished game */}
            {viewMode === 'admin' && isEditingPastGame && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-sm border-2 border-amber-400 p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-amber-700 uppercase tracking-wide flex items-center gap-2">
                    ✏️ EDITING PAST GAME
                  </h3>
                  <button
                    onClick={() => setIsEditingPastGame(false)}
                    className="text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-full hover:bg-amber-300"
                  >
                    Done Editing
                  </button>
                </div>
                <p className="text-xs text-amber-600 mb-3">Tap a player to adjust their stats:</p>
                <div className="grid grid-cols-3 gap-2">
                  {roster.map((player) => {
                    const stats = getPlayerStats(currentGame?.stats, player);
                    const hasAnyStats = stats && (
                      stats.touchdowns > 0 || stats.catches > 0 || stats.flagPulls > 0 || 
                      stats.interceptions > 0 || stats.runs > 0
                    );
                    return (
                      <button
                        key={player}
                        onClick={() => setSelectedPlayer(selectedPlayer === player ? null : player)}
                        className={`py-2 px-2 rounded-xl text-left font-bold btn-press transition-all text-sm flex flex-col items-center gap-1 ${
                          selectedPlayer === player 
                            ? 'bg-amber-500 text-white ring-2 ring-amber-300' 
                            : hasAnyStats 
                              ? 'bg-white text-amber-700 border border-amber-300' 
                              : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        <span className={`text-xs font-bold ${selectedPlayer === player ? 'text-white' : 'text-gray-500'}`}>#{playerInfo[player]?.jersey}</span>
                        <span className="text-xs truncate w-full text-center">{player}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Selected player stat editing - All stats */}
                {selectedPlayer && selectedGame && (
                  <div className="mt-4 bg-white rounded-xl p-3 border border-amber-200" data-testid="edit-past-game-stats">
                    <p className="text-sm font-bold text-amber-700 mb-3">{playerFullNames[selectedPlayer] || selectedPlayer}</p>
                    <div className="space-y-3">
                      {/* Scoring */}
                      <div className="bg-red-50 rounded-lg p-2">
                        <p className="text-xs font-bold text-red-600 mb-2">SCORING</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'touchdowns', 6)} disabled={(currentGame?.stats[selectedPlayer]?.touchdowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30" data-testid="edit-td-minus"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.touchdowns || 0} TD</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'touchdowns', 6)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center" data-testid="edit-td-plus"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'extraPoints', 1)} disabled={(currentGame?.stats[selectedPlayer]?.extraPoints || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.extraPoints || 0} XP</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'extraPoints', 1)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'twoPointConversions', 2)} disabled={(currentGame?.stats[selectedPlayer]?.twoPointConversions || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.twoPointConversions || 0} 2PT</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'twoPointConversions', 2)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      {/* Receiving */}
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-xs font-bold text-blue-600 mb-2">RECEIVING</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'catches', 0)} disabled={(currentGame?.stats[selectedPlayer]?.catches || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.catches || 0} CTH</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'catches', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'catchFirstDowns', 0)} disabled={(currentGame?.stats[selectedPlayer]?.catchFirstDowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.catchFirstDowns || 0} C1D</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'catchFirstDowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      {/* Passing */}
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs font-bold text-purple-600 mb-2">PASSING (QB)</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'qbTouchdowns', 0)} disabled={(currentGame?.stats[selectedPlayer]?.qbTouchdowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.qbTouchdowns || 0} QTD</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'qbTouchdowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'qbFirstDownThrows', 0)} disabled={(currentGame?.stats[selectedPlayer]?.qbFirstDownThrows || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.qbFirstDownThrows || 0} Q1D</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'qbFirstDownThrows', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'completions', 0)} disabled={(currentGame?.stats[selectedPlayer]?.completions || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.completions || 0} CMP</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'completions', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'incompletes', 0)} disabled={(currentGame?.stats[selectedPlayer]?.incompletes || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.incompletes || 0} INC</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'incompletes', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      {/* Defense */}
                      <div className="bg-orange-50 rounded-lg p-2">
                        <p className="text-xs font-bold text-orange-600 mb-2">DEFENSE</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'flagPulls', 0)} disabled={(currentGame?.stats[selectedPlayer]?.flagPulls || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.flagPulls || 0} FLG</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'flagPulls', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'interceptions', 0)} disabled={(currentGame?.stats[selectedPlayer]?.interceptions || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.interceptions || 0} INT</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'interceptions', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'sacks', 0)} disabled={(currentGame?.stats[selectedPlayer]?.sacks || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.sacks || 0} SCK</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'sacks', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      {/* Rushing */}
                      <div className="bg-teal-50 rounded-lg p-2">
                        <p className="text-xs font-bold text-teal-600 mb-2">RUSHING</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'runs', 0)} disabled={(currentGame?.stats[selectedPlayer]?.runs || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.runs || 0} RUN</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'runs', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-2 py-1">
                            <button onClick={() => removeStat(selectedGame, selectedPlayer, 'firstDowns', 0)} disabled={(currentGame?.stats[selectedPlayer]?.firstDowns || 0) === 0} className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold">{currentGame?.stats[selectedPlayer]?.firstDowns || 0} R1D</span>
                            <button onClick={() => addStat(selectedGame, selectedPlayer, 'firstDowns', 0)} className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GAME STATS - Shows for everyone */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-500">📊 THIS GAME</h3>
                <button
                  onClick={shareGame}
                  className="flex items-center gap-1.5 bg-[#E51636] text-white px-3 py-1.5 rounded-lg text-xs font-bold btn-press"
                  data-testid="button-share-game"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Game
                </button>
              </div>
              <div className="space-y-3">
                {roster.map((player) => {
                  const stats = getPlayerStats(currentGame?.stats, player);
                  const points = ((stats?.touchdowns || 0) * 6) + (stats?.extraPoints || 0) + ((stats?.twoPointConversions || 0) * 2);
                  const hasAnyStats = stats && (
                    stats.touchdowns > 0 || stats.extraPoints > 0 || stats.twoPointConversions > 0 || 
                    stats.qbTouchdowns > 0 || stats.catches > 0 || stats.flagPulls > 0 || 
                    stats.interceptions > 0 || stats.sacks > 0 || (stats.runs || 0) > 0 || 
                    (stats.firstDowns || 0) > 0 || (stats.qbFirstDownThrows || 0) > 0 || (stats.catchFirstDowns || 0) > 0 ||
                    (stats.completions || 0) > 0 || (stats.incompletes || 0) > 0 || (stats.drops || 0) > 0
                  );
                  
                  // Hot Hand: 2+ catches OR 2+ flag pulls in current game
                  const isHotHand = stats && ((stats.catches || 0) >= 2 || (stats.flagPulls || 0) >= 2);
                  
                  return (
                    <div key={player} className={`p-3 rounded-xl relative ${
                      isHotHand 
                        ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 shadow-lg shadow-amber-200/50' 
                        : hasAnyStats 
                          ? 'bg-[#E51636]/5 border border-[#E51636]/10' 
                          : 'bg-gray-50'
                    }`} data-testid={`player-stats-${player}`}>
                      {/* Hot Hand Badge */}
                      {isHotHand && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-black shadow-lg animate-pulse flex items-center gap-1" data-testid={`hot-hand-${player}`}>
                          🔥 HOT
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${hasAnyStats ? 'bg-[#E51636] text-white' : 'bg-gray-300 text-gray-600'}`}>#{playerInfo[player]?.jersey}</span>
                            <span className={`font-bold ${isHotHand ? 'text-amber-700' : hasAnyStats ? 'text-[#E51636]' : 'text-gray-700'}`}>{playerFullNames[player] || player}</span>
                          </div>
                          {hasAnyStats && stats && (
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-0.5">{getBadge(stats)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {points > 0 && (
                            <span className="text-sm font-bold text-[#E51636] bg-[#E51636]/10 px-2 py-0.5 rounded-full">{points} pts</span>
                          )}
                          {hasAnyStats && (
                            <button
                              onClick={() => sharePlayer(player)}
                              className="p-1.5 rounded-lg bg-[#E51636] hover:bg-[#c41230] transition-colors"
                              data-testid={`button-share-${player}`}
                            >
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                      {hasAnyStats && stats && (
                        <p className="text-xs italic text-gray-600 mb-2">"{getMicroStory(stats)}"</p>
                      )}
                      {hasAnyStats ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {stats.touchdowns > 0 && (
                            <span className="bg-[#E51636] text-white px-2 py-1 rounded-full font-bold">{stats.touchdowns} TD</span>
                          )}
                          {stats.extraPoints > 0 && (
                            <span className="bg-amber-500 text-white px-2 py-1 rounded-full font-bold">{stats.extraPoints} XP</span>
                          )}
                          {stats.twoPointConversions > 0 && (
                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full font-bold">{stats.twoPointConversions} 2PT</span>
                          )}
                          {stats.qbTouchdowns > 0 && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full font-bold">{stats.qbTouchdowns} QB TD</span>
                          )}
                          {stats.catches > 0 && (
                            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full font-bold">{stats.catches} Catch</span>
                          )}
                          {stats.flagPulls > 0 && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full font-bold">{stats.flagPulls} Flag</span>
                          )}
                          {stats.interceptions > 0 && (
                            <span className="bg-indigo-500 text-white px-2 py-1 rounded-full font-bold">{stats.interceptions} INT</span>
                          )}
                          {stats.sacks > 0 && (
                            <span className="bg-rose-600 text-white px-2 py-1 rounded-full font-bold">{stats.sacks} Sack</span>
                          )}
                          {(stats.runs || 0) > 0 && (
                            <span className="bg-teal-500 text-white px-2 py-1 rounded-full font-bold">{stats.runs} Run</span>
                          )}
                          {(stats.firstDowns || 0) > 0 && (
                            <span className="bg-teal-600 text-white px-2 py-1 rounded-full font-bold">{stats.firstDowns} Run 1D</span>
                          )}
                          {(stats.qbFirstDownThrows || 0) > 0 && (
                            <span className="bg-purple-600 text-white px-2 py-1 rounded-full font-bold">{stats.qbFirstDownThrows} QB 1D</span>
                          )}
                          {(stats.catchFirstDowns || 0) > 0 && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full font-bold">{stats.catchFirstDowns} Catch 1D</span>
                          )}
                          {(stats.completions || 0) > 0 && (
                            <span className="bg-purple-400 text-white px-2 py-1 rounded-full font-bold">{stats.completions} Comp</span>
                          )}
                          {(stats.incompletes || 0) > 0 && (
                            <span className="bg-gray-400 text-white px-2 py-1 rounded-full font-bold">{stats.incompletes} Inc</span>
                          )}
                          {(stats.drops || 0) > 0 && (
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full font-bold">{stats.drops} Drop</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No stats yet</p>
                      )}
                      {/* Player Notes from Voice Commentary */}
                      {stats?.notes && stats.notes.length > 0 && (
                        <div className="mt-2 border-t border-gray-200 pt-2">
                          <p className="text-xs font-bold text-amber-600 mb-1">🎙️ Coach Notes</p>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {stats.notes.map((note: { text: string; quarter: number; timestamp: number }, i: number) => (
                              <p key={i} className="text-xs text-gray-600 bg-amber-50 rounded px-2 py-1">
                                <span className="text-amber-500 font-medium">H{note.quarter}:</span> {note.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* MY HIGHLIGHTS - Player video clips for spectators */}
                      {stats?.highlights && stats.highlights.length > 0 && (
                        <div className="mt-2 border-t border-gray-200 pt-2">
                          <button
                            onClick={() => setExpandedHighlights(expandedHighlights === player ? null : player)}
                            className="w-full flex items-center justify-between text-xs font-bold text-purple-600 mb-2"
                            data-testid={`toggle-highlights-${player}`}
                          >
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              MY HIGHLIGHTS ({stats.highlights.length})
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedHighlights === player ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedHighlights === player && (
                            <div className="space-y-3">
                              {stats.highlights.map((highlight: { videoUrl: string; description: string; timestamp: number; quarter: number }, idx: number) => (
                                <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-bold text-purple-800">{highlight.description}</p>
                                      <p className="text-xs text-purple-500">
                                        Half {highlight.quarter > 2 ? 2 : 1} • {new Date(highlight.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                      </p>
                                    </div>
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                          const videoLink = `${window.location.origin}/api/uploads/object/${encodeURIComponent(highlight.videoUrl)}`;
                                          const shareText = `${player}'s highlight: ${highlight.description}\n\nWatch: ${videoLink}`;
                                          
                                          if (navigator.share) {
                                            await navigator.share({ 
                                              title: `${player}'s Highlight`,
                                              text: shareText,
                                              url: videoLink
                                            });
                                          } else {
                                            await navigator.clipboard.writeText(shareText);
                                            alert('Link copied! Paste in a text message to share.');
                                          }
                                        } catch (err) {
                                          console.error('Share failed:', err);
                                        }
                                      }}
                                      className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                                      data-testid={`share-highlight-${player}-${idx}`}
                                    >
                                      <Share2 className="w-3 h-3" />
                                      Share
                                    </button>
                                  </div>
                                  <video
                                    src={highlight.videoUrl}
                                    controls
                                    playsInline
                                    className="w-full rounded-lg bg-black"
                                    style={{ maxHeight: '200px' }}
                                    onError={(e) => {
                                      const parent = (e.target as HTMLVideoElement).closest('.bg-gradient-to-r');
                                      if (parent) (parent as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                              <p className="text-xs text-center text-purple-400 italic">Tap Share to text the video link to yourself or others!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHARE GAME RECAP - Prominent button for spectators */}
            <div className="bg-gradient-to-r from-[#E51636] to-rose-600 rounded-2xl p-5 shadow-lg">
              <div className="text-center mb-3">
                <h3 className="text-white font-bold text-lg">📊 Game Recap</h3>
                <p className="text-white/80 text-sm">Share the full game summary with family & friends!</p>
              </div>
              <button
                onClick={shareGame}
                className="w-full bg-white text-[#E51636] py-4 rounded-xl font-bold flex items-center justify-center gap-2 btn-press shadow-md text-lg"
                data-testid="button-share-recap"
              >
                <Share2 className="w-6 h-6" />
                Share Game Recap
              </button>
            </div>

            {/* SEASON STATS LINK */}
            <Link 
              href="/season-stats"
              className="block bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 shadow-lg btn-press"
              data-testid="link-season-stats"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    🏆 Season Stats
                  </h3>
                  <p className="text-white/80 text-sm">View all-time player stats & leaderboards</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>

          </div>
        )}
      </main>

      <section className="max-w-lg mx-auto px-4 pb-8" data-testid="coach-promo-section">
        <div className="border-t border-gray-200 pt-6 mt-4">
          <h3 className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Meet Your Coaches</h3>
          
          <div className="space-y-3">
            <Link 
              href="/surfstung"
              className="block bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 btn-press"
              data-testid="card-surfstung"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={surfstungLogo} alt="Surfstung AI & Media" className="w-10 h-10 rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">Surfstung AI & Media</span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">Custom Digital Solutions</p>
                  <p className="text-white/50 text-xs">Custom apps, websites & AI solutions. Need to level up?</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">View</span>
                </div>
              </div>
            </Link>

            <Link 
              href="/pitch"
              className="block bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-4 btn-press"
              data-testid="button-share-pitch"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">Share with a Coach or Sponsor</span>
                  </div>
                  <p className="text-white/70 text-sm">Send this app to other coaches or potential sponsors</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">Share</span>
                </div>
              </div>
            </Link>

            <a 
              href="https://www.seabrookisland.com/real-estate/agents/john-halter/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-4 btn-press"
              data-testid="card-coach-john"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">Coach John Halter</span>
                  </div>
                  <p className="text-white/80 text-sm mb-2">Seabrook Island Real Estate / Realtor</p>
                  <p className="text-white/60 text-xs">Find your Lowcountry dream home on Seabrook Island</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-white text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">View</span>
                </div>
              </div>
            </a>

            <a 
              href="https://wells-compass--surfstungco.replit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 btn-press"
              data-testid="card-coach-chris"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">Coach Chris Wells</span>
                  </div>
                  <p className="text-white/80 text-sm mb-2">Licensed Professional Counselor</p>
                  <p className="text-white/60 text-xs">Helping individuals & families find healing and restoration</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">View</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Standings Modal - Dark Theme */}
      {showStandings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowStandings(false)}>
          <div className="bg-black rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-700/50" onClick={e => e.stopPropagation()}>
            {/* Header - Bronze/Brown theme */}
            <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-200" />
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>13.15 Boys -- James Island</h3>
                </div>
              </div>
              <button onClick={() => setShowStandings(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Table - Mobile optimized */}
            <div className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-900 to-amber-800">
                    <th className="text-left py-2 px-2 font-bold text-white border-r border-black/30 text-xs">Team</th>
                    <th className="text-center py-2 px-1 font-bold text-white border-r border-black/30 text-xs w-8">GP</th>
                    <th className="text-center py-2 px-1 font-bold text-white border-r border-black/30 text-xs w-8">PTS</th>
                    <th className="text-center py-2 px-1 font-bold text-white border-r border-black/30 text-xs w-8">W</th>
                    <th className="text-center py-2 px-1 font-bold text-white border-r border-black/30 text-xs w-8">L</th>
                    <th className="text-center py-2 px-1 font-bold text-white text-xs w-8">T</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueStandings.map((team, idx) => (
                    <tr 
                      key={team.team} 
                      className={`border-t-2 border-black ${team.isUs ? 'bg-[#E51636]/20' : idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-950'}`}
                    >
                      <td className={`py-3 px-2 font-bold text-sm border-r border-black/30 ${team.isUs ? 'text-[#E51636]' : 'text-white'}`}>
                        {team.team}
                      </td>
                      <td className="py-3 px-1 text-center text-white font-bold text-sm border-r border-black/30">{team.gp}</td>
                      <td className="py-3 px-1 text-center text-amber-400 font-black text-sm border-r border-black/30">{team.pts}</td>
                      <td className="py-3 px-1 text-center text-emerald-400 font-bold text-sm border-r border-black/30">{team.wins}</td>
                      <td className="py-3 px-1 text-center text-red-400 font-bold text-sm border-r border-black/30">{team.losses}</td>
                      <td className="py-3 px-1 text-center text-gray-400 font-bold text-sm">{team.ties}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 py-3 text-center bg-black border-t border-gray-800">3 pts for win • 1 pt for tie • 0 pts for loss</p>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal - Fullscreen video recording */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" data-testid="camera-modal">
          {/* Close button */}
          <button
            onClick={closeCameraModal}
            className="absolute top-4 left-4 z-10 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center"
            data-testid="camera-close-button"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* Recording timer */}
          <div className="absolute top-4 right-4 z-10 bg-black/50 px-4 py-2 rounded-full flex items-center gap-2">
            {isRecordingVideo && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className="text-white font-mono text-lg">
              {String(Math.floor(recordingDuration / 60)).padStart(2, '0')}:{String(recordingDuration % 60).padStart(2, '0')}
            </span>
            <span className="text-white/60 text-sm">/ 0:15</span>
          </div>
          
          {/* Video preview - full screen */}
          <video
            ref={videoPreviewRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            data-testid="camera-preview"
          />
          
          {/* Controls overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            {/* Pending play preview - show what stats will be logged */}
            {pendingVideoPlay ? (
              <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                <div className="text-center text-yellow-400 font-bold text-lg">
                  Confirm Stats
                </div>
                
                {/* Play breakdown */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-full space-y-2">
                  {/* Play type with emoji */}
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                    <span>{pendingVideoPlay.tickerEmoji}</span>
                    <span className="capitalize">{pendingVideoPlay.parsedPlay.result || pendingVideoPlay.parsedPlay.playType}</span>
                  </div>
                  
                  {/* Stat credits */}
                  <div className="space-y-1.5 text-sm">
                    {pendingVideoPlay.parsedPlay.qb && (
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                        <span className="text-white font-medium">{pendingVideoPlay.parsedPlay.qb}</span>
                        <span className="text-yellow-300">
                          {pendingVideoPlay.parsedPlay.result === 'incomplete' ? 'Incomplete' : 
                           pendingVideoPlay.parsedPlay.result === 'touchdown' ? 'QB TD' : 
                           pendingVideoPlay.parsedPlay.result === 'interception' ? 'Interception' : 'Completion'}
                        </span>
                      </div>
                    )}
                    {pendingVideoPlay.parsedPlay.receiver && (
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                        <span className="text-white font-medium">{pendingVideoPlay.parsedPlay.receiver}</span>
                        <span className="text-green-300">
                          {pendingVideoPlay.parsedPlay.result === 'touchdown' ? 'TD Catch' : 
                           pendingVideoPlay.parsedPlay.result === 'first_down' ? 'First Down' : 'Catch'}
                        </span>
                      </div>
                    )}
                    {pendingVideoPlay.parsedPlay.runner && (
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                        <span className="text-white font-medium">{pendingVideoPlay.parsedPlay.runner}</span>
                        <span className="text-blue-300">
                          {pendingVideoPlay.parsedPlay.result === 'touchdown' ? 'Rush TD' : 'Run'}
                        </span>
                      </div>
                    )}
                    {pendingVideoPlay.parsedPlay.defender && (
                      <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                        <span className="text-white font-medium">{pendingVideoPlay.parsedPlay.defender}</span>
                        <span className="text-purple-300">
                          {pendingVideoPlay.parsedPlay.opponentResult || 'Flag Pull'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Score change */}
                  {pendingVideoPlay.scoreChange > 0 && (
                    <div className="text-center text-green-400 font-bold mt-2">
                      +{pendingVideoPlay.scoreChange} Points!
                    </div>
                  )}
                </div>
                
                {/* Big Send to Feed button - same style as original */}
                <button
                  onClick={confirmPendingVideoPlay}
                  disabled={isUploadingVideo}
                  className="w-full py-5 bg-green-600 rounded-2xl flex items-center justify-center gap-3 font-bold text-white text-xl shadow-lg disabled:opacity-50"
                  data-testid="camera-confirm-button"
                >
                  {isUploadingVideo ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-7 h-7" />
                      SEND TO FEED
                    </>
                  )}
                </button>
                
                {/* Cancel/Retake row */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={cancelPendingVideoPlay}
                    disabled={isUploadingVideo}
                    className="flex-1 py-3 bg-red-600/80 rounded-xl flex items-center justify-center gap-2 text-white font-medium disabled:opacity-50"
                    data-testid="camera-cancel-button"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPendingVideoPlay(null);
                      setRecordedVideoBlob(null);
                      setRecordingDuration(0);
                    }}
                    disabled={isUploadingVideo}
                    className="flex-1 py-3 bg-gray-700 rounded-xl flex items-center justify-center gap-2 text-white disabled:opacity-50"
                    data-testid="camera-retake-button"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retake
                  </button>
                </div>
              </div>
            ) : recordedVideoBlob && !isRecordingVideo ? (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center text-green-400 font-bold text-lg mb-2">
                  Video ready! ({recordingDuration}s)
                </div>
                
                {/* Big Send to Feed button */}
                <button
                  onClick={sendVideoToFeed}
                  disabled={isUploadingVideo}
                  className="w-full max-w-xs py-5 bg-green-600 rounded-2xl flex items-center justify-center gap-3 font-bold text-white text-xl shadow-lg disabled:opacity-50"
                  data-testid="camera-send-button"
                >
                  {isUploadingVideo ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send className="w-7 h-7" />
                      SEND TO FEED
                    </>
                  )}
                </button>
                
                {/* Secondary buttons row */}
                <div className="flex gap-3 w-full max-w-xs">
                  {/* Stat Only button */}
                  <button
                    onClick={sendStatOnly}
                    disabled={isUploadingVideo}
                    className="flex-1 py-3 bg-blue-600 rounded-xl flex items-center justify-center gap-2 text-white font-medium disabled:opacity-50"
                    data-testid="camera-stat-only-button"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Stat Only
                  </button>
                  
                  {/* Retake button */}
                  <button
                    onClick={() => {
                      setRecordedVideoBlob(null);
                      setRecordingDuration(0);
                    }}
                    disabled={isUploadingVideo}
                    className="flex-1 py-3 bg-gray-700 rounded-xl flex items-center justify-center gap-2 text-white disabled:opacity-50"
                    data-testid="camera-retake-button"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retake
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {/* Record/Stop button */}
                <button
                  onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all ${
                    isRecordingVideo 
                      ? 'bg-red-600 border-white' 
                      : 'bg-red-500 border-white hover:bg-red-600'
                  }`}
                  data-testid="camera-record-button"
                >
                  {isRecordingVideo ? (
                    <div className="w-8 h-8 bg-white rounded-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-white" />
                  )}
                </button>
              </div>
            )}
            
            {/* Instructions */}
            {!recordedVideoBlob && !isRecordingVideo && (
              <p className="text-center text-white/70 text-sm mt-4">
                Tap the red button to start recording (max 15 seconds)
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default FlagFootballScorer;
