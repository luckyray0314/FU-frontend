import { useQuery } from "react-query";
import { fetchAPI } from "../api/fetch-api";
import { BackgroundAdultData } from "../model/backgroundAdultData.model";

export const useBackgroundAdultData = (codeNumber?: string) => {
  return useQuery(["get-background-adult-data", codeNumber], async () => {
    const { data } = await fetchAPI({
      url: `/background-adult-data/get/${codeNumber}`,
      method: "GET"
    });
    return data as BackgroundAdultData;
  }, {
    enabled: !!codeNumber
  });
};