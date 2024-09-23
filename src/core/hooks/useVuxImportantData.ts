import { useQuery } from "react-query";
import { fetchAPI } from "../api/fetch-api";
import { ImportantEventsVuxData } from "../model/importantEventsVux.model";

const getImportantEventsVuxData = async (codeNumber: string) => {
  const { data } = await fetchAPI({
    url: `/important-events-vux/get/${codeNumber}`,
    method: "GET"
  });
  return data as ImportantEventsVuxData;
};

export const useImportantEventsVuxData = (codeNumber: string) => {
  return useQuery(
    ["get-important-events-vux", codeNumber],
    () => getImportantEventsVuxData(codeNumber),
    {
      enabled: !!codeNumber
    });
};