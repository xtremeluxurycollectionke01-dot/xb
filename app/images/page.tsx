/*'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import './images.css';

interface ImageData {
  id: string;
  url: string;
  optimizedUrl: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 24,
    total: 0,
    hasMore: false,
    nextCursor: null,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchImages = useCallback(async (page: number, cursor?: string | null) => {
    try {
      const url = cursor 
        ? `/api/images?page=${page}&limit=24&cursor=${cursor}`
        : `/api/images?page=${page}&limit=24`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setImages((prev) => [...prev, ...data.images]);
        setPagination(data.pagination);
        return data;
      } else {
        setError(data.error || 'Failed to fetch images');
        return null;
      }
    } catch (err) {
      setError('Error loading images');
      console.error(err);
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchImages(1);
      setLoading(false);
    };
    loadInitial();
  }, [fetchImages]);

  // Load more on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && pagination.hasMore) {
          const loadMore = async () => {
            setLoadingMore(true);
            await fetchImages(pagination.page + 1, pagination.nextCursor);
            setLoadingMore(false);
          };
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, pagination, fetchImages]);

  if (loading && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
          Image Gallery
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showing {images.length} of {pagination.total} images
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No images found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--card-border)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--soft-gray)]">
                  <Image
                    src={image.optimizedUrl}
                    alt={image.filename || 'Image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized // Cloudinary handles optimization
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                      {image.format?.toUpperCase()}
                    </span>
                    <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                      {image.width}×{image.height}
                    </span>
                    <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                      {(image.size / 1024).toFixed(0)}KB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load more trigger *
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
            )}
            {!pagination.hasMore && images.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You've seen all {pagination.total} images
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}*/

// C:\Users\Administrator\Desktop\linkchemtwo\app\images\page.tsx
/*'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import './images.css';

interface ImageData {
  id: string;
  url: string;
  optimizedUrl: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}

interface ItemFormData {
  name: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    format: string;
    size: number;
  }[];
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 24,
    total: 0,
    hasMore: false,
    nextCursor: null,
  });

  // Selection state
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    images: [],
  });

  // State for items view
  const [showItemsView, setShowItemsView] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch images from Cloudinary
  const fetchImages = useCallback(async (page: number, cursor?: string | null) => {
    try {
      const url = cursor 
        ? `/api/images?page=${page}&limit=24&cursor=${cursor}`
        : `/api/images?page=${page}&limit=24`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setImages((prev) => [...prev, ...data.images]);
        setPagination(data.pagination);
        return data;
      } else {
        setError(data.error || 'Failed to fetch images');
        return null;
      }
    } catch (err) {
      setError('Error loading images');
      console.error(err);
      return null;
    }
  }, []);

  // Fetch items from MongoDB
  const fetchItems = useCallback(async () => {
    try {
      setItemsLoading(true);
      const response = await fetch('/api/items?page=1&limit=100');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchImages(1);
      setLoading(false);
    };
    loadInitial();
    fetchItems();
  }, [fetchImages, fetchItems]);

  // Load more on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && pagination.hasMore) {
          const loadMore = async () => {
            setLoadingMore(true);
            await fetchImages(pagination.page + 1, pagination.nextCursor);
            setLoadingMore(false);
          };
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, pagination, fetchImages]);

  // Toggle image selection
  const toggleImageSelection = (imageId: string, imageData: ImageData) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // Select all images
  const selectAllImages = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      const allIds = new Set(images.map(img => img.id));
      setSelectedImages(allIds);
    }
  };

  // Open drawer with selected images
  const openCreateDrawer = () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image');
      return;
    }

    const selectedImageData = images
      .filter(img => selectedImages.has(img.id))
      .map(img => ({
        url: img.url,
        public_id: img.id,
        format: img.format,
        size: img.size,
      }));

    setFormData({
      name: '',
      description: '',
      images: selectedImageData,
    });
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ name: '', description: '', images: [] });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Item created successfully!');
        closeDrawer();
        setSelectedImages(new Set());
        await fetchItems();
        // Refresh images to update selection
        setImages([]);
        await fetchImages(1);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an item
  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchItems();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      {/* Header with toggle and actions *
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
              {showItemsView ? 'Items Collection' : 'Image Gallery'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {showItemsView 
                ? `${items.length} items created` 
                : `Showing ${images.length} of ${pagination.total} images`
              }
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setShowItemsView(!showItemsView);
                if (showItemsView) {
                  // Clear selection when switching to images
                  setSelectedImages(new Set());
                }
              }}
              className="px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors"
            >
              {showItemsView ? 'View Images' : 'View Items'}
            </button>
            
            {!showItemsView && (
              <>
                <button
                  onClick={selectAllImages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                </button>
                
                <button
                  onClick={openCreateDrawer}
                  className="px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Item ({selectedImages.size})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items View *
      {showItemsView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No items created yet</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--card-border)]"
              >
                <div className="relative aspect-video overflow-hidden bg-[var(--soft-gray)]">
                  {item.images && item.images.length > 0 && (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      className="object-cover"
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
                  <h3 className="font-semibold text-lg text-[var(--dark-text)] dark:text-[var(--light-text)] truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Images Grid *
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => {
              const isSelected = selectedImages.has(image.id);
              return (
                <div
                  key={image.id}
                  className={`group bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-[var(--brand-500)] shadow-lg scale-[1.02]' 
                      : 'border-[var(--card-border)] hover:border-[var(--brand-300)]'
                  } cursor-pointer`}
                  onClick={() => toggleImageSelection(image.id, image)}
                >
                  <div className="relative aspect-square overflow-hidden bg-[var(--soft-gray)]">
                    <Image
                      src={image.optimizedUrl}
                      alt={image.filename || 'Image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--brand-500)]/20 flex items-center justify-center">
                        <div className="bg-[var(--brand-500)] text-white rounded-full p-2">
                          <Check className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {image.format?.toUpperCase()}
                      </span>
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {image.width}×{image.height}
                      </span>
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {(image.size / 1024).toFixed(0)}KB
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load more trigger *
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
            )}
            {!pagination.hasMore && images.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You've seen all {pagination.total} images
              </p>
            )}
          </div>
        </>
      )}

      {/* Drawer for creating item *
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop *
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          
          {/* Drawer *
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[var(--white)] shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header *
              <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                <h2 className="text-xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                  Create New Item
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-[var(--soft-gray)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content *
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                {/* Image Preview *
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Images ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-[var(--soft-gray)]">
                        <Image
                          src={img.url}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Name *
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg bg-white dark:bg-gray-800 text-[var(--dark-text)] dark:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] transition-all"
                    placeholder="Enter item name"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Description *
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg bg-white dark:bg-gray-800 text-[var(--dark-text)] dark:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] transition-all resize-none"
                    placeholder="Enter item description"
                    maxLength={1000}
                    required
                  />
                </div>

                {/* Actions *
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex-1 px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--soft-gray)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}*/


