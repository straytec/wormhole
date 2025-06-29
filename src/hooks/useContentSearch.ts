import { useQuery } from '@tanstack/react-query';

interface ContentCandidate {
  id: string;
  title: string;
  type: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
  imageUrl: string;
  year?: string;
  creator?: string;
  description?: string;
}

const searchMovies = async (title: string): Promise<ContentCandidate[]> => {
  try {
    // Using TMDB API for movies
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=demo_key&query=${encodeURIComponent(title)}`
    );
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      return getMockMovies(title);
    }
    
    const data = await response.json();
    
    return data.results?.slice(0, 3).map((movie: any) => ({
      id: `movie-${movie.id}`,
      title: movie.title,
      type: 'movie' as const,
      imageUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: movie.release_date?.split('-')[0],
      creator: movie.director || 'Unknown Director',
      description: movie.overview
    })) || [];
  } catch (error) {
    console.warn('Movie API failed, using mock data:', error);
    return getMockMovies(title);
  }
};

const getMockMovies = (title: string): ContentCandidate[] => {
  const mockMovies = [
    {
      id: 'movie-1',
      title: 'Interstellar',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2014',
      creator: 'Christopher Nolan',
      description: 'A team of explorers travel through a wormhole in space...'
    },
    {
      id: 'movie-2',
      title: 'Inception',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/3095769/pexels-photo-3095769.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2010',
      creator: 'Christopher Nolan',
      description: 'A thief who steals corporate secrets through dream-sharing technology...'
    },
    {
      id: 'movie-3',
      title: 'The Dark Knight',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2008',
      creator: 'Christopher Nolan',
      description: 'Batman faces the Joker in this dark superhero epic...'
    },
    {
      id: 'movie-4',
      title: 'Tenet',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2020',
      creator: 'Christopher Nolan',
      description: 'A secret agent embarks on a dangerous mission involving time inversion...'
    },
    {
      id: 'movie-5',
      title: 'Oppenheimer',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2023',
      creator: 'Christopher Nolan',
      description: 'The story of J. Robert Oppenheimer and the development of the atomic bomb...'
    },
    {
      id: 'movie-6',
      title: 'Dune',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2021',
      creator: 'Denis Villeneuve',
      description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset...'
    },
    {
      id: 'movie-7',
      title: 'Arrival',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/3095769/pexels-photo-3095769.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2016',
      creator: 'Denis Villeneuve',
      description: 'A linguist works with the military to communicate with alien lifeforms...'
    },
    {
      id: 'movie-8',
      title: 'Blade Runner 2049',
      type: 'movie' as const,
      imageUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2017',
      creator: 'Denis Villeneuve',
      description: 'A young blade runner discovers a secret that could plunge society into chaos...'
    }
  ];

  // Return all mock movies for broader search results
  return mockMovies;
};

const searchBooks = async (title: string): Promise<ContentCandidate[]> => {
  try {
    // Using Google Books API
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=3`
    );
    
    if (!response.ok) {
      return getMockBooks(title);
    }
    
    const data = await response.json();
    
    return data.items?.map((book: any) => ({
      id: `book-${book.id}`,
      title: book.volumeInfo.title,
      type: 'book' as const,
      imageUrl: book.volumeInfo.imageLinks?.thumbnail || 
        'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: book.volumeInfo.publishedDate?.split('-')[0],
      creator: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
      description: book.volumeInfo.description
    })) || [];
  } catch (error) {
    console.warn('Books API failed, using mock data:', error);
    return getMockBooks(title);
  }
};

