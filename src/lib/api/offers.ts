export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  location: string;
  rating: number;
  discount: number;
}

export async function fetchOffers(): Promise<Offer[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: '1',
      title: 'iPhone 14 Pro Max',
      description: 'Excellent condition, barely used. Comes with original box and charger.',
      imageUrl: '', // Placeholder for now
      price: 899,
      originalPrice: 1099,
      location: 'San Francisco, CA',
      rating: 4.8,
      discount: 18,
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      description: 'Perfect for students and professionals. 8GB RAM, 256GB SSD.',
      imageUrl: '',
      price: 999,
      originalPrice: 1199,
      location: 'New York, NY',
      rating: 4.9,
      discount: 17,
    },
  ];
} 