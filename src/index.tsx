import { List, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { BookStackResponse } from "./BookStack";
import { SearchResults } from "./SearchResults";
import { LatestUpdates } from "./LatestUpdates";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BookStackResponse | null>();
  const [latestUpdates, setLatestUpdates] = useState<BookStackResponse | null>();
  const [error, setError] = useState<Error>();

  const preferences = getPreferenceValues();
  const instance = preferences.instance as string;
  const token = preferences.token as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isBookStackResponse = (response: any): response is BookStackResponse => {
    return "data" in response && "total" in response;
  };

  const jsonToBookStackResponse = async (response: any): Promise<BookStackResponse | null> => {
    const json = await response.json();
    if (isBookStackResponse(json)) {
      return json;
    }
    return null;
  };

  const search = async (query = ""): Promise<BookStackResponse | null> => {
    setIsLoading(true);

    const response = await fetch(instance + "/api/search?query=" + query, {
      method: "get",
      headers: {
        Authorization: "Token " + token,
        "Content-Type": "application/json",
      },
    });

    setIsLoading(false);
    return jsonToBookStackResponse(response);
  };

  useEffect(() => {
    async function loadLatestActivities() {
      try {
        setIsLoading(true);

        const response = await fetch(instance + "/api/pages?sort=-updated_at&count=10", {
          method: "get",
          headers: {
            Authorization: "Token " + token,
            "Content-Type": "application/json",
          },
        });

        setIsLoading(false);
        const bookstackResponse = await jsonToBookStackResponse(response);
        bookstackResponse?.data.forEach((x) => {
          x.url = instance + "/books/" + x.book_slug + "/page/" + x.slug;
        });

        setLatestUpdates(bookstackResponse);
      } catch (error: any) {
        setError(error);
      }
    }

    loadLatestActivities();
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
        message: error.message,
      });
    }
  }, [error]);

  return (
    <List
      throttle={true}
      isLoading={isLoading}
      onSearchTextChange={async (query) => setSearchResults(await search(query))}
    >
      {!searchResults && <LatestUpdates pages={latestUpdates} />}

      {searchResults && searchResults.data.length > 0 && <SearchResults searchResults={searchResults} />}
    </List>
  );
}