const getMockBooks = (title: string): ContentCandidate[] => {
  const mockBooks = [
    {
      id: 'book-1',
      title: 'Dune',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1965',
      creator: 'Frank Herbert',
      description: 'A science fiction novel about desert planet Arrakis...'
    },
    {
      id: 'book-2',
      title: 'Dune Messiah',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1969',
      creator: 'Frank Herbert',
      description: 'The sequel to Dune, continuing Paul Atreides\' story...'
    },
    {
      id: 'book-3',
      title: 'Children of Dune',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1976',
      creator: 'Frank Herbert',
      description: 'The third book in the Dune series...'
    },
    {
      id: 'book-4',
      title: 'God Emperor of Dune',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1981',
      creator: 'Frank Herbert',
      description: 'The fourth book in the Dune series...'
    },
    {
      id: 'book-5',
      title: 'Heretics of Dune',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1984',
      creator: 'Frank Herbert',
      description: 'The fifth book in the Dune series...'
    },
    {
      id: 'book-6',
      title: 'Chapterhouse: Dune',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1985',
      creator: 'Frank Herbert',
      description: 'The sixth and final book in the original Dune series...'
    },
    {
      id: 'book-7',
      title: 'Foundation',
      type: 'book' as const,
      imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1951',
      creator: 'Isaac Asimov',
      description: 'The first novel in Asimov\'s Foundation series...'
    }
  ];

  // Return all mock books for broader search results
  return mockBooks;
};

const searchAlbums = async (title: string): Promise<ContentCandidate[]> => {
  // For now, return mock data since Spotify API requires authentication
  const mockAlbums = [
    {
      id: 'album-1',
      title: 'Abbey Road',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1969',
      creator: 'The Beatles',
      description: 'The Beatles\' penultimate studio album featuring the famous medley...'
    },
    {
      id: 'album-2',
      title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1967',
      creator: 'The Beatles',
      description: 'Groundbreaking concept album that changed popular music...'
    },
    {
      id: 'album-3',
      title: 'Revolver',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1966',
      creator: 'The Beatles',
      description: 'Innovative album showcasing The Beatles\' studio experimentation...'
    },
    {
      id: 'album-4',
      title: 'Rubber Soul',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1965',
      creator: 'The Beatles',
      description: 'Transitional album marking The Beatles\' artistic maturation...'
    },
    {
      id: 'album-5',
      title: 'The White Album',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1968',
      creator: 'The Beatles',
      description: 'Double album showcasing the band\'s diverse musical styles...'
    },
    {
      id: 'album-6',
      title: 'The Dark Side of the Moon',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1973',
      creator: 'Pink Floyd',
      description: 'Progressive rock masterpiece...'
    },
    {
      id: 'album-7',
      title: 'OK Computer',
      type: 'album' as const,
      imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '1997',
      creator: 'Radiohead',
      description: 'Alternative rock album exploring themes of modern alienation...'
    }
  ];

  // Return all mock albums for broader search results
  return mockAlbums;
};

const searchStudyingContent = async (title: string): Promise<ContentCandidate[]> => {
  // Mock studying content - could integrate with educational APIs like Coursera, edX, etc.
  const mockStudying = [
    {
      id: 'study-1',
      title: 'React Complete Course',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Tech Academy',
      description: 'Complete React development course from basics to advanced...'
    },
    {
      id: 'study-2',
      title: 'Machine Learning Fundamentals',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'AI Institute',
      description: 'Introduction to machine learning concepts and applications...'
    },
    {
      id: 'study-3',
      title: 'Data Structures & Algorithms',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Computer Science Academy',
      description: 'Master fundamental data structures and algorithms...'
    },
    {
      id: 'study-4',
      title: 'Digital Marketing Strategy',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Marketing Pro',
      description: 'Learn modern digital marketing techniques and strategies...'
    },
    {
      id: 'study-5',
      title: 'Photography Masterclass',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Visual Arts School',
      description: 'Master the art of photography from composition to post-processing...'
    },
    {
      id: 'study-6',
      title: 'Spanish Language Course',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Language Institute',
      description: 'Learn Spanish from beginner to conversational level...'
    },
    {
      id: 'study-7',
      title: 'Financial Planning & Investment',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Finance Academy',
      description: 'Learn personal finance, budgeting, and investment strategies...'
    },
    {
      id: 'study-8',
      title: 'UX/UI Design Principles',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Design Studio',
      description: 'Master user experience and interface design fundamentals...'
    },
    {
      id: 'study-9',
      title: 'Advanced Python Programming',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Code Academy',
      description: 'Deep dive into advanced Python concepts and frameworks...'
    },
    {
      id: 'study-10',
      title: 'Blockchain & Cryptocurrency',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Crypto Institute',
      description: 'Understanding blockchain technology and digital currencies...'
    },
    {
      id: 'study-11',
      title: 'Creative Writing Workshop',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Writers Guild',
      description: 'Develop your storytelling skills and creative voice...'
    },
    {
      id: 'study-12',
      title: 'Data Science with R',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Statistics Academy',
      description: 'Statistical analysis and data visualization using R programming...'
    },
    {
      id: 'study-13',
      title: 'Mindfulness & Meditation',
      type: 'studying' as const,
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Wellness Center',
      description: 'Learn meditation techniques for stress reduction and mental clarity...'
    }
  ];

  // Return a subset of studying content for broader search results
  return mockStudying.slice(0, 2);
};

