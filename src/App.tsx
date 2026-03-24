/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Filter, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';
import { Game, Category } from './types';

const CATEGORIES: Category[] = ['All', 'Action', 'Puzzle', 'Sports', 'Retro', 'Strategy'];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const filteredGames = useMemo(() => {
    return gamesData.filter((game: Game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b-4 border-black p-6 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 bg-[#FFD700] z-40 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveGame(null)}>
          <div className="bg-black p-3 brutal-border group-hover:bg-white transition-colors">
            <Gamepad2 className="text-[#00FF00] w-8 h-8 group-hover:text-black" />
          </div>
          <h1 className="font-display text-4xl uppercase tracking-tighter group-hover:text-white transition-colors">UG_HUB</h1>
        </div>

        <div className="flex-1 max-w-xl w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="SEARCH GAMES..."
            className="w-full pl-12 pr-4 py-3 brutal-border font-bold placeholder:text-black/50 outline-none focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map((cat, idx) => {
            const colors = ['bg-[#FF00FF]', 'bg-[#00FFFF]', 'bg-[#FFFF00]', 'bg-[#7FFF00]', 'bg-[#FF4500]', 'bg-[#1E90FF]'];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-bold uppercase text-sm brutal-border whitespace-nowrap transition-transform hover:-translate-y-1 active:translate-y-0 ${
                  selectedCategory === cat ? colors[idx % colors.length] : 'bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 bg-[#6A5ACD] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        
        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key="game-player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[1600px] mx-auto w-full"
            >
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="font-display text-7xl uppercase leading-none">{activeGame.title}</h2>
                  <p className="font-bold text-black/60 mt-2 uppercase tracking-wider text-xl">{activeGame.category}</p>
                </div>
                <button
                  onClick={() => setActiveGame(null)}
                  className="p-4 brutal-border bg-white hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-10 h-10" />
                </button>
              </div>

              <div className="relative aspect-video brutal-border bg-black overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <iframe
                  src={activeGame.url}
                  className="w-full h-full border-none"
                  title={activeGame.title}
                  allowFullScreen
                />
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 p-10 brutal-border bg-white">
                  <h3 className="font-display text-4xl mb-6 uppercase">Description</h3>
                  <p className="text-xl leading-relaxed font-medium">{activeGame.description}</p>
                </div>
                <div className="p-10 brutal-border" style={{ backgroundColor: activeGame.color || '#00FF00' }}>
                  <h3 className="font-display text-4xl mb-6 uppercase">Controls</h3>
                  <ul className="space-y-4 font-bold uppercase text-lg">
                    <li>[W,A,S,D] - Move</li>
                    <li>[SPACE] - Action</li>
                    <li>[ESC] - Pause</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 max-w-[1800px] mx-auto"
            >
              {filteredGames.length > 0 ? (
                filteredGames.map((game: Game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveGame(game)}
                    className="group cursor-pointer"
                  >
                    <div className="brutal-border bg-white overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
                      <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-bold text-xs uppercase brutal-border" style={{ color: game.color || '#00FF00' }}>
                          {game.category}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-display text-3xl uppercase mb-2 transition-colors" style={{ color: 'black' }}>
                          <span className="group-hover:underline" style={{ textDecorationColor: game.color || 'black' }}>{game.title}</span>
                        </h3>
                        <p className="text-sm font-medium text-black/70 line-clamp-2 mb-4">
                          {game.description}
                        </p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="font-display text-xl">0{index + 1}</span>
                          <div className="bg-black text-white p-2 brutal-border transition-colors">
                            <Maximize2 className="w-5 h-5" style={{ color: game.color || '#00FF00' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <h2 className="font-display text-6xl uppercase opacity-20">No Games Found</h2>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black p-12 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-6xl uppercase mb-6 tracking-tighter">UG_HUB</h2>
            <p className="text-xl font-medium text-white/60 max-w-md">
              The ultimate destination for unblocked web entertainment. 
              Built for speed, designed for gamers.
            </p>
          </div>
          <div>
            <h4 className="font-display text-2xl uppercase mb-6 text-[#00FF00]">Quick Links</h4>
            <ul className="space-y-4 font-bold uppercase text-sm">
              <li className="hover:text-[#00FF00] cursor-pointer">About Us</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Terms of Service</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#00FF00] cursor-pointer">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-2xl uppercase mb-6 text-[#00FF00]">Stats</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold uppercase text-sm">1.2M+ Monthly Players</span>
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5" />
                <span className="font-bold uppercase text-sm">500+ Games Catalog</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/10 text-center font-bold uppercase text-xs tracking-widest text-white/40">
          © 2026 UNBLOCKED GAMES HUB • ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
