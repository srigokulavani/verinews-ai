
export type NewsCategory = 
  | 'All' | 'World' | 'India' | 'Politics' | 'Technology' | 'Business' | 'Health' | 'Science' | 'Sports'
  | 'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar' | 'Chhattisgarh' | 'Goa' | 'Gujarat' | 'Haryana' 
  | 'Himachal Pradesh' | 'Jharkhand' | 'Karnataka' | 'Kerala' | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' 
  | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab' | 'Rajasthan' | 'Sikkim' | 'Tamil Nadu' 
  | 'Telangana' | 'Tripura' | 'Uttar Pradesh' | 'Uttarakhand' | 'West Bengal' | 'Delhi' | 'Jammu & Kashmir';

export interface Source {
  name: string;
  url: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  country: 'India' | 'Global';
  publishedAt: string;
  verifiedAt: string; // Timestamp of AI cross-source analysis
  authenticityScore: number; // 0-100
  verificationStatus: 'Verified' | 'Low Confidence' | 'Unverified';
  explanation: string;
  sources: Source[];
  imageUrl: string;
}