const searchWorkContent = async (title: string): Promise<ContentCandidate[]> => {
  // Mock work content - could integrate with project management tools, GitHub, etc.
  const mockWork = [
    {
      id: 'work-1',
      title: 'E-commerce Platform',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Development Team',
      description: 'Full-stack e-commerce platform with React and Node.js...'
    },
    {
      id: 'work-2',
      title: 'Mobile App Design System',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Design Team',
      description: 'Comprehensive design system for mobile applications...'
    },
    {
      id: 'work-3',
      title: 'API Documentation Portal',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Backend Team',
      description: 'Interactive API documentation and testing portal...'
    },
    {
      id: 'work-4',
      title: 'Marketing Campaign Analytics',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Marketing Analytics Team',
      description: 'Data visualization dashboard for marketing campaign performance...'
    },
    {
      id: 'work-5',
      title: 'Customer Support Chatbot',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'AI Development Team',
      description: 'Intelligent chatbot for automated customer support...'
    },
    {
      id: 'work-6',
      title: 'Inventory Management System',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Operations Team',
      description: 'Real-time inventory tracking and management system...'
    },
    {
      id: 'work-7',
      title: 'Brand Identity Redesign',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Creative Team',
      description: 'Complete brand identity redesign including logo and guidelines...'
    },
    {
      id: 'work-8',
      title: 'Data Migration Project',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Database Team',
      description: 'Large-scale data migration from legacy systems to cloud...'
    },
    {
      id: 'work-9',
      title: 'Security Audit & Compliance',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Security Team',
      description: 'Comprehensive security audit and compliance implementation...'
    },
    {
      id: 'work-10',
      title: 'Employee Training Platform',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'HR Technology Team',
      description: 'Interactive platform for employee onboarding and training...'
    }
    ,
    {
      id: 'work-11',
      title: 'Cloud Infrastructure Migration',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'DevOps Team',
      description: 'Complete migration of legacy systems to cloud infrastructure...'
    },
    {
      id: 'work-12',
      title: 'Social Media Management Tool',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Social Media Team',
      description: 'Comprehensive tool for managing multiple social media accounts...'
    },
    {
      id: 'work-13',
      title: 'Performance Analytics Dashboard',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Analytics Team',
      description: 'Real-time performance monitoring and analytics dashboard...'
    },
    {
      id: 'work-14',
      title: 'Mobile Banking App',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'FinTech Team',
      description: 'Secure mobile banking application with biometric authentication...'
    },
    {
      id: 'work-15',
      title: 'Content Management System',
      type: 'work' as const,
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      creator: 'Content Team',
      description: 'Headless CMS for managing content across multiple platforms...'
    }
  ];

  // Return a subset of work content for broader search results
  return mockWork.slice(0, 2);
};

export const useContentSearch = (title: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['content-search', title],
    queryFn: async () => {
      if (!title.trim()) return [];
      
      console.log('Searching for:', title);
      
      const [movies, books, albums, studying, work] = await Promise.all([
        searchMovies(title),
        searchBooks(title),
        searchAlbums(title),
        searchStudyingContent(title),
        searchWorkContent(title),
      ]);
      
      const results = [...movies, ...books, ...albums, ...studying, ...work];
      console.log('Search results:', results);
      
      return results;
    },
    enabled: enabled && !!title.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};