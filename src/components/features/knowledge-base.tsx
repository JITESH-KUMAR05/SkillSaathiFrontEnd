'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FolderIcon,
  StarIcon,
  TagIcon,
  CalendarIcon,
  PlusIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  favorite: boolean;
  lastAccessed: string;
  source: 'scanned' | 'manual' | 'ai-generated';
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Quadratic Formula Derivation',
    content: 'The quadratic formula x = (-b ± √(b²-4ac)) / 2a is derived from completing the square method...',
    category: 'Mathematics',
    tags: ['algebra', 'equations', 'formula'],
    favorite: true,
    lastAccessed: '2024-01-15T10:30:00Z',
    source: 'scanned'
  },
  {
    id: '2',
    title: 'Hindi Poetry Analysis',
    content: 'कबीर के दोहे में गूढ़ अर्थ छिपे होते हैं। "बुरा जो देखन मैं चला" का विश्लेषण...',
    category: 'Literature',
    tags: ['hindi', 'poetry', 'kabir'],
    favorite: false,
    lastAccessed: '2024-01-14T15:20:00Z',
    source: 'manual'
  },
  {
    id: '3',
    title: 'Physics Laws Summary',
    content: 'Newton\'s three laws of motion form the foundation of classical mechanics...',
    category: 'Physics',
    tags: ['mechanics', 'newton', 'laws'],
    favorite: true,
    lastAccessed: '2024-01-13T09:15:00Z',
    source: 'ai-generated'
  },
  {
    id: '4',
    title: 'Chemical Bonding Notes',
    content: 'Ionic bonds form between metals and non-metals through electron transfer...',
    category: 'Chemistry',
    tags: ['bonding', 'ionic', 'covalent'],
    favorite: false,
    lastAccessed: '2024-01-12T14:45:00Z',
    source: 'scanned'
  }
];

const CATEGORIES = [
  { name: 'All', count: KNOWLEDGE_ITEMS.length },
  { name: 'Mathematics', count: KNOWLEDGE_ITEMS.filter(item => item.category === 'Mathematics').length },
  { name: 'Literature', count: KNOWLEDGE_ITEMS.filter(item => item.category === 'Literature').length },
  { name: 'Physics', count: KNOWLEDGE_ITEMS.filter(item => item.category === 'Physics').length },
  { name: 'Chemistry', count: KNOWLEDGE_ITEMS.filter(item => item.category === 'Chemistry').length },
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [items, setItems] = useState(KNOWLEDGE_ITEMS);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || item.favorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'scanned': return '📷';
      case 'manual': return '✍️';
      case 'ai-generated': return '🤖';
      default: return '📄';
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="space-y-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-teal-50 text-teal-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FolderIcon className="w-4 h-4" />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Favorites only</span>
          </label>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              Items ({filteredItems.length})
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded">
              <PlusIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getSourceIcon(item.source)}</span>
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {item.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <StarIcon className={`w-4 h-4 ${item.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No items found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedItem ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getSourceIcon(selectedItem.source)}</span>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h1>
                    <button
                      onClick={() => toggleFavorite(selectedItem.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <StarIcon className={`w-5 h-5 ${selectedItem.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FolderIcon className="w-4 h-4" />
                      <span>{selectedItem.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Last accessed {new Date(selectedItem.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl">
                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <TagIcon className="w-4 h-4" />
                    <span>Tags</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedItem.content}
                    </div>
                  </div>
                </div>

                {/* Related Items */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items
                      .filter(item => 
                        item.id !== selectedItem.id && 
                        (item.category === selectedItem.category || 
                         item.tags.some(tag => selectedItem.tags.includes(tag)))
                      )
                      .slice(0, 4)
                      .map(item => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="p-4 bg-white rounded-lg border hover:border-teal-300 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span>{getSourceIcon(item.source)}</span>
                            <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {item.content.substring(0, 80)}...
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookmarkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Item</h3>
              <p className="text-gray-600">
                Choose an item from your knowledge base to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
