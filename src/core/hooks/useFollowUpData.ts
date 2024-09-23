import { useQuery } from "react-query";
import { fetchAPI } from "../api/fetch-api";
import { FollowUpData } from "../model/followUpData.model";

export const useFollowUpData = (codeNumber?: string) => {
  return useQuery(["get-follow-up-data", codeNumber], async () => {
    const { data } = await fetchAPI({
      url: `/follow-up-data/get/${codeNumber}`,
      method: "GET"
    });
    return data as FollowUpData;
  }, {
    enabled: !!codeNumber
  });
};