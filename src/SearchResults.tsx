import { List, Action, ActionPanel } from "@raycast/api";
import { BookStackRecord, BookStackResponse, formatPreview, getIcon } from "./BookStack";

export function SearchResults(props: { searchResults: BookStackResponse | null | undefined }) {
  return (
    <List.Section title="Results">
      {props.searchResults?.data.map((result: BookStackRecord) => (
        <List.Item
          key={result.id}
          title={result.name}
          subtitle={formatPreview(result.preview_html)}
          icon={getIcon(result)}
          actions={
            result.url ? (
              <ActionPanel title={result.name}>
                <Action.OpenInBrowser url={result.url} title="Open in Browser" />
                <Action.CopyToClipboard content={result.url} title="Copy to Clipboard" />
              </ActionPanel>
            ) : undefined
          }
        />
      ))}
    </List.Section>
  );
}
