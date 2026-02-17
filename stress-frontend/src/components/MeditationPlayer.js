import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MeditationPlayer.css';

function MeditationPlayer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(false);

  const tracks = [
    {
      id: 1,
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 600,
      description: 'Calming ocean waves for deep relaxation and sleep',
      category: 'Nature',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cover: '🌊',
      mood: 'Calm',
      benefits: ['Reduces anxiety', 'Improves sleep', 'Deep relaxation'],
    },
    {
      id: 2,
      title: 'Forest Ambience',
      artist: 'Natural Harmony',
      duration: 900,
      description: 'Peaceful forest sounds with gentle birdsong',
      category: 'Nature',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
      cover: '🌲',
      mood: 'Peaceful',
      benefits: ['Stress relief', 'Mental clarity', 'Grounding'],
    },
    {
      id: 3,
      title: 'Guided Body Scan',
      artist: 'Dr. Sarah Mitchell',
      duration: 720,
      description: 'Progressive muscle relaxation meditation',
      category: 'Guided',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      cover: '🧘',
      mood: 'Focused',
      benefits: ['Body awareness', 'Tension release', 'Mindfulness'],
    },
    {
      id: 4,
      title: 'Rain & Thunder',
      artist: 'Storm Serenity',
      duration: 1200,
      description: 'Gentle rain with distant thunder for deep focus',
      category: 'Nature',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      color: '#607D8B',
      gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
      cover: '⛈️',
      mood: 'Contemplative',
      benefits: ['Enhanced focus', 'Sleep aid', 'Stress reduction'],
    },
    {
      id: 5,
      title: 'Mindful Breathing',
      artist: 'Mindfulness Institute',
      duration: 480,
      description: 'Guided breathing exercise for anxiety relief',
      category: 'Guided',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      color: '#FF5722',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      cover: '💨',
      mood: 'Energized',
      benefits: ['Anxiety relief', 'Emotional balance', 'Energy boost'],
    },
    {
      id: 6,
      title: 'Mountain Stream',
      artist: 'Zen Soundscapes',
      duration: 1080,
      description: 'Flowing mountain water for meditation',
      category: 'Nature',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      color: '#00BCD4',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      cover: '🏔️',
      mood: 'Refreshed',
      benefits: ['Mental clarity', 'Creativity boost', 'Rejuvenation'],
    },
    {
      id: 7,
      title: 'Deep Sleep Meditation',
      artist: 'Sleep Wellness Lab',
      duration: 1800,
      description: 'Progressive relaxation for restful sleep',
      category: 'Sleep',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      color: '#3F51B5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cover: '🌙',
      mood: 'Sleepy',
      benefits: ['Deep sleep', 'Insomnia relief', 'Dream enhancement'],
    },
    {
      id: 8,
      title: 'Morning Energizer',
      artist: 'Wellness Pro',
      duration: 360,
      description: 'Energizing meditation to start your day',
      category: 'Morning',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      cover: '☀️',
      mood: 'Motivated',
      benefits: ['Energy boost', 'Positive mindset', 'Motivation'],
    },
  ];

  const categories = ['All', 'Nature', 'Guided', 'Sleep', 'Morning'];

  const filteredTracks = activeCategory === 'All' 
    ? tracks 
    : tracks.filter(t => t.category === activeCategory);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('waiting', () => setIsBuffering(true));
      audioRef.current.addEventListener('playing', () => setIsBuffering(false));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isMuted, isLooping]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnd = () => {
    if (!isLooping) {
      handleSkip('next');
    }
  };

  const handlePlayPause = () => {
    if (!selectedTrack) {
      handleTrackSelect(tracks[0]);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track) => {
    const wasPlaying = isPlaying;
    setSelectedTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        setTimeout(() => {
          audioRef.current.play();
          setIsPlaying(true);
        }, 100);
      }
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleSkip = (direction) => {
    if (!selectedTrack) return;
    
    const currentIndex = filteredTracks.findIndex(t => t.id === selectedTrack.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredTracks.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? filteredTracks.length - 1 : currentIndex - 1;
    }
    
    handleTrackSelect(filteredTracks[newIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return duration ? (currentTime / duration) * 100 : 0;
  };

  return (
    <div className="meditation-pro-page" style={{
      background: selectedTrack?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="meditation-overlay"></div>
      
      <div className="meditation-pro-container">
        <button onClick={() => navigate('/dashboard')} className="btn-back-pro">
          <span className="back-icon">←</span> Dashboard
        </button>

        <div className="player-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${showPlaylist ? 'show' : 'hide'}`}>
            <div className="sidebar-header">
              <h2>🎵 Meditation Library</h2>
              <button className="toggle-sidebar" onClick={() => setShowPlaylist(!showPlaylist)}>
                {showPlaylist ? '◀' : '▶'}
              </button>
            </div>

            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="track-list-pro">
              {filteredTracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`track-item ${selectedTrack?.id === track.id ? 'active' : ''}`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="track-number">{index + 1}</div>
                  <div className="track-cover" style={{ background: track.gradient }}>
                    {track.cover}
                  </div>
                  <div className="track-details">
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                  </div>
                  <div className="track-time">{formatTime(track.duration)}</div>
                  {selectedTrack?.id === track.id && isPlaying && (
                    <div className="playing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Player */}
          <main className="main-player">
            {selectedTrack ? (
              <>
                <div className="now-playing-section">
                  <div className="album-artwork">
                    <div className="artwork-inner" style={{ background: selectedTrack.gradient }}>
                      <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
                        <div className="vinyl-center">
                          <span className="vinyl-icon">{selectedTrack.cover}</span>
                        </div>
                      </div>
                    </div>
                    {isBuffering && <div className="buffering-spinner"></div>}
                  </div>

                  <div className="track-info-main">
                    <div className="track-meta">
                      <span className="mood-badge">{selectedTrack.mood}</span>
                      <span className="category-badge">{selectedTrack.category}</span>
                    </div>
                    <h1 className="track-title">{selectedTrack.title}</h1>
                    <p className="track-artist">{selectedTrack.artist}</p>
                    <p className="track-description">{selectedTrack.description}</p>
                    
                    <div className="benefits-list">
                      <h4>✨ Benefits:</h4>
                      <div className="benefits-tags">
                        {selectedTrack.benefits.map((benefit, i) => (
                          <span key={i} className="benefit-tag">{benefit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="player-controls-section">
                  <div className="progress-section">
                    <span className="time-current">{formatTime(currentTime)}</span>
                    <div 
                      className="progress-bar-pro" 
                      ref={progressRef}
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="progress-fill-pro" 
                        style={{ width: `${getProgress()}%` }}
                      >
                        <div className="progress-thumb"></div>
                      </div>
                    </div>
                    <span className="time-total">{formatTime(duration)}</span>
                  </div>

                  <div className="controls-main">
                    <button 
                      className={`control-btn loop-btn ${isLooping ? 'active' : ''}`}
                      onClick={() => setIsLooping(!isLooping)}
                      title="Loop"
                    >
                      🔁
                    </button>

                    <button className="control-btn skip-btn" onClick={() => handleSkip('prev')}>
                      ⏮️
                    </button>

                    <button className="control-btn play-btn-pro" onClick={handlePlayPause}>
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <button className="control-btn skip-btn" onClick={() => handleSkip('next')}>
                      ⏭️
                    </button>

                    <button className="control-btn shuffle-btn" title="Shuffle">
                      🔀
                    </button>
                  </div>

                  <div className="volume-section">
                    <button className="volume-btn" onClick={toggleMute}>
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (isMuted) setIsMuted(false);
                      }}
                      className="volume-slider-pro"
                    />
                    <span className="volume-label">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎵</div>
                <h2>Welcome to Meditation Studio</h2>
                <p>Select a track from the library to begin your journey</p>
                <button className="btn-start" onClick={() => handleTrackSelect(tracks[0])}>
                  Start with Ocean Waves
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}

export default MeditationPlayer;