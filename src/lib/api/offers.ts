import { createPublicClient, http } from 'viem';
import { mainnet , worldchain} from 'viem/chains';
import ItemManager from '@/components/Transaction/ItemManager.json';

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
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  console.log("contractAddress", contractAddress);
  
  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro')
  });

  const contract = {
    address: contractAddress as `0x${string}`,
    abi: ItemManager
  };

  async function fetchOffersFromContract(): Promise<Offer[]> {
    try {
      // Get total number of items
      const numberOfItems = await client.readContract({
        ...contract,
        functionName: 'getNumberOfItems'
      });

      const offers: Offer[] = [];
      
      // Fetch each item
      for (let i = 0; i < Number(numberOfItems); i++) {
        await new Promise((r) => setTimeout(r, 100));

        const item = await client.readContract({
          ...contract,
          functionName: 'items',
          args: [i]
        }) as any;

        // Map contract data to Offer interface
        // Note: Adjust field mapping based on actual contract structure

        console.log("item", item);

        offers.push({
          id: i.toString(),
          // id: item.id.toString() || '',
          title: item[0] || '',
          description: item[1] || '',
          imageUrl: '',
          price: Number(item[3]) / 1000000000000000000,
          originalPrice: Number(item[4] || item[3]) / 1000000000000000000,
          location: item[5] || '',
          rating: Number(item[6] || 0),
          discount: Number(item[7] || 0)
        });
      }

      return offers;
    } catch (error) {
      console.error('Error fetching offers from contract:', error);
      return [];
    }
  }
  
  await new Promise((r) => setTimeout(r, 400));
  
  return await fetchOffersFromContract();
} 