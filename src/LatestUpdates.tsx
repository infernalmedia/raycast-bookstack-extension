import { List, Action, ActionPanel } from "@raycast/api";
import { BookStackResponse, BookStackRecord, getIcon } from "./BookStack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function LatestUpdates(props: { pages: BookStackResponse | null | undefined }) {
  return (
    <List.Section title="Recently Updated Pages">
      {props.pages?.data.map((result: BookStackRecord) => (
        <List.Item
          key={result.id}
          title={result.name}
          subtitle={"updated " + dayjs(result.updated_at).fromNow()}
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
