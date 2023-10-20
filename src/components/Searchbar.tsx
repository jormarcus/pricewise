'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const isValidAmazonProductURL = (url: string) => {
  const regex = /amazon(?=[^/])/;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // use regex instead of conditions
    if (regex.test(hostname)) {
      // hostname.includes('amazon.com') ||
      // hostname.includes ('amazon.') ||
      // hostname.endsWith('amazon')
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

export default function Searchbar() {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidUrl = isValidAmazonProductURL(searchPrompt);

    if (!isValidUrl) toast.error('Please provide a valid Amazon link');

    try {
      setIsLoading(true);

      // scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-12">
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
