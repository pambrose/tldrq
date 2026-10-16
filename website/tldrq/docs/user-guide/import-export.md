---
icon: lucide/arrow-down-up
---

# Import, Export & Bulk Actions

The toolbar above your bookmarks has four tools for working with many bookmarks at once: import a list of URLs,
export the displayed ones, delete the displayed ones, and refresh the list.

## Bulk import

Bulk import saves every URL in a text file. It's built for the moment you have dozens of tabs open and want them
all in tldrq.

### Gather your tab URLs

Click the import icon (**Import URLs**) to open **Bulk Import**. Under the file picker, "How to gather the URLs of
all your browser tabs" explains how to get every open tab's URL into a file, for the system tldrq detects (macOS,
Windows or Linux). Pick your browser in the **Browser:** menu.

=== "macOS: Safari, Chrome, Edge, Brave"

    tldrq shows a Terminal command, with a copy button, that writes the URL of every open tab to a file. For
    Safari:

    ```bash
    osascript -e 'set text item delimiters to linefeed' -e 'tell app "Safari" to (url of tabs of windows) as text' > safari-urls.txt
    ```

    The other browsers' commands are the same with `Google Chrome`, `Microsoft Edge` or `Brave Browser` in place of
    `Safari`, and write `chrome-urls.txt`, `edge-urls.txt` or `brave-urls.txt`.

=== "Firefox (any system)"

    Open Firefox's Browser Console (Cmd+Shift+J on macOS, Ctrl+Shift+J on Windows and Linux) and run:

    ```javascript
    copy([...gBrowser.tabs].map(t => t.linkedBrowser.currentURI.spec).join('\n'))
    ```

    That copies every tab's URL to the clipboard. Paste it into a new text file and save it.

=== "Windows and Linux: Chrome, Edge, Brave"

    Install a "Copy All Tab URLs" extension from your browser's extension store, use it to copy all tab URLs, and
    paste them into a text file.

### Import the file

Choose a `.txt` file with one URL per line. Spaces around each line are trimmed and blank lines are skipped. tldrq
reports "Found N lines to import. Invalid URLs will be flagged."

Pick a collection (**Auto-categorize** by default; see [Auto-categorization](collections.md#auto-categorization))
and a priority (**Normal** by default) for all of them, then click **Start Import**. **Clear** goes back to the file
picker.

URLs are imported one at a time ("Importing 3 of 40…", with a progress bar), and tldrq fetches each one's details
as if you'd saved it by hand, so a long list takes a while. There's no limit on the number of lines. **Cancel** stops
the import at once: the URL in progress gets no result line and may or may not have been saved, so check for it
afterwards. Keep the dialog open until the import finishes.

### Reading the results

Counts at the top of the results (`N imported`, `N skipped`, `N invalid`, `N failed`) summarize the list below
them, where each URL is marked:

| Mark | Meaning |
|---|---|
| ✓ Imported | Saved |
| — Duplicate | Already in your bookmarks; skipped |
| ! Invalid URL | Not an `http://` or `https://` URL; never sent |
| ✗ and a message | Something went wrong saving it; the message says what |

Click **Done** to close the dialog. Your list refreshes when the import ends.

## Export

The export icon (**Export displayed URLs**) downloads `bookmarks.txt`: the URLs of the bookmarks currently
displayed, one per line, in the order shown. Filter first to export part of your list. The file can be imported
again.

## Delete displayed bookmarks

The trash icon in the toolbar (**Delete displayed URLs**) deletes every bookmark currently displayed, after asking
"Delete N bookmarks?". Narrow the view with [filters](finding.md) first.

!!! warning
    Deleted bookmarks can't be recovered. Check the count above the list before you confirm.

The button is disabled when nothing is displayed.

## Refresh

The circular-arrows icon (**Refresh displayed URLs**) reloads your list, for example after saving bookmarks from
another device. It doesn't fetch the bookmarked pages' details again (see
[Updating a bookmark's details](saving.md#updating-a-bookmarks-details)).
