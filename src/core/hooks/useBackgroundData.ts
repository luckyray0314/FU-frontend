import { useQuery } from "react-query";
import { fetchAPI } from "../api/fetch-api";
import { BackgroundData } from "../model/backgroundData.model";

export const useBackgroundData = (codeNumber?: string) => {
  return useQuery(["get-background-data", codeNumber], async () => {
    const { data } = await fetchAPI({
      url: `/background-data/get/${codeNumber}`,
      method: "GET"
    });
    return data as BackgroundData;
  }, {
    enabled: !!codeNumber
  });
};