// C:\Users\Administrator\Desktop\linkchemtwo\app\images\page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, Check, Plus, Trash2, Edit2, Image as ImageIcon, Grid3x3 } from 'lucide-react';
import './images.css';

interface ImageData {
  id: string;
  url: string;
  optimizedUrl: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}

interface ItemFormData {
  name: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    format: string;
    size: number;
  }[];
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 24,
    total: 0,
    hasMore: false,
    nextCursor: null,
  });

  // Selection state
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    images: [],
  });

  // State for items view
  const [showItemsView, setShowItemsView] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Store the current scroll position
  const scrollPositionRef = useRef<number>(0);

  // Fetch images from Cloudinary
  const fetchImages = useCallback(async (page: number, cursor?: string | null) => {
    try {
      const url = cursor 
        ? `/api/images?page=${page}&limit=24&cursor=${cursor}`
        : `/api/images?page=${page}&limit=24`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setImages((prev) => [...prev, ...data.images]);
        setPagination(data.pagination);
        return data;
      } else {
        setError(data.error || 'Failed to fetch images');
        return null;
      }
    } catch (err) {
      setError('Error loading images');
      console.error(err);
      return null;
    }
  }, []);

  // Fetch items from MongoDB
  const fetchItems = useCallback(async () => {
    try {
      setItemsLoading(true);
      const response = await fetch('/api/items?page=1&limit=100');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchImages(1);
      setLoading(false);
    };
    loadInitial();
    fetchItems();
  }, [fetchImages, fetchItems]);

  // Load more on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && pagination.hasMore) {
          const loadMore = async () => {
            setLoadingMore(true);
            await fetchImages(pagination.page + 1, pagination.nextCursor);
            setLoadingMore(false);
          };
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, pagination, fetchImages]);

  // Toggle image selection
  const toggleImageSelection = (imageId: string, imageData: ImageData) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // Select all images
  const selectAllImages = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      const allIds = new Set(images.map(img => img.id));
      setSelectedImages(allIds);
    }
  };

  // Open drawer with selected images
  const openCreateDrawer = () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image');
      return;
    }

    const selectedImageData = images
      .filter(img => selectedImages.has(img.id))
      .map(img => ({
        url: img.url,
        public_id: img.id,
        format: img.format,
        size: img.size,
      }));

    setFormData({
      name: '',
      description: '',
      images: selectedImageData,
    });
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ name: '', description: '', images: [] });
  };

  // Handle form submission - Optimized to prevent page refresh
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert('Item created successfully!');
        
        // Close the drawer
        closeDrawer();
        
        // ONLY clear the selection - don't reload images
        setSelectedImages(new Set());
        
        // Refresh the items list (but keep the page position)
        await fetchItems();
        
        // Don't reload images - just keep the current state
        // This prevents the page from scrolling to the top
        
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an item
  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchItems();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // Count selected images
  const selectedCount = selectedImages.size;

  return (
    <div className="container-custom section-padding pb-32">
      {/* Header with toggle and actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
              {showItemsView ? 'Items Collection' : 'Image Gallery'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {showItemsView 
                ? `${items.length} items created` 
                : `Showing ${images.length} of ${pagination.total} images`
              }
            </p>
          </div>
          
          {/* Desktop view buttons (hidden on mobile) */}
          <div className="hidden md:flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setShowItemsView(!showItemsView);
                if (showItemsView) {
                  setSelectedImages(new Set());
                }
              }}
              className="px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors"
            >
              {showItemsView ? 'View Images' : 'View Items'}
            </button>
            
            {!showItemsView && (
              <>
                <button
                  onClick={selectAllImages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                </button>
                
                <button
                  onClick={openCreateDrawer}
                  className="px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Item ({selectedImages.size})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items View */}
      {showItemsView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No items created yet</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--card-border)]"
              >
                <div className="relative aspect-video overflow-hidden bg-[var(--soft-gray)]">
                  {item.images && item.images.length > 0 && (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      className="object-cover"
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
                  <h3 className="font-semibold text-lg text-[var(--dark-text)] dark:text-[var(--light-text)] truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => {
              const isSelected = selectedImages.has(image.id);
              return (
                <div
                  key={image.id}
                  className={`group bg-white dark:bg-[var(--white)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-[var(--brand-500)] shadow-lg scale-[1.02]' 
                      : 'border-[var(--card-border)] hover:border-[var(--brand-300)]'
                  } cursor-pointer`}
                  onClick={() => toggleImageSelection(image.id, image)}
                >
                  <div className="relative aspect-square overflow-hidden bg-[var(--soft-gray)]">
                    <Image
                      src={image.optimizedUrl}
                      alt={image.filename || 'Image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--brand-500)]/20 flex items-center justify-center">
                        <div className="bg-[var(--brand-500)] text-white rounded-full p-2">
                          <Check className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {image.format?.toUpperCase()}
                      </span>
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {image.width}×{image.height}
                      </span>
                      <span className="text-xs bg-[var(--soft-gray)] px-2 py-1 rounded-full dark:bg-gray-700">
                        {(image.size / 1024).toFixed(0)}KB
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--brand-500)]"></div>
            )}
            {!pagination.hasMore && images.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You've seen all {pagination.total} images
              </p>
            )}
          </div>
        </>
      )}

      {/* Floating Bottom Toolbar - Only shown in image view and when there are images */}
      {!showItemsView && images.length > 0 && (
        <div className="floating-toolbar">
          <div className="floating-toolbar-content">
            {/* View toggle - visible on mobile */}
            <button
              onClick={() => {
                setShowItemsView(!showItemsView);
                if (showItemsView) {
                  setSelectedImages(new Set());
                }
              }}
              className="toolbar-btn toolbar-btn-primary md:hidden"
              aria-label={showItemsView ? 'View Images' : 'View Items'}
            >
              {showItemsView ? <ImageIcon className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
            </button>

            <div className="toolbar-divider md:hidden"></div>

            {/* Selection counter */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--soft-gray)] dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">selected</span>
            </div>

            <div className="toolbar-divider"></div>

            {/* Select All button */}
            <button
              onClick={selectAllImages}
              className="toolbar-btn toolbar-btn-secondary"
            >
              <span className="hidden sm:inline">
                {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
              </span>
              <span className="sm:hidden">
                {selectedImages.size === images.length ? 'Deselect' : 'Select All'}
              </span>
            </button>

            <div className="toolbar-divider"></div>

            {/* Create Item button */}
            <button
              onClick={openCreateDrawer}
              className="toolbar-btn toolbar-btn-primary flex items-center gap-2"
              disabled={selectedCount === 0}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Item</span>
              <span className="hidden xs:inline sm:hidden">Create</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawer for creating item */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[var(--white)] shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                <h2 className="text-xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                  Create New Item
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-[var(--soft-gray)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                {/* Image Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Images ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-[var(--soft-gray)]">
                        <Image
                          src={img.url}
                          alt={`Selected ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg bg-white dark:bg-gray-800 text-[var(--dark-text)] dark:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] transition-all"
                    placeholder="Enter item name"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-[var(--card-border)] rounded-lg bg-white dark:bg-gray-800 text-[var(--dark-text)] dark:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] transition-all resize-none"
                    placeholder="Enter item description"
                    maxLength={1000}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex-1 px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--soft-gray)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg hover:bg-[var(--brand-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}