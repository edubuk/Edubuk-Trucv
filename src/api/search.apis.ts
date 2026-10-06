
import api from "@/lib/api";

export interface SearchProfile {
  _id: string;
  userId:string,
  name: string;
  userImage: string;
  profileSummary: string;
}

interface SearchProfilesResponse {
  profiles: SearchProfile[];
  totalProfiles:[{count:number}];
}

export const searchService = {searchProfiles: async (query: string,page?:number): Promise<SearchProfilesResponse> => {
    const { data } = await api.get(
      `/search/search-profiles?serachQuery=${encodeURIComponent(query)}${page?`&page=${page}`:''}`
    );
    return data.data; // unwrap here — hooks/components get clean data
  },
};