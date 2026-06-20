"use client";

import { KeyboardEvent, SyntheticEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button, Input } from "@w1zll/shop-ui";

type SearchSuggestion = {
  brand: string;
  label: string;
  slug: string;
};

type SearchSuggestionsResponse = {
  items: SearchSuggestion[];
};

const MIN_QUERY_LENGTH = 2;
const SEARCH_HISTORY_KEY = "shop-catalog:search-history";
const SEARCH_HISTORY_LIMIT = 5;
const SUGGESTIONS_LIMIT = 6;

function createSearchHref(query: string) {
  const params = new URLSearchParams();
  const search = query.trim();

  if (search.length > 0) {
    params.set("search", search);
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

export function SearchBox({ initialValue = "" }: Readonly<{ initialValue?: string }>) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const trimmedQuery = query.trim();
  const showHistory = isFocused && trimmedQuery.length === 0 && history.length > 0;
  const showSuggestions = isFocused && trimmedQuery.length >= MIN_QUERY_LENGTH;

  const activeSuggestion = useMemo(
    () => (activeIndex >= 0 ? suggestions[activeIndex] : undefined),
    [activeIndex, suggestions],
  );

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const rawHistory = window.localStorage.getItem(SEARCH_HISTORY_KEY);

    if (!rawHistory) {
      return;
    }

    try {
      const parsedHistory = JSON.parse(rawHistory) as unknown;

      if (Array.isArray(parsedHistory)) {
        setHistory(
          parsedHistory.filter((item): item is string => typeof item === "string").slice(0, 5),
        );
      }
    } catch {
      window.localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setActiveIndex(-1);
      setIsLoading(false);
      setSuggestions([]);
      setSuggestionsError(false);
      return;
    }

    const controller = new AbortController();
    const debounceId = setTimeout(() => {
      setIsLoading(true);
      setSuggestionsError(false);

      fetch(
        `/api/v1/products/search/suggestions?q=${encodeURIComponent(
          trimmedQuery,
        )}&limit=${String(SUGGESTIONS_LIMIT)}`,
        {
          signal: controller.signal,
        },
      )
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Suggestions request failed: ${String(response.status)}`);
          }

          return (await response.json()) as SearchSuggestionsResponse;
        })
        .then((data) => {
          setActiveIndex(-1);
          setSuggestions(data.items);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setActiveIndex(-1);
          setSuggestions([]);
          setSuggestionsError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => {
      clearTimeout(debounceId);
      controller.abort();
    };
  }, [trimmedQuery]);

  function saveSearchHistory(search: string) {
    if (search.length === 0) {
      return;
    }

    const nextHistory = [search, ...history.filter((item) => item !== search)].slice(
      0,
      SEARCH_HISTORY_LIMIT,
    );

    setHistory(nextHistory);
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
  }

  function submitSearch(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSearchHistory(trimmedQuery);
    router.push(createSearchHref(query));
  }

  function selectSuggestion(suggestion: SearchSuggestion) {
    router.push(`/product/${suggestion.slug}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.min(currentIndex + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    } else if (event.key === "Enter" && activeSuggestion) {
      event.preventDefault();
      selectSuggestion(activeSuggestion);
    } else if (event.key === "Escape") {
      setIsFocused(false);
    }
  }

  return (
    <form className="relative max-w-2xl" role="search" onSubmit={submitSearch}>
      <div className="flex gap-2">
        <Input
          aria-activedescendant={
            activeSuggestion ? `search-suggestion-${activeSuggestion.slug}` : undefined
          }
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          aria-label="Поисковый запрос"
          autoComplete="off"
          name="search"
          placeholder="Например, наушники"
          role="combobox"
          value={query}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 120);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button className="gap-2" type="submit">
          <Search className="size-4" aria-hidden="true" />
          Найти
        </Button>
      </div>

      {showHistory ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-lg border border-[var(--shop-border)] bg-[var(--shop-background)] p-2 shadow-lg">
          {history.map((item) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--shop-secondary)]"
              href={createSearchHref(item)}
              key={item}
            >
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      {showSuggestions ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-lg border border-[var(--shop-border)] bg-[var(--shop-background)] p-2 shadow-lg"
          id="search-suggestions"
          role="listbox"
        >
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-[var(--shop-muted-foreground)]">Ищем...</p>
          ) : null}
          {!isLoading && suggestionsError ? (
            <p className="px-3 py-2 text-sm text-[var(--shop-muted-foreground)]">
              Подсказки временно недоступны.
            </p>
          ) : null}
          {!isLoading && !suggestionsError && suggestions.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--shop-muted-foreground)]">
              Подсказок нет.
            </p>
          ) : null}
          {!isLoading && !suggestionsError
            ? suggestions.map((suggestion, index) => (
                <Link
                  aria-selected={activeIndex === index}
                  className={
                    activeIndex === index
                      ? "block rounded-md bg-[var(--shop-secondary)] px-3 py-2 text-sm"
                      : "block rounded-md px-3 py-2 text-sm hover:bg-[var(--shop-secondary)]"
                  }
                  href={`/product/${suggestion.slug}`}
                  id={`search-suggestion-${suggestion.slug}`}
                  key={suggestion.slug}
                  role="option"
                >
                  <span className="block font-medium">{suggestion.label}</span>
                  <span className="text-xs text-[var(--shop-muted-foreground)]">
                    {suggestion.brand}
                  </span>
                </Link>
              ))
            : null}
        </div>
      ) : null}
    </form>
  );
}
