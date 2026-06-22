// C:\Users\Administrator\Desktop\linkchemtwo\components\ItemsDisplay.tsx
/*'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    format: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ItemsDisplayProps {
  limit?: number;
  showViewAll?: boolean;
}

export function ItemsDisplay({ limit = 6, showViewAll = true }: ItemsDisplayProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items?page=1&limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
          setItems(data.data);
        } else {
          setError(data.error || 'Failed to fetch items');
        }
      } catch (err) {
        setError('Error loading items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md border border-[var(--card-border)] animate-pulse">
            <div className="aspect-video bg-[var(--soft-gray)]"></div>
            <div className="p-4 space-y-2">
              <div className="h-6 bg-[var(--soft-gray)] rounded w-3/4"></div>
              <div className="h-4 bg-[var(--soft-gray)] rounded w-full"></div>
              <div className="h-4 bg-[var(--soft-gray)] rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No items available yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="group bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] hover:-translate-y-1"
          >
            <div className="relative aspect-video overflow-hidden bg-[var(--soft-gray)]">
              {item.images && item.images.length > 0 && (
                <Image
                  src={item.images[0].url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              )}
              {item.images && item.images.length > 1 && (
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  +{item.images.length - 1} more
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[var(--dark-text)] dark:text-[var(--light-text)] line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                  {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && items.length >= limit && (
        <div className="text-center mt-8">
          <a
            href="/images"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors"
          >
            View All Items
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}*/

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    format: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ItemsDisplayProps {
  limit?: number;
  showViewAll?: boolean;
}

export function ItemsDisplay({ 
  limit = 8, 
  showViewAll = true,
}: ItemsDisplayProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items?page=1&limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
          setItems(data.data);
        } else {
          setError(data.error || 'Failed to fetch items');
        }
      } catch (err) {
        setError('Error loading items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(Math.min(limit, 8))].map((_, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md border border-[var(--card-border)] animate-pulse"
          >
            <div className="aspect-square bg-[var(--soft-gray)]"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-[var(--soft-gray)] rounded w-3/4"></div>
              <div className="h-4 bg-[var(--soft-gray)] rounded w-full"></div>
              <div className="h-4 bg-[var(--soft-gray)] rounded w-2/3"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-[var(--soft-gray)] rounded w-1/3"></div>
                <div className="h-3 bg-[var(--soft-gray)] rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--soft-gray)] mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
          No items available yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Items will appear here once they are created
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="group bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] hover:-translate-y-1 hover:border-[var(--brand-300)]"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--soft-gray)]">
              {item.images && item.images.length > 0 ? (
                <>
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  {item.images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      +{item.images.length - 1}
                    </span>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-[var(--soft-gray)]">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[var(--dark-text)] dark:text-[var(--light-text)] line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-xs bg-[var(--soft-gray)] px-2.5 py-1 rounded-full dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {item.images.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && items.length >= limit && (
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            View All Items
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}