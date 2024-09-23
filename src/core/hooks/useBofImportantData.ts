import { useQuery } from "react-query";
import { fetchAPI } from "../api/fetch-api";
import { ImportantEventsData } from "../model/importantEvents.model";

const getImportantEventsBofData = async (codeNumber: string) => {
  const { data } = await fetchAPI({
    url: `/important-events/get/${codeNumber}`,
    method: "GET"
  });
  return data as ImportantEventsData;
};

export const useImportantEventsBofData = (codeNumber: string) => {
  return useQuery(
    ['get-important-events', codeNumber],
    () => getImportantEventsBofData(codeNumber),
    {
      enabled: !!codeNumber,
    }
  );
};