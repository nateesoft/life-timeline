import React, { useState, useEffect } from 'react';
import { Book, Movie, Sport } from '../types';

interface MediaSportsSectionProps {
  books: Book[];
  movies: Movie[];
  sports: Sport[];
  onAddBook: () => void;
  onAddMovie: () => void;
  onAddSport: () => void;
  onEditBook: (book: Book) => void;
  onEditMovie: (movie: Movie) => void;
  onEditSport: (sport: Sport) => void;
  onRemoveBook: (id: number) => void;
  onRemoveMovie: (id: number) => void;
  onRemoveSport: (id: number) => void;
}

const MediaSportsSection: React.FC<MediaSportsSectionProps> = ({
  books,
  movies,
  sports,
  onAddBook,
  onAddMovie,
  onAddSport,
  onEditBook,
  onEditMovie,
  onEditSport,
  onRemoveBook,
  onRemoveMovie,
  onRemoveSport
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'movies' | 'sports'>('books');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'expert':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'reading':
      case 'watching':
      case 'advanced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'want_to_read':
      case 'want_to_watch':
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'dropped':
      case 'beginner':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string, type: 'book' | 'movie' | 'sport') => {
    if (type === 'sport') {
      const sportStatusMap = {
        'beginner': 'เริ่มต้น',
        'intermediate': 'ปานกลาง',
        'advanced': 'ขั้นสูง',
        'expert': 'เชี่ยวชาญ'
      };
      return sportStatusMap[status as keyof typeof sportStatusMap] || status;
    }

    const statusMap = {
      'reading': 'กำลังอ่าน',
      'watching': 'กำลังดู',
      'completed': 'เสร็จแล้ว',
      'want_to_read': 'อยากอ่าน',
      'want_to_watch': 'อยากดู',
      'dropped': 'หยุดแล้ว'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          ({rating}/5)
        </span>
      </div>
    );
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-white truncate">
            {book.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            โดย {book.author}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col space-y-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}
              >
                {getStatusText(book.status, 'book')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {book.genre} • {book.pages} หน้า
              </span>
            </div>
            <div className="text-right">
              {renderStars(book.rating)}
              {book.finishDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  อ่านเสร็จ: {new Date(book.finishDate).toLocaleDateString('th-TH')}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onEditBook(book)}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="แก้ไข"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onRemoveBook(book.id)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="ลบ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-white truncate">
            {movie.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ผู้กำกับ {movie.director}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col space-y-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(movie.status)}`}
              >
                {getStatusText(movie.status, 'movie')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {movie.genre} • {movie.year} • {movie.duration} นาที
              </span>
            </div>
            <div className="text-right">
              {renderStars(movie.rating)}
              {movie.watchDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ดูเมื่อ: {new Date(movie.watchDate).toLocaleDateString('th-TH')}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onEditMovie(movie)}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="แก้ไข"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onRemoveMovie(movie.id)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="ลบ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const SportCard: React.FC<{ sport: Sport }> = ({ sport }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-white truncate">
            {sport.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {sport.type === 'individual' ? 'กีฬาเดี่ยว' : 'กีฬาทีม'} • {sport.category}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col space-y-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sport.skillLevel)}`}
              >
                {getStatusText(sport.skillLevel, 'sport')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ความถี่: {sport.frequency}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                เริ่มเล่น: {new Date(sport.startDate).toLocaleDateString('th-TH')}
              </p>
              {sport.endDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  หยุดเล่น: {new Date(sport.endDate).toLocaleDateString('th-TH')}
                </p>
              )}
              {sport.location && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  สถานที่: {sport.location}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onEditSport(sport)}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="แก้ไข"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onRemoveSport(sport.id)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="ลบ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const getTabStats = () => {
    const bookStats = {
      total: books.length,
      completed: books.filter(b => b.status === 'completed').length,
      reading: books.filter(b => b.status === 'reading').length
    };

    const movieStats = {
      total: movies.length,
      completed: movies.filter(m => m.status === 'completed').length,
      watching: movies.filter(m => m.status === 'watching').length
    };

    const sportStats = {
      total: sports.length,
      active: sports.filter(s => !s.endDate).length,
      expert: sports.filter(s => s.skillLevel === 'expert').length
    };

    return { bookStats, movieStats, sportStats };
  };

  const { bookStats, movieStats, sportStats } = getTabStats();

  return (
    <div className="mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                สื่อและกีฬา
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                หนังสือ หนัง และกีฬาที่คุณชื่นชอบ
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'books'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            📚 หนังสือ ({bookStats.total})
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'movies'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            🎬 หนัง ({movieStats.total})
          </button>
          <button
            onClick={() => setActiveTab('sports')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'sports'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            ⚽ กีฬา ({sportStats.total})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {activeTab === 'books' && (
            <>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {bookStats.completed}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">อ่านเสร็จ</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {bookStats.reading}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">กำลังอ่าน</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                  {books.filter(b => b.status === 'want_to_read').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">อยากอ่าน</div>
              </div>
            </>
          )}
          
          {activeTab === 'movies' && (
            <>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {movieStats.completed}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ดูเสร็จ</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {movieStats.watching}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">กำลังดู</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                  {movies.filter(m => m.status === 'want_to_watch').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">อยากดู</div>
              </div>
            </>
          )}
          
          {activeTab === 'sports' && (
            <>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {sportStats.active}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">กำลังเล่น</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {sportStats.expert}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">เชี่ยวชาญ</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                  {sports.filter(s => s.frequency === 'daily').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">เล่นทุกวัน</div>
              </div>
            </>
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              if (activeTab === 'books') onAddBook();
              else if (activeTab === 'movies') onAddMovie();
              else if (activeTab === 'sports') onAddSport();
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>
              เพิ่ม{activeTab === 'books' ? 'หนังสือ' : activeTab === 'movies' ? 'หนัง' : 'กีฬา'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'books' && (
            <>
              {books.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    ยังไม่มีหนังสือ เริ่มเพิ่มหนังสือที่คุณอ่านหรืออยากอ่านกันเถอะ!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'movies' && (
            <>
              {movies.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    ยังไม่มีหนัง เริ่มเพิ่มหนังที่คุณดูหรืออยากดูกันเถอะ!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movies
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'sports' && (
            <>
              {sports.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">⚽</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    ยังไม่มีกีฬา เริ่มเพิ่มกีฬาที่คุณเล่นหรืออยากเล่นกันเถอะ!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sports
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((sport) => (
                      <SportCard key={sport.id} sport={sport} />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaSportsSection;