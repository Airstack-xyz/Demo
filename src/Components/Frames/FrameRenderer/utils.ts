import { FrameButton, FrameState } from './types';

const FRAME_ROUTE = '/api/frame';

export const fetchFrameData = async ({
  url,
  signal
}: {
  url: string;
  signal?: AbortSignal;
}) => {
  try {
    const payload = {
      postUrl: url
    };
    const response = await fetch(FRAME_ROUTE, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal
    });
    if (!response.ok) {
      return { data: null, error: response.statusText };
    }
    const document = await response.text();
    const data = parseFrameData(document);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const parseFrameData = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const postUrl = doc
    .querySelector("meta[name='fc:frame:post_url']")
    ?.getAttribute('content');
  const image = doc
    .querySelector("meta[name='fc:frame:image']")
    ?.getAttribute('content');

  const inputText = doc
    .querySelector("meta[name='fc:frame:input:text']")
    ?.getAttribute('content');

  const buttons: FrameButton[] = [];
  [1, 2, 3, 4].forEach(buttonIndex => {
    const btnAction = doc
      .querySelector(`meta[name='fc:frame:button:${buttonIndex}:action']`)
      ?.getAttribute('content');

    if (btnAction) {
      const btnLabel = doc
        .querySelector(`meta[name='fc:frame:button:${buttonIndex}']`)
        ?.getAttribute('content');
      const btnTarget = doc
        .querySelector(`meta[name='fc:frame:button:${buttonIndex}:target']`)
        ?.getAttribute('content');

      buttons.push({
        action: btnAction,
        label: btnLabel || '',
        target: btnTarget || ''
      });
    }
  });

  const frame: FrameState = {
    postUrl: postUrl || '',
    image: image || '',
    buttons,
    inputText: inputText || ''
  };

  return frame;
};
